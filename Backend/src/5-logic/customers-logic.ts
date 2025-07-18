import dal from "../2-utils/dal";
import CustomerModel from "../4-models/CutomersModel";
import {ResourceNotFoundErrorModel, ValidationErrorModel} from "../4-models/ErrorModel";
import {OkPacket} from "mysql";
import PaymentModel from "../4-models/PaymentModel";
import ExpenseModel from "../4-models/ExpenseModel";
import CustInFollow from "../4-models/CustInFollow";
import DocumentModel from "../4-models/DocumentModel";
import { publicDecrypt } from "crypto";
import { start } from "repl";
import { func } from "joi";
import fs from 'fs';
import path from 'path';

async function getAllCustomers(
    userId: number,
    freeSearch: string|undefined,
    offset: number,
    limit: number):
    Promise<{ customers: CustomerModel[]; count:number}> {
        const conditions = ` WHERE userId = ?
            AND customerStatus <> 0 
            ${freeSearch ? ` AND (name LIKE ? OR adress LIKE ? OR phoneNumber LIKE ?)` : ""}`;

        const countSql = `SELECT COUNT(*) AS count
                FROM customer 
                ${conditions}`;

        const customersSql = `SELECT customerId, name, adress, phoneNumber, customerStatus
                FROM customer 
                ${conditions}
                ORDER BY customerStatus ASC, customerId DESC 
                LIMIT ? OFFSET ?`;

        const baseParams : ([number | string])= [userId];
        if(freeSearch){
            const searchParam = `%${freeSearch}%`;
            baseParams.push(searchParam, searchParam, searchParam);
        }

        const result = await dal.execute(countSql, baseParams)
        const count = result[0]?.count ?? 0;

        const paginationParams = [...baseParams, limit, offset];
        const customers = await dal.execute(customersSql, paginationParams);

        return {
            customers, count
        }
}

async function getOneCustomer(customerId: number): Promise<CustomerModel> {
    const sql = `SELECT * FROM customer WHERE customerId = ? AND customerStatus <> 0`;
    const customers = await dal.execute(sql, [customerId]) 

    const customer = customers[0]

    if (!customer) throw new ResourceNotFoundErrorModel(customerId)

    return customer
}



async function addCustomer(customer: any, userId: number): Promise<CustomerModel> {
    const customerInstance = new CustomerModel(customer);

    const error = customerInstance.validate();
    if (error) throw new ValidationErrorModel(error);

    console.log("customer from back", customerInstance);

    const sql = `
        INSERT INTO customer (name, adress, phoneNumber, userId, customerStatus) 
        VALUES (?, ?, ?, ?, ?)
    `;

    console.log("customer before insert id:", customerInstance);

    const info: OkPacket = await dal.execute(sql, [
        customerInstance.name,
        customerInstance.adress,
        customerInstance.phoneNumber,
        userId,
        customerInstance.customerStatus
    ]);

    console.log("Insert info:", info);

    customerInstance.customerId = info.insertId;
    return customerInstance;
}



async function updateCustomer(customerId: number, customer: any): Promise<CustomerModel> {
    const customerInstance = new CustomerModel(customer);
    const error = customerInstance.validate();
    if (error) {
        throw new ValidationErrorModel(error);
    }

    console.log("i am here update before imageName");

    const sql = `
        UPDATE customer SET 
            name = ?, 
            adress = ?, 
            phoneNumber = ?,
            customerStatus = ?
        WHERE customerId = ?
          AND customerStatus <> 0
    `;

    const info: OkPacket = await dal.execute(sql, [
        customerInstance.name,
        customerInstance.adress,
        customerInstance.phoneNumber,
        customerInstance.customerStatus,
        customerId
    ]);
console.log(customerInstance);
    if (info.affectedRows === 0) {
        throw new ResourceNotFoundErrorModel(`${customerId}`);
    }
    return customerInstance;
}

    async function deleteCustomer(customerId: number): Promise<void> {
        try {
            const deletePaymentsSql = `DELETE FROM payments WHERE customerId = ?`;
            await dal.execute(deletePaymentsSql, [customerId]);

            const deleteCustomerSql = `DELETE FROM customer WHERE customerId = ?`;
            const info: OkPacket = await dal.execute(deleteCustomerSql, [customerId]);
            if (info.affectedRows === 0) throw new ResourceNotFoundErrorModel(customerId);
        } catch (error) {
            console.error('Failed to delete vacation:', error);
            throw error;
        }
    }

    async function getPaymentByCustomerId(customerId: number): Promise<PaymentModel[]> {
        const sql = `
            SELECT paymentId, p.customerId, amount, paymentDate, isPaid
            FROM payments p
            INNER JOIN customer c ON c.customerId = p.customerId
            WHERE p.customerId = ?
            AND c.customerStatus <> 0
            ORDER BY paymentId DESC`;

        return await dal.execute(sql, [customerId]);
    }
async function getEpensesByCustomerId(customerId: number): Promise<ExpenseModel[]> {
    const sql = `
        SELECT chomarimId, cm.customerId, expenseTypeId, chomarimCategory, amount, updateDate
        FROM chomarim cm
        INNER JOIN customer c ON c.customerId = cm.customerId
        WHERE cm.customerId = ? 
        AND c.customerStatus <> 0
        ORDER BY cm.chomarimId DESC`;

    console.log("Fetching expenses for customer:", customerId); // לוג לדיבוג
    
    const expenses = await dal.execute(sql, [customerId]);
    
    console.log("Fetched expenses:", expenses); // לוג לדיבוג
    
    return expenses;
}
    // הוספת הכנסה חדשה
async function addPayment(payment: PaymentModel): Promise<PaymentModel> {
    const sql = `
        INSERT INTO payments (customerId,userId, amount, paymentDate, isPaid)
        VALUES (?, ?,?, ?, ?)`;

    const result = await dal.execute(sql, [payment.customerId,payment.userId, payment.amount, payment.paymentDate, payment.isPaid]);
    payment.paymentId = result.insertId; // מזהה ההכנסה החדשה
    return payment;
}

// הוספת הוצאה חדשה
async function addExpense(expense: ExpenseModel): Promise<ExpenseModel> {
    console.log("Adding expense to database:", expense); // לוג לדיבוג
    
    const sql = `
        INSERT INTO chomarim (customerId, expenseTypeId, chomarimCategory, amount, updateDate)
        VALUES (?, ?, ?, ?, ?)`;

    const result = await dal.execute(sql, [
        expense.customerId, 
        expense.expenseTypeId || 1, // ערך ברירת מחדל אם לא נשלח
        expense.chomarimCategory, 
        expense.amount, 
        expense.updateDate
    ]);
    
    expense.chomarimId = result.insertId; // מזהה ההוצאה החדשה
    
    console.log("Expense added successfully with ID:", expense.chomarimId); // לוג לדיבוג
    
    return expense;
}

async function fetchExpensesPerMonth(userId: number): Promise<{amount: number, updateMonth: string}[]> {
    const startDate = new Date();
    startDate.setFullYear(startDate.getFullYear() - 1).toString();

    const sql = `SELECT SUM(amount) AS amount, DATE_FORMAT(updateDate, '%Y-%m-1') AS updateMonth 
        FROM chomarim cm
        INNER JOIN customer c
        ON cm.customerId = c.customerId
        WHERE updateDate > ?
        AND userId = ?
        AND customerStatus <> 0
        GROUP BY updateMonth
        ORDER BY updateMonth`;

    return await dal.execute(sql, [startDate, userId]);
}

async function fetchPaymentsPerMonth(userId: number): Promise<{amount: number, updateMonth: string}[]> {
    const startDate = new Date();
    startDate.setFullYear(startDate.getFullYear() - 1);
    const sql = `SELECT SUM(amount) AS amount, DATE_FORMAT(paymentDate, '%Y-%m-1') AS updateMonth 
        FROM payments p
        INNER JOIN customer c
        ON p.customerId = c.customerId
        WHERE paymentDate > ?
        AND c.userId = ?
        AND customerStatus <> 0
        GROUP BY updateMonth
        ORDER BY updateMonth`;

    return await dal.execute(sql, [startDate, userId]);
}

async function fetchBalancePerMonth(userId: number): Promise<{months: string[], values: number[]}> {
    const expenses = new Map(
        (await fetchExpensesPerMonth(userId)).map(({amount, updateMonth}) => [updateMonth, amount])
    );
    const payments = new Map(
        (await fetchPaymentsPerMonth(userId)).map(({amount, updateMonth}) => [updateMonth, amount])
    );
    const allMonths = Array.from(new Set(
        [...Array.from(expenses.keys()), ...Array.from(payments.keys())]
    )).sort((a: string,b: string) => 
        new Date(a).getTime() - new Date(b).getTime()
    );

    return {
        months: allMonths,
        values: allMonths.map((value, index) => (
            (+(payments.get(value) ?? 0)) - (+(expenses.get(value) ?? 0))
        ))
    }
}

async function fetchExpensesPerYear(userId: number): Promise<{amount: number, updateYear: number}[]> {
    const startDate = new Date();
    startDate.setFullYear(startDate.getFullYear() - 5).toString();
 
    const sql = `SELECT SUM(amount) AS amount, YEAR(updateDate) AS updateYear
        FROM chomarim cm
        INNER JOIN customer c
        ON cm.customerId = c.customerId
        WHERE updateDate > ?
        AND userId = ?
        AND customerStatus <> 0
        GROUP BY updateYear
        ORDER BY updateYear`;

    return await dal.execute(sql, [startDate, userId]);
}

async function fetchPaymentsPerYear(userId: number): Promise<{amount: number, updateYear: number}[]> {
    const startDate = new Date();
    startDate.setFullYear(startDate.getFullYear() - 5);
    const sql = `SELECT SUM(amount) AS amount, YEAR(paymentDate) AS updateYear 
        FROM payments p
        INNER JOIN customer c
        ON p.customerId = c.customerId
        WHERE paymentDate > ?
        AND c.userId = ?
        AND customerStatus <> 0
        GROUP BY updateYear
        ORDER BY updateYear`;

    return await dal.execute(sql, [startDate, userId]);
}

async function fetchBalancePerYear(userId: number): Promise<{years: number[], values: number[]}>  {
    const expenses = new Map(
        (await fetchExpensesPerYear(userId)).map(({amount, updateYear}) => [updateYear, amount])
    );
    const payments = new Map(
        (await fetchPaymentsPerYear(userId)).map(({amount, updateYear}) => [updateYear, amount])
    );
    const allYears = Array.from(new Set(
        [...Array.from(expenses.keys()), ...Array.from(payments.keys())]
    )).sort((a: number,b: number) => a - b);

    return {
        years: allYears,
        values: allYears.map((value, index) => (
            (+(payments.get(value) ?? 0)) - (+(expenses.get(value) ?? 0))
        ))
    };
}


/**
 * Fetch All documents By CustomerId
 * @param customerId
 * @param userId
 */
async function getDocumentsByCustomerId(
    customerId: number,
): Promise<DocumentModel[]> {

    const sql = `SELECT d.* 
        FROM documents d
        INNER JOIN customer c
        ON c.customerId = d.customerId
        WHERE c.customerStatus <> 0
        AND d.customerId = ?
        ORDER BY documentId DESC`;

    return await dal.execute(sql, [customerId]);
}

/**
 * Insert document
 * @param document
 * @returns DocumentModel
 */
async function addDocument(document: DocumentModel): Promise<DocumentModel> {

    const documentInstance = new DocumentModel(document);

    const error = documentInstance.validate();
    if (error) throw new ValidationErrorModel(error);

    const sql = `
        INSERT INTO documents (customerId, documentName, filePath, uploadDate) 
        VALUES (?, ?, ?, ?)
    `;

    console.log("document before insert id:", documentInstance);

    const info: OkPacket = await dal.execute(sql, [
        documentInstance.customerId,
        documentInstance.documentName,
        documentInstance.filePath,
        new Date().toISOString().slice(0,10),
    ]);

    console.log("Insert info:", info);

    documentInstance.documentId = info.insertId;
    console.log("Inserted document with ID:", documentInstance.documentId);

    return documentInstance;
}

async function addFollow(customerId: number, status: boolean): Promise<boolean> {
    const sql = `
        INSERT INTO customerInFollow (customerId, status) 
        VALUES (?, ?)
    `;
    
    const result = await dal.execute(sql, [customerId, status]);
    
    return result.affectedRows > 0;
}


async function removeFollow(customerId: number): Promise<boolean> {
    const sql = `
        UPDATE customerInFollow
        SET status = false
        WHERE customerId = ? AND status = true;  
    `;
    
    const result = await dal.execute(sql, [customerId]);
    
    return result.affectedRows > 0;
}

async function getCustomersInFollow(): Promise<CustInFollow[]> {
    const sql = `
        SELECT cf.followedId, cf.customerId, c.name, c.phoneNumber, c.adress
        FROM customerinfollow cf
        INNER JOIN customer c ON cf.customerId = c.customerId
        WHERE cf.status = true
        ORDER BY c.name ASC;
    `;

    const customersInFollow = await dal.execute(sql, []);
    return customersInFollow;
}
async function deleteDocument(documentId: number, customerId: number): Promise<{ success: boolean, message?: string }> {
    try {
        // קבלת פרטי המסמך לפני המחיקה
        const documentSql = `SELECT * FROM documents WHERE documentId = ? AND customerId = ?`;
        const documents = await dal.execute(documentSql, [documentId, customerId]);
        
        if (!documents || documents.length === 0) {
            return { 
                success: false, 
                message: 'המסמך לא נמצא או שאינו שייך ללקוח זה' 
            };
        }

        const document = documents[0];
        
        // מחיקה מבסיס הנתונים
        const deleteSql = `DELETE FROM documents WHERE documentId = ? AND customerId = ?`;
        const result: OkPacket = await dal.execute(deleteSql, [documentId, customerId]);
        
        if (result.affectedRows === 0) {
            return { 
                success: false, 
                message: 'לא ניתן למחוק את המסמך מבסיס הנתונים' 
            };
        }

        // מחיקת הקובץ הפיזי
        try {
            const filePath = path.join(process.cwd(), 'uploads', document.filePath);
            
            // בדיקה שהקובץ קיים לפני המחיקה
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
                console.log(`קובץ נמחק: ${filePath}`);
            } else {
                console.log(`קובץ לא נמצא במיקום: ${filePath}`);
            }
        } catch (fileError) {
            console.error('שגיאה במחיקת הקובץ הפיזי:', fileError);
            // לא נכשיל את כל הפעולה בגלל שגיאה במחיקת הקובץ
            // כי המסמך כבר נמחק מבסיס הנתונים
        }

        return { 
            success: true, 
            message: 'המסמך נמחק בהצלחה' 
        };

    } catch (error) {
        console.error('שגיאה במחיקת המסמך:', error);
        return { 
            success: false, 
            message: 'שגיאה במחיקת המסמך' 
        };
    }
}


    
    export default {
        getAllCustomers,
        getOneCustomer, 
        addCustomer, 
        updateCustomer,
        deleteCustomer,
        getPaymentByCustomerId,
        getEpensesByCustomerId,
        addPayment,
        addExpense,
        fetchBalancePerMonth,
        fetchBalancePerYear,
        getDocumentsByCustomerId,
        addDocument,
        deleteDocument,
        addFollow,
        removeFollow,
        getCustomersInFollow

    }
  
   

