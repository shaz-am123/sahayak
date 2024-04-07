import Currency from "../enums/Currency";
import ExpenseCategoryResponse from "./ExpenseCategoryResponse";

class ExpenseResponse {
  id: string;
  userId: string;
  amount: number;
  currency: Currency;
  expenseCategory: ExpenseCategoryResponse;
  description: string;
  date: Date;

  constructor(data: {
    id: string;
    userId: string;
    amount: number;
    expenseCategory: ExpenseCategoryResponse;
    description: string;
    date: Date;
    currency: Currency;
  }) {
    this.id = data.id;
    this.userId = data.userId;
    this.amount = data.amount;
    this.currency = data.currency;
    this.expenseCategory = data.expenseCategory;
    this.description = data.description;
    this.date = data.date;
  }
}

export default ExpenseResponse;
