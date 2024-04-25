import ExpenseCategoryResponse from "./ExpenseCategoryResponse";

export default interface ExpenseResponse {
  id: string;
  amount: number;
  userId: string;
  expenseCategory: ExpenseCategoryResponse;
  description: string;
  date: Date;
}
