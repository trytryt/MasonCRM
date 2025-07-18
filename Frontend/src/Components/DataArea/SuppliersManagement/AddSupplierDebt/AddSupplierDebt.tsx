import React, { useState, useEffect } from 'react';
import { Supplier, SupplierDebt, SupplierDebtPayload } from '../../../../Models/SuppliersModel';
import supplierDebtsService from '../../../../Services/suppliersDebtsService';
import { notify } from '../../../../Utils/Notify';
import './AddSupplierDebt.css';
import suppliersService from '../../../../Services/SuppliersService';

interface AddSupplierDebtProps {
    onClose: () => void;
    onDebtAdded: () => void;
}

const AddSupplierDebt: React.FC<AddSupplierDebtProps> = ({ onClose, onDebtAdded }) => {
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [selectedSupplierId, setSelectedSupplierId] = useState<number>(0);
    const [amount, setAmount] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [paymentStatus, setPaymentStatus] = useState<'unpaid' | 'paid'>('unpaid');
    const [loading, setLoading] = useState<boolean>(false);
    const [loadingSuppliers, setLoadingSuppliers] = useState<boolean>(false);
    const [showAddNewSupplier, setShowAddNewSupplier] = useState<boolean>(false);
    
    // שדות לספק חדש
    const [newSupplierName, setNewSupplierName] = useState<string>('');
    const [newSupplierPhone, setNewSupplierPhone] = useState<string>('');
    const [newSupplierAddress, setNewSupplierAddress] = useState<string>('');
    const [newSupplierEmail, setNewSupplierEmail] = useState<string>('');
    const [newSupplierNotes, setNewSupplierNotes] = useState<string>('');

    // טעינת רשימת ספקים
    const loadSuppliers = async () => {
        setLoadingSuppliers(true);
        try {
            // נניח שיש לנו שירות לספקים
            const response = await suppliersService.getAllSuppliers();
            setSuppliers(response.suppliers || []);
        } catch (error) {
            notify.error('שגיאה בטעינת רשימת הספקים');
        } finally {
            setLoadingSuppliers(false);
        }
    };

    useEffect(() => {
        loadSuppliers();
    }, []);

    // הוספת ספק חדש
    const handleAddNewSupplier = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!newSupplierName.trim()) {
            notify.error('שם הספק הוא שדה חובה');
            return;
        }

        try {
            const newSupplier = {
                name: newSupplierName.trim(),
                phone: newSupplierPhone.trim(),
                address: newSupplierAddress.trim(),
                email: newSupplierEmail.trim() || undefined,
                notes: newSupplierNotes.trim()
            };

            const addedSupplier = await suppliersService.addSupplier(newSupplier);
            
            // הוספת הספק החדש לרשימה
            setSuppliers(prev => [...prev, addedSupplier]);
            setSelectedSupplierId(addedSupplier.id);
            
            // איפוס השדות
            setNewSupplierName('');
            setNewSupplierPhone('');
            setNewSupplierAddress('');
            setNewSupplierEmail('');
            setNewSupplierNotes('');
            setShowAddNewSupplier(false);
            
            notify.success('הספק נוסף בהצלחה');
        } catch (error) {
            notify.error('שגיאה בהוספת הספק');
        }
    };

    // הוספת חוב חדש
    const handleAddDebt = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!selectedSupplierId) {
            notify.error('יש לבחור ספק');
            return;
        }
        
        if (!amount.trim() || parseFloat(amount) <= 0) {
            notify.error('יש להזין סכום חיובי');
            return;
        }
        
        if (!description.trim()) {
            notify.error('יש להזין תיאור');
            return;
        }

        setLoading(true);
        try {
            const debtPayload: SupplierDebtPayload = {
                supplier_id: selectedSupplierId,
                customerId: 1, // נניח שמגיע מהקשר של המשתמש המחובר
                amount: parseFloat(amount),
                description: description.trim(),
                payment_status: paymentStatus
            };

            await supplierDebtsService.addSupplierDebt(debtPayload);
            notify.success('החוב נוסף בהצלחה');
            onDebtAdded();
        } catch (error) {
            notify.error('שגיאה בהוספת החוב');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="add-supplier-debt-modal">
            <div className="modal-backdrop" onClick={onClose}></div>
            <div className="modal-content">
                <div className="modal-header">
                    <h3>הוספת חוב ספק</h3>
                    <button className="close-btn" onClick={onClose}>×</button>
                </div>

                <div className="modal-body">
                    {/* בחירת ספק */}
                    <div className="supplier-selection">
                        <h4>בחירת ספק</h4>
                        
                        {loadingSuppliers ? (
                            <div className="loading">טוען ספקים...</div>
                        ) : (
                            <div className="supplier-options">
                                <select
                                    value={selectedSupplierId}
                                    onChange={(e) => setSelectedSupplierId(parseInt(e.target.value))}
                                    className="supplier-select"
                                >
                                    <option value={0}>בחר ספק קיים</option>
                                    {suppliers.map(supplier => (
                                        <option key={supplier.id} value={supplier.id}>
                                            {supplier.name} - {supplier.phone}
                                        </option>
                                    ))}
                                </select>
                                
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => setShowAddNewSupplier(!showAddNewSupplier)}
                                >
                                    {showAddNewSupplier ? 'ביטול' : 'הוספת ספק חדש'}
                                </button>
                            </div>
                        )}

                        {/* טופס הוספת ספק חדש */}
                        {showAddNewSupplier && (
                            <form onSubmit={handleAddNewSupplier} className="new-supplier-form">
                                <h5>הוספת ספק חדש</h5>
                                <div className="form-group">
                                    <label>שם הספק *</label>
                                    <input
                                        type="text"
                                        value={newSupplierName}
                                        onChange={(e) => setNewSupplierName(e.target.value)}
                                        required
                                        className="form-control"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>טלפון</label>
                                    <input
                                        type="tel"
                                        value={newSupplierPhone}
                                        onChange={(e) => setNewSupplierPhone(e.target.value)}
                                        className="form-control"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>כתובת</label>
                                    <input
                                        type="text"
                                        value={newSupplierAddress}
                                        onChange={(e) => setNewSupplierAddress(e.target.value)}
                                        className="form-control"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>אימייל</label>
                                    <input
                                        type="email"
                                        value={newSupplierEmail}
                                        onChange={(e) => setNewSupplierEmail(e.target.value)}
                                        className="form-control"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>הערות</label>
                                    <textarea
                                        value={newSupplierNotes}
                                        onChange={(e) => setNewSupplierNotes(e.target.value)}
                                        className="form-control"
                                        rows={2}
                                    />
                                </div>
                                <button type="submit" className="btn btn-primary">
                                    הוסף ספק
                                </button>
                            </form>
                        )}
                    </div>

                    {/* טופס הוספת חוב */}
                    <form onSubmit={handleAddDebt} className="debt-form">
                        <h4>פרטי החוב</h4>
                        
                        <div className="form-group">
                            <label>סכום *</label>
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                required
                                min="0"
                                step="0.01"
                                className="form-control"
                                placeholder="הזן סכום בשקלים"
                            />
                        </div>

                        <div className="form-group">
                            <label>תיאור *</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                                className="form-control"
                                rows={3}
                                placeholder="תיאור החוב..."
                            />
                        </div>

                        <div className="form-group">
                            <label>סטטוס תשלום</label>
                            <select
                                value={paymentStatus}
                                onChange={(e) => setPaymentStatus(e.target.value as 'unpaid' | 'paid')}
                                className="form-control"
                            >
                                <option value="unpaid">לא שולם</option>
                                <option value="paid">שולם</option>
                            </select>
                        </div>

                        <div className="form-actions">
                            <button
                                type="submit"
                                disabled={loading || !selectedSupplierId}
                                className="btn btn-primary"
                            >
                                {loading ? 'מוסיף...' : 'הוספת חוב'}
                            </button>
                            <button
                                type="button"
                                onClick={onClose}
                                className="btn btn-secondary"
                            >
                                ביטול
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddSupplierDebt;