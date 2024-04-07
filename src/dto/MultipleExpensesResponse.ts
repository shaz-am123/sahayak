import ExpenseResponse from "./ExpenseResponse";

class MultipleExpensesResponse {
  expenses: ExpenseResponse[];
  totalRecords: number;

  constructor(data: {
    expenses: ExpenseResponse[];
    totalRecords: number;
  }) {
    this.expenses = data.expenses;
    this.totalRecords = data.totalRecords;
  }
}

export default MultipleExpensesResponse;
