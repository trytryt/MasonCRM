import React from 'react';
import "./Home.css";
import { Box, Typography, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';


function Home(): JSX.Element {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate('/list');
    };

    return (
        <Box className="Home" display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100vh" bgcolor="#f0f0f0">
         
           
        </Box>
    );
}

export default Home;
