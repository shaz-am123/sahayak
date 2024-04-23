import React from "react";
import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Navbar from "../../app/component/Navbar";
import { useRouter } from "next/navigation";
import { handleLogout } from "../../app/api/auth/AuthService";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("../../app/api/auth/AuthService", () => ({
  handleLogout: jest.fn(),
}));

describe("Navbar component", () => {
  beforeEach(() => {
    render(<Navbar />);
  });
  test("renders correctly", () => {
    const navbar = screen.getByTestId("navbar");
    expect(navbar).toBeInTheDocument();

    const logo = screen.getByAltText("logo");
    expect(logo).toBeInTheDocument();
  });

  test("should have all the navigation items and a logout button", () => {
    screen.getByText("Home");
    screen.getByText("Expenses");
    screen.getByText("Expense Categories");
    screen.getByText("Reports");
    screen.getByText("Logout");
  });

  test("should navigate to the corresponding page when a navLink is clicked", async () => {
    const homeLink = screen.getByText("Home");
    const expensesLink = screen.getByText("Expenses");
    const expenseCategoriesLink = screen.getByText("Expense Categories");
    const dashboardLink = screen.getByText("Reports");

    expect(homeLink).toHaveAttribute("href", "/home");
    expect(expensesLink).toHaveAttribute("href", "/expense");
    expect(expenseCategoriesLink).toHaveAttribute("href", "/expenseCategory");
    expect(dashboardLink).toHaveAttribute("href", "/dashboard");
  });

  test("should call handleLogout function when logout button is clicked", () => {
    const logoutButton = screen.getByTestId("logoutButton");
    fireEvent.click(logoutButton);
    expect(handleLogout).toHaveBeenCalled();
  });
});
