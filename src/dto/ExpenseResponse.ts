import Currency from "../enums/Currency";

class ExpenseRequest {
  id: string;
  amount: number;
  currency: Currency;
  expenseCategoryId: string;
  description: string;
  date: Date;

  constructor(data: {
    id: string;
    amount: number;
    expenseCategoryId: string;
    description: string;
    date: Date;
    currency: Currency;
  }) {
    this.id = data.id;
    this.amount = data.amount;
    this.currency = data.currency;
    this.expenseCategoryId = data.expenseCategoryId;
    this.description = data.description;
    this.date = data.date;
  }
}

export default ExpenseRequest;
