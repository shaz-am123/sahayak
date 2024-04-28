import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import AddCategory from "../../../app/expenseCategory/addCategory/page";

jest.mock("next/navigation", () => require("next-router-mock"));
jest.mock("../../../app/api/auth", () => ({
  isAuthenticated: jest.fn(() => Promise.resolve(true)),
}));

describe("AddCategory component", () => {
  beforeEach(() => {
    render(<AddCategory />);
  });

  it("renders ExpenseCategoryForm", async () => {
    expect(screen.getByTestId("add-expenseCategory-form")).toBeInTheDocument();
  });
});
