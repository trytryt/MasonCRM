class PaymentModel {
    public paymentId: number | null; // Null אם זה תשלום חדש לפני שמירתו
    public customerId: number;
    public userId: number;
    public amount: number;
    public paymentDate: Date; // או string אם התאריך מגיע בפורמט אחר
    public isPaid: boolean;

    public constructor(payment: Partial<PaymentModel>) {
        this.paymentId = payment.paymentId || null; // Null אם לא מסופק
        this.customerId = payment.customerId!;
        this.userId = payment.userId!;
        this.amount = payment.amount || 0;
        this.paymentDate = payment.paymentDate ? new Date(payment.paymentDate) : new Date();
        this.isPaid = payment.isPaid || false;
    }
}

export default PaymentModel;
