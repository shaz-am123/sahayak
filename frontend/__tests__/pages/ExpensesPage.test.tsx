import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import Expense from "../../app/expense/page";

const mockExpenses = {
  expenses: [
    {
      amount: 160,
      expenseCategory: { name: "Food" },
      date: "2022-04-24T00:00:00.000Z",
      description: "Lunch",
    },
    {
      amount: 1800,
      expenseCategory: { name: "Travel" },
      date: "2022-04-25T00:00:00.000Z",
      description: "Hotel Booking",
    },
  ],
  totalRecords: 2,
};

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("../../app/api/expense", () => ({
  getExpenses: jest.fn(() => Promise.resolve(mockExpenses)),
}));

jest.mock("../../app/api/auth", () => ({
  isAuthenticated: jest.fn(() => Promise.resolve(true)),
}));

describe("Expenses listing component", () => {
  it("renders expenses table", async () => {
    render(<Expense />);

    expect(screen.getByText("Loading")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("My Expenses")).toBeInTheDocument();
      expect(screen.getByTestId("expenses-table")).toBeInTheDocument();
      mockExpenses.expenses.map((expense): void => {
        expect(screen.getByText(expense.amount)).toBeInTheDocument();
        expect(
          screen.getByText(expense.expenseCategory.name),
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
