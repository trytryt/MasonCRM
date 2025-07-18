class Config {

    public port = 3002
    public baseUrl = "http://localhost:3002/api"

    // Customer APIs
    public getAllCustomresUrl = "http://localhost:3002/api/customers/:userId"
    public getOneCustomerUrl = "http://localhost:3002/api/customer/:customerId"
    public addCustomerUrl = "http://localhost:3002/api/customer/:userId"
    public updateCustomerUrl = "http://localhost:3002/api/customer/:customerId"
    public deleteCustomerUrl = "http://localhost:3002/api/customer/:customerId"

    // Payment APIs
    public getPaymentsByCustomerId = "http://localhost:3002/api/customer/:customerId/payments"
    public addPaymentToCustomer = "http://localhost:3002/api/customer/:customerId/payment"

    // Expense APIs
    public addExpenseToCustomer = "http://localhost:3002/api/customer/:customerId/expense"

    // Balance & Reports APIs
    public fetchBalancePerMonth = "http://localhost:3002/api/customer/:userId/month-balance"
    public fetchBalancePerYear = "http://localhost:3002/api/customer/:userId/year-balance"

    // Document APIs
    public addDocumentToCustomer = "http://localhost:3002/api/customer/:customerId/upload"
    public getDocumentsByCustomerId = "http://localhost:3002/api/customer/:customerId/documents"
    public deleteDocumentUrl = "http://localhost:3002/api/customer/:customerId/document/:documentId"

    // Customer Follow APIs
    public addFollowedCust = "http://localhost:3002/api/addFollowedCust"
    public removeFollowedCust = "http://localhost:3002/api/removeFollowedCust"
    public getCustInFollow = "http://localhost:3002/api/getCustInFollow"

    // Authentication APIs
    public registerUrl = "http://localhost:3002/api/auth/register"
    public loginUrl = "http://localhost:3002/api/auth/login"
    public logoutUrl = "http://localhost:3002/api/auth/logout"
    public refreshTokenUrl = "http://localhost:3002/api/auth/refresh-token"

    // Supplier Management APIs
    public supplierDebtsUrl = `${this.baseUrl}/supplier-debts`
    public updateSupplierDebtUrl = `${this.baseUrl}/supplier-debts/:id`
    public deleteSupplierDebtUrl = `${this.baseUrl}/supplier-debts/:id`
    public markSupplierDebtAsPaidUrl = `${this.baseUrl}/supplier-debts/:id/mark-paid`
    
    // Suppliers APIs
    public suppliersUrl = `${this.baseUrl}/suppliers`
    public updateSupplierUrl = `${this.baseUrl}/suppliers/:id`
    public deleteSupplierUrl = `${this.baseUrl}/suppliers/:id`
    public searchSuppliersUrl = `${this.baseUrl}/suppliers/search`
    
    // Sticky Notes APIs
    public stickyNotesUrl = `${this.baseUrl}/sticky-notes`
    public createNewStickyNoteUrl = `${this.baseUrl}/sticky-notes/create-new`
    public updateStickyNoteUrl = `${this.baseUrl}/sticky-notes/:id`
    public updateStickyNoteContentUrl = `${this.baseUrl}/sticky-notes/:id/content`
    public updateStickyNotePositionUrl = `${this.baseUrl}/sticky-notes/:id/position`
    public updateStickyNoteSizeUrl = `${this.baseUrl}/sticky-notes/:id/size`
    public updateStickyNoteColorUrl = `${this.baseUrl}/sticky-notes/:id/color`
    public deleteStickyNoteUrl = `${this.baseUrl}/sticky-notes/:id`

    // Client Routes - for navigation
    public routes = {
        // Authentication
        login: '/auth/login',
        register: '/auth/register',
        logout: '/auth/logout',
        
        // Main areas
        dashboard: '/dashboard',
        customers: '/customers',
        suppliers: '/suppliers',
        reports: '/reports',
        notes: '/notes',
        
        // Customer specific
        customerNew: '/customers/new',
        customerView: (customerId: number) => `/customers/${customerId}`,
        customerEdit: (customerId: number) => `/customers/${customerId}/edit`,
        
        // Reports
        balanceReport: '/reports/balance'
    }
}

const appConfig = new Config() 

export default appConfig