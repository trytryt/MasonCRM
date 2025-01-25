import { Navigate, Route, Routes } from "react-router-dom";
import "./Routing.css";
import Home from "../../HomeArea/Home/Home";
// import List from "../../DataArea/List/List";
import PageNotFound from "../PageNotFound/PageNotFound";
import Login from "../../AuthArea/Login/Login";
import Logout from "../../AuthArea/Logout/Logout";
import Register from "../../AuthArea/Register/Register";
import { CustomersList } from "../../DataArea/CustomersList/CustomersList";
import { CustomerPage } from "../../DataArea/CustomerPage/CustomerPage";
import { AddCustomer } from "../../DataArea/AddCustomer/AddCustomer";

function Routing(): JSX.Element {
    return (
        <div className="Routing">  
            <Routes>
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/logout" element={<Logout />} />
                <Route path="/home" element={<Home />} />
                <Route path="/list" element={<CustomersList/>} />  
                <Route path="/add-customer/:userId" element={<AddCustomer />} />
                <Route path="/customer/:userId/edit/:customerId" element={<AddCustomer />} />
                <Route path="/customer/:customerId" element={<CustomerPage />} />
                <Route path="/" element={<Navigate to="/home" />} />
                 <Route path="*" element={<PageNotFound />} />
            </Routes>
        </div>
    );
}

export default Routing;
