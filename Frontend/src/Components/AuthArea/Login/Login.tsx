import { useNavigate } from "react-router-dom";
// import "./Login.css";
// import { useForm } from "react-hook-form";
// import CredentialsModel from "../../../Models/CredentialsModel";
// import AuthService from "../../../Services/AuthService";
// import { ToastContainer, toast } from "react-toastify";
// import 'react-toastify/dist/ReactToastify.css';
// import authService from "../../../Services/AuthService";

// function Login(): JSX.Element {
//     const { register, handleSubmit } = useForm<CredentialsModel>();
//     const navigate = useNavigate();

//     async function send(credentials: CredentialsModel) {
//         try {
//             await authService.login(credentials);

//             // Display success toast
//             toast.success("Welcome Back!");

//             setTimeout(() => navigate("/list"), 1000);
//         } catch (error: any) {
//             // Display error toast
//             toast.error(error.message);
//         }
//     }

//     return (
//         <div className="Login Box">
//             <form onSubmit={handleSubmit(send)}>
//                 <h2>Login</h2>
//                 <label>Username:</label>
//                 <input type="text" {...register("userName")} />
//                 <label>Password:</label>
//                 <input type="password" {...register("password")} />
//                 <button>Login</button>
//             </form>
//             <ToastContainer 
//                 position="top-left" 
//                 autoClose={3000} 
//                 hideProgressBar={false} 
//                 newestOnTop={false} 
//                 closeOnClick 
//                 rtl={false} 
//                 pauseOnFocusLoss 
//                 draggable 
//                 pauseOnHover 
//             />
//         </div>
//     );
// }

// export default Login;
import { Button, TextField, Box, Typography, Container } from '@mui/material';
import { useForm } from 'react-hook-form';
import CredentialsModel from '../../../Models/CredentialsModel';
import AuthService from '../../../Services/AuthService';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {NavLink} from 'react-router-dom';

function Login(): JSX.Element {
    const { register, handleSubmit } = useForm<CredentialsModel>();
    const navigate = useNavigate();

    async function send(credentials: CredentialsModel) {
        try {
            await AuthService.login(credentials);


            toast.success('טוב שחזרת!');

            setTimeout(() => navigate('/list'), 1000);
        } catch (error: any) {

            toast.error(error.message);
        }
    }

    return (
        <Container maxWidth="xs">
            <Box sx={{ mt: 4, p: 4, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 3 }}>
                {/*<Typography variant="h5" gutterBottom>*/}
                {/*    Login*/}
                {/*</Typography>*/}
                <form onSubmit={handleSubmit(send)}>
                    <TextField
                        fullWidth
                        label="שם משתמש"
                        {...register('userName')}
                        variant="outlined"
                        margin="normal"
                        required
                    />
                    <TextField
                        fullWidth
                        type="password"
                        label="סיסמה"
                        {...register('password')}
                        variant="outlined"
                        margin="normal"
                        required
                        InputProps={{
                            style: { textAlign: "right" }, // Aligns text to the right in the input
                        }}
                        inputProps={{
                            style: { direction: "rtl", textAlign: "right" }, // Aligns text and placeholder
                        }}
                    />
                    <div className="action-buttons">
                        <Button
                            className="register-btn"
                            type="button"
                            variant="contained"
                            color="primary"
                            sx={{ mt: 2 }}
                        >
                            <NavLink style={{ textDecoration: "none", color: "white" }} to="/register">
                                הרשמה
                            </NavLink>
                        </Button>
                        <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
                            כניסה
                        </Button>
                    </div>
                </form>
            </Box>

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
        </Container>
    );
}

export default Login;

