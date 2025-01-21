import axios from "axios"
import { authStore } from "../Redux/AuthState"


class InterceptorsService {

    public createInterceptors():void {
        axios.interceptors.request.use(request => {

            if(authStore.getState().token) {
                request.headers.Authorization = "Bearer " + authStore.getState().token
            }

            return request

        })
    }

}

const interceptorService = new InterceptorsService()
export default interceptorService