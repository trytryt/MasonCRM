// src/Models/SuppliersModel.ts

// מודל ספק
export interface Supplier {
    id: number;
    name: string;
    phone: string;
    address: string;
    email?: string;
    notes: string;
    is_deleted?: boolean;
}

// מודל לצורך הוספה/עדכון של ספק
export interface SupplierPayload {
    name: string;
    phone: string;
    address: string;
    email?: string;
    notes: string;
}

// מודל עם מידע שחוזר מהשרת, כולל תמיכה בדפדוף
export interface SuppliersResponse {
    suppliers: Supplier[];
    count: number;
}

// מודל חוב ספק
export interface SupplierDebt {
    id?: number;
    supplier_id: number;
    customerId: number;
    amount: number;
    description: string;
    created_at?: Date | string;
    payment_status: 'unpaid' | 'paid';
    paid_at?: Date | string | null;
    is_deleted?: boolean;
    
    // שדות נוספים מטבלת suppliers
    supplier_name?: string;
    supplier_phone?: string;
    supplier_email?: string;
}

// מודל לצורך הוספה/עדכון של חוב ספק
export interface SupplierDebtPayload {
    supplier_id: number;
    customerId: number;
    amount: number;
    description: string;
    payment_status: 'unpaid' | 'paid';
}

// מודל עם מידע שחוזר מהשרת, כולל תמיכה בדפדוף
export interface SupplierDebtsResponse {
    debts: SupplierDebt[];
    count: number;
}

// סטטוס אפשרי של חוב ספק
export enum PaymentStatus {
    UNPAID = 'unpaid',
    PAID = 'paid'
}

// מודל עבור סטטיסטיקות חובות ספקים
export interface SupplierDebtStats {
    totalDebts: number;
    totalUnpaidDebts: number;
    totalPaidDebts: number;
    totalUnpaidAmount: number;
    totalPaidAmount: number;
    averageDebtAmount: number;
}

// מודל עבור דוח חובות לפי ספק
export interface SupplierDebtReport {
    supplier_id: number;
    supplier_name: string;
    supplier_phone: string;
    totalDebts: number;
    totalAmount: number;
    unpaidDebts: number;
    unpaidAmount: number;
    paidDebts: number;
    paidAmount: number;
}