import "./CustomerPage.css";
import { useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import customersService from "../../../Services/CustomersService";
import { toast } from "react-toastify";
import { CustomerData } from "../../../Models/CustomerDataModel";
import { FileUpload } from "../FileUpload/FileUpload";

export function CustomerPage(): JSX.Element {
    const { customerId } = useParams<{ customerId: string }>();
    const [customerData, setCustomerData] = useState<CustomerData | null>(null);

    const [paymentAmount, setPaymentAmount] = useState<number | undefined>();
    const [expenseAmount, setExpenseAmount] = useState<number | undefined>();
    const [expenseCategory, setExpenseCategory] = useState<string>("");

    useEffect(() => {
        getCustomerData();
    }, [customerId]);

    const getCustomerData = async () => {
        try {
            console.log("Customer ID:", customerId);
            const data = await customersService.getCustomerById(+customerId!);
            console.log("Received customer data:", data);
            setCustomerData(data);
        } catch (err: any) {
            toast.error("Failed to load customer data: " + err.message);
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

    const addPayment = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const paymentData = {
                amount: paymentAmount,
                paymentDate: new Date().toISOString().split("T")[0],
                isPaid: true,
            };
            await customersService.addPaymentToCustomer(+customerId!, paymentData);
            toast.success("הכנסה נוספה בהצלחה");
            setPaymentAmount(undefined);
            getCustomerData();
        } catch (err: any) {
            toast.error("Failed to add payment: " + err.message);
        }
    };

    const addExpense = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const expenseData = {
                expenseTypeId: 1,
                chomarimCategory: expenseCategory,
                amount: expenseAmount,
            };
            await customersService.addExpenseToCustomer(+customerId!, expenseData);
            toast.success("הוצאה נוספה בהצלחה");
            setExpenseAmount(undefined);
            setExpenseCategory("");
            getCustomerData();
        } catch (err: any) {
            toast.error("Failed to add expense: " + err.message);
        }
    };

    const totalPayments = customerData?.payments?.reduce((sum, p) => sum + p.amount, 0) || 0;
    const totalExpenses = customerData?.expenses?.reduce((sum, e) => sum + e.amount, 0) || 0;
    const balance = totalPayments - totalExpenses;

    return (
        <div className="CustomerPage">
            {customerData ? (
                <div className="customer-details" key={customerData.customer.customerId}>
                    <h2>{customerData.customer.name}</h2>
                    <p><strong>כתובת:</strong> {customerData.customer.adress}</p>
                    <p><strong>נייד:</strong> {customerData.customer.phoneNumber}</p>
                    <p><strong>יתרה:</strong> {balance} ₪</p>
                    <p><strong>סה"כ הכנסות:</strong> {totalPayments} ₪</p>
                    <p><strong>סה"כ הוצאות:</strong> {totalExpenses} ₪</p>

                    {/* Payments and Expenses Sections */}
                    <div className="payments-expenses">
                        <div>
                            <h3>הכנסות</h3>
                            <form onSubmit={addPayment}>
                                <input
                                    type="number"
                                    required
                                    placeholder="סכום הכנסה"
                                    value={paymentAmount ?? ""}
                                    onChange={(e) => setPaymentAmount(+e.target.value)}
                                />
                                <button type="submit">הוספה</button>
                            </form>
                            <table>
                                <thead>
                                <tr>
                                    <th>סכום</th>
                                    <th>תאריך</th>
                                    <th>סטטוס</th>
                                </tr>
                                </thead>
                                <tbody>
                                {customerData.payments?.length ? (
                                    customerData.payments.map((payment) => (
                                        <tr key={payment.paymentId}>
                                            <td>{payment.amount} ₪</td>
                                            <td>{formatDate(payment.paymentDate)}</td>
                                            <td>{payment.isPaid ? "שולם" : "לא שולם"}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={3}>אין הכנסות.</td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                        </div>

                        <div>
                            <h3>הוצאות</h3>
                            <form onSubmit={addExpense}>
                                <input
                                    type="number"
                                    required
                                    placeholder="סכום הוצאה"
                                    value={expenseAmount ?? ""}
                                    onChange={(e) => setExpenseAmount(+e.target.value)}
                                />
                                <input
                                    type="text"
                                    required
                                    placeholder="קטגוריה"
                                    value={expenseCategory}
                                    onChange={(e) => setExpenseCategory(e.target.value)}
                                />
                                <button type="submit">הוספה</button>
                            </form>
                            <table>
                                <thead>
                                <tr>
                                    <th>סוג</th>
                                    <th>קטגוריה</th>
                                    <th>סכום</th>
                                </tr>
                                </thead>
                                <tbody>
                                {customerData.expenses?.length ? (
                                    customerData.expenses.map((expense) => (
                                        <tr key={expense.chomarimId}>
                                            <td>{expense.expenseTypeId}</td>
                                            <td>{expense.chomarimCategory}</td>
                                            <td>{expense.amount} ₪</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={3}>אין הוצאות.</td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Documents Section */}
                    <div>
                        <h3>מסמכים</h3>
                        <FileUpload customerId={+customerId!}/>
                        {/* Handle documents here */}
                    </div>
                </div>
            ) : (
                <p>טוען לקוחות, נא המתן...</p>
            )}
        </div>
    );
}
