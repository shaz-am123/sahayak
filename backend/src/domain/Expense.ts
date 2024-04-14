import Currency from "../enums/Currency";

class Expense {
  id: string | null;
  userId: string;
  amount: number;
  currency: Currency;
  expenseCategoryId: string;
  description: string;
  date: Date;

  constructor(data: {
    id: string | null;
    userId: string;
    amount: number;
    currency: Currency;
    expenseCategoryId: string;
    description: string;
    date: Date;
  }) {
    this.id = data.id;
    this.userId = data.userId;
    this.amount = data.amount;
    this.currency = data.currency;
    this.expenseCategoryId = data.expenseCategoryId;
    this.description = data.description;
    this.date = data.date;
  }
}

export default Expense;
