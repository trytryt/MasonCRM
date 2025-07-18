import express from "express";
import cors from "cors";
import routeNotFound from "./3-middleWare/route-not-found";
import appConfig from "./2-utils/app-config";
import catchAll from "./3-middleWare/catch-all";
import authController from "./6-controllers/auth-controller";
import customersController from "./6-controllers/customers-controller";
import suppliersController from "./6-controllers/suppliers-controller";
import stickyNotesController from "./6-controllers/sticky_notes_controller";
import path from "path";

console.log("BeezratHashem!!!");

const server = express()

server.use(cors({
    origin: '*', //'http://localhost:3000',  // Allow frontend requests from localhost:3000
    methods: ['GET', 'POST', 'PUT', 'DELETE','PATCH'],
    credentials: true,  // Allow sending cookies with the request
}))
server.use(express.json())

server.use('/uploads', express.static(path.join(__dirname, '../uploads')))

server.use("/api",customersController)
server.use("/api", authController)
server.use("/api",suppliersController) 
server.use("/api", stickyNotesController);


server.use("*",routeNotFound)
server.use(catchAll)

server.listen(appConfig.port,()=>console.log(`Listening on http://localhost:${appConfig.port}`))







































// import express, { NextFunction, Request, Response } from "express"

// // Creating our server object:
// const server = express()

// // Tell express to take the JSON resides in request's body into request.body object.
// server.use(express.json())


// // Listen on GET, http://localhost:3001/api/kittens
// server.get("/api/kittens",(request:Request, response:Response,next:NextFunction)=>{
//     response.json(kittens)
// })

// // Listen on GET, http://localhost:3001/api/kittens/3
// server.get("/api/kittens/:id",(request:Request, response:Response,next:NextFunction)=>{
//     const id = +request.params.id
//     const kitten = kittens.find(k => k.id === id)
//     response.json(kitten)
// })

// // Listen on POST, http://localhost:3001/api/kittens
// server.post("/api/kittens",(request:Request, response:Response,next:NextFunction)=>{
//     const kitten = request.body // ישב החתול החדש ששלחנו
//     kitten.id = kittens[kittens.length -1].id + 1
//     kittens.push(kitten)
//     response.json(kitten)
// })
// server.put ("/api/kittens/:id"),(request:Request, response:Response,next:NextFunction)=>{
//     const id= +request.params.id
//     request.body.id = id
//     const kitten = request.body
//     const index = kittens.findIndex(k => k.id === id)
//     kittens[index] = kitten
//     response.json(kitten)
// }

// server.delete ("/api/kittens/:id",(request:Request, response:Response,next:NextFunction)=>{
//     const id= +request.params.id 
//     const index = kittens.findIndex(k => k.id === id)
//     kittens.splice(index, 1)
//     response.sendStatus(204)
    
// })




// // Running the server:
// server.listen(3002,()=> console.log("Listening on http://localhost:3001"))

// const kittens = [
//     {id:1,name:"Mitsi",age:4},
//     {id:2,name:"Pitsi",age:5},
//     {id:3,name:"Kitsi",age:6}
// ]