import React, { useState } from 'react';
import Suppliers from '../Suppliers/Suppliers';
import SuppliersDebts from '../SuppliersDebts/SuppliersDebts';
import StickyNotesBoard from '../../SticktNotes/sticky_notes_board_component';
import './SuppliersManagementDashboard.css';

const SuppliersManagementDashboard: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'debts' | 'suppliers' | 'notes'>('debts');

    return (
        <div className="suppliers-management-dashboard">
            <div className="dashboard-header">
                <h1>ניהול ספקים וחובות</h1>
                <div className="dashboard-tabs">
                    <button 
                        className={`tab-button ${activeTab === 'debts' ? 'active' : ''}`}
                        onClick={() => setActiveTab('debts')}
                    >
                        חובות ספקים
                    </button>
                    <button 
                        className={`tab-button ${activeTab === 'suppliers' ? 'active' : ''}`}
                        onClick={() => setActiveTab('suppliers')}
                    >
                        ניהול ספקים
                    </button>
                    <button 
                        className={`tab-button ${activeTab === 'notes' ? 'active' : ''}`}
                        onClick={() => setActiveTab('notes')}
                    >
                        תזכורות
                    </button>
                </div>
            </div>

            <div className="dashboard-content">
                {activeTab === 'debts' && <SuppliersDebts />}
                {activeTab === 'suppliers' && <Suppliers />}
                {activeTab === 'notes' && <StickyNotesBoard />}
            </div>
        </div>
    );
};

export default SuppliersManagementDashboard;

