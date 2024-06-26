import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import Expense from "../../../app/expense/page";
import mockExpenses from "../../../__mocks__/mockExpenses";
import mockRouter from "next-router-mock";
import mockExpenseCategories from "../../../__mocks__/mockExpenseCategories";
import { deleteExpense, updateExpense } from "../../../app/api/expense";

jest.mock("next/navigation", () => require("next-router-mock"));

jest.mock("../../../app/api/auth", () => ({
  isAuthenticated: jest.fn(() => Promise.resolve(true)),
}));

jest.mock("../../../app/api/expense", () => ({
  getExpenses: jest.fn(() => Promise.resolve(mockExpenses)),
  updateExpense: jest.fn(() =>
    Promise.resolve({ success: true, message: "Update successful" }),
  ),
  deleteExpense: jest.fn(() =>
    Promise.resolve({ success: true, message: "Delete successful" }),
  ),
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

  it("each row should have a edit button and clicking on it should open the table-row in editable mode", async () => {
    const { container } = render(<Expense />);

    await waitFor(() => {
      const rowEditbuttons =
        container.getElementsByClassName("p-row-editor-init");
      expect(rowEditbuttons[0]).toBeInTheDocument();
      expect(rowEditbuttons.length).toEqual(mockExpenses.totalRecords);

      expect(screen.queryByTestId("desc-editor")).not.toBeInTheDocument();
      expect(screen.queryByTestId("amount-editor")).not.toBeInTheDocument();
      expect(screen.queryByTestId("date-editor")).not.toBeInTheDocument();

      fireEvent.click(rowEditbuttons[0]);
      expect(screen.queryByTestId("desc-editor")).toBeInTheDocument();
      expect(screen.queryByTestId("amount-editor")).toBeInTheDocument();
      expect(screen.queryByTestId("date-editor")).toBeInTheDocument();
    });
  });

  it("should be able to update an expense", async () => {
    const { container } = render(<Expense />);

    await waitFor(() => {
      const rowEditbuttons =
        container.getElementsByClassName("p-row-editor-init");

      fireEvent.click(rowEditbuttons[0]);
      const amountEditor = screen.getByTestId("amount-editor");
      fireEvent.change(amountEditor, {
        target: { value: "190" },
      });
      const saveButton = container.getElementsByClassName(
        "p-row-editor-save p-link",
      )[0];
      expect(saveButton).toBeInTheDocument();
      fireEvent.click(saveButton);
      expect(updateExpense).toHaveBeenCalled();
    });
  });

  it("each row should have a trash(delete) button", async () => {
    await waitFor(() => {
      const deleteButtons = screen.getAllByTestId("delete-expense-button");
      expect(deleteButtons[0]).toBeInTheDocument();
      expect(deleteButtons.length).toEqual(mockExpenses.totalRecords);
      fireEvent.click(deleteButtons[0]);
      expect(
        screen.getByText(
          "Are you sure you want to proceed with deleting the expense?",
        ),
      ).toBeInTheDocument();
    });
  });

  it("should be able to delete an expense", async () => {
    await waitFor(() => {
      const deleteButtons = screen.getAllByTestId("delete-expense-button");

      fireEvent.click(deleteButtons[0]);
      fireEvent.click(screen.getByText("Yes"));
      expect(deleteExpense).toHaveBeenCalled();
    });
  });
});
