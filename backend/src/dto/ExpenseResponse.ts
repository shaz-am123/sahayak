import ExpenseCategoryResponse from "./ExpenseCategoryResponse";

class ExpenseResponse {
  id: string;
  userId: string;
  amount: number;
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
  }) {
    this.id = data.id;
    this.userId = data.userId;
    this.amount = data.amount;
    this.expenseCategory = data.expenseCategory;
    this.description = data.description;
    this.date = data.date;
  }
}

export default ExpenseResponse;
