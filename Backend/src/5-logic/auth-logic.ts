import dal from "../2-utils/dal";
import {OkPacket} from "mysql";
import tokens from "../2-utils/tokens";

import {UnauthorizedErrorModel, ValidationErrorModel} from "../4-models/ErrorModel";
import {UserModel} from "../4-models/UserModel";
import CredentialsModel from "../4-models/CredentialsModel";
import bcrypt from 'bcryptjs';

// const bcrypt = require('bcrypt');
const saltRounds = 10;

async function register (user:UserModel):Promise<string>{
console.log('register logic');
    // const error = user.validate();
    // if (error) throw new ValidationErrorModel(error);

    // if (await isUsernameTaken(user.userName)) {
    //     throw new ValidationErrorModel(`Username ${user.userName} already taken`);
    // }

    const sql = `INSERT INTO user ( userName,  password) VALUES (?, ?)
    `
    console.log("Executing SQL:", sql);
    console.log("With values:", [ user.userName, user.password]);

    try {
        const hashedPassword = await bcrypt.hash(user.password, saltRounds);
        const info: OkPacket = await dal.execute(sql, [user.userName, hashedPassword]);
        console.log("SQL execution info:", info);
        
        user.userId = info.insertId;
        console.log(user + "befor token");
        const token = tokens.getNewToken(user);
        console.log(user +"after token");

        return token;
    } catch (error) {
        console.error("Failed to execute SQL:", error);
        throw new Error("Failed to register user: " + error.message);
    }
}
async function login(credentials: CredentialsModel): Promise<string> {
    const error = credentials.validation();
    if (error) throw new ValidationErrorModel(error);

    const sql = `SELECT * FROM user WHERE userName = ?`;
    const users = await dal.execute(sql, [credentials.userName])
    console.log(users);

    if (users.length === 0) {
        throw new UnauthorizedErrorModel("Incorrect username or password");
    }
    const user = users[0];
    const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
    if (!isPasswordValid) {
        throw new UnauthorizedErrorModel('Invalid credentials');
    }

    return tokens.getNewToken(user)

}
async function isUsernameTaken(userName: string): Promise<boolean> {
    const sql = `SELECT COUNT(*) AS count FROM user WHERE userName = ?`;
    const rows = await dal.execute(sql, [userName]);
    const count = rows[0].count
    return count > 0;
}

export default {
    register,
    login,
    isUsernameTaken
}