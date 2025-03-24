import axios from "axios";
import CustomersModel from "../Models/CustomersModel";
import appConfig from "../Utils/Config";
import {CustomerData} from "../Models/CustomerDataModel";

class CustomersService {

    public async getAllCustomers(
        userId: number,
        freeSearch?: string,
        offset: number = 1,
        limit: number = 9
    ): Promise<{ customers: CustomersModel[]; count: number }> {
        const url = appConfig.getAllCustomresUrl.replace(":userId", userId.toString());

        try {
            const response = await axios.get<{ customers: CustomersModel[]; count: number }>(url, {
                params: {
                    freeSearch,
                    offset,
                    limit,
                },
            });
            return {
                customers: response.data.customers,
                count: response.data?.count ?? 0,
            };
        } catch (error) {
            console.error("Error fetching customers:", error);
            throw error;
        }
    }

    public async getCustomerById(customerId: number): Promise<CustomerData> {
        const url = `http://localhost:3002/api/customer/${customerId}`;
        const response = await axios.get<CustomerData>(url);
        console.log(response.data, " data from customerService");
        console.log(customerId, " customerId from customerService");

    
        return response.data;
    }

    
    public async addCustomer(customer: any, userId: number): Promise<void> {
        const url = appConfig.addCustomerUrl.replace(":userId", userId.toString());
        await axios.post(url, customer);
    }

    public async updateCustomer(customer: any) {
        const url = appConfig.updateCustomerUrl.replace(":customerId", customer.customerId.toString());
        await axios.put(url, customer);
    }
    

    public async addPaymentToCustomer(customerId: number, paymentData: any): Promise<void> {
        const url = appConfig.addPaymentToCustomer.replace(":customerId", customerId.toString());
        await axios.post(url, paymentData);
        console.log("Payment added successfully.");
    }

    public async addExpenseToCustomer(customerId: number, expenseData: any): Promise<void> {
        const url = appConfig.addExpenseToCustomer.replace(":customerId", customerId.toString());
        await axios.post(url, expenseData);
        console.log("Expense added successfully.");
    }

    public async fetchBalancePerMonth(userId: number): Promise<{months: string[], values: number[]}> {
        const url = appConfig.fetchBalancePerMonth.replace(':userId', userId.toString());
        const response = await axios.get<{months: string[], values: number[]}>(url);
        return response.data;
    }

    public async fetchBalancePerYear(userId: number): Promise<{years: number[], values: number[]}> {
        const url = appConfig.fetchBalancePerYear.replace(':userId', userId.toString());
        const response = await axios.get<{years: number[], values: number[]}>(url);
        return response.data;
    }

    public async addDocumentToCustomer(customerId: number, files: File[]): Promise<void> {
        const url = appConfig.addDocumentToCustomer.replace(":customerId", customerId.toString());

        // Create a new FormData object
        const formData = new FormData();

        // Append files to the FormData object
        files.forEach((file) => {
            formData.append("files", file); // The key "files" should match the name expected by multer on the backend
        });

        try {
            await axios.post(url, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            console.log("Document added successfully.");
        } catch (error) {
            console.error("Error adding document:", error);
            throw error;
        }
    }
    
}
const customersService = new CustomersService()

export default customersService
