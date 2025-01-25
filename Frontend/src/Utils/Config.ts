class Config {

    public getAllCustomresUrl = "http://localhost:3002/api/customers/:userId"

    public getOneCustomerUrl = "http://localhost:3002/api/customer/:customerId"

    public addCustomerUrl = "http://localhost:3002/api/customer/:userId"
    public saveCustomerUrl = "http://localhost:3002/api/customer/:userId/"

    public updateCustomerUrl = "http://localhost:3002/api/customer/:customerId"

    public deleteCustomerUrl = "http://localhost:3002/api/customer/:customerId"

    public getPaymentsByCustomerId = "http://localhost:3002/api/customer/:customerId/payments"

    public addPaymentToCustomer = "http://localhost:3002/api/customer/:customerId/payment"

    public addExpenseToCustomer = "http://localhost:3002/api/customer/:customerId/expense"

    // --------------------------------

    
    public addFollowedCust = "http://localhost:3002/api/customer/addFollowedCust"

    public removeFollowedCust = "http://localhost:3002/api/customer/removeFollowedCust"


    public getCustInFollow = "http://localhost:3002/api/follower/getCustInFollow"

    public registerUrl = "http://localhost:3002/api/auth/register/"

    public loginUrl = "http://localhost:3002/api/auth/login/"

    public logoutUrl = "http://localhost:3002/api/auth/logout/"

    public refreshToken = "http://localhost:3002/api/auth/refresh-token/"

}

const appConfig = new Config() 

export default appConfig