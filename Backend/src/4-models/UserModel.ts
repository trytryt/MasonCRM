import Joi from "joi"


class UserModel {
    public userId:number
    public userName: string
    public password: string

    public constructor(user: Partial<UserModel>) {
        this.userId = user.userId ;
        this.userName = user.userName!;
        this.password = user.password!;
    }

    public static validationSchema = Joi.object({
        userId: Joi.number().optional().integer().positive(),
        userName: Joi.string().required().min(4).max(30),
        password: Joi.string().required().min(4).max(20),
    })

    public validate():string |undefined {
        const result = UserModel.validationSchema.validate(this)
        return result.error?.message
    }


}

export {UserModel}

