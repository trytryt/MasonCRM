import dal from "../2-utils/dal";
import CustomerModel from "../4-models/CutomersModel";
import { ResourceNotFoundErrorModel, ValidationErrorModel } from "../4-models/ErrorModel";
import { OkPacket } from "mysql";
import PaymentModel from "../4-models/PaymentModel";


async function getAllCustomers(userId: number): Promise<CustomerModel[]> {
    const sql = `SELECT customerId, name, adress, phoneNumber
    FROM customer 
    WHERE userId = ?
    ORDER BY name ASC `;
    const customers = await dal.execute(sql, [userId])
    return customers
}

async function getOneCustomer(customerId: number): Promise<CustomerModel> {
    console.log(customerId)
    const sql = `SELECT * FROM customer WHERE customerId = ?`;
    const customers = await dal.execute(sql, [customerId]) 

    const customer = customers[0]

    if (!customer) throw new ResourceNotFoundErrorModel(customerId)

    return customer
}

// async function addCustomer(customer: CustomerModel, userId: number): Promise<CustomerModel> {
//     const error = customer.validate();
//     if (error) throw new ValidationErrorModel(error);
//     console.log("customer from back")
//     console.log(customer)
//     const sql = `
//         INSERT INTO customer (name, adress, phoneNumber, userId) 
//         VALUES (?, ?, ?, ?)
//     `;

//     console.log("customer before insert id:", customer);

//     const info: OkPacket = await dal.execute(sql, [
//         customer.name,
//         customer.adress,
//         customer.phoneNumber,
//         userId
//     ]);

//     console.log("Insert info:", info);
//     customer.customerId = info.insertId;
//     console.log("Inserted vacation with ID:", customer.customerId);

//     return customer;
// }

async function addCustomer(customer: any, userId: number): Promise<CustomerModel> {
    // הפוך את האובייקט למופע של CustomerModel
    const customerInstance = new CustomerModel(customer);

    // בדיקת ולידציה
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

    // עדכון ה-ID של הלקוח
    customerInstance.customerId = info.insertId;
    console.log("Inserted customer with ID:", customerInstance.customerId);

    return customerInstance;
}

// async function updateCustomer(customerId: number, customer: CustomerModel): Promise<CustomerModel> {
//     const error = customer.validate();
//     if (error) {
//         throw new ValidationErrorModel(error);
//     }
// console.log("i am here update before imageName");

//         const sql = `
//             UPDATE customer SET 
//                 name = ?, 
//                 adress = ?, 
//                 phoneNumber = ?
//             WHERE customerId = ?
//         `;

//         const INFO: OkPacket = await dal.execute(sql, [
//             customer.name, 
//             customer.adress, 
//             customer.phoneNumber, 
//             customerId
//         ]);

//         if (INFO.affectedRows === 0) {
//             throw new ResourceNotFoundErrorModel(`${customerId}`);
//         } return customer;
//     }

async function updateCustomer(customerId: number, customer: any): Promise<CustomerModel> {
    // יצירת מופע של CustomerModel
    const customerInstance = new CustomerModel(customer);

    // בדיקת ולידציה
    const error = customerInstance.validate();
    if (error) {
        throw new ValidationErrorModel(error);
    }

    console.log("i am here update before imageName");

    const sql = `
        UPDATE customer SET 
            name = ?, 
            adress = ?, 
            phoneNumber = ?
        WHERE customerId = ?
    `;

    const info: OkPacket = await dal.execute(sql, [
        customerInstance.name, 
        customerInstance.adress, 
        customerInstance.phoneNumber, 
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
            SELECT paymentId, customerId, amount, paymentDate, isPaid
            FROM payments
            WHERE customerId = ?`;
        
        const payments = await dal.execute(sql, [customerId]);
    
        if (!payments || payments.length === 0) {
            throw new ResourceNotFoundErrorModel(`No payments found for customerId ${customerId}`);
        }
    
        return payments;
    }
    
    export default {
        getAllCustomers,
        getOneCustomer, 
        addCustomer, 
        updateCustomer,
        deleteCustomer,
        getPaymentByCustomerId

    }
  
   

