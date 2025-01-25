class CustomersModel {
    public customerId: number | null; // Null אם זה לקוח חדש לפני שמירתו
    public name: string;
    public adress: string;
    public phoneNumber: string; // עדיף String כי מספרי טלפון לא מחושבים
    public customerStatus: number;

    public constructor(customer: Partial<CustomersModel>) {
        this.customerId = customer.customerId || null; // Null אם לא מסופק
        this.name = customer.name || "";
        this.adress = customer.adress || "";
        this.phoneNumber = customer.phoneNumber || "";
        this.customerStatus = customer.customerStatus || 1;
    }
}

export default CustomersModel;
