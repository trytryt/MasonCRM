import fsPromises from "fs/promises"

async function logger(msg:string):Promise<void> {
    const now = new Date()
    let line = `${now.toLocaleTimeString} \t ${msg}`
    line += "---------------------------------------\n"
    await fsPromises.appendFile("./logger.txt",line) 
}

export default logger