class PaymentModel {
    paymentId: number;
    customerId: number;
    userId: number;
    amount: number;
    paymentDate: Date;
    isPaid: boolean;

    constructor(paymentId: number, customerId: number,userId: number, amount: number, paymentDate: Date, isPaid: boolean) {
        this.paymentId = paymentId;
        this.customerId = customerId;
        this.userId = userId;
        this.amount = amount;
        this.paymentDate = paymentDate;
        this.isPaid = isPaid;
    }
}

export default PaymentModel