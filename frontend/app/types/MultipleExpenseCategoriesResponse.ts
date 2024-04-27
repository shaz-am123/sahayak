import ExpenseCategoryResponse from "./ExpenseCategoryResponse";

export default interface MultipleExpenseCategoriesResponse {
  expenseCategories: ExpenseCategoryResponse[];
  totalRecords: number;
}
