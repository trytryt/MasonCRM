


import mysql from "mysql"
import appConfig from "./app-config"


// Create a pool of connection to MySQL
const connection = mysql.createPool({
    host: appConfig.host,
    user: appConfig.user,
    password: appConfig.password,
    database: appConfig.database
})


// SELECT * FROM products
function execute(sql:string ,values?:any[]):Promise<any> {
    return new Promise<any>((resolve,reject)=>{
        connection.query(sql, values,(err,result)=>{ // always return array
            if(err) {
                reject(err)
                return
            }
            resolve(result)
        })
    })    
}

export default {
    execute
}

// import fsPromises from "fs/promises";
// import VocationsModel from "../4-models/VocationsModel";


//   const vocationsPath = "./src/1-assets/vocations.json"

//    async function getAllVocations ():Promise<VocationsModel[]>{
//    const content = await fsPromises.readFile(vocationsPath, "utf-8")
//    const vocations  = JSON.parse(content)
//    return vocations
// }
//     async function saveAllVocations(vocations: VocationsModel[]):Promise<void>{
//     const content = JSON.stringify(vocations,null,4)
//     await fsPromises.writeFile(vocationsPath, content)
//    }

//   export default {
//   getAllVocations,
//   saveAllVocations
// }


