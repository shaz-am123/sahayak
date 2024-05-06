import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import ExpenseCategory from "../../../app/expenseCategory/page";
import mockRouter from "next-router-mock";
import mockExpenseCategories from "../../../__mocks__/mockExpenseCategories";
import mockExpenses from "../../../__mocks__/mockExpenses";

jest.mock("next/navigation", () => require("next-router-mock"));

jest.mock("../../../app/api/auth", () => ({
  isAuthenticated: jest.fn(() => Promise.resolve(true)),
}));

jest.mock("../../../app/api/expenseCategory", () => ({
  getExpenseCategories: jest.fn(() => Promise.resolve(mockExpenseCategories)),
}));

jest.mock("../../../app/api/expense", () => ({
  getExpenses: jest.fn(() => Promise.resolve(mockExpenses)),
}));

const mockCategoryIdToExpenseMap = {
  "1": 160,
  "2": 1800,
  "3": 0,
};

describe("Expenses listing component", () => {
  beforeEach(() => {
    render(<ExpenseCategory />);
  });
  it("renders expense-categories", async () => {
    expect(screen.getByText("Loading")).toBeInTheDocument();

    await waitFor(() => {
      expect(
        screen.getByText(
          `Expense Categories (${mockExpenseCategories.totalRecords})`,
        ),
      ).toBeInTheDocument();
      const expenseCategoryCards = screen.getAllByTestId(
        "expense-category-card",
      );
      expect(expenseCategoryCards.length).toEqual(3);
      mockExpenseCategories.expenseCategories.map((expenseCategory): void => {
        expect(screen.getByText(expenseCategory.name)).toBeInTheDocument();
        expect(
          screen.getByText(`Expense count: ${expenseCategory.expenseCount}`),
        ).toBeInTheDocument();
        expect(
          screen.getByText(
            `Total Expenses: ₹${mockCategoryIdToExpenseMap[expenseCategory.id]}`,
          ),
        ).toBeInTheDocument();
        expect(
          screen.getByText(expenseCategory.description),
        ).toBeInTheDocument();
      });
    });
  });

  it("should have a add button which navigates to add expense-category page", async () => {
    const pushMock = jest.fn();
    mockRouter.push = pushMock;
    expect(screen.getByText("Loading")).toBeInTheDocument();
    await waitFor(() => {
      const addButton = screen.getByTestId("add-button");
      expect(addButton).toBeInTheDocument();
      fireEvent.click(addButton);
      expect(pushMock).toHaveBeenCalledWith("/expenseCategory/addCategory");
    });
  });

  it("should render date-range-picker", async () => {
    expect(screen.getByText("Loading")).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByTestId("date-range-picker")).toBeInTheDocument();
    });
  });
});
