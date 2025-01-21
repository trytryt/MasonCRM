import { useEffect, useState } from "react";
import "./CustomersList.css";
import CustomersModel from "../../../Models/CustomersModel";
import { authStore } from "../../../Redux/AuthState";
import customersService from "../../../Services/CustomersService";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export function CustomersList(): JSX.Element {
    const [customers, setCustomers] = useState<CustomersModel[]>([]);

    useEffect(() => {
        getData();
    }, []);

    const getData = async () => {
        try {
            const userId = authStore.getState().user?.userId;
            if (!userId) throw new Error("User ID is not available");
            const customers = await customersService.getAllCustomers(userId);
            setCustomers(customers);
        } catch (err: any) {
            toast(err.message);
        }
    };


const navigate = useNavigate();

const goToAddCustomerPage = () => {
    const userId = authStore.getState().user?.userId;
    if (userId) {
        navigate(`/add-customer/${userId}`); 
    } else {
        toast.error("User ID is not available");
    }
};

    return (
        
        <div className="CustomersList">
            <h2>Customers List</h2>
            <button onClick={goToAddCustomerPage}>לקוח חדש +</button>

            <div className="customers-container">
                {customers.length > 0 ? (
                    customers.map(customer => (
                        <div key={customer.customerId} className="customer-card">
                            <h3>{customer.name}</h3>
                            <p><strong>Address:</strong> {customer.adress}</p>
                            <p><strong>Phone:</strong> {customer.phoneNumber}</p>
                            {/* כפתור "MORE" */}
                            <Link to={`/customer/${customer.customerId}`} className="more-button">
                                <button>More</button>
                            </Link>
                        </div>
                    ))
                ) : (
                    <p>No customers found.</p>
                )}
            </div>
        </div>
    );
}
