class ExpenseModel {
    chomarimId: number;
    customerId: number;
    expenseTypeId: number;
    chomarimCategory: string; // שינוי מ-enum לstring כדי לאפשר טקסט חופשי
    amount: number;
    updateDate: string;

    constructor(expense: Partial<ExpenseModel>) {
        this.chomarimId = expense.chomarimId || 0;
        this.customerId = expense.customerId || 0;
        this.expenseTypeId = expense.expenseTypeId || 1; // ערך ברירת מחדל
        this.chomarimCategory = expense.chomarimCategory || '';
        this.amount = expense.amount || 0;
        this.updateDate = expense.updateDate || new Date().toISOString().split('T')[0];
    }
}

export default ExpenseModel;