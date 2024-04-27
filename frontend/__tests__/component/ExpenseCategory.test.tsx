import React from "react";
import "@testing-library/jest-dom";
import {
  render,
  screen,
  fireEvent,
  act,
  waitFor,
} from "@testing-library/react";
import { addExpenseCategory } from "../../app/api/expenseCategory";
import ExpenseCategoryForm from "../../app/component/ExpenseCategoryForm";

jest.mock("../../app/api/expenseCategory", () => ({
  addExpenseCategory: jest.fn(),
}));

jest.mock("next/navigation", () => require("next-router-mock"));

describe("ExpenseCategoryForm component", () => {
  beforeEach(() => {
    render(<ExpenseCategoryForm />);
  });
  test("renders correctly", () => {
    const expenseCategoryForm = screen.getByTestId("expense-fategory-form");
    expect(expenseCategoryForm).toBeInTheDocument();

    const heading = screen.getByTestId("heading");
    expect(heading).toBeInTheDocument();
    expect(heading.innerHTML).toEqual("Add Expense-Category");
  });

  test("should have all the input fields and login button", () => {
    expect(screen.getByLabelText("Expense-category name")).toBeInTheDocument();
    expect(screen.getByLabelText("Description")).toBeInTheDocument();

    const addButton = screen.getByLabelText("Add");
    expect(addButton).toBeInTheDocument();
  });

  test("should call addExpenseCategory when add button is clicked", async () => {
    const addButton = screen.getByLabelText("Add");
    const categoryNameField = screen.getByLabelText("Expense-category name");
    const descriptionField = screen.getByLabelText("Description");
    expect(categoryNameField).toBeInTheDocument();
    expect(descriptionField).toBeInTheDocument();
    expect(addButton).toBeInTheDocument();

    act(() => {
      fireEvent.change(categoryNameField, { target: { value: "Travel" } });
      fireEvent.change(descriptionField, {
        target: { value: "Travelling and vacation related expenses" },
      });
      fireEvent.click(addButton);
    });

    await waitFor(() => {
      expect(addExpenseCategory).toHaveBeenCalled();
    });
  });

  test("should show missing field messages when required", async () => {
    const categoryField = screen.getByLabelText("Expense-category name");
    const addButton = screen.getByLabelText("Add");

    expect(categoryField).toBeInTheDocument();
    expect(addButton).toBeInTheDocument();

    act(() => {
      fireEvent.change(categoryField, { target: { value: "" } });
      fireEvent.click(addButton);
    });

    await waitFor(() => {
      expect(screen.getByText("Category name is required")).toBeInTheDocument();
    });
  });
});
