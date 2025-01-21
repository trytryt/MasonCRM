
import { Button, TextField, Box, Typography, Container } from '@mui/material';
import { useForm } from 'react-hook-form';
import authService from '../../../Services/AuthService';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

function Register(): JSX.Element {
    const { register, handleSubmit } = useForm();
    const navigate = useNavigate();

    async function send(user: any) {
        try {
            await authService.register(user);
            toast.success('Welcome!');
            setTimeout(() => navigate('/home'), 2000);
        } catch (error: any) {
            toast.error(error.message);
        }
    }

    return (
        <Container maxWidth="xs">
            <Box sx={{ mt: 4, p: 3, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 1 }}>
                <Typography variant="h5" gutterBottom>
                    Register
                </Typography>
                <form onSubmit={handleSubmit(send)}>
                    <TextField
                        fullWidth
                        label="Username"
                        {...register('userName')}
                        variant="outlined"
                        margin="normal"
                        size="small"
                        required
                    />
                   
                    <TextField
                        fullWidth
                        type="password"
                        label="Password"
                        {...register('password', { minLength: 4 })}
                        variant="outlined"
                        margin="normal"
                        size="small"
                        required
                    />
                    <Button type="submit" variant="contained" color="primary" sx={{ mt: 2, mb: 1 }}>
                        Register
                    </Button>
                </form>
                <Button  variant="outlined" color="primary" sx={{ mt: 2, mb: 1 }}>
                        already a member?
                    </Button>
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
export default Register;
