import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import ExpenseCategoryRequest from "../types/ExpenseCategoryRequest";
import MultipleExpenseCategoriesResponse from "../types/MultipleExpenseCategoriesResponse";
import { isAuthenticated } from "./auth";
import { capitalize } from "../utils/formatter";
import ApiResponse from "../types/ApiResponse";

const BACKEND_SERVICE_URL = process.env.BACKEND_SERVICE_URL;

export const getExpenseCategories =
  async (): Promise<MultipleExpenseCategoriesResponse> => {
    if (!isAuthenticated()) {
      throw new Error("Not Authenticated");
    }

    const res = await fetch(`${BACKEND_SERVICE_URL}/categories/`, {
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

export const addExpenseCategory = async (
  expenseCategoryRequest: ExpenseCategoryRequest,
  router: AppRouterInstance,
): Promise<ApiResponse | void> => {
  if (!isAuthenticated()) {
    throw new Error("Not Authenticated");
  }

  const res = await fetch(`${BACKEND_SERVICE_URL}/categories/`, {
    method: "POST",
    body: JSON.stringify({
      ...expenseCategoryRequest,
      name: capitalize(expenseCategoryRequest.name),
    }),
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
  router.push("/expenseCategory");
  return {
    success: true,
    message: "Categpory added successfully",
  };
};

export const isUniqueCategory = async (
  categoryName: string,
): Promise<{ isUnique: boolean }> => {
  if (!isAuthenticated()) {
    throw new Error("Not Authenticated");
  }

  const res = await fetch(
    `${BACKEND_SERVICE_URL}/categories/check-category?categoryName=${capitalize(categoryName)}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("token")!,
      },
    },
  );

  if (!res.ok) {
    throw new Error("Server error");
  }

  return await res.json();
};
