import { Navigate, Route, Routes } from "react-router-dom";
import "./Routing.css";
import Home from "../../HomeArea/Home/Home";
import PageNotFound from "../PageNotFound/PageNotFound";
import  Login  from "../../AuthArea/Login/Login";
import Logout from "../../AuthArea/Logout/Logout";
import Register from "../../AuthArea/Register/Register";
import { CustomersList } from "../../DataArea/CustomersList/CustomersList";
import { CustomerPage } from "../../DataArea/CustomerPage/CustomerPage";
import { AddCustomer } from "../../DataArea/AddCustomer/AddCustomer";
import { BasicLineChart } from "../../DataArea/BasicLineChart/BasicLineChart";
import React from "react";
import SuppliersManagementDashboard from "../../DataArea/SuppliersManagement/SuppliersManagementDashboard/SuppliersManagementDashboard";
import StickyNotesBoard from "../../DataArea/SticktNotes/sticky_notes_board_component";

function Routing(): JSX.Element {
    return (
        <div className="Routing">  
            <Routes>
                {/* Authentication Routes */}
                <Route path="/auth/login" element={<Login />} />
                <Route path="/auth/register" element={<Register />} />
                <Route path="/auth/logout" element={<Logout />} />
                
                {/* Main Dashboard/Home */}
                <Route path="/dashboard" element={<Home />} />
                
                {/* Customer Management Routes */}
                <Route path="/customers" element={<CustomersList/>} />
                <Route path="/customers/new" element={<AddCustomer />} />
                <Route path="/customers/:customerId" element={<CustomerPage />} />
                <Route path="/customers/:customerId/edit" element={<AddCustomer />} />
                
                {/* Reports & Analytics */}
                <Route path="/reports/balance" element={<BasicLineChart/>} />
                
                {/* Supplier Management */}
                <Route path="/suppliers" element={<SuppliersManagementDashboard />} />
                
                {/* Notes & Reminders */}
                <Route path="/notes" element={<StickyNotesBoard />} />
                
                {/* Legacy redirects for backward compatibility */}
                <Route path="/home" element={<Navigate to="/dashboard" replace />} />
                <Route path="/list" element={<Navigate to="/customers" replace />} />
                <Route path="/Balance" element={<Navigate to="/reports/balance" replace />} />
                <Route path="/list/suppliers-management" element={<Navigate to="/suppliers" replace />} />
                <Route path="/list/sticky-notes" element={<Navigate to="/notes" replace />} />
                <Route path="/add-customer/:userId" element={<Navigate to="/customers/new" replace />} />
                <Route path="/customer/:userId/edit/:customerId" element={<Navigate to="/customers/:customerId/edit" replace />} />
                <Route path="/customer/:customerId" element={<Navigate to="/customers/:customerId" replace />} />
                
                {/* Default redirects */}
                <Route path="/" element={<Navigate to="/auth/login" replace />} />
                <Route path="/login" element={<Navigate to="/auth/login" replace />} />
                <Route path="/register" element={<Navigate to="/auth/register" replace />} />
                
                {/* 404 - Must be last */}
                <Route path="*" element={<PageNotFound />} />
            </Routes>
        </div>
    );
}

export default Routing;