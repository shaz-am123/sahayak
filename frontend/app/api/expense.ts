import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import ExpenseRequest from "../types/ExpenseRequest";
import MultipleExpensesResponse from "../types/MultipleExpensesResponse";
import { isAuthenticated } from "./auth";
import ApiResponse from "../types/ApiResponse";
import { ExpenseQueryParams } from "../types/ExpenseQueryParams";
import { serializeExpenseQueryParams } from "../utils/expenseQueryConstructors";

const BACKEND_SERVICE_URL =
  process.env.BACKEND_SERVICE_URL || "http://localhost:8080";

export const getExpenses = async (
  expenseQueryParams: ExpenseQueryParams,
): Promise<MultipleExpensesResponse> => {
  if (!isAuthenticated()) {
    throw new Error("Not Authenticated");
  }
  const queryString = serializeExpenseQueryParams(expenseQueryParams);
  const res = await fetch(`${BACKEND_SERVICE_URL}/expenses?${queryString}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("token")!,
    },
  });

  if (!res.ok) {
    throw new Error("Request failed");
  }

  const data = await res.json();
  return data;
};

export const addExpense = async (
  expenseRequest: ExpenseRequest,
  router: AppRouterInstance,
): Promise<ApiResponse | void> => {
  if (!isAuthenticated()) {
    throw new Error("Not Authenticated");
  }

  const res = await fetch(`${BACKEND_SERVICE_URL}/expenses`, {
    method: "POST",
    body: JSON.stringify({ ...expenseRequest }),
    headers: {
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("token")!,
    },
  });

  if (!res.ok) {
    const errorResponse = await res.json();
    return {
      success: false,
      message: errorResponse.error,
    };
  }
  router.push("/expense");
  return {
    success: true,
    message: "Expense added successfully",
  };
};

export const updateExpense = async (
  expenseId: string,
  updateExpense: Partial<ExpenseRequest>,
): Promise<ApiResponse> => {
  if (!isAuthenticated()) {
    throw new Error("Not Authenticated");
  }

  const res = await fetch(`${BACKEND_SERVICE_URL}/expenses/${expenseId}`, {
    method: "PUT",
    body: JSON.stringify({ ...updateExpense }),
    headers: {
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("token")!,
    },
  });

  if (!res.ok) {
    const errorResponse = await res.json();
    return {
      success: false,
      message: errorResponse.error,
    };
  }
  return {
    success: true,
    message: "Expense updated successfully",
  };
};

export const deleteExpense = async (
  expenseId: string,
): Promise<ApiResponse> => {
  if (!isAuthenticated()) {
    throw new Error("Not Authenticated");
  }

  const res = await fetch(`${BACKEND_SERVICE_URL}/expenses/${expenseId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("token")!,
    },
  });

  if (!res.ok) {
    const errorResponse = await res.json();
    return {
      success: false,
      message: errorResponse.error,
    };
  }
  return {
    success: true,
    message: "Expense deleted successfully",
  };
};
