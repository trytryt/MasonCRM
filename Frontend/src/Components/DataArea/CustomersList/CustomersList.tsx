import { useEffect, useState } from "react";
import "./CustomersList.css";
import CustomersModel from "../../../Models/CustomersModel";
import { authStore } from "../../../Redux/AuthState";
import customersService from "../../../Services/CustomersService";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";


export function CustomersList(): JSX.Element {
    const [customers, setCustomers] = useState<CustomersModel[]>([]);
    const [freeSearch, setFreeSearch] = useState("");
    const [totalRecords, setTotalRecords] = useState(20);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemPerPage] = useState(20);

    useEffect(() => {
        getData();
    }, [itemPerPage, currentPage, freeSearch]);

    const getData = async () => {
        try {console.log(freeSearch);
            const userId = authStore.getState().user?.userId;
            if (!userId) throw new Error("User ID is not available");
            const results = await customersService.getAllCustomers(userId, freeSearch, currentPage, itemPerPage);
            setCustomers(results.customers);
        } catch (err: any) {
            toast(err.message);
        }
    };


const navigate = useNavigate();

const goToAddCustomerPage = (customerId?: number | undefined) => {
    const userId = authStore.getState().user?.userId;
    if (userId) {
        if(customerId){
            navigate(`/customer/${userId}/edit/${customerId}`)
        } else {
            navigate(`/add-customer/${userId}`);
        }
    } else {
        toast.error("אין לך הרשאות לפעולה זו");
    }
};

    const toggleStatus = async (customer: CustomersModel) => {
        const userId = authStore.getState().user?.userId;
        if (userId) {

            try{
                let updatedStatus = customer.customerStatus == 1 ? 2 : 1;
                customer.customerStatus = updatedStatus;
                await customersService.updateCustomer(customer);

                setCustomers((prevCustomers) => {
                    const customerIndex = prevCustomers.findIndex(
                        (c) => c.customerId === customer.customerId
                    );

                    if (customerIndex !== -1) {
                        const updatedCustomers = [...prevCustomers];
                        updatedCustomers[customerIndex] = {
                            ...updatedCustomers[customerIndex],
                            customerStatus: updatedStatus,
                        };
                        return updatedCustomers;
                    }

                    return prevCustomers;
                });

                toast.success(`סטטוס הלקוח עודכן בהצלחה`);
            } catch (error) {
                console.error("Failed to update customer status:", error);
                toast.error("עדכון הסטטוס נכשל, אנא נסה שנית");
            }

        } else {
            toast.error("אין לך הרשאות לפעולה זו");
        }
    }

    const trashCustomer = (customerId: number) => {
        const userId = authStore.getState().user?.userId;
        if (userId) {

        } else {
            toast.error("אין לך הרשאות לפעולה זו");
        }
    }

    return (

        <div className="CustomersList">
            <h2>הלקחות שלי</h2>
            <form className="search-form" onSubmit={(e) => {
                e.preventDefault();
                getData();
            }}>
                <input
                    type="text"
                    value={freeSearch}
                    onChange={(e) => setFreeSearch(e.target.value)}
                    placeholder="חפש"
                />
                <button type="submit">חפש</button>
            </form>
            <button onClick={() => goToAddCustomerPage()}>לקוח חדש +</button>

            <div className="customers-container">
                {customers.length > 0 ? (
                    customers.map(customer => (
                        <div key={customer.customerId} className="customer-card">
                            <h3>{customer.name}</h3>
                            <p><strong>Address:</strong> {customer.adress}</p>
                            <p><strong>Phone:</strong> {customer.phoneNumber}</p>
                            {/* כפתור "MORE" */}

                            <div><span>{customer.customerStatus}</span>
                                {customer.customerStatus == 1 ? (
                                    <FaCheckCircle size={30} color="green"/>
                                ) : (
                                    <FaTimesCircle size={30} color="red"/>
                                )}
                                <button onClick={() => toggleStatus(customer)}>
                                    {customer.customerStatus == 1 ? "פעיל" : "לא פעיל"}
                                </button>
                            </div>
                            <button onClick={() => goToAddCustomerPage(customer.customerId)}>מחיקה</button>
                            <button onClick={() => goToAddCustomerPage(customer.customerId)}>עריכה</button>
                            <Link to={`/customer/${customer.customerId}`} className="more-button">
                                <button>קרא עוד</button>
                            </Link>
                        </div>
                    ))
                ) : (
                    <p>No customers found.</p>
                )}

                {/*<div className="pagination">*/}
                {/*    <button*/}
                {/*        onClick={() => handlePageChange(currentPage - 1)}*/}
                {/*        disabled={currentPage === 1}*/}
                {/*    >*/}
                {/*        Previous*/}
                {/*    </button>*/}

                {/*    {[...Array(totalPages)].map((_, index) => (*/}
                {/*        <button*/}
                {/*            key={index}*/}
                {/*            onClick={() => handlePageChange(index + 1)}*/}
                {/*            className={index + 1 === currentPage ? 'active' : ''}*/}
                {/*        >*/}
                {/*            {index + 1}*/}
                {/*        </button>*/}
                {/*    ))}*/}

                {/*    <button*/}
                {/*        onClick={() => handlePageChange(currentPage + 1)}*/}
                {/*        disabled={currentPage === totalPages}*/}
                {/*    >*/}
                {/*        Next*/}
                {/*    </button>*/}
                {/*</div>*/}

            </div>
        </div>
    );
}
