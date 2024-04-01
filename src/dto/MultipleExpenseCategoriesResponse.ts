import ExpenseCategoryResponse from "./ExpenseCategoryResponse";

class MultipleExpenseCategories {
  expenseCategory: ExpenseCategoryResponse;
  totalRecords: number;

  constructor(data: {
    expenseCategory: ExpenseCategoryResponse;
    totalRecords: number;
  }) {
    this.expenseCategory = data.expenseCategory;
    this.totalRecords = data.totalRecords;
  }
}

export default MultipleExpenseCategories;
