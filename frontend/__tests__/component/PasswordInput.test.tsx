import React from "react";
import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import PasswordInput from "../../app/component/InputPassword";

describe("PasswordInput", () => {
  test("toggle password visibility", () => {
    render(<PasswordInput />);
    const inputElement = screen.getByTestId("password-input");
    const toggleButton = screen.getByTestId("toggle-button");

    expect(inputElement.getAttribute("type")).toBe("password");

    fireEvent.click(toggleButton);

    expect(inputElement.getAttribute("type")).toBe("text");

    fireEvent.click(toggleButton);

    expect(inputElement.getAttribute("type")).toBe("password");
  });
});
