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
                    <span>Hello Guest |</span>

                    <span> | </span>
                    <NavLink to="/register">Register</NavLink>
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
            Hello {user.userName} 
          </Typography>
                    <NavLink to="/login"><Button variant="outlined" size="small">
                    Login
                    </Button></NavLink>

                    <NavLink to="/logout"><Button variant="outlined" size="small">
                        Logout
                    </Button></NavLink>
                </>
            )}
        </div>
    );
}

export default AuthMenu;