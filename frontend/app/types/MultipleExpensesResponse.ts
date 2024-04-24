import ExpenseResponse from "./ExpenseResponse";

export default interface MultipleExpensesResponse{
    expenses: ExpenseResponse[];
    totalRecords: number;
}