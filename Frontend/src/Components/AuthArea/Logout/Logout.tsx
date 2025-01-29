import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import AuthService from "../../../Services/AuthService";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

function Logout(): JSX.Element {
    const navigate = useNavigate();

    useEffect(() => {
        AuthService.logout();

        toast.info("ביי ביי!");

        setTimeout(() => navigate("/login"), 1000);
    }, [navigate]);

    return (
        <>
            <ToastContainer 
                position="top-left" 
                autoClose={3000} 
                hideProgressBar={false} 
                newestOnTop={false} 
                closeOnClick 
                rtl={false} 
                pauseOnFocusLoss 
                draggable 
                pauseOnHover 
            />
        </>
    );
}

export default Logout;
