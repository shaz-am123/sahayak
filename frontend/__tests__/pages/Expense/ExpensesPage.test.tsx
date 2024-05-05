import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import Expense from "../../../app/expense/page";
import mockExpenses from "../../../__mocks__/mockExpenses";
import mockRouter from "next-router-mock";
import mockExpenseCategories from "../../../__mocks__/mockExpenseCategories";

jest.mock("next/navigation", () => require("next-router-mock"));

jest.mock("../../../app/api/auth", () => ({
  isAuthenticated: jest.fn(() => Promise.resolve(true)),
}));

jest.mock("../../../app/api/expense", () => ({
  getExpenses: jest.fn(() => Promise.resolve(mockExpenses)),
}));

jest.mock("../../../app/api/expenseCategory", () => ({
  getExpenseCategories: jest.fn(() => Promise.resolve(mockExpenseCategories)),
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
          screen.getByText(expense.expenseCategory.name),
        ).toBeInTheDocument();
        expect(screen.getByText(expense.description)).toBeInTheDocument();

        const date = new Date(expense.date).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "2-digit",
        });

        expect(screen.getByText(date)).toBeInTheDocument();

        expect(screen.getByTestId("total-row")).toBeInTheDocument();
      });
    });
  });

  it("renders filters", async () => {
    expect(screen.getByText("Loading")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByTestId("expense-filters")).toBeInTheDocument();
      expect(screen.getByTestId("date-range-picker")).toBeInTheDocument();
      expect(screen.getByTestId("filter-button")).toBeInTheDocument();
    });
  });

  it("should open overlay panel when the filter button is clicked", async () => {
    expect(screen.getByText("Loading")).toBeInTheDocument();

    await waitFor(() => {
      const filterButton = screen.getByTestId("filter-button");
      fireEvent.click(filterButton);
      const filterPanel = screen.getByTestId("filter-panel");
      expect(filterPanel).toBeInTheDocument();
    });
  });

  it("should display filterchips filters are checked", async () => {
    expect(screen.getByText("Loading")).toBeInTheDocument();

    await waitFor(() => {
      const filterButton = screen.getByTestId("filter-button");
      fireEvent.click(filterButton);
      const filterPanel = screen.getByTestId("filter-panel");
      expect(filterPanel).toBeInTheDocument();
      const filterOption = screen.getByLabelText("Food");
      expect(filterOption).toBeInTheDocument();
      expect(screen.queryByTestId("filter-chip")).not.toBeInTheDocument();
      fireEvent.click(filterOption);
      expect(screen.queryByTestId("filter-chip")).toBeInTheDocument();
    });
  });

  it("should have an add button which navigates to add expense page", async () => {
    const pushMock = jest.fn();
    mockRouter.push = pushMock;
    expect(screen.getByText("Loading")).toBeInTheDocument();
    await waitFor(() => {
      const addButton = screen.getByTestId("add-button");
      expect(addButton).toBeInTheDocument();
      fireEvent.click(addButton);
      expect(pushMock).toHaveBeenCalledWith("/expense/addExpense");
    });
  });
});
