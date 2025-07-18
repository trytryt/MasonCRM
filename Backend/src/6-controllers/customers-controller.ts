import express, { NextFunction, Request, Response } from "express";
import customersLogic from "../5-logic/customers-logic";
import { fileUploadMiddleware } from '../3-middleWare/fileUploadMiddleware';
import DocumentModel from "../4-models/DocumentModel";

const router = express.Router();

/* ========== ROUTES כלליים ========== */

// Get customers in follow
router.get("/getCustInFollow", async (request: Request, response: Response, next: NextFunction) => {
    try {
        const customers = await customersLogic.getCustomersInFollow();
        response.json(customers);
    } catch (error: any) {
        next(error);
    }
});

// Add customer to follow
router.post("/addFollowedCust", async (request: Request, response: Response, next: NextFunction) => {
    try {
        const { customerId, status } = request.body;
        const updated = await customersLogic.addFollow(customerId, status);
        updated
            ? response.json({ message: 'סטטוס הלקוח עודכן בהצלחה' })
            : response.status(400).json({ message: 'שגיאה בעדכון סטטוס' });
    } catch (error: any) {
        next(error);
    }
});

// Remove customer from follow
router.post("/removeFollowedCust", async (request: Request, response: Response, next: NextFunction) => {
    try {
        const { customerId } = request.body;
        const removed = await customersLogic.removeFollow(customerId);
        removed
            ? response.json({ message: 'הלקוח הוסר מהמעקב בהצלחה' })
            : response.status(400).json({ message: 'שגיאה בהסרת הלקוח מהמעקב' });
    } catch (error: any) {
        next(error);
    }
});

/* ========== ROUTES לפי userId ========== */

// Get all customers by userId
router.get("/customers/:userId", async (request: Request, response: Response, next: NextFunction) => {
    try {
        const userId = +request.params.userId;
        const freeSearch = typeof request.query.freeSearch === 'string' ? request.query.freeSearch : undefined;
        const offset = +request.query.offset;
        const limit = +request.query.limit;
        const results = await customersLogic.getAllCustomers(userId, freeSearch, offset, limit);
        response.send(results);
    } catch (error: any) {
        next(error);
    }
});

// Get month balance by userId
router.get('/customer/:userId/month-balance', async(request: Request, response: Response, next: NextFunction) => {
    try {
        const userId = +request.params.userId;
        const results = await customersLogic.fetchBalancePerMonth(userId);
        response.status(200).json(results);
    } catch(err) {
        next(err);
    }
});

// Get year balance by userId
router.get('/customer/:userId/year-balance', async(request: Request, response: Response, next: NextFunction) => {
    try {
        const userId = +request.params.userId;
        const results = await customersLogic.fetchBalancePerYear(userId);
        response.status(200).json(results);
    } catch(err) {
        next(err);
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

/* ========== ROUTES לפי customerId ========== */

// Get one customer with expenses, payments and documents
router.get("/customer/:customerId", async (request: Request, response: Response, next: NextFunction) => {
    try {
        const customerId = +request.params.customerId;
        const customer = await customersLogic.getOneCustomer(customerId);
        const expenses = await customersLogic.getEpensesByCustomerId(customerId);
        const payments = await customersLogic.getPaymentByCustomerId(customerId);
        const documents = await customersLogic.getDocumentsByCustomerId(customerId);
        response.json({ customer, expenses, payments, documents });
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

// Add payment
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

// Add expense - עם תיקון ולוגים
router.post("/customer/:customerId/expense", async (request: Request, response: Response, next: NextFunction) => {
    try {
        const customerId = +request.params.customerId;
        const expense = request.body; 
        expense.customerId = customerId;

        console.log("Received expense data:", expense); // לוג לדיבוג
        
        // ווידוא שכל השדות הנדרשים קיימים
        if (!expense.amount || expense.amount <= 0) {
            return response.status(400).json({ message: 'סכום הוצאה חייב להיות גדול מ-0' });
        }
        
        if (!expense.chomarimCategory || expense.chomarimCategory.trim() === '') {
            return response.status(400).json({ message: 'קטגוריית הוצאה חובה' });
        }
        
        // הגדרת ערכי ברירת מחדל
        expense.expenseTypeId = expense.expenseTypeId || 1;
        expense.updateDate = expense.updateDate || new Date().toISOString().split('T')[0];

        console.log("Processed expense data:", expense); // לוג לדיבוג

        const addedExpense = await customersLogic.addExpense(expense);
        
        console.log("Added expense result:", addedExpense); // לוג לדיבוג
        
        response.status(201).json(addedExpense); 
    } catch (error: any) {
        console.error("Error in expense controller:", error); // לוג שגיאות
        next(error);
    }
});

// Upload document
router.post('/customer/:customerId/upload', fileUploadMiddleware, async (req: Request, res: Response) => {
    try {
        const customerId = +req.params.customerId;
        const uploadedFile = (req as any).uploadedFile;

        if (!uploadedFile) {
            return res.status(400).json({ message: 'File upload failed!' });
        }

        const document = new DocumentModel({
            documentId: null,
            customerId: customerId,
            documentName: uploadedFile.originalName,
            filePath: uploadedFile.fileName,
            uploadDate: new Date().toISOString(),
        });

        const validationError = document.validate();
        if (validationError) {
            return res.status(400).json({ message: validationError });
        }

        const addedDocument = await customersLogic.addDocument(document);

        res.status(200).json({
            message: 'File uploaded and document saved successfully!',
            document: addedDocument,
        });
    } catch (err) {
        console.error('Error in controller:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete document
router.delete('/customer/:customerId/document/:documentId', async (req: Request, res: Response) => {
    try {
        const customerId = +req.params.customerId;
        const documentId = +req.params.documentId;

        if (isNaN(customerId) || isNaN(documentId)) {
            return res.status(400).json({ 
                success: false, 
                message: 'מזהה לקוח או מזהה מסמך לא תקינים' 
            });
        }

        const result = await customersLogic.deleteDocument(documentId, customerId);

        if (result.success) {
            res.status(200).json({
                success: true,
                message: 'המסמך נמחק בהצלחה',
                deletedDocumentId: documentId
            });
        } else {
            res.status(404).json({
                success: false,
                message: result.message || 'המסמך לא נמצא או לא ניתן למחוק'
            });
        }

    } catch (err) {
        console.error('Error deleting document:', err);
        res.status(500).json({ 
            success: false, 
            message: 'שגיאת שרת במחיקת המסמך' 
        });
    }
});

// Update customer
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

// Delete customer
router.delete("/customer/:customerId", async (request: Request, response: Response, next: NextFunction) => {
    try {
        const customerId = +request.params.customerId;
        await customersLogic.deleteCustomer(customerId);
        response.sendStatus(204); 
    } catch (error: any) {
        next(error);
    }
});

export default router;
