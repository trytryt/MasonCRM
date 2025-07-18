import Joi from "joi";

class SupplierModel {
    public id: number;
    public name: string;
    public phone: string;
    public address: string;
    public email?: string;
    public notes: string;
    public is_deleted: boolean;

    public constructor(supplier: Partial<SupplierModel>) {
        this.id = supplier.id;
        this.name = supplier.name;
        this.phone = supplier.phone || "";
        this.address = supplier.address || "";
        this.email = supplier.email;
        this.notes = supplier.notes || "";
        this.is_deleted = supplier.is_deleted || false;
    }

    private static validationSchema = Joi.object({
        id: Joi.number().optional().allow(null),
        name: Joi.string().required().min(2).max(100),
        phone: Joi.string().optional().allow("").max(20),
        address: Joi.string().optional().allow("").max(200),
        email: Joi.string().email().optional().allow("").max(100),
        notes: Joi.string().optional().allow("").max(500),
        is_deleted: Joi.boolean().optional()
    });

    public validate(): string {
        const result = SupplierModel.validationSchema.validate(this);
        return result.error?.message;
    }
}

export default SupplierModel;