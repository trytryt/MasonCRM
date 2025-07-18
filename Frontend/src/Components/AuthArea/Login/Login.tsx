import { Button, TextField, Box, Typography, Container } from '@mui/material';
import { useForm } from 'react-hook-form';
import CredentialsModel from '../../../Models/CredentialsModel';
import AuthService from '../../../Services/AuthService';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {NavLink, useNavigate} from 'react-router-dom';
import appConfig from '../../../Utils/Config';

function Login(): JSX.Element {
    const { register, handleSubmit } = useForm<CredentialsModel>();
    const navigate = useNavigate();

    async function send(credentials: CredentialsModel) {
        try {
            await AuthService.login(credentials);

            toast.success('טוב שחזרת!');

            setTimeout(() => navigate(appConfig.routes.dashboard), 1000);
        } catch (error: any) {

            toast.error(error.message);
        }
    }

    return (
        <Container maxWidth="xs">
            <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                minHeight="100vh"
            >
                <Typography component="h1" variant="h5">
                    התחברות
                </Typography>
                <Box component="form" onSubmit={handleSubmit(send)} sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="שם משתמש"
                        autoComplete="email"
                        autoFocus
                        {...register("userName")}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="סיסמא"
                        type="password"
                        autoComplete="current-password"
                        {...register("password")}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        התחבר
                    </Button>
                    <NavLink to="/register">אין לך חשבון? הירשם</NavLink>
                </Box>
                <ToastContainer />
            </Box>
        </Container>
    );
}export default Login;