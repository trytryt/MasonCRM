
import Joi from "joi";

class CustomerModel {
    public customerId: number
    public name: string;
    public adress: string;
    public phoneNumber: string;
    public userId: number;
    public customerStatus: number;


    public constructor(customer: CustomerModel) {
        this.customerId = customer.customerId
        this.name = customer.name
        this.adress = customer.adress
        this.phoneNumber = customer.phoneNumber
        this.userId = customer.userId || 0
        this.customerStatus = customer.customerStatus || 1
    }

    private static validationSchema = Joi.object({
        customerId: Joi.number().optional().allow(null),
        name: Joi.string().required().min(2).max(100),
        adress: Joi.string().required().min(3).max(30),
        phoneNumber: Joi.string().required().min(5),
        userId: Joi.number().required(),
        customerStatus: Joi.number().min(0).max(2)
    });

    public validate(): string {
        const result = CustomerModel.validationSchema.validate(this);
        return result.error?.message;
    }
}

export default CustomerModel;