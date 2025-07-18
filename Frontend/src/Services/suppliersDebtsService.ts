
import axios from "axios";
import appConfig from "../Utils/Config";
import { SupplierDebt, SupplierDebtsResponse } from "../Models/SuppliersModel";

class SupplierDebtsService {
    // קבלת כל חובות הספקים (עם אפשרות לפילטור לפי לקוח)
    public async getAllSupplierDebts(
        customerId?: number,
        freeSearch?: string,
        offset: number = 0,
        limit: number = 20
    ): Promise<SupplierDebtsResponse> {
        let url = appConfig.supplierDebtsUrl;
        
        try {
            const response = await axios.get<SupplierDebtsResponse>(url, {
                params: {
                    customerId,
                    freeSearch,
                    offset,
                    limit,
                },
            });
            
            return {
                debts: response.data.debts,
                count: response.data?.count ?? 0,
            };
        } catch (error) {
            console.error("Error fetching supplier debts:", error);
            throw error;
        }
    }

    // קבלת חובות ספקים ללקוח ספציפי
    public async getSupplierDebtsByCustomer(customerId: number): Promise<SupplierDebtsResponse> {
        try {
            return await this.getAllSupplierDebts(customerId);
        } catch (error) {
            console.error(`Error fetching supplier debts for customer ${customerId}:`, error);
            throw error;
        }
    }

    // קבלת חוב ספק ספציפי לפי מזהה
    public async getSupplierDebtById(id: number): Promise<SupplierDebt> {
        const url = `${appConfig.supplierDebtsUrl}${id}`;
        
        try {
            const response = await axios.get<SupplierDebt>(url);
            return response.data;
        } catch (error) {
            console.error(`Error fetching supplier debt with ID ${id}:`, error);
            throw error;
        }
    }

    // הוספת חוב ספק חדש
    public async addSupplierDebt(debt: Partial<SupplierDebt>): Promise<SupplierDebt> {
        try {
            const response = await axios.post<SupplierDebt>(appConfig.supplierDebtsUrl, debt);
            console.log("Supplier debt added successfully.");
            return response.data;
        } catch (error) {
            console.error("Error adding supplier debt:", error);
            throw error;
        }
    }

    // עדכון חוב ספק קיים
    public async updateSupplierDebt(debt: SupplierDebt): Promise<SupplierDebt> {
        const url = appConfig.updateSupplierDebtUrl.replace(':id', debt.id.toString());
        
        try {
            const response = await axios.put<SupplierDebt>(url, debt);
            console.log("Supplier debt updated successfully.");
            return response.data;
        } catch (error) {
            console.error(`Error updating supplier debt with ID ${debt.id}:`, error);
            throw error;
        }
    }

    // סימון חוב כשולם
    public async markDebtAsPaid(id: number): Promise<{ success: boolean, message: string }> {
        const url = appConfig.markSupplierDebtAsPaidUrl.replace(':id', id.toString());
        
        try {
            const response = await axios.put<{ success: boolean, message: string }>(url);
            console.log("Supplier debt marked as paid successfully.");
            return response.data;
        } catch (error) {
            console.error(`Error marking supplier debt with ID ${id} as paid:`, error);
            throw error;
        }
    }

    // מחיקת חוב ספק
    public async deleteSupplierDebt(id: number): Promise<{ success: boolean, message: string }> {
        const url = appConfig.deleteSupplierDebtUrl.replace(':id', id.toString());
        
        try {
            const response = await axios.delete<{ success: boolean, message: string }>(url);
            console.log("Supplier debt deleted successfully.");
            return response.data;
        } catch (error) {
            console.error(`Error deleting supplier debt with ID ${id}:`, error);
            throw error;
        }
    }
}

const supplierDebtsService = new SupplierDebtsService();

export default supplierDebtsService;