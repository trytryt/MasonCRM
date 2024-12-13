// import { NextFunction, Request, Response } from "express";
// import { UnauthorizedErrorModel } from "../4-models/ErrorModel";
// import tokens from "../2-utils/tokens";


// async function verifyAdmin(request:Request,response:Response,next:NextFunction) {

//     try {
//         const isAdmin = await tokens.verifyIsAdmin(request)
//         if(!isAdmin) throw new UnauthorizedErrorModel("You are not admin!")
//         next()
//     } catch (error:any) {
//         next(error)
//     }

// }

// export default verifyAdmin