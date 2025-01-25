import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import UserModel from "../../../Models/UserModel";
import { authStore } from "../../../Redux/AuthState";
import { Button, Typography } from "@mui/material";


function AuthMenu(): JSX.Element {
    const [user, setUser] = useState<UserModel>();

    useEffect(() => {
        setUser(authStore.getState().user);

        const unsubscribe = authStore.subscribe(() => {
            setUser(authStore.getState().user);
        });

        return () => unsubscribe();
    }, []);

    return (
        <div className="AuthMenu">
            {!user && (
                <>
                    <span>שלום אורח |</span>

                    <span> | </span>
                    <NavLink to="/register">הרשמה</NavLink>
                </>
            )}
            {user && (
                <>
                     <Typography
            variant="body1"
            sx={{
              
              fontWeight: 280,
              mr: 1,
            }}
          >
             {user.userName} שלום
          </Typography>
                     {!user && (
                    <NavLink to="/login"><Button variant="outlined" size="small">
                    התחברות
                    </Button></NavLink>
                     )}
                     {user && (
                    <NavLink to="/logout"><Button variant="outlined" size="small">
                        יציאה
                    </Button></NavLink>
                     )}
                </>
            )}
        </div>
    );
}

export default AuthMenu;