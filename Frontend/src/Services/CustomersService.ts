import axios from "axios";
import CustomersModel from "../Models/CustomersModel";
import appConfig from "../Utils/Config";
import { CustomerData } from "../Models/CustomerDataModel";

class CustomersService {

    public async getAllCustomers(
        userId:number,
        freeSearch: string|undefined,
        page: number,
        limit: number):
    Promise<{customers: CustomersModel[], count: number}>{
        const url = appConfig.getAllCustomresUrl.replace(":userId", userId.toString());
        const response = await axios.get<{customers: CustomersModel[], count: number}>(url, {
            params: {
                'freeSearch': freeSearch,
                'page' : page,
                'limit': limit
            }
        });console.log(response);
        let results = response.data

        return results;
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
    
}
const customersService = new CustomersService()

export default customersService
