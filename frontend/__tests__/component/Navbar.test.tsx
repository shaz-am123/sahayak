import React from "react";
import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import Navbar from "../../app/component/Navbar";
import { useRouter } from "next/navigation";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

describe("Navbar component", () => {
  test("renders correctly", () => {
    render(<Navbar />);
    const navbar = screen.getByTestId("navbar");
    expect(navbar).toBeInTheDocument();

    const logo = screen.getByAltText("logo");
    expect(logo).toBeInTheDocument();
  });

  test("should have all the navigation items and a logout button", () => {
    render(<Navbar />);

    screen.getByText("Home");
    screen.getByText("Expenses");
    screen.getByText("Expense Categories");
    screen.getByText("Reports");
    screen.getByText("Logout");
  });
});
