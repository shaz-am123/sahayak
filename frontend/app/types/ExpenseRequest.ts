export default interface ExpenseRequest {
  amount: number;
  expenseCategoryId: string ;
  description: string;
  date: Date;
}
