import dal from "../2-utils/dal";
import { OkPacket } from "mysql";
import SupplierDebtModel from "../4-models/SuppliersDebtsModel";
import{ResourceNotFoundErrorModel}  from "../4-models/ErrorModel";
import SupplierModel from "../4-models/SupplierModel";

// פונקציות לוגיקה מעודכנות לניהול חובות ספקים
async function getAllSupplierDebts(
    customerId?: number,
    freeSearch?: string,
    offset: number = 0,
    limit: number = 20
): Promise<{ debts: SupplierDebtModel[], count: number }> {
    // בניית תנאי חיפוש
    const conditions = customerId 
        ? "WHERE d.customerId = ? AND d.is_deleted = 0" 
        : "WHERE d.is_deleted = 0";

    const searchCondition = freeSearch 
        ? " AND (s.name LIKE ? OR d.description LIKE ?)" 
        : "";

    // שאילתה לספירת רשומות
    const countSql = `SELECT COUNT(*) AS count 
                      FROM supplier_debts d
                      LEFT JOIN suppliers s ON d.supplier_id = s.id
                      ${conditions} ${searchCondition}`;

    // שאילתה לקבלת הנתונים עם דפדוף
    const debtsSql = `SELECT d.*, s.name as supplier_name, s.phone as supplier_phone
                      FROM supplier_debts d
                      LEFT JOIN suppliers s ON d.supplier_id = s.id
                      ${conditions} ${searchCondition} 
                      ORDER BY d.created_at DESC 
                      LIMIT ? OFFSET ?`;

    // הכנת הפרמטרים
    const baseParams: (number | string)[] = [];
    if (customerId) baseParams.push(customerId);
    
    if (freeSearch) {
        const searchParam = `%${freeSearch}%`;
        baseParams.push(searchParam, searchParam);
    }

    // ביצוע שאילתת הספירה
    const result = await dal.execute(countSql, baseParams);
    const count = result[0]?.count ?? 0;

    // ביצוע שאילתת הנתונים עם דפדוף
    const paginationParams = [...baseParams, limit, offset];
    const debts = await dal.execute(debtsSql, paginationParams);

    return {
        debts,
        count
    };
}

// קבלת חוב ספציפי לפי מזהה
async function getOneSupplierDebt(id: number): Promise<SupplierDebtModel> {
    const sql = `SELECT d.*, s.name as supplier_name, s.phone as supplier_phone
                FROM supplier_debts d
                LEFT JOIN suppliers s ON d.supplier_id = s.id
                WHERE d.id = ? AND d.is_deleted = 0`;
    
    const debts = await dal.execute(sql, [id]);
    
    const debt = debts[0];
    if (!debt) throw new ResourceNotFoundErrorModel(id);
    
    return debt;
}

// הוספת חוב ספק חדש
async function addSupplierDebt(debt: SupplierDebtModel): Promise<SupplierDebtModel> {
    // בדיקת תקינות
    const error = debt.validate();
    if (error) throw new Error(error);

    // הוספת החוב
    const sql = `INSERT INTO supplier_debts(supplier_id, customerId, amount, description, created_at, payment_status, is_deleted)
                 VALUES(?, ?, ?, ?, ?, ?, ?)`;
    
    const result: OkPacket = await dal.execute(sql, [
        debt.supplier_id,
        debt.customerId,
        debt.amount,
        debt.description,
        debt.created_at,
        debt.payment_status,
        debt.is_deleted
    ]);

    // שמירת ה-ID שנוצר
    debt.id = result.insertId;

    // הוספת רשומה לטבלת ההוצאות
    await addExpenseRecord(debt);
    
    // קבלת החוב עם פרטי הספק
    const addedDebt = await getOneSupplierDebt(debt.id);
    return addedDebt;
}

// הוספת רשומה לטבלת הוצאות (chomarim)
async function addExpenseRecord(debt: SupplierDebtModel): Promise<void> {
    try {
        // קבלת שם הספק
        const supplierQuery = `SELECT name FROM suppliers WHERE id = ? AND is_deleted = 0`;
        const suppliers = await dal.execute(supplierQuery, [debt.supplier_id]);
        const supplierName = suppliers[0]?.name || "ספק לא ידוע";

        // הוספת הוצאה לפי המבנה של טבלת chomarim
        const sql = `INSERT INTO chomarim(customerId, expenseTypeId, chomarimCategory, amount, updateDate)
                     VALUES(?, ?, ?, ?, ?)`;
        
        await dal.execute(sql, [
            debt.customerId,
            1, // expenseTypeId - תצטרך להחליט איזה ID מתאים
            `חוב לספק: ${supplierName}`, // chomarimCategory כתיאור
            debt.amount,
            new Date() // updateDate
        ]);
    } catch (err) {
        console.error("שגיאה בהוספת רשומה לטבלת הוצאות:", err);
        // במקרה של שגיאה, אנחנו לא נכשיל את כל הפעולה, רק נרשום את השגיאה
    }
}

// סימון חוב כשולם
async function markDebtAsPaid(id: number): Promise<boolean> {
    const sql = `UPDATE supplier_debts 
                 SET payment_status = 'paid', paid_at = NOW() 
                 WHERE id = ? AND payment_status = 'unpaid' AND is_deleted = 0`;
    
    const result: OkPacket = await dal.execute(sql, [id]);
    return result.affectedRows > 0;
}

// ניקוי חובות ישנים ששולמו (אחרי 30 יום)
async function cleanupOldPaidDebts(): Promise<number> {
    const sql = `UPDATE supplier_debts 
                 SET is_deleted = 1
                 WHERE payment_status = 'paid' 
                 AND paid_at < DATE_SUB(NOW(), INTERVAL 30 DAY)
                 AND is_deleted = 0`;
    
    const result: OkPacket = await dal.execute(sql);
    return result.affectedRows;
}
async function deleteSupplierDebt(id: number): Promise<boolean> {
    // מחיקה לוגית - עדכון שדה is_deleted ל-true
    const sql = `UPDATE supplier_debts 
                 SET is_deleted = 1
                 WHERE id = ? AND is_deleted = 0`;
    
    const result: OkPacket = await dal.execute(sql, [id]);
    return result.affectedRows > 0;
}

// עריכת חוב ספק
async function updateSupplierDebt(debt: SupplierDebtModel): Promise<SupplierDebtModel> {
    // בדיקת תקינות
    const error = debt.validate();
    if (error) throw new Error(error);
    
    // בדיקה שהחוב קיים
    const existingDebt = await getOneSupplierDebt(debt.id);
    if (!existingDebt) {
        throw new ResourceNotFoundErrorModel(debt.id);
    }
    
    // עדכון החוב
    const sql = `UPDATE supplier_debts 
                 SET supplier_id = ?, 
                     customerId = ?, 
                     amount = ?, 
                     description = ?, 
                     payment_status = ?
                 WHERE id = ? AND is_deleted = 0`;
    
    const params = [
        debt.supplier_id,
        debt.customerId,
        debt.amount,
        debt.description,
        debt.payment_status,
        debt.id
    ];
    
    const result: OkPacket = await dal.execute(sql, params);
    
    if (result.affectedRows === 0) {
        throw new ResourceNotFoundErrorModel(debt.id);
    }
    
    // החזרת החוב המעודכן עם פרטי הספק
    return await getOneSupplierDebt(debt.id);
}

// עדכון או הוספת רשומה בטבלת הוצאות (chomarim) לאחר עריכת חוב
async function updateExpenseRecord(debt: SupplierDebtModel): Promise<void> {
    try {
        // קבלת שם הספק
        const supplierQuery = `SELECT name FROM suppliers WHERE id = ? AND is_deleted = 0`;
        const suppliers = await dal.execute(supplierQuery, [debt.supplier_id]);
        const supplierName = suppliers[0]?.name || "ספק לא ידוע";
        
        // בדיקה אם כבר קיימת רשומת הוצאה לחוב זה
        // מכיוון שאין source_id, נחפש לפי customerId וסכום ותיאור
        const checkSql = `SELECT chomarimId FROM chomarim 
                         WHERE customerId = ? 
                         AND amount = ? 
                         AND chomarimCategory LIKE ?`;
        const existingExpense = await dal.execute(checkSql, [
            debt.customerId, 
            debt.amount, 
            `%${supplierName}%`
        ]);
        
        if (existingExpense && existingExpense.length > 0) {
            // עדכון רשומה קיימת
            const updateSql = `UPDATE chomarim 
                              SET amount = ?, 
                                  chomarimCategory = ?,
                                  updateDate = ?
                              WHERE chomarimId = ?`;
            
            await dal.execute(updateSql, [
                debt.amount,
                `חוב לספק: ${supplierName} - ${debt.description}`,
                new Date(),
                existingExpense[0].chomarimId
            ]);
        } else {
            // יצירת רשומה חדשה
            await addExpenseRecord(debt);
        }
    } catch (err) {
        console.error("שגיאה בעדכון רשומה בטבלת הוצאות:", err);
    }
}
// קבלת כל הספקים (עם חיפוש ודפדוף)
// קבלת כל הספקים
async function getAllSuppliers(
    freeSearch?: string,
    offset: number = 0,
    limit: number = 100
): Promise<{ suppliers: SupplierModel[], count: number }> {
    // בניית תנאי חיפוש
    const baseCondition = "WHERE is_deleted = 0";
    const searchCondition = freeSearch 
        ? " AND (name LIKE ? OR phone LIKE ? OR email LIKE ? OR address LIKE ?)" 
        : "";

    // שאילתה לספירת רשומות
    const countSql = `SELECT COUNT(*) AS count 
                      FROM suppliers 
                      ${baseCondition} ${searchCondition}`;

    // שאילתה לקבלת הנתונים עם דפדוף
    const suppliersSql = `SELECT * FROM suppliers
                          ${baseCondition} ${searchCondition} 
                          ORDER BY name ASC 
                          LIMIT ? OFFSET ?`;

    // הכנת הפרמטרים
    const baseParams: (string)[] = [];
    
    if (freeSearch) {
        const searchParam = `%${freeSearch}%`;
        baseParams.push(searchParam, searchParam, searchParam, searchParam);
    }

    // ביצוע שאילתת הספירה
    const result = await dal.execute(countSql, baseParams);
    const count = result[0]?.count ?? 0;

    // ביצוע שאילתת הנתונים עם דפדוף
    const paginationParams = [...baseParams, limit, offset];
    const suppliers = await dal.execute(suppliersSql, paginationParams);

    return {
        suppliers,
        count
    };
}


// קבלת ספק ספציפי לפי מזהה
async function getOneSupplier(id: number): Promise<SupplierModel> {
    const sql = `SELECT * FROM suppliers WHERE id = ? AND is_deleted = 0`;
    
    const suppliers = await dal.execute(sql, [id]);
    
    const supplier = suppliers[0];
    if (!supplier) throw new ResourceNotFoundErrorModel(id);
    
    return supplier;
}

// הוספת ספק חדש
// הוספת ספק חדש
async function addSupplier(supplier: SupplierModel): Promise<SupplierModel> {
    // בדיקת תקינות
    const error = supplier.validate();
    if (error) throw new Error(error);

    // בדיקה שלא קיים ספק עם אותו שם
    const existingSupplier = await checkSupplierExists(supplier.name);
    if (existingSupplier) {
        throw new Error("כבר קיים ספק עם שם זה");
    }

    // הוספת הספק (לפי המבנה האמיתי של הטבלה)
    const sql = `INSERT INTO suppliers(name, phone, address, email, notes, is_deleted)
                 VALUES(?, ?, ?, ?, ?, ?)`;
    
    const result: OkPacket = await dal.execute(sql, [
        supplier.name,
        supplier.phone,
        supplier.address,
        supplier.email,
        supplier.notes,
        supplier.is_deleted
    ]);

    // שמירת ה-ID שנוצר
    supplier.id = result.insertId;
    
    return supplier;
}

// עדכון ספק קיים
async function updateSupplier(supplier: SupplierModel): Promise<SupplierModel> {
    // בדיקת תקינות
    const error = supplier.validate();
    if (error) throw new Error(error);
    
    // בדיקה שהספק קיים
    const existingSupplier = await getOneSupplier(supplier.id);
    if (!existingSupplier) {
        throw new ResourceNotFoundErrorModel(supplier.id);
    }
    
    // בדיקה שלא קיים ספק אחר עם אותו שם
    const duplicateSupplier = await checkSupplierExists(supplier.name, supplier.id);
    if (duplicateSupplier) {
        throw new Error("כבר קיים ספק אחר עם שם זה");
    }
    
    // עדכון הספק
    const sql = `UPDATE suppliers 
                 SET name = ?, 
                     phone = ?, 
                     address = ?,
                     email = ?,
                     notes = ?
                 WHERE id = ? AND is_deleted = 0`;
    
    const params = [
        supplier.name,
        supplier.phone,
        supplier.address,
        supplier.email,
        supplier.notes,
        supplier.id
    ];
    
    const result: OkPacket = await dal.execute(sql, params);
    
    if (result.affectedRows === 0) {
        throw new ResourceNotFoundErrorModel(supplier.id);
    }
    
    return supplier;
}
// מחיקת ספק (מחיקה לוגית)
async function deleteSupplier(id: number): Promise<boolean> {
    // בדיקה שאין חובות פעילים לספק זה
    const activeDebtsCount = await getSupplierActiveDebtsCount(id);
    if (activeDebtsCount > 0) {
        throw new Error("לא ניתן למחוק ספק שיש לו חובות פעילים");
    }

    // מחיקה לוגית - עדכון שדה is_deleted ל-true
    const sql = `UPDATE suppliers 
                 SET is_deleted = 1
                 WHERE id = ? AND is_deleted = 0`;
    
    const result: OkPacket = await dal.execute(sql, [id]);
    return result.affectedRows > 0;
}

// בדיקה אם קיים ספק עם שם מסוים (למניעת כפילויות)
async function checkSupplierExists(name: string, excludeId?: number): Promise<boolean> {
    let sql = `SELECT id FROM suppliers WHERE name = ? AND is_deleted = 0`;
    const params: (string | number)[] = [name];
    
    if (excludeId) {
        sql += ` AND id != ?`;
        params.push(excludeId);
    }
    
    const result = await dal.execute(sql, params);
    return result.length > 0;
}

// קבלת מספר חובות פעילים של ספק
async function getSupplierActiveDebtsCount(supplierId: number): Promise<number> {
    const sql = `SELECT COUNT(*) as count 
                 FROM supplier_debts 
                 WHERE supplier_id = ? AND payment_status = 'unpaid' AND is_deleted = 0`;
    
    const result = await dal.execute(sql, [supplierId]);
    return result[0]?.count ?? 0;
}

// חיפוש ספקים לפי שם (לשימוש בדרופדאון)
async function searchSuppliers(searchTerm: string, limit: number = 50): Promise<SupplierModel[]> {
    const sql = `SELECT * FROM suppliers 
                 WHERE name LIKE ? AND is_deleted = 0 
                 ORDER BY name ASC 
                 LIMIT ?`;
    
    const searchParam = `%${searchTerm}%`;
    const suppliers = await dal.execute(sql, [searchParam, limit]);
    
    return suppliers;
}


export default {
    getAllSupplierDebts,
    getOneSupplierDebt,
    addSupplierDebt,
    markDebtAsPaid,
    cleanupOldPaidDebts,
    deleteSupplierDebt,     
    updateSupplierDebt,    
    updateExpenseRecord,
    getAllSuppliers,
    getOneSupplier,
    addSupplier,
    updateSupplier,
    deleteSupplier,
    checkSupplierExists,
    getSupplierActiveDebtsCount,
    searchSuppliers    
};