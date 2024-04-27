import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import ExpenseCategory from "../../../app/expenseCategory/page";
import mockRouter from "next-router-mock";
import mockExpenseCategories from "../../../__mocks__/mockExpenseCategories";

jest.mock("next/navigation", () => require("next-router-mock"));

jest.mock("../../../app/api/auth", () => ({
  isAuthenticated: jest.fn(() => Promise.resolve(true)),
}));

jest.mock("../../../app/api/expenseCategory", () => ({
  getExpenseCategories: jest.fn(() => Promise.resolve(mockExpenseCategories)),
}));

describe("Expenses listing component", () => {
  beforeEach(() => {
    render(<ExpenseCategory />);
  });
  it("renders expense-categories", async () => {
    expect(screen.getByText("Loading")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("My Expense Categories")).toBeInTheDocument();
      const expenseCategoryCards = screen.getAllByTestId(
        "expense-category-card",
      );
      expect(expenseCategoryCards.length).toEqual(3);
      mockExpenseCategories.expenseCategories.map((expenseCategory): void => {
        expect(screen.getByText(expenseCategory.name)).toBeInTheDocument();
        expect(
          screen.getByText(`Expenses: ${expenseCategory.expenseCount}`),
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
});
