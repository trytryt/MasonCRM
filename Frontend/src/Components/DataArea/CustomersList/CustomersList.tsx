import React, {ReactElement, useEffect, useState} from "react";
import "./CustomersList.css";
import CustomersModel from "../../../Models/CustomersModel";
import { authStore } from "../../../Redux/AuthState";
import customersService from "../../../Services/CustomersService";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import {FaCheckCircle, FaEdit, FaTimesCircle, FaTrash} from "react-icons/fa";


export function CustomersList(): JSX.Element {
    const [customers, setCustomers] = useState<CustomersModel[]>([]);
    const [freeSearch, setFreeSearch] = useState("");
    const [totalRecords, setTotalRecords] = useState(20);
    const [currentPage, setCurrentPage] = useState(0);
    const [itemPerPage] = useState(9);
    const [customerForDelete, setCustomerForDelete] = useState<CustomersModel>();
    const [confirm, setConfirm] = useState(false);


    useEffect(() => {
        getData();
    },[currentPage]);

    const getData = async () => {
        try {
            const userId = authStore.getState().user?.userId;
            if (!userId) throw new Error("User ID is not available");
            const results = await customersService.getAllCustomers(userId, freeSearch, currentPage, itemPerPage);
            setCustomers([...customers, ...results.customers]);
            setTotalRecords(results.count);
        } catch (err: any) {
            toast(err.message);
        }
    };

    const loadMore = async () => {
        setCurrentPage((prevPage) => prevPage + itemPerPage);
    }

    const search = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            // Reset current page and clear customers
            setCurrentPage(0);
            setCustomers([]);

            // Fetch new search results
            const userId = authStore.getState().user?.userId;
            if (!userId) throw new Error("User ID is not available");

            const results = await customersService.getAllCustomers(userId, freeSearch, 0, itemPerPage);

            // Update customers with only the search results
            setCustomers(results.customers);
            setTotalRecords(results.count);
        } catch (err: any) {
            toast(err.message);
        }
    }


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

    const trashCustomer = async (e: React.FormEvent<HTMLFormElement>, customer: CustomersModel) => {
        e.preventDefault();
        const userId = authStore.getState().user?.userId;
        if (userId) {
            customer.customerStatus = 0;
            await customersService.updateCustomer(customer);
            setCustomers(c => c.filter(item => item.customerId != customer.customerId))
            toast.success("הלקוח נמחק בהצלחה");
        } else {
            toast.error("אין לך הרשאות לפעולה זו");
        }
    }

    const confirmationDelete = (customer: CustomersModel) => {
        setCustomerForDelete(customer);
        setConfirm(true);
    }

    return (

        <div className="CustomersList">

            {confirm &&  <div className="confirmation">
                <form onSubmit={(e) => trashCustomer(e, customerForDelete)}>
                    <p>האם אתה בטוח שברצונך למחוק את  {customerForDelete?.name}?</p>
                    <div className="wrap-icons">
                        <button className="cancel-btn" onClick={() => setConfirm(false)}>ביטול</button>
                        <button type="submit" className="conf-btn">מחיקה</button>
                    </div>
                </form>
            </div>}
            {/*<h2>הלקחות שלי</h2>*/}
            <div className={"head-list"}>
                <form className="search-form" onSubmit={search}>
                    <input
                        type="text"
                        value={freeSearch}
                        onChange={(e) => setFreeSearch(e.target.value)}
                        placeholder="הכנס שם / כתובת / נייד"
                    />
                    <button type="submit">חפש</button>
                </form>
                <button onClick={() => goToAddCustomerPage()}>לקוח חדש +</button>
            </div>

            <span className={"found-txt"}>נמצאו <span>{totalRecords}</span> לקוחות</span>

            <div className="customers-container">
                {customers.length > 0 ? (
                    customers.map(customer => (
                        <div key={customer.customerId} className="customer-card">
                            <div>
                                <button
                                    className={`button-status ${customer.customerStatus === 1 ? "btn-active" : "btn-inactive"}`}
                                    onClick={() => toggleStatus(customer)}>
                                    {customer.customerStatus === 1 ? (
                                        <>
                                            <FaCheckCircle className="mr-2"/> פעיל
                                        </>
                                    ) : (
                                        <>
                                            <FaTimesCircle className={"mr-2"}/> לא פעיל
                                        </>
                                    )}
                                </button>
                            </div>
                            <h3>{customer.name}</h3>
                            <p><strong>כתובת:</strong> {customer.adress}</p>
                            <p><strong>נייד:</strong> {customer.phoneNumber}</p>
                            {/* כפתור "MORE" */}

                            <div className={"action-buttons"}>
                                <div className={"wrap-icons"}>
                                    <button className={"button-icon"}
                                            onClick={() => confirmationDelete(customer)}>
                                        <FaTrash className="mr-2"></FaTrash>
                                    </button>
                                    <button className={"button-icon"}
                                            onClick={() => goToAddCustomerPage(customer.customerId)}>
                                        <FaEdit className="mr-2"/>
                                    </button>
                                </div>
                                <Link to={`/customer/${customer.customerId}`} className="more-button">
                                    <button>קרא עוד</button>
                                </Link>
                            </div>

                        </div>
                    ))
                ) : (
                    <p></p>
                )}

                { totalRecords > customers.length && (
                    <div className="wrap-load-btn">
                        <button className={"load-more"} onClick={loadMore}>הצג לקוחות נוספים</button>
                    </div>
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
