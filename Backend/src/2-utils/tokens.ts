// import { createSecretKey } from "crypto";  check
import jwt from "jsonwebtoken"
import {UserModel} from "../4-models/UserModel";
import { Request } from "express"
import crypto from "crypto";

const secretKey = "secreteForToken"

function getNewToken(user: UserModel): string {

    const container = { user }
    const options = { expiresIn: "1h" }
    const token = jwt.sign(container, secretKey, options)
    return token

}
function verifyToken(request: Request): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
        try {

            const header = request.header("authorization")

            if (!header) {
                resolve(false)
                return
            }

            const token = header.substring(7)

            if (!token) {
               resolve(false)
                return
            }

            jwt.verify(token, secretKey, err => {

                if (err) {
                    resolve(false)
                    return
                }

                resolve(true)

            })


        } catch (error: any) {
           reject(error)
        }
    })
}
// async function verifyIsAdmin(request: Request): Promise<boolean> {

//     const isLoggedIn = await verifyToken(request)

//     if (!isLoggedIn) return false

//     const header = request.header("authorization")
//     const token = header.substring(7)

//     const container: any = jwt.decode(token)

//     const user: UserModel = container.user

//     return user.role === 'Admin';
// }

const salt = "saltIsGood"

function hash(plainText:string):string {

    if(!plainText) return null

    const hashedText = crypto.createHmac("sha512",salt).update(plainText).digest("hex")

    return hashedText

}

export default {
    getNewToken,
    verifyToken,
    // verifyIsAdmin,
     hash
}