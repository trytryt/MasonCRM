import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import UserModel from "../../../Models/UserModel";
import { authStore } from "../../../Redux/AuthState";
import { Button, Typography } from "@mui/material";
import { FaSignOutAlt } from "react-icons/fa";
import appConfig from "../../../Utils/Config";

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
                    <span>שלום אורח  |</span>
                    <NavLink to={appConfig.routes.register}>הרשמה</NavLink>
                    <span>|</span>
                    <NavLink to={appConfig.routes.login}>התחברות</NavLink>
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
             שלום {user.userName}
          </Typography>
                     
                    <NavLink to={appConfig.routes.logout}>
                        <Button variant="outlined" size="small">
                            <FaSignOutAlt className="mr-2" /> יציאה
                        </Button>
                    </NavLink>
                </>
            )}
        </div>
    );
}
export default AuthMenu;