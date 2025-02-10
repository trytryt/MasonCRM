export interface CustomerData {
    customer: {
    customerId: number | null; // Null אם זה לקוח חדש לפני שמירתו
     name: string;
     adress: string;
     phoneNumber: string;
     customerStatus: number;
    };
    expenses: {
        chomarimId: number;
        customerId: number;
        expenseTypeId: number;
        chomarimCategory: string;
        amount: number;
        updateDate: string;
    }[];
    payments: {
        paymentId: number;
        customerId: number;
        userId: number;
        amount: number;
        paymentDate: string;
        isPaid: boolean;
    }[];
    documents: {
        documentId: number;
        customerId: number;
        documentName: string;
        filePath: string;
        uploadDate: string;
    }[];
}
