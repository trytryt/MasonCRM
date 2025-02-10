import axios from "axios";
import UserModel from "../Models/UserModel";
import appConfig from "../Utils/Config";
import CredentialsModel from "../Models/CredentialsModel";
import { authStore, AuthActionType } from "../Redux/AuthState";


class AuthService {

    public async register(user: UserModel): Promise<void> {
        const response = await axios.post<UserModel>(appConfig.registerUrl, user, {
            headers: {
                "Content-Type": "application/json", // Ensure proper content type
            },
        })
        console.log("Response from service:", JSON.stringify(user, null, 2));  
        const token = response.data
        authStore.dispatch({ type: AuthActionType.Register, payload: token })
    }

    public async login(credentials: CredentialsModel): Promise<void> {
        const response = await axios.post<CredentialsModel>(appConfig.loginUrl, credentials)
        const token = response.data
        console.log(token + "service token");
        authStore.dispatch({ type: AuthActionType.Login, payload: token })

    }

    public logout(): void {
        // const response = await axios.delete(appConfig.logoutUrl)
        authStore.dispatch({ type: AuthActionType.Logout })

    }

    public async refreshToken():Promise<void> {
        const response = await axios.post<string>(appConfig.refreshToken)
        console.log(response)
    }
}
const authService = new AuthService()
export default authService