// הגדרת enum עבור סוגי החומר
enum ChomerimCategory {
    ChomerShachor = "חומר שחור",
    ChomerLavan = "חומר לבן",
    KablanMishneh = "קבלן משנה",
    Sapak = "ספק"
}

class ExpenseModel {
    chomarimId: number;
    customerId: number;
    expenseTypeId: number;
    chomarimCategory: ChomerimCategory; // סוג הוצאה מתוך ה-ENUM
    amount: number;

    constructor(
        chomarimId: number, 
        customerId: number, 
        expenseTypeId: number, 
        chomarimCategory: ChomerimCategory, 
        amount: number
    ) {
        this.chomarimId = chomarimId;
        this.customerId = customerId;
        this.expenseTypeId = expenseTypeId;
        this.chomarimCategory = chomarimCategory;
        this.amount = amount;
    }
}

export default ExpenseModel;
