import React, { useState, useEffect } from 'react';
import { Supplier, SuppliersResponse, SupplierPayload } from '../../../../Models/SuppliersModel';
import './Suppliers.css';
import suppliersService from '../../../../Services/SuppliersService';
import { notify } from '../../../../Utils/Notify';

const Suppliers: React.FC = () => {
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [totalCount, setTotalCount] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [pageSize] = useState<number>(20);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [showAddForm, setShowAddForm] = useState<boolean>(false);
    const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);
    const [supplierToDelete, setSupplierToDelete] = useState<Supplier | null>(null);
    
    // שדות הטופס
    const [formData, setFormData] = useState<SupplierPayload>({
        name: '',
        phone: '',
        address: '',
        email: '',
        notes: ''
    });

    // טעינת ספקים
    const loadSuppliers = async (page: number = 1, search: string = '') => {
        setLoading(true);
        try {
            const offset = (page - 1) * pageSize;
            const response: SuppliersResponse = await suppliersService.getAllSuppliers(
                search,
                offset,
                pageSize
            );
            
            setSuppliers(response.suppliers);
            setTotalCount(response.count);
        } catch (error) {
            notify.error('שגיאה בטעינת רשימת הספקים');
        } finally {
            setLoading(false);
        }
    };

    // טעינה ראשונית
    useEffect(() => {
        loadSuppliers(currentPage, searchTerm);
    }, [currentPage, searchTerm]);

    // חיפוש
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    // איפוס הטופס
    const resetForm = () => {
        setFormData({
            name: '',
            phone: '',
            address: '',
            email: '',
            notes: ''
        });
        setEditingSupplier(null);
        setShowAddForm(false);
    };

    // הוספת ספק חדש
    const handleAddSupplier = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.name.trim()) {
            notify.error('שם הספק הוא שדה חובה');
            return;
        }

        try {
            await suppliersService.addSupplier(formData);
            notify.success('הספק נוסף בהצלחה');
            resetForm();
            loadSuppliers(currentPage, searchTerm);
        } catch (error: any) {
            // טיפול בשגיאות ספציפיות
            if (error.message?.includes('כבר קיים ספק עם שם זה')) {
                notify.error('כבר קיים ספק עם שם זה במערכת');
            } else {
                notify.error('שגיאה בהוספת הספק: ' + (error.message || 'שגיאה לא ידועה'));
            }
        }
    };

    // עדכון ספק
    const handleUpdateSupplier = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!editingSupplier || !formData.name.trim()) {
            notify.error('שם הספק הוא שדה חובה');
            return;
        }

        try {
            const updatedSupplier: Supplier = {
                ...editingSupplier,
                ...formData
            };
            
            await suppliersService.updateSupplier(updatedSupplier);
            notify.success('הספק עודכן בהצלחה');
            resetForm();
            loadSuppliers(currentPage, searchTerm);
        } catch (error: any) {
            // טיפול בשגיאות ספציפיות
            if (error.message?.includes('כבר קיים ספק אחר עם שם זה')) {
                notify.error('כבר קיים ספק אחר עם שם זה במערכת');
            } else {
                notify.error('שגיאה בעדכון הספק: ' + (error.message || 'שגיאה לא ידועה'));
            }
        }
    };

    // התחלת תהליך מחיקה
    const initiateDelete = (supplier: Supplier) => {
        setSupplierToDelete(supplier);
        setShowDeleteConfirm(true);
    };

    // ביטול מחיקה
    const cancelDelete = () => {
        setSupplierToDelete(null);
        setShowDeleteConfirm(false);
    };

    // מחיקת ספק עם טיפול משופר בשגיאות
    const confirmDeleteSupplier = async () => {
        if (!supplierToDelete) return;

        try {
            await suppliersService.deleteSupplier(supplierToDelete.id);
            notify.success('הספק נמחק בהצלחה');
            loadSuppliers(currentPage, searchTerm);
        } catch (error: any) {
            console.error('Delete error:', error);
            
            // טיפול בשגיאות ספציפיות
            if (error.message?.includes('לא ניתן למחוק ספק שיש לו חובות פעילים')) {
                notify.error(
                    `לא ניתן למחוק את הספק "${supplierToDelete.name}" מכיוון שיש לו חובות שטרם שולמו. ` +
                    'יש לסגור את כל החובות הפתוחים לפני מחיקת הספק.'
                );
            } else if (error.message?.includes('הספק לא נמצא')) {
                notify.error('הספק לא נמצא במערכת או כבר נמחק');
            } else if (error.response?.status === 400) {
                notify.error('לא ניתן למחוק ספק זה. יתכן שיש לו חובות פתוחים או קשרים אחרים במערכת.');
            } else if (error.response?.status === 404) {
                notify.error('הספק לא נמצא במערכת');
            } else if (error.response?.status === 500) {
                notify.error('שגיאת שרת. אנא נסה שוב מאוחר יותר או פנה למנהל המערכת');
            } else {
                notify.error('שגיאה במחיקת הספק: ' + (error.message || 'שגיאה לא ידועה'));
            }
        } finally {
            setSupplierToDelete(null);
            setShowDeleteConfirm(false);
        }
    };

    // התחלת עריכה
    const startEdit = (supplier: Supplier) => {
        setEditingSupplier(supplier);
        setFormData({
            name: supplier.name,
            phone: supplier.phone,
            address: supplier.address || '',
            email: supplier.email || '',
            notes: supplier.notes || ''
        });
        setShowAddForm(true);
    };

    // דפדוף
    const totalPages = Math.ceil(totalCount / pageSize);
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    return (
        <div className="suppliers">
            <div className="suppliers-header">
                <h2>ניהול ספקים</h2>
                <button 
                    className="btn btn-primary"
                    onClick={() => setShowAddForm(true)}
                >
                    הוספת ספק חדש
                </button>
            </div>

            {/* חיפוש */}
            <div className="search-container">
                <input
                    type="text"
                    placeholder="חיפוש לפי שם ספק, טלפון, כתובת או אימייל..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="search-input"
                />
            </div>

            {/* טופס הוספה/עריכה */}
            {showAddForm && (
                <div className="supplier-form-container">
                    <form onSubmit={editingSupplier ? handleUpdateSupplier : handleAddSupplier} className="supplier-form">
                        <h3>{editingSupplier ? 'עריכת ספק' : 'הוספת ספק חדש'}</h3>
                        
                        <div className="form-group">
                            <label>שם הספק *</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                required
                                className="form-control"
                            />
                        </div>

                        <div className="form-group">
                            <label>טלפון</label>
                            <input
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                className="form-control"
                            />
                        </div>

                        <div className="form-group">
                            <label>כתובת</label>
                            <input
                                type="text"
                                value={formData.address}
                                onChange={(e) => setFormData({...formData, address: e.target.value})}
                                className="form-control"
                            />
                        </div>

                        <div className="form-group">
                            <label>אימייל</label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                                className="form-control"
                            />
                        </div>

                        <div className="form-group">
                            <label>הערות</label>
                            <textarea
                                value={formData.notes}
                                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                                className="form-control"
                                rows={3}
                            />
                        </div>

                        <div className="form-actions">
                            <button type="submit" className="btn btn-primary">
                                {editingSupplier ? 'עדכן' : 'הוסף'}
                            </button>
                            <button type="button" onClick={resetForm} className="btn btn-secondary">
                                ביטול
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* דיאלוג אישור מחיקה */}
            {showDeleteConfirm && supplierToDelete && (
                <div className="delete-confirm-overlay">
                    <div className="delete-confirm-modal">
                        <div className="delete-confirm-header">
                            <h3>אישור מחיקה</h3>
                        </div>
                        <div className="delete-confirm-body">
                            <p>האם אתה בטוח שברצונך למחוק את הספק:</p>
                            <strong>"{supplierToDelete.name}"</strong>
                            <p className="delete-warning">
                                ⚠️ שים לב: אם יש לספק זה חובות שטרם שולמו, המחיקה תיכשל.
                            </p>
                        </div>
                        <div className="delete-confirm-actions">
                            <button 
                                onClick={confirmDeleteSupplier}
                                className="btn btn-danger"
                            >
                                מחק ספק
                            </button>
                            <button 
                                onClick={cancelDelete}
                                className="btn btn-secondary"
                            >
                                ביטול
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* רשימת ספקים */}
            <div className="suppliers-table-container">
                {loading ? (
                    <div className="loading">טוען...</div>
                ) : (
                    <table className="suppliers-table">
                        <thead>
                            <tr>
                                <th>שם ספק</th>
                                <th>טלפון</th>
                                <th>כתובת</th>
                                <th>אימייל</th>
                                <th>הערות</th>
                                <th>פעולות</th>
                            </tr>
                        </thead>
                        <tbody>
                            {suppliers.map((supplier) => (
                                <tr key={supplier.id}>
                                    <td>{supplier.name}</td>
                                    <td>{supplier.phone}</td>
                                    <td>{supplier.address || '-'}</td>
                                    <td>{supplier.email || '-'}</td>
                                    <td>{supplier.notes || '-'}</td>
                                    <td className="actions">
                                        <button
                                            className="btn btn-info btn-sm"
                                            onClick={() => startEdit(supplier)}
                                        >
                                            ערוך
                                        </button>
                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() => initiateDelete(supplier)}
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
                        עמוד {currentPage} מתוך {totalPages} ({totalCount} ספקים)
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

export default Suppliers;