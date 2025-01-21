import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import customersService from "../../../Services/CustomersService"; 
import { toast } from "react-toastify";
import "./AddCustomer.css";

export function AddCustomer(): JSX.Element {
    const { userId } = useParams<{ userId: string }>(); 
    const [name, setName] = useState("");
    const [adress, setAdress] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const navigate = useNavigate(); 

   const addCustomer = async () => {
    if (!userId) {
        toast.error("User ID is not available");
        return;
    }

    const customerData = {
        name,
        adress,
        phoneNumber
    };

    try {
        await customersService.addCustomer(customerData, parseInt(userId));
        toast.success("Customer added successfully!");
        navigate("/list");
    } catch (error: any) {
        toast.error("Error adding customer: " + error.message);
    }
};

return (
    <div className="AddCustomer">
        <h2>Add New Customer</h2>
        <form onSubmit={(e) => e.preventDefault()}>
            <div className="form-group">
                <label>Name:</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
            </div>
            <div className="form-group">
                <label>Address:</label>
                <input
                    type="text"
                    value={adress}
                    onChange={(e) => setAdress(e.target.value)}
                    required
                />
            </div>
            <div className="form-group">
                <label>Phone Number:</label>
                <input
                    type="text"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                />
            </div>
            <div className="form-group">
                <button type="button" onClick={addCustomer}>Save</button>
            </div>
        </form>
    </div>
);
}