import React, { useState, useEffect } from 'react';
import { SupplierDebt, SupplierDebtsResponse } from '../../../../Models/SuppliersModel';
import supplierDebtsService from '../../../../Services/suppliersDebtsService';
import AddSupplierDebt from '../AddSupplierDebt/AddSupplierDebt';
import './SuppliersDebts.css';
import {notify} from '../../../../Utils/Notify';


const SuppliersDebts: React.FC = () => {
    const [debts, setDebts] = useState<SupplierDebt[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [totalCount, setTotalCount] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [pageSize] = useState<number>(20);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [showAddForm, setShowAddForm] = useState<boolean>(false);

    // טעינת חובות ספקים
    const loadSupplierDebts = async (page: number = 1, search: string = '') => {
        setLoading(true);
        try {
            const offset = (page - 1) * pageSize;
            const response: SupplierDebtsResponse = await supplierDebtsService.getAllSupplierDebts(
                undefined, // customerId - נשלח undefined כדי לקבל את כל החובות
                search,
                offset,
                pageSize
            );
            
            setDebts(response.debts);
            setTotalCount(response.count);
        } catch (error) {
            notify.error('שגיאה בטעינת רשימת חובות הספקים');
        } finally {
            setLoading(false);
        }
    };

    // טעינה ראשונית
    useEffect(() => {
        loadSupplierDebts(currentPage, searchTerm);
    }, [currentPage, searchTerm]);

    // חיפוש
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    // מחיקת חוב
    const handleDeleteDebt = async (id: number) => {
        if (window.confirm('האם אתה בטוח שברצונך למחוק חוב זה?')) {
            try {
                await supplierDebtsService.deleteSupplierDebt(id);
                notify.success('החוב נמחק בהצלחה');
                loadSupplierDebts(currentPage, searchTerm);
            } catch (error) {
                notify.error('שגיאה במחיקת החוב');
            }
        }
    };

    // סימון חוב כשולם
    const handleMarkAsPaid = async (id: number) => {
        try {
            await supplierDebtsService.markDebtAsPaid(id);
            notify.success('החוב סומן כשולם');
            loadSupplierDebts(currentPage, searchTerm);
        } catch (error) {
            notify.error('שגיאה בסימון החוב כשולם');
        }
    };

    // עיצוב סכום בשקלים
    const formatCurrency = (amount: number): string => {
        return new Intl.NumberFormat('he-IL', {
            style: 'currency',
            currency: 'ILS'
        }).format(amount);
    };

    // עיצוב תאריך
    const formatDate = (date: string | Date): string => {
        return new Date(date).toLocaleDateString('he-IL');
    };

    // דפדוף
    const totalPages = Math.ceil(totalCount / pageSize);
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    // רענון הרשימה אחרי הוספת חוב חדש
    const handleDebtAdded = () => {
        setShowAddForm(false);
        loadSupplierDebts(currentPage, searchTerm);
    };

    return (
        <div className="suppliers-debts">
            <div className="suppliers-debts-header">
                <h2>ניהול חובות ספקים</h2>
                <button 
                    className="btn btn-primary"
                    onClick={() => setShowAddForm(true)}
                >
                    הוספת חוב חדש
                </button>
            </div>

            {/* חיפוש */}
            <div className="search-container">
                <input
                    type="text"
                    placeholder="חיפוש לפי שם ספק או תיאור..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="search-input"
                />
            </div>

            {/* טופס הוספת חוב */}
            {showAddForm && (
                <AddSupplierDebt 
                    onClose={() => setShowAddForm(false)}
                    onDebtAdded={handleDebtAdded}
                />
            )}

            {/* רשימת חובות */}
            <div className="debts-table-container">
                {loading ? (
                    <div className="loading">טוען...</div>
                ) : (
                    <table className="debts-table">
                        <thead>
                            <tr>
                                <th>שם ספק</th>
                                <th>טלפון</th>
                                <th>סכום</th>
                                <th>תיאור</th>
                                <th>סטטוס</th>
                                <th>תאריך יצירה</th>
                                <th>תאריך תשלום</th>
                                <th>פעולות</th>
                            </tr>
                        </thead>
                        <tbody>
                            {debts.map((debt) => (
                                <tr key={debt.id} className={debt.payment_status === 'paid' ? 'paid' : 'unpaid'}>
                                    <td>{debt.supplier_name}</td>
                                    <td>{debt.supplier_phone}</td>
                                    <td className="amount">{formatCurrency(debt.amount)}</td>
                                    <td>{debt.description}</td>
                                    <td>
                                        <span className={`status ${debt.payment_status}`}>
                                            {debt.payment_status === 'paid' ? 'שולם' : 'לא שולם'}
                                        </span>
                                    </td>
                                    <td>{debt.created_at ? formatDate(debt.created_at) : '-'}</td>
                                    <td>{debt.paid_at ? formatDate(debt.paid_at) : '-'}</td>
                                    <td className="actions">
                                        {debt.payment_status === 'unpaid' && (
                                            <button
                                                className="btn btn-success btn-sm"
                                                onClick={() => handleMarkAsPaid(debt.id!)}
                                            >
                                                סמן כשולם
                                            </button>
                                        )}
                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() => handleDeleteDebt(debt.id!)}
                                        >
                                            מחק
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* דפדוף */}
            {totalPages > 1 && (
                <div className="pagination">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="btn btn-secondary"
                    >
                        הקודם
                    </button>
                    <span className="page-info">
                        עמוד {currentPage} מתוך {totalPages} ({totalCount} חובות)
                    </span>
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="btn btn-secondary"
                    >
                        הבא
                    </button>
                </div>
            )}
        </div>
    );
};

export default SuppliersDebts;