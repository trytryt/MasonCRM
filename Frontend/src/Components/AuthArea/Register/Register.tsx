import { Button, TextField, Box, Typography, Container } from '@mui/material';
import { useForm } from 'react-hook-form';
import authService from '../../../Services/AuthService';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, NavLink } from 'react-router-dom';
import appConfig from '../../../Utils/Config';

function Register(): JSX.Element {
    const { register, handleSubmit } = useForm();
    const navigate = useNavigate();

    async function send(user: any) {
        try {
            await authService.register(user);
            toast.success('Welcome!');
            setTimeout(() => navigate(appConfig.routes.dashboard), 2000);
        } catch (error: any) {
            toast.error(error.message);
        }
    }

    return (
        <Container maxWidth="xs">
            <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography component="h1" variant="h5">
                    Register
                </Typography>
                <Box component="form" onSubmit={handleSubmit(send)} sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="userName"
                        autoComplete="userName"
                        autoFocus
                        {...register('userName')}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Password"
                        type="password"
                        autoComplete="current-password"
                        {...register('password')}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Register
                    </Button>
                    <NavLink to="/login">Already have an account? Sign in</NavLink>
                </Box>
            </Box>
            <ToastContainer />
        </Container>
    );
}
export default Register;