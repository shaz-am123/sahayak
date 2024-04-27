import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import ExpenseCategoryRequest from "../types/ExpenseCategoryRequest";
import MultipleExpenseCategoriesResponse from "../types/MultipleExpenseCategoriesResponse";
import { isAuthenticated } from "./auth";

const BACKEND_SERVICE_URL =
  process.env.BACKEND_SERVICE_URL || "http://localhost:8080";

export const getExpenseCategories =
  async (): Promise<MultipleExpenseCategoriesResponse> => {
    if (!isAuthenticated()) {
      alert("Not Authenticated");
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
      alert("Request failed");
      throw new Error("Request failed");
    }

    const data = await res.json();
    return data;
  };

export const addExpenseCategory = async (
  expenseCategoryRequest: ExpenseCategoryRequest,
  router: AppRouterInstance
): Promise<void> => {
  if (!isAuthenticated()) {
    alert("Not Authenticated");
    throw new Error("Not Authenticated");
  }

  const res = await fetch(`${BACKEND_SERVICE_URL}/categories/`, {
    method: "POST",
    body: JSON.stringify({ ...expenseCategoryRequest }),
    headers: {
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("token")!,
    },
  });

  if (!res.ok) {
    alert("Request failed");
    throw new Error("Request failed");
  }
  else{
    router.refresh;
  }
};
