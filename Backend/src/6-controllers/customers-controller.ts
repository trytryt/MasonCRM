import express, { NextFunction, Request, Response } from "express";
import customersLogic from "../5-logic/customers-logic";
import { fileUploadMiddleware } from '../3-middleWare/fileUploadMiddleware'
import e_chomarim from '../4-models/ExpenseModel'
import documentModel from "../4-models/DocumentModel";
import DocumentModel from "../4-models/DocumentModel";

const router = express.Router();

// Get all customers by userId
router.get("/customers/:userId", async (request: Request, response: Response, next: NextFunction) => {
    try {
        const userId = +request.params.userId;
        const freeSearch = typeof request.query.freeSearch == 'string' ? request.query.freeSearch : undefined;
        const offset = +request.query.offset;
        const limit = +request.query.limit;
        const results = await customersLogic.getAllCustomers(userId, freeSearch, offset, limit);
        response.send(results);
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
        const documents = await customersLogic.getDocumentsByCustomerId(customerId);
        const result = {
            customer,
            expenses,
            payments,
            documents
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

// Example of your endpoint (ensure it is correctly handling file uploads)
router.post('/customer/:customerId/upload', fileUploadMiddleware, async (req: Request, res: Response) => {
    try {
        const customerId = +req.params.customerId;
        const uploadedFile = (req as any).uploadedFile;

        if (!uploadedFile) {
            return res.status(400).json({ message: 'File upload failed!' });
        }

        const document = new DocumentModel({
            documentId: null,  // Assuming documentId is auto-generated
            customerId: customerId,
            documentName: uploadedFile.originalName,
            filePath: uploadedFile.fileName,
            uploadDate: new Date().toISOString(),
        });

        const validationError = document.validate();
        if (validationError) {
            return res.status(400).json({ message: validationError });
        }

        // Save the document (assuming `addDocument` is an async function)
        const addedDocument = await customersLogic.addDocument(document);

        // Send the response with the document details
        res.status(200).json({
            message: 'File uploaded and document saved successfully!',
            document: addedDocument,
        });
    } catch (err) {
        console.error('Error in controller:', err);
        res.status(500).json({ message: 'Server error' });
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
        console.log(customer);
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

router.post("/addFollowedCust", async (request: Request, response: Response, next: NextFunction) => {
    try {
        const { customerId, status } = request.body; // קבלת המידע מ-body של הבקשה
        const updated = await customersLogic.addFollow(customerId, status); // עדכון הסטטוס
        if (updated) {
            response.json({ message: 'סטטוס הלקוח עודכן בהצלחה' });
        } else {
            response.status(400).json({ message: 'שגיאה בעדכון סטטוס' });
        }
    } catch (error: any) {
        next(error);
    }
});

router.post("/removeFollowedCust", async (request: Request, response: Response, next: NextFunction) => {
    try {
        const { customerId } = request.body; 
        const removed = await customersLogic.removeFollow(customerId); 
        if (removed) {
            response.json({ message: 'הלקוח הוסר מהמעקב בהצלחה' });
        } else {
            response.status(400).json({ message: 'שגיאה בהסרת הלקוח מהמעקב' });
        }
    } catch (error: any) {
        next(error);
    }
});


router.get("/getCustInFollow", async (request: Request, response: Response, next: NextFunction) => {
    try {
        const customers = await customersLogic.getCustomersInFollow();
        response.json(customers);
    } catch (error: any) {
        next(error);
    }
});

export default router;
