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
import { handleRegistration } from "../../app/api/auth/AuthService";

jest.mock("../../app/api/auth/AuthService", () => ({
  handleRegistration: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

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

  test("should call handleRegistration when register button is clicked", () => {
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
      fireEvent.change(passwordField, { target: { value: "myPass123" } });
      fireEvent.change(confirmPasswordField, {
        target: { value: "myPass123" },
      });
      fireEvent.click(registerButton);
    });
    expect(handleRegistration).toHaveBeenCalled();
  });
});
