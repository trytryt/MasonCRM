import express, { NextFunction, Request, Response } from "express";
import customersLogic from "../5-logic/customers-logic";

const router = express.Router();

// Get all customers by userId
router.get("/customers/:userId", async (request: Request, response: Response, next: NextFunction) => {
    try {
        const userId = +request.params.userId; // Convert string to number
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
        response.json(customer);
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
        response.status(201).json(addedCustomer); // 201: Created
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
        response.sendStatus(204); // 204: No Content
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

export default router;
