import "./CustomerPage.css";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import "./CustomerPage.css";
import CustomersModel from "../../../Models/CustomersModel";
import customersService from "../../../Services/CustomersService";
import { toast } from "react-toastify";
import { CustomerData } from "../../../Models/CustomerDataModel";
export function CustomerPage(): JSX.Element {

    const { customerId } = useParams<{ customerId: string }>();
    const [customerData, setCustomerData] = useState<CustomerData | null>(null);

    const [paymentAmount, setPaymentAmount] = useState<number>();
    const [expenseAmount, setExpenseAmount] = useState<number>();
    const [expenseCategory, setExpenseCategory] = useState<string>("");
    useEffect(() => {
        getCustomerData();
    }, [customerId]);

    const getCustomerData = async () => {
        try {
            console.log("Customer ID:", customerId);
            const customerData = await customersService.getCustomerById(+customerId!);
            console.log("Received customer data:", customerData);
            setCustomerData(customerData);
        } catch (err: any) {
            toast(err.message);
        }
    };

    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        return date.toLocaleDateString("he-IL", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
    };

    const addPayment = async () => {
        try {
            const paymentData = { amount: paymentAmount, paymentDate: new Date().toISOString().split('T')[0], isPaid: true };
            await customersService.addPaymentToCustomer(+customerId!, paymentData);
            toast.success("Payment added successfully!");
            getCustomerData();
        } catch (err: any) {
            toast.error("Failed to add payment: " + err.message);
        }
    };

    const addExpense = async () => {
        try {
            const expenseData = { expenseTypeId: 1, chomarimCategory: expenseCategory, amount: expenseAmount };
            await customersService.addExpenseToCustomer(+customerId!, expenseData);
            toast.success("Expense added successfully!");
            getCustomerData(); 
        } catch (err: any) {
            toast.error("Failed to add expense: " + err.message);
        }
    };

    const totalPayments = customerData?.payments.reduce((sum, p) => sum + p.amount, 0) || 0;
    const totalExpenses = customerData?.expenses.reduce((sum, e) => sum + e.amount, 0) || 0;
    const balance = totalPayments - totalExpenses; // חישוב היתרה

    return (
        <div className="CustomerPage">
            {customerData ? (
                <div className="customer-details" key={customerData.customer.customerId}>
                    <h2>{customerData.customer.name}</h2>
                    <p><strong>כתובת:</strong> {customerData.customer.adress}</p>
                    <p><strong>נייד:</strong> {customerData.customer.phoneNumber}</p>
                    <p><strong>סה"כ הכנסות:</strong> {totalPayments} ₪</p>
                    <p><strong>סה"כ הוצאות:</strong> {totalExpenses} ₪</p>
                    <p><strong>יתרה:</strong> {balance} ₪</p>

                    {/* Payments and Expenses Side by Side */}
                    <div className="payments-expenses">
                        {/* Payments Section */}
                        <div>
                            <h3>
                                הכנסות
                            </h3>
                            {/* Payment Form */}
                            <div>
                                <input
                                    type="number"
                                    placeholder="סכום הכנסה"
                                    value={paymentAmount}
                                    onChange={(e) => setPaymentAmount(+e.target.value)}
                                />
                                <button onClick={addPayment}>הוספה</button>
                            </div>
                            {customerData.payments.length > 0 ? (
                                <ul>
                                    {customerData.payments.map(payment => (
                                        <li key={payment.paymentId}>
                                            סכום: {payment.amount} ₪ |
                                            תאריך: {formatDate(payment.paymentDate)} | {payment.isPaid ? "שולם" : "לא שולם"}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>אין הכנסות ללקוח זה.</p>
                            )}
                        </div>

                        {/* Expenses Section */}
                        <div>
                            <h3>
                                הוצאות
                            </h3>

                            {/* Expense Form */}
                            <div>
                                <input
                                    type="number"
                                    placeholder="סכום הוצאה"
                                    value={expenseAmount}
                                    onChange={(e) => setExpenseAmount(+e.target.value)}
                                />
                                <input
                                    type="text"
                                    placeholder="קטגוריה"
                                    value={expenseCategory}
                                    onChange={(e) => setExpenseCategory(e.target.value)}
                                />
                                <button onClick={addExpense}>הוספה</button>
                            </div>

                            {customerData.expenses.length > 0 ? (
                                <ul>
                                    {customerData.expenses.map(expense => (
                                        <li key={expense.chomarimId}>
                                            {expense.chomarimCategory}: {expense.amount} ₪
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>אין הוצאות ללקוח זה.</p>
                            )}
                        </div>
                    </div>
                </div>
            ) : (
                <p>Loading customer details...</p>
            )}
        </div>

    );
}
