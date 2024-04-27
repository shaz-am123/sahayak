import React from "react";
import "@testing-library/jest-dom";
import {
  render,
  screen,
  fireEvent,
  act,
  waitFor,
} from "@testing-library/react";
import RegistrationForm from "../../app/component/RegistrationForm";
import { handleRegistration } from "../../app/api/auth";

jest.mock("../../app/api/auth", () => ({
  handleRegistration: jest.fn(),
  isUniqueUsername: jest.fn(() => Promise.resolve({ isUnique: true })),
}));

jest.mock("next/navigation", () => require("next-router-mock"));

describe("RegistrationForm component", () => {
  beforeEach(() => {
    render(<RegistrationForm />);
  });
  test("renders correctly", () => {
    const registrationForm = screen.getByTestId("registrationForm");
    expect(registrationForm).toBeInTheDocument();

    const heading = screen.getByTestId("heading");
    expect(heading).toBeInTheDocument();
    expect(heading.innerHTML).toEqual("Register");
  });

  test("should have all the input fields and register button", () => {
    expect(screen.getByLabelText("Username")).toBeInTheDocument();
    expect(screen.getByLabelText("Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByLabelText("Confirm Password")).toBeInTheDocument();

    const registerButton = screen.getByLabelText("Register");
    expect(registerButton).toBeInTheDocument();
  });

  test("should call handleRegistration when register button is clicked", async () => {
    const registerButton = screen.getByLabelText("Register");
    const usernameField = screen.getByLabelText("Username");
    const nameField = screen.getByLabelText("Name");
    const emailField = screen.getByLabelText("Email");
    const passwordField = screen.getByLabelText("Password");
    const confirmPasswordField = screen.getByLabelText("Confirm Password");

    expect(usernameField).toBeInTheDocument();
    expect(nameField).toBeInTheDocument();
    expect(emailField).toBeInTheDocument();
    expect(confirmPasswordField).toBeInTheDocument();
    expect(passwordField).toBeInTheDocument();
    expect(registerButton).toBeInTheDocument();

    act(() => {
      fireEvent.change(usernameField, { target: { value: "ram123" } });
      fireEvent.change(nameField, { target: { value: "Ram Sharma" } });
      fireEvent.change(emailField, { target: { value: "ram@gmail.com" } });
      fireEvent.change(passwordField, { target: { value: "myPass12@" } });
      fireEvent.change(confirmPasswordField, {
        target: { value: "myPass12@" },
      });
      fireEvent.click(registerButton);
    });
    await waitFor(() => {
      expect(handleRegistration).toHaveBeenCalled();
    });
  });

  test("should show error messages when invalid values are entered in the input fields", async () => {
    const registerButton = screen.getByLabelText("Register");
    const usernameField = screen.getByLabelText("Username");
    const nameField = screen.getByLabelText("Name");
    const emailField = screen.getByLabelText("Email");
    const passwordField = screen.getByLabelText("Password");
    const confirmPasswordField = screen.getByLabelText("Confirm Password");

    expect(usernameField).toBeInTheDocument();
    expect(nameField).toBeInTheDocument();
    expect(emailField).toBeInTheDocument();
    expect(confirmPasswordField).toBeInTheDocument();
    expect(passwordField).toBeInTheDocument();
    expect(registerButton).toBeInTheDocument();

    act(() => {
      fireEvent.change(usernameField, { target: { value: "" } });
      fireEvent.change(nameField, { target: { value: "R" } });
      fireEvent.change(emailField, { target: { value: "xyz" } });
      fireEvent.change(passwordField, { target: { value: "myPass123" } });
      fireEvent.change(confirmPasswordField, {
        target: { value: "myPass123" },
      });
      fireEvent.click(registerButton);
    });
    await waitFor(() => {
      expect(screen.getByText("Username is required"));
      expect(screen.getByText("Name must be at least 3 characters"));
      expect(screen.getByText("Invalid email address"));
      expect(
        screen.getByText(
          "Password must contain at least one special character",
        ),
      );
    });
  });
});
