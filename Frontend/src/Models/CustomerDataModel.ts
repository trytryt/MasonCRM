export interface CustomerData {
    customer: {
    customerId: number | null; // Null אם זה לקוח חדש לפני שמירתו
     name: string;
     adress: string;
     phoneNumber: string;
     status: number;
    };
    expenses: {
        chomarimId: number;
        customerId: number;
        expenseTypeId: number;
        chomarimCategory: string;
        amount: number;
    }[];
    payments: {
        paymentId: number;
        customerId: number;
        userId: number;
        amount: number;
        paymentDate: string;
        isPaid: boolean;
    }[];
}
