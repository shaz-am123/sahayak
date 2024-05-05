import { ExpenseQueryParams } from "../types/ExpenseQueryParams";

export function objectToQueryString(obj: { [key: string]: any }) {
  return Object.keys(obj)
    .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`)
    .join("&");
}

export const serializeExpenseQueryParams = (params: ExpenseQueryParams) => {
  const { startDate, endDate, expenseCategories } = params;
  const serializedParams = {
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
    expenseCategories: expenseCategories.join(","),
  };

  return objectToQueryString(serializedParams);
};
