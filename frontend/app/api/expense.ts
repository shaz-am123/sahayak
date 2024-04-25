import MultipleExpensesResponse from "../types/MultipleExpensesResponse";
import { isAuthenticated } from "./auth";

const BACKEND_SERVICE_URL =
  process.env.BACKEND_SERVICE_URL || "http://localhost:8080";

export const getExpenses = async (): Promise<MultipleExpensesResponse> => {
  if (!isAuthenticated()) {
    alert("Not Authenticated");
    throw new Error("Not Authenticated");
  }

  const res = await fetch(`${BACKEND_SERVICE_URL}/expenses`, {
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
