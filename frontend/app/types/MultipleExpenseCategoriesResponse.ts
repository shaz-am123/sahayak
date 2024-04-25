import ExpenseCategoryResponse from "./ExpenseCategoryResponse";

export default interface MultipleExpenseCategoriesResponse {
  expenses: ExpenseCategoryResponse[];
  totalRecords: number;
}
