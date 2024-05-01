import React from "react";
import "@testing-library/jest-dom";
import {
  render,
  screen,
  fireEvent,
  act,
  waitFor,
} from "@testing-library/react";
import ExpenseForm from "../../app/component/ExpenseForm";
import mockExpenseCategories from "../../__mocks__/mockExpenseCategories";

jest.mock("../../app/api/expense", () => ({
  addExpense: jest.fn(),
}));

jest.mock("../../app/api/expenseCategory", () => ({
  getExpenseCategories: jest.fn(() => Promise.resolve(mockExpenseCategories)),
}));

jest.mock("next/navigation", () => require("next-router-mock"));

describe("ExpenseForm component", () => {
  beforeEach(() => {
    render(<ExpenseForm />);
  });

  test("renders correctly", () => {
    const expenseForm = screen.getByTestId("expense-form");
    expect(expenseForm).toBeInTheDocument();

    const heading = screen.getByTestId("heading");
    expect(heading).toBeInTheDocument();
    expect(heading.innerHTML).toEqual("Add Expense");
  });

  test("should have all the input fields and add button", () => {
    expect(screen.getByLabelText("Amount")).toBeInTheDocument();
    expect(screen.getByTestId("expenseCategory")).toBeInTheDocument();
    expect(screen.getByLabelText("Amount")).toBeInTheDocument();
    expect(screen.getByTestId("date")).toBeInTheDocument();

    const addButton = screen.getByLabelText("Add");
    expect(addButton).toBeInTheDocument();
  });

  test("should show missing field messages when required", async () => {
    const addButton = screen.getByLabelText("Add");
    const amountField = screen.getByLabelText("Amount");
    const categoryField = screen.getByTestId("expenseCategory");
    const descriptionField = screen.getByLabelText("Description");
    const dateField = screen.getByTestId("date");

    expect(amountField).toBeInTheDocument();
    expect(categoryField).toBeInTheDocument();
    expect(descriptionField).toBeInTheDocument();
    expect(dateField).toBeInTheDocument();

    expect(addButton).toBeInTheDocument();

    act(() => {
      fireEvent.change(amountField, { target: { value: "" } });
      fireEvent.change(descriptionField, {
        target: { value: "Flight Tickets" },
      });
      fireEvent.click(addButton);
    });

    await waitFor(() => {
      expect(screen.getByText("Amount is required")).toBeInTheDocument();
      expect(
        screen.getByText("Expense category is required"),
      ).toBeInTheDocument();
    });
  });
});
