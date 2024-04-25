import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import Expense from "../../app/expense/page";
import mockExpenses from "../__mocks__/mockExpenses";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("../../app/api/auth", () => ({
  isAuthenticated: jest.fn(() => Promise.resolve(true)),
}));

jest.mock("../../app/api/expense", () => ({
  getExpenses: jest.fn(() => Promise.resolve(mockExpenses)),
}));

describe("Expenses listing component", () => {
  beforeEach(() => {
    render(<Expense />);
  });
  it("renders expenses table", async () => {
    expect(screen.getByText("Loading")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("My Expenses")).toBeInTheDocument();
      expect(screen.getByTestId("expenses-table")).toBeInTheDocument();
      mockExpenses.expenses.map((expense): void => {
        expect(screen.getByText(expense.amount)).toBeInTheDocument();
        expect(
          screen.getByText(expense.expenseCategory.name)
        ).toBeInTheDocument();
        expect(screen.getByText(expense.description)).toBeInTheDocument();

        const date = new Date(expense.date).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "2-digit",
        });

        expect(screen.getByText(date)).toBeInTheDocument();
      });
    });
  });
});
