import React from "react";
import "@testing-library/jest-dom";
import {
  render,
  screen,
  fireEvent,
  act,
  waitFor,
} from "@testing-library/react";
import LoginForm from "../../app/component/LoginForm";
import { handleLogin } from "../../app/api/auth";

jest.mock("../../app/api/auth", () => ({
  handleLogin: jest.fn(),
}));

jest.mock("next/navigation", () => require("next-router-mock"));

describe("LoginForm component", () => {
  beforeEach(() => {
    render(<LoginForm />);
  });
  test("renders correctly", () => {
    const loginForm = screen.getByTestId("loginForm");
    expect(loginForm).toBeInTheDocument();

    const heading = screen.getByTestId("heading");
    expect(heading).toBeInTheDocument();
    expect(heading.innerHTML).toEqual("Login");
  });

  test("should have all the input fields and login button", () => {
    expect(screen.getByLabelText("Username")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();

    const loginButton = screen.getByLabelText("Login");
    expect(loginButton).toBeInTheDocument();
  });

  test("should call handleLogin when login button is clicked", async () => {
    const loginButton = screen.getByLabelText("Login");
    const usernameField = screen.getByLabelText("Username");
    const passwordField = screen.getByLabelText("Password");
    expect(usernameField).toBeInTheDocument();
    expect(passwordField).toBeInTheDocument();
    expect(loginButton).toBeInTheDocument();

    act(() => {
      fireEvent.change(usernameField, { target: { value: "ram123" } });
      fireEvent.change(passwordField, { target: { value: "myPass123" } });
      fireEvent.click(loginButton);
    });

    await waitFor(() => {
      expect(handleLogin).toHaveBeenCalled();
    });
  });

  test("should show missing field messages when required", async () => {
    const usernameField = screen.getByLabelText("Username");
    const passwordField = screen.getByLabelText("Password");
    const loginButton = screen.getByLabelText("Login");

    expect(usernameField).toBeInTheDocument();
    expect(passwordField).toBeInTheDocument();
    expect(loginButton).toBeInTheDocument();

    act(() => {
      fireEvent.change(usernameField, { target: { value: "" } });
      fireEvent.change(passwordField, { target: { value: "" } });
      fireEvent.click(loginButton);
    });

    await waitFor(() => {
      expect(screen.getByText("Username is required")).toBeInTheDocument();
      expect(screen.getByText("Password is required")).toBeInTheDocument();
    });
  });
});
