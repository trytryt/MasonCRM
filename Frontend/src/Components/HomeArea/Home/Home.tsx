import React from 'react';
import "./Home.css";
import { Box, Typography, Button, Grid, Card, CardContent, CardActions } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { People, Business, Assessment, StickyNote2 } from '@mui/icons-material';
import appConfig from "../../../Utils/Config";

function Home(): JSX.Element {
    const navigate = useNavigate();

    const menuItems = [
        {
            title: 'ניהול לקוחות',
            description: 'צפייה, הוספה ועריכה של לקוחות במערכת',
            icon: <People sx={{ fontSize: 60, color: '#1976d2' }} />,
            route: appConfig.routes.customers,
            color: '#e3f2fd'
        },
        {
            title: 'ניהול ספקים',
            description: 'ניהול ספקים וחובות ספקים',
            icon: <Business sx={{ fontSize: 60, color: '#388e3c' }} />,
            route: appConfig.routes.suppliers,
            color: '#e8f5e8'
        },
        {
            title: 'דוחות ויתרות',
            description: 'צפייה בדוחות כספיים ויתרות',
            icon: <Assessment sx={{ fontSize: 60, color: '#f57c00' }} />,
            route: appConfig.routes.balanceReport,
            color: '#fff3e0'
        },
        {
            title: 'תזכורות',
            description: 'ניהול פתקיות ותזכורות',
            icon: <StickyNote2 sx={{ fontSize: 60, color: '#7b1fa2' }} />,
            route: appConfig.routes.notes,
            color: '#f3e5f5'
        }
    ];

    return (
        <Box className="Home" sx={{ padding: 4, minHeight: '100vh', bgcolor: '#f5f5f5' }}>
            <Box textAlign="center" mb={4}>
                <Typography variant="h3" component="h1" gutterBottom color="primary" fontWeight="bold">
                    ברוכים הבאים למערכת ניהול הלקוחות
                </Typography>
                <Typography variant="h6" color="text.secondary">
                    בחרו את האזור הרצוי לעבודה
                </Typography>
            </Box>

            <Grid container spacing={4} justifyContent="center">
                {menuItems.map((item, index) => (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                        <Card 
                            sx={{ 
                                height: '100%', 
                                display: 'flex', 
                                flexDirection: 'column',
                                transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                                cursor: 'pointer',
                                '&:hover': {
                                    transform: 'translateY(-8px)',
                                    boxShadow: '0 12px 20px rgba(0,0,0,0.15)'
                                }
                            }}
                            onClick={() => navigate(item.route)}
                        >
                            <CardContent sx={{ flexGrow: 1, textAlign: 'center', bgcolor: item.color }}>
                                <Box mb={2}>
                                    {item.icon}
                                </Box>
                                <Typography variant="h5" component="h2" gutterBottom fontWeight="bold">
                                    {item.title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {item.description}
                                </Typography>
                            </CardContent>
                            <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                                <Button 
                                    variant="contained" 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        navigate(item.route);
                                    }}
                                    sx={{ minWidth: 120 }}
                                >
                                    כניסה
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>

        </Box>
    );
}

export default Home;