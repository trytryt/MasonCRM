
import Joi from "joi";

class CustomerModel {
    public customerId: number
    public name: string;
    public adress: string;
    public phoneNumber: string;
   

    public constructor(customer: CustomerModel) {
        this.customerId = customer.customerId
        this.name = customer.name
        this.adress = customer.adress
        this.phoneNumber = customer.phoneNumber
    }

    private static validationSchema = Joi.object({
        customerId: Joi.number().optional().allow(null),
        name: Joi.string().required().min(4).max(100),
        adress: Joi.string().required().min(5).max(30),
        phoneNumber: Joi.string().required().min(5)

    });

    public validate(): string {
        const result = CustomerModel.validationSchema.validate(this);
        return result.error?.message;
    }
}

export default CustomerModel;