import express, { NextFunction, Request, Response, request } from "express"
import authLogic from "../5-logic/auth-logic"
import CredentialsModel from "../4-models/CredentialsModel"
import { UserModel } from "../4-models/UserModel"


const router = express.Router()
 router.post("/auth/register", async(request:Request, response:Response, next: NextFunction)=>{
    try {
        const user = new UserModel(request.body)
 console.log("log from controller:" +request.body);   
        const token = await authLogic.register(user)
        response.status(201).json(token)
    } catch (error:any) {
        next(error)
    }
 })


 router.post("/auth/login" ,async(request:Request,response:Response,next:NextFunction)=>{
    try {
        const credentials = new CredentialsModel(request.body)
        const token = await authLogic.login(credentials)
        response.json(token)
    } catch (error:any) {
        next(error)
    }
})
router.delete("/auth/logout/", async(request:Request, response:Response, next:NextFunction )=>{
    try {
        
    } catch (error:any) {
        next(error)
    }
})

export default router