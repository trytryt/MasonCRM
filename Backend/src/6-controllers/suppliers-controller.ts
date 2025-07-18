import express, { Request, Response, NextFunction } from "express";
import supplierDebtsLogic from "../5-logic/supliers-logic";
import SupplierDebtModel from "../4-models/SuppliersDebtsModel";
import SupplierModel from "../4-models/SupplierModel";


// נתיבים לניהול חובות ספקים
const router = express.Router();

// קבלת כל חובות הספקים (עם אפשרות לפילטור לפי לקוח)
router.get("/supplier-debts", async (request: Request, response: Response, next: NextFunction) => {
    try {
        const customerId = +request.query.customerId || undefined;
        const freeSearch = typeof request.query.freeSearch == 'string' ? request.query.freeSearch : undefined;
        const offset = +request.query.offset || 0;
        const limit = +request.query.limit || 20;
        
        const results = await supplierDebtsLogic.getAllSupplierDebts(customerId, freeSearch, offset, limit);
        response.json(results);
    }
    catch (error: any) {
        next(error);
    }
});

// קבלת חוב ספציפי לפי מזהה
router.get("/supplier-debts/:id", async (request: Request, response: Response, next: NextFunction) => {
    try {
        const id = +request.params.id;
        const debt = await supplierDebtsLogic.getOneSupplierDebt(id);
        response.json(debt);
    }
    catch (error: any) {
        next(error);
    }
});

// הוספת חוב ספק חדש
router.post("/supplier-debts", async (request: Request, response: Response, next: NextFunction) => {
    try {
        const debt = new SupplierDebtModel(request.body);
        const addedDebt = await supplierDebtsLogic.addSupplierDebt(debt);
        response.status(201).json(addedDebt);
    }
    catch (error: any) {
        next(error);
    }
});

// סימון חוב כשולם
router.put("/supplier-debts/:id/mark-paid", async (request: Request, response: Response, next: NextFunction) => {
    try {
        const id = +request.params.id;
        const success = await supplierDebtsLogic.markDebtAsPaid(id);
        
        if(success) {
            response.json({ success: true, message: "החוב סומן כשולם בהצלחה" });
        }
        else {
            response.status(404).json({ success: false, message: "החוב לא נמצא או כבר סומן כשולם" });
        }
    }
    catch (error: any) {
        next(error);
    }
});

// עריכת חוב ספק - נתיב חדש
router.put("/supplier-debts/:id", async (request: Request, response: Response, next: NextFunction) => {
    try {
        const id = +request.params.id;
        request.body.id = id;  // וידוא שה-ID בגוף הבקשה תואם לנתיב
        
        const debt = new SupplierDebtModel(request.body);
        const updatedDebt = await supplierDebtsLogic.updateSupplierDebt(debt);
        
        // עדכון רשומה בטבלת הוצאות אם קיימת
        await supplierDebtsLogic.updateExpenseRecord(updatedDebt);
        
        response.json(updatedDebt);
    }
    catch (error: any) {
        next(error);
    }
});

// מחיקת חוב ספק - נתיב חדש
router.delete("/supplier-debts/:id", async (request: Request, response: Response, next: NextFunction) => {
    try {
        const id = +request.params.id;
        const success = await supplierDebtsLogic.deleteSupplierDebt(id);
        
        if(success) {
            response.json({ success: true, message: "החוב נמחק בהצלחה" });
        }
        else {
            response.status(404).json({ success: false, message: "החוב לא נמצא או כבר נמחק" });
        }
    }
    catch (error: any) {
        next(error);
    }
});
// קבלת כל הספקים (עם אפשרות לחיפוש ודפדוף)
router.get("/suppliers", async (request: Request, response: Response, next: NextFunction) => {
    try {
        const freeSearch = typeof request.query.freeSearch == 'string' ? request.query.freeSearch : undefined;
        const offset = +request.query.offset || 0;
        const limit = +request.query.limit || 100;
        
        const results = await supplierDebtsLogic.getAllSuppliers(freeSearch, offset, limit);
        response.json(results);
    }
    catch (error: any) {
        next(error);
    }
});

// קבלת ספק ספציפי לפי מזהה
router.get("/suppliers/:id", async (request: Request, response: Response, next: NextFunction) => {
    try {
        const id = +request.params.id;
        const supplier = await supplierDebtsLogic.getOneSupplier(id);
        response.json(supplier);
    }
    catch (error: any) {
        next(error);
    }
});

// הוספת ספק חדש
router.post("/suppliers", async (request: Request, response: Response, next: NextFunction) => {
    try {
        const supplier = new SupplierModel(request.body);
        const addedSupplier = await supplierDebtsLogic.addSupplier(supplier);
        response.status(201).json(addedSupplier);
    }
    catch (error: any) {
        next(error);
    }
});

// עדכון ספק קיים
router.put("/suppliers/:id", async (request: Request, response: Response, next: NextFunction) => {
    try {
        const id = +request.params.id;
        request.body.id = id;
        
        const supplier = new SupplierModel(request.body);
        const updatedSupplier = await supplierDebtsLogic.updateSupplier(supplier);
        
        response.json(updatedSupplier);
    }
    catch (error: any) {
        next(error);
    }
});

// מחיקת ספק
router.delete("/suppliers/:id", async (request: Request, response: Response, next: NextFunction) => {
    try {
        const id = +request.params.id;
        const success = await supplierDebtsLogic.deleteSupplier(id);
        
        if(success) {
            response.json({ success: true, message: "הספק נמחק בהצלחה" });
        }
        else {
            response.status(404).json({ success: false, message: "הספק לא נמצא או כבר נמחק" });
        }
    }
    catch (error: any) {
        next(error);
    }
});

// חיפוש ספקים (לשימוש בדרופדאון)
router.get("/suppliers/search/:term", async (request: Request, response: Response, next: NextFunction) => {
    try {
        const searchTerm = request.params.term;
        const limit = +request.query.limit || 50;
        
        const suppliers = await supplierDebtsLogic.searchSuppliers(searchTerm, limit);
        response.json(suppliers);
    }
    catch (error: any) {
        next(error);
    }
});

export default router;