import dal from "../2-utils/dal";
import CustomerModel from "../4-models/CutomersModel";
import {ResourceNotFoundErrorModel, ValidationErrorModel} from "../4-models/ErrorModel";
import {OkPacket} from "mysql";
import PaymentModel from "../4-models/PaymentModel";
import ExpenseModel from "../4-models/ExpenseModel";
import CustInFollow from "../4-models/CustInFollow";


async function getAllCustomers(
    userId: number,
    freeSearch: string|undefined,
    page: number,
    limit: number):
Promise<{ customers: CustomerModel[]; count: number}> {
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

    const count = await dal.execute(countSql, baseParams)

    const paginationParams = [...baseParams, limit, page];
    console.log("SQL: " + customersSql);
    console.log("SQL: " + countSql);
    console.log("pageination " + JSON.stringify(paginationParams));
    const customers = await dal.execute(customersSql, paginationParams);
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
    console.log("Inserted customer with ID:", customerInstance.customerId);

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
        addFollow,
        removeFollow,
        getCustomersInFollow

    }
  
   

