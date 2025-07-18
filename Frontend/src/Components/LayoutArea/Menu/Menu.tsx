import { NavLink } from "react-router-dom";
import "./Menu.css";
import React from "react";
import appConfig from "../../../Utils/Config";

function Menu(): JSX.Element {
    return (
        <div className="Menu">
            <NavLink to={appConfig.routes.dashboard}>דף הבית</NavLink>
            <span>|</span>
            <NavLink to={appConfig.routes.customers}>לקוחות</NavLink>
            <span>|</span>
            <NavLink to={appConfig.routes.suppliers}>ספקים</NavLink>
            <span>|</span>
            <NavLink to={appConfig.routes.balanceReport}>דוחות</NavLink>
            <span>|</span>
            <NavLink to={appConfig.routes.notes}>תזכורות</NavLink>
        </div>
    );
}

export default Menu;