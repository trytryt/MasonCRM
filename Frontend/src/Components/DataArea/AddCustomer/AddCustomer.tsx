import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import customersService from "../../../Services/CustomersService";
import { toast } from "react-toastify";
import "./AddCustomer.css";

export function AddCustomer(): JSX.Element {
    const { userId, customerId } = useParams<{ userId: string; customerId?: string }>();
    const isEditMode = !!customerId;
    const [name, setName] = useState("");
    const [adress, setAdress] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [customerStatus, setCustomerStatus] = useState(1); // default status to 1 (active)
    const navigate = useNavigate();

    useEffect(() => {
        if (customerId) {
            getCustomerData();
        }
    }, [customerId]);

    // Track customerStatus changes
    useEffect(() => {
        console.log('customerStatus updated:', customerStatus); // This will log when customerStatus changes
    }, [customerStatus]);

    const getCustomerData = async () => {
        try {
            const customerData = await customersService.getCustomerById(+customerId!);
            setName(customerData.customer.name);
            setAdress(customerData.customer.adress);
            setPhoneNumber(customerData.customer.phoneNumber);
            setCustomerStatus(customerData.customer.customerStatus || 1); // If status is missing, default to 1 (active)
            // Log the fetched customer status here
            console.log('Fetched customer status:', customerData.customer.customerStatus);
        } catch (err: any) {
            toast.error("שגיאה: " + err.message);
        }
    };

    const changeCustomerStatus = () => {
        setCustomerStatus((prevStatus) => {
            const newStatus = prevStatus === 1 ? 2 : 1; // Toggle status between 1 and 2
            console.log('Toggling status to:', newStatus);  // Debug the new status
            return newStatus;
        });
    };

    const addCustomer = async () => {
        if (!userId) {
            toast.error("אין לך הרשאות לפעולה זו");
            return;
        }

        const customerData = {
            customerId,
            name,
            adress,
            phoneNumber,
            customerStatus,
        };

        try {
            if (isEditMode) {
                await customersService.updateCustomer(customerData);
            } else {
                await customersService.addCustomer(customerData, parseInt(userId));
            }
            navigate("/list");
        } catch (error: any) {
            toast.error("שגיאה: " + error.message);
        }
    };

    return (
        <div className="AddCustomer">
            <h2>{isEditMode ? 'עריכת לקוח' : 'הוספת לקוח חדש'}</h2>
            <form onSubmit={(e) => e.preventDefault()}>
                <div className="form-group">
                    <label>שם:</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>כתובת:</label>
                    <input
                        type="text"
                        value={adress}
                        onChange={(e) => setAdress(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>נייד:</label>
                    <input
                        type="text"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="status">פעיל</label>
                    <input
                        id="status"
                        type="checkbox"
                        checked={customerStatus === 1}
                        onChange={changeCustomerStatus}
                    />
                </div>
                <input type="hidden" name="id" value={+customerId ?? undefined} />
                <div className="form-group">
                    <button type="button" onClick={addCustomer}>שמירה</button>
                </div>
            </form>
        </div>
    );
}
