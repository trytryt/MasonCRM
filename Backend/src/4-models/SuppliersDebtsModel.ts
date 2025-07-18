import Joi from "joi";

class SupplierDebtModel {
    public id: number;
    public supplier_id: number;
    public customerId: number;
    public amount: number;
    public description: string;
    public created_at: Date;
    public payment_status: string; // 'unpaid' | 'paid'
    public paid_at: Date | null;
    public is_deleted: boolean;
    
    // שדות נוספים מטבלת suppliers (יתווספו ע"י JOIN)
    public supplier_name?: string;
    public supplier_phone?: string;

    public constructor(debt: Partial<SupplierDebtModel>) {
        this.id = debt.id;
        this.supplier_id = debt.supplier_id;
        this.customerId = debt.customerId;
        this.amount = debt.amount;
        this.description = debt.description || "";
        this.created_at = debt.created_at || new Date();
        this.payment_status = debt.payment_status || "unpaid";
        this.paid_at = debt.paid_at || null;
        this.is_deleted = debt.is_deleted || false;
        
        // שדות נוספים לאחר JOIN
        this.supplier_name = debt.supplier_name;
        this.supplier_phone = debt.supplier_phone;
    }

    private static validationSchema = Joi.object({
        id: Joi.number().optional().allow(null),
        supplier_id: Joi.number().required().positive(),
        customerId: Joi.number().required().positive(),
        amount: Joi.number().required().positive(),
        description: Joi.string().optional().allow(""),
        created_at: Joi.date().optional(),
        payment_status: Joi.string().valid("unpaid", "paid").required(),
        paid_at: Joi.date().allow(null).optional(),
        is_deleted: Joi.boolean().optional(),
        
        // שדות שלא נכנסים לבדיקת התקינות בעת יצירה/עדכון
        supplier_name: Joi.string().optional(),
        supplier_phone: Joi.string().optional()
    });

    public validate(): string {
        const result = SupplierDebtModel.validationSchema.validate(this);
        return result.error?.message;
    }
}

export default SupplierDebtModel;