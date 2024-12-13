import { NextFunction, Request, Response } from "express";
import { UnauthorizedErrorModel } from "../4-models/ErrorModel";
import tokens from "../2-utils/tokens";

async function verifyLoggedIn(request:Request,response:Response,next:NextFunction) {
    try { 
        const isValid = await tokens.verifyToken(request)
        if(!isValid) throw new UnauthorizedErrorModel("Invalid Token")
        next()

    } catch (error:any) {
        next(error)
    }
}

export default verifyLoggedIn