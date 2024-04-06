import ExpenseResponse from "./ExpenseResponse";

class MultipleExpensesResponse {
  expenseCategories: ExpenseResponse[];
  totalRecords: number;

  constructor(data: {
    expenseCategories: ExpenseResponse[];
    totalRecords: number;
  }) {
    this.expenseCategories = data.expenseCategories;
    this.totalRecords = data.totalRecords;
  }
}

export default MultipleExpensesResponse;
