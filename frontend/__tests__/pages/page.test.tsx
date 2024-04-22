import React from "react";
import {
  render,
  screen,
  fireEvent,
  act,
  waitFor,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import StartPage from "../../app/page";
import { useRouter } from "next/navigation";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

describe("StartPage component", () => {
  beforeEach(() => {
    render(<StartPage />);
  });

  it("renders input switch", () => {
    expect(screen.getByTestId("newUserToggle")).toBeInTheDocument();
  });

  it("renders RegistrationForm when 'New User' is checked", async () => {
    const inputSwitch = screen.getByTestId("newUserToggle");

    act(() => {
      fireEvent.click(inputSwitch);
    });

    await waitFor(() => {
      const registrationForm = screen.getByTestId("registrationForm");
      expect(registrationForm).toBeInTheDocument();
    });
  });

  it("renders LoginForm when 'New User' is not checked", () => {
    const inputSwitch = screen.getByTestId("newUserToggle");
    fireEvent.click(inputSwitch);
    fireEvent.click(inputSwitch);
    expect(screen.getByTestId("loginForm")).toBeInTheDocument();
  });

  it("changes state when toggling input switch", () => {
    const inputSwitch = screen.getByTestId("newUserToggle");
    expect(inputSwitch.getAttribute("aria-checked")).toBe("false");
    fireEvent.click(inputSwitch);
    expect(inputSwitch.getAttribute("aria-checked")).toBe("true");
  });
});
