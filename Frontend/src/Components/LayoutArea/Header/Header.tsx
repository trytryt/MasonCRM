import AuthMenu from "../../AuthArea/AuthMenu/AuthMenu";
import Routing from "../Routing/Routing";
import "./Header.css";

function Header(): JSX.Element {
    return (
        <div className="Header">
            <div className="container">
                <AuthMenu/>
            </div>
        </div>
    );
}

export default Header;
