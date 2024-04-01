import ExpenseCategoryResponse from "./ExpenseCategoryResponse";

class MultipleExpenseCategoriesResponse {
  expenseCategories: ExpenseCategoryResponse[];
  totalRecords: number;

  constructor(data: {
    expenseCategories: ExpenseCategoryResponse[];
    totalRecords: number;
  }) {
    this.expenseCategories = data.expenseCategories;
    this.totalRecords = data.totalRecords;
  }
}

export default MultipleExpenseCategoriesResponse;
