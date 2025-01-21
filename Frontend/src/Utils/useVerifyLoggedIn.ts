import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { authStore } from "../Redux/AuthState"
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

function useVerifyLoggedIn() {

    const navigate = useNavigate()

    useEffect(()=>{

        if(!authStore.getState().token) {
            toast("You are not logged in!")
            navigate("/login")
        }

    },[])

}

export default useVerifyLoggedIn