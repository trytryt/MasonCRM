import dal from "../2-utils/dal";
import CustomerModel from "../4-models/CutomersModel";
import {ResourceNotFoundErrorModel, ValidationErrorModel} from "../4-models/ErrorModel";
import {OkPacket} from "mysql";
import PaymentModel from "../4-models/PaymentModel";
import ExpenseModel from "../4-models/ExpenseModel";
import CustInFollow from "../4-models/CustInFollow";
import DocumentModel from "../4-models/DocumentModel";


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
console.log(JSON.stringify(paginationParams));
        return {
            customers, count
        }
}

async function getOneCustomer(customerId: number): Promise<CustomerModel> {
    console.log(customerId)
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
        INSERT INTO customer (name, adress, phoneNumber, userId) 
        VALUES (?, ?, ?, ?)
    `;

    console.log("customer before insert id:", customerInstance);

    const info: OkPacket = await dal.execute(sql, [
        customerInstance.name,
        customerInstance.adress,
        customerInstance.phoneNumber,
        userId
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
        SELECT chomarimId, cm.customerId, expenseTypeId, chomarimCategory, amount
        FROM chomarim cm
        INNER JOIN customer c ON c.customerId = cm.customerId
        WHERE cm.customerId = ? 
        AND c.customerStatus <> 0
        ORDER BY cm.chomarimId DESC`;

        return await dal.execute(sql, [customerId]);
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
    const sql = `
        INSERT INTO chomarim (customerId, expenseTypeId, chomarimCategory, amount)
        VALUES (?, ?, ?, ?)`;

    const result = await dal.execute(sql, [expense.customerId, expense.expenseTypeId, expense.chomarimCategory, expense.amount]);
    expense.chomarimId = result.insertId; // מזהה ההוצאה החדשה
    return expense;
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
        ORDER BY uploadDate DESC`;

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
        getDocumentsByCustomerId,
        addDocument,
        addFollow,
        removeFollow,
        getCustomersInFollow

    }
  
   

