import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import AddExpense from "../../../app/expense/addExpense/page";
import { getExpenseCategories } from "../../../app/api/expenseCategory";
import mockExpenseCategories from "../../../__mocks__/mockExpenseCategories";

jest.mock("next/navigation", () => require("next-router-mock"));
jest.mock("../../../app/api/auth", () => ({
  isAuthenticated: jest.fn(() => Promise.resolve(true)),
}));

jest.mock("../../../app/api/expenseCategory", () => ({
  getExpenseCategories: jest.fn(() => Promise.resolve(mockExpenseCategories)),
}));

describe("AddExpense component", () => {
  beforeEach(() => {
    render(<AddExpense />);
  });

  it("renders ExpenseForm", async () => {
    expect(screen.getByTestId("add-expense-form")).toBeInTheDocument();
  });
});
