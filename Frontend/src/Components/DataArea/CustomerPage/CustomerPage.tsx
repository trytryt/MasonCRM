import "./CustomerPage.css";
import { useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import customersService from "../../../Services/CustomersService";
import { toast } from "react-toastify";
import { CustomerData } from "../../../Models/CustomerDataModel";
import { FileUpload } from "../FileUpload/FileUpload";
import appConfig from "../../../Utils/Config";

export function CustomerPage(): JSX.Element {
    const { customerId } = useParams<{ customerId: string }>();
    const [customerData, setCustomerData] = useState<CustomerData | null>(null);
    const [paymentAmount, setPaymentAmount] = useState<number | undefined>();
    const [expenseAmount, setExpenseAmount] = useState<number | undefined>();
    const [expenseCategory, setExpenseCategory] = useState<string>("");
    const [deletingDocumentId, setDeletingDocumentId] = useState<number | null>(null);

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
            // תיקון: הוספת expenseTypeId ווידוא שכל השדות נשלחים
            const expenseData = {
                expenseTypeId: 1, // ערך ברירת מחדל - ניתן להוסיף dropdown לבחירה
                chomarimCategory: expenseCategory.trim(), // ווידוא שאין רווחים מיותרים
                amount: expenseAmount,
                updateDate: new Date().toISOString().split("T")[0],
            };
            
            console.log("Sending expense data:", expenseData); // לוג לדיבוג
            
            await customersService.addExpenseToCustomer(+customerId!, expenseData);
            toast.success("הוצאה נוספה בהצלחה");
            setExpenseAmount(undefined);
            setExpenseCategory("");
            getCustomerData();
        } catch (err: any) {
            console.error("Error adding expense:", err);
            toast.error("Failed to add expense: " + err.message);
        }
    };

    // פונקציה למחיקת מסמך
    const deleteDocument = async (documentId: number, documentName: string) => {
        if (!window.confirm(`האם אתה בטוח שברצונך למחוק את המסמך "${documentName}"?`)) {
            return;
        }

        setDeletingDocumentId(documentId);
        
        try {
            const result = await customersService.deleteDocument(+customerId!, documentId);
            
            if (result.success) {
                toast.success(result.message || "המסמך נמחק בהצלחה");
                // רענון נתוני הלקוח לאחר מחיקה מוצלחת
                getCustomerData();
            } else {
                toast.error(result.message || "שגיאה במחיקת המסמך");
            }
        } catch (error: any) {
            console.error("Error deleting document:", error);
            toast.error(error.message || "שגיאה במחיקת המסמך");
        } finally {
            setDeletingDocumentId(null);
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
                                <div className={"button-wrap"}>
                                    <button type="submit">הוספה</button>
                                </div>
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
                                    placeholder="קטגוריה (למשל: חומר שחור, קבלן משנה)"
                                    value={expenseCategory}
                                    onChange={(e) => setExpenseCategory(e.target.value)}
                                    maxLength={100}
                                />
                                <div className={"button-wrap"}>
                                    <button type="submit">הוספה</button>
                                </div>
                            </form>
                            <table>
                                <thead>
                                <tr>
                                    <th>סכום</th>
                                    <th>קטגוריה</th>
                                    <th>תאריך</th>
                                </tr>
                                </thead>
                                <tbody>
                                {customerData.expenses?.length ? (
                                    customerData.expenses.map((expense) => (
                                        <tr key={expense.chomarimId}>
                                            <td>{expense.amount} ₪</td>
                                            <td>{expense.chomarimCategory || 'לא צוין'}</td>
                                            <td>{formatDate(expense.updateDate)}</td>
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
                    <div className="payments-expenses documents">
                        <div>
                            <h3>מסמכים</h3>
                            <FileUpload customerId={+customerId!} getCustomerData={getCustomerData}/>

                            <table>
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>שם מסמך</th>
                                        <th>תאריך</th>
                                        <th>פעולות</th>
                                    </tr>
                                </thead>
                                <tbody>
                                {customerData.documents.length > 0 ? (
                                    customerData.documents.map((document) => (
                                        <tr key={document.documentId}>
                                            <td>{document.documentId}</td>
                                            <td> 
                                                <a 
                                                    target={"_blank"} 
                                                    href={'http://localhost:' + appConfig.port + "/uploads/" + document.filePath} 
                                                    title={document.documentName}
                                                    rel="noopener noreferrer"
                                                >
                                                    {document.documentName}
                                                </a>
                                            </td>
                                            <td>{formatDate(document.uploadDate)}</td>
                                            <td>
                                                <button
                                                    onClick={() => deleteDocument(document.documentId, document.documentName)}
                                                    disabled={deletingDocumentId === document.documentId}
                                                    className="delete-document-btn"
                                                    style={{
                                                        backgroundColor: deletingDocumentId === document.documentId ? '#ccc' : '#f44336',
                                                        color: 'white',
                                                        border: 'none',
                                                        padding: '5px 10px',
                                                        borderRadius: '3px',
                                                        cursor: deletingDocumentId === document.documentId ? 'not-allowed' : 'pointer',
                                                        fontSize: '12px'
                                                    }}
                                                >
                                                    {deletingDocumentId === document.documentId ? 'מוחק...' : 'מחק'}
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4}>אין מסמכים</td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            ) : (
                <p>טוען לקוחות, נא המתן...</p>
            )}
        </div>
    );
}