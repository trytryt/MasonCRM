import Footer from "../Footer/Footer";
import Header from "../Header/Header";
import Menu from "../Menu/Menu";
import Routing from "../Routing/Routing";
import "./Layout.css";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { authStore } from "../../../Redux/AuthState";

function Layout(): JSX.Element {
    const location = useLocation();
    const [user, setUser] = useState(authStore.getState().user);

    useEffect(() => {
        const unsubscribe = authStore.subscribe(() => {
            setUser(authStore.getState().user);
        });
        return unsubscribe;
    }, []);

    // רשימת דפים שלא צריכים תפריט ניווט
    const hideMenuRoutes = ['/auth/login', '/auth/register', '/auth/logout', '/dashboard'];
    const shouldShowMenu = user && !hideMenuRoutes.includes(location.pathname);

    return (
        <div className="Layout">
            <header>
                <Header/>
            </header>

            {shouldShowMenu && (
                <nav>
                    <Menu/>
                </nav>
            )}

            <main>
                <div className={"container"}>
                    <Routing/>
                </div>
            </main>

            <footer>
                <Footer/>
            </footer>
        </div>
    );
}
export default Layout;