export interface ExpenseQueryParams{
    startDate: Date | null,
    endDate: Date | null,
    expenseCategories: string[] | null
}