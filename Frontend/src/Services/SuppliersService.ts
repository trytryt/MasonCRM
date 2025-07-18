import axios from "axios";
import appConfig from "../Utils/Config";

// ייבוא הטיפוסים מהמודל הרשמי
import { Supplier, SuppliersResponse, SupplierPayload } from "../Models/SuppliersModel";

class SuppliersService {
    // קבלת כל הספקים (עם אפשרות לפילטור וחיפוש)
    public async getAllSuppliers(
        freeSearch?: string,
        offset: number = 0,
        limit: number = 100
    ): Promise<SuppliersResponse> {
        let url = appConfig.suppliersUrl;
        
        try {
            const response = await axios.get<SuppliersResponse>(url, {
                params: {
                    freeSearch,
                    offset,
                    limit,
                },
            });
            
            return {
                suppliers: response.data.suppliers,
                count: response.data?.count ?? 0,
            };
        } catch (error) {
            console.error("Error fetching suppliers:", error);
            throw error;
        }
    }

    // קבלת ספק ספציפי לפי מזהה
    public async getSupplierById(id: number): Promise<Supplier> {
        const url = `${appConfig.suppliersUrl}${id}`;
        
        try {
            const response = await axios.get<Supplier>(url);
            return response.data;
        } catch (error) {
            console.error(`Error fetching supplier with ID ${id}:`, error);
            throw error;
        }
    }

    // הוספת ספק חדש
    public async addSupplier(supplier: SupplierPayload): Promise<Supplier> {
        try {
            const response = await axios.post<Supplier>(appConfig.suppliersUrl, supplier);
            console.log("Supplier added successfully.");
            return response.data;
        } catch (error) {
            console.error("Error adding supplier:", error);
            throw error;
        }
    }

    // עדכון ספק קיים
    public async updateSupplier(supplier: Supplier): Promise<Supplier> {
        const url = appConfig.updateSupplierUrl.replace(':id', supplier.id.toString());
        
        try {
            const response = await axios.put<Supplier>(url, supplier);
            console.log("Supplier updated successfully.");
            return response.data;
        } catch (error) {
            console.error(`Error updating supplier with ID ${supplier.id}:`, error);
            throw error;
        }
    }

    // מחיקת ספק
    public async deleteSupplier(id: number): Promise<{ success: boolean, message: string }> {
        const url = appConfig.deleteSupplierUrl.replace(':id', id.toString());
        
        try {
            const response = await axios.delete<{ success: boolean, message: string }>(url);
            console.log("Supplier deleted successfully.");
            return response.data;
        } catch (error) {
            console.error(`Error deleting supplier with ID ${id}:`, error);
            throw error;
        }
    }

    // חיפוש ספקים לפי שם
    public async searchSuppliers(searchTerm: string): Promise<Supplier[]> {
        try {
            const response = await this.getAllSuppliers(searchTerm, 0, 50);
            return response.suppliers;
        } catch (error) {
            console.error("Error searching suppliers:", error);
            throw error;
        }
    }
}

const suppliersService = new SuppliersService();

export default suppliersService;