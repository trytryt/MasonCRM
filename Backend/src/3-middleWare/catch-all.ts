import { NextFunction, Request, Response } from "express";
import logger from "../2-utils/logger";


function catchAll(err:any,request:Request,response:Response,next:NextFunction) {

    // Log error on the console
    console.log(err)

    // Log into file
    logger(err.message)

    // Send error back to the front
    response.status(err.status || 500).send(err.message)
}

export default catchAll