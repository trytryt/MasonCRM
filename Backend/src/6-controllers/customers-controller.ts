import express, { NextFunction, Request, Response } from "express";
import customersLogic from "../5-logic/customers-logic";

const router = express.Router();

// Get all customers by userId
router.get("/customers/:userId", async (request: Request, response: Response, next: NextFunction) => {
    try {
        const userId = +request.params.userId; 
        const customers = await customersLogic.getAllCustomers(userId);
        response.json(customers);
    } catch (error: any) {
        next(error);
    }
});

// Get one customer by customerId
router.get("/customer/:customerId", async (request: Request, response: Response, next: NextFunction) => {
    try {
        const customerId = +request.params.customerId;
        const customer = await customersLogic.getOneCustomer(customerId);
        const expenses = await customersLogic.getEpensesByCustomerId(customerId);
        const payments = await customersLogic.getPaymentByCustomerId(customerId);
        const result = {
            customer,
            expenses,
            payments
        };
        response.json(result);
    } catch (error: any) {
        next(error);
    }
});

// הוספת הכנסה חדשה
router.post("/customer/:customerId/payment", async (request: Request, response: Response, next: NextFunction) => {
    try {
        const customerId = +request.params.customerId;
        const payment = request.body; 
        payment.customerId = customerId;

        const addedPayment = await customersLogic.addPayment(payment);
        response.status(201).json(addedPayment); 
    } catch (error: any) {
        next(error);
    }
});

// הוספת הוצאה חדשה
router.post("/customer/:customerId/expense", async (request: Request, response: Response, next: NextFunction) => {
    try {
        const customerId = +request.params.customerId;
        const expense = request.body; 
        expense.customerId = customerId;

        const addedExpense = await customersLogic.addExpense(expense);
        response.status(201).json(addedExpense); 
    } catch (error: any) {
        next(error);
    }
});

// Add a new customer
router.post("/customer/:userId", async (request: Request, response: Response, next: NextFunction) => {
    try {
        const userId = +request.params.userId;
        const customer = request.body;
        const addedCustomer = await customersLogic.addCustomer(customer, userId);
        response.status(201).json(addedCustomer); 
    } catch (error: any) {
        next(error);
    }
});

// Update a customer
router.put("/customer/:customerId", async (request: Request, response: Response, next: NextFunction) => {
    try {
        const customerId = +request.params.customerId;
        const customer = request.body;
        const updatedCustomer = await customersLogic.updateCustomer(customerId, customer);
        response.json(updatedCustomer);
    } catch (error: any) {
        next(error);
    }
});

// Delete a customer
router.delete("/customer/:customerId", async (request: Request, response: Response, next: NextFunction) => {
    try {
        const customerId = +request.params.customerId;
        await customersLogic.deleteCustomer(customerId);
        response.sendStatus(204); 
    } catch (error: any) {
        next(error);
    }
});

// Get payments by customerId
router.get("/customer/:customerId/payments", async (request: Request, response: Response, next: NextFunction) => {
    try {
        const customerId = +request.params.customerId;
        const payments = await customersLogic.getPaymentByCustomerId(customerId);
        response.json(payments);
    } catch (error: any) {
        next(error);
    }
});
// Get expenses by customerId
router.get("/customer/:customerId/expenses", async (request: Request, response: Response, next: NextFunction) => {
    try {
        const customerId = +request.params.customerId;
        const expenses = await customersLogic.getEpensesByCustomerId(customerId);
        response.json(expenses);
    } catch (error: any) {
        next(error);
    }
});

export default router;
