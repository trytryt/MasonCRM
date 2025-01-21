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

    const [paymentAmount, setPaymentAmount] = useState<number>(0);
    const [expenseAmount, setExpenseAmount] = useState<number>(0);
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
            const paymentData = { amount: paymentAmount, paymentDate: new Date().toISOString(), isPaid: true };
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
                    <p><strong>Address:</strong> {customerData.customer.adress}</p>
                    <p><strong>Phone:</strong> {customerData.customer.phoneNumber}</p>

                    {/* הצגת הכנסות */}
                    <h3>הכנסות
                        <button onClick={() => addPayment()} className="add-button">הוסף הכנסה</button>
                    </h3>
                    {customerData.payments.length > 0 ? (
                        <ul>
                            {customerData.payments.map(payment => (
                                <li key={payment.paymentId}>
                                    סכום: {payment.amount} ₪ | תאריך: {formatDate(payment.paymentDate)} | {payment.isPaid ? "שולם" : "לא שולם"}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>לא הוספת הכנסות עדיין.</p>
                    )}

                    {/* טופס להוספת הכנסה */}
                    <div>
                        <h4>Add Payment</h4>
                        <input
                            type="number"
                            placeholder="Payment Amount"
                            value={paymentAmount}
                            onChange={(e) => setPaymentAmount(+e.target.value)}
                        />
                        <button onClick={addPayment}>Add Payment</button>
                    </div>

                    {/* הצגת הוצאות */}
                    <h3>הוצאות
                        <button onClick={() => addExpense()} className="add-button">הוסף הוצאה</button>
                    </h3>
                    {customerData.expenses.length > 0 ? (
                        <ul>
                            {customerData.expenses.map(expense => (
                                <li key={expense.chomarimId}>
                                    {expense.chomarimCategory}: {expense.amount} ₪
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>לא הוספת הוצאות עדיין.</p>
                    )}

                    {/* טופס להוספת הוצאה */}
                    <div>
                        <h4>Add Expense</h4>
                        <input
                            type="number"
                            placeholder="Expense Amount"
                            value={expenseAmount}
                            onChange={(e) => setExpenseAmount(+e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="Expense Category"
                            value={expenseCategory}
                            onChange={(e) => setExpenseCategory(e.target.value)}
                        />
                        <button onClick={addExpense}>Add Expense</button>
                    </div>

                    {/* הצגת יתרה */}
                    <h3>יתרה</h3>
                    <p><strong>סכום ההכנסות:</strong> {totalPayments} ₪</p>
                    <p><strong>סכום ההוצאות:</strong> {totalExpenses} ₪</p>
                    <p><strong>יתרה:</strong> {balance} ₪</p>
                </div>
            ) : (
                <p>Loading customer details...</p>
            )}
        </div>
    );
}
