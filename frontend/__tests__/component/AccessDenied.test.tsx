import React from "react";
import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AccessDenied from "../../app/component/AccessDenied";
import mockRouter from "next-router-mock";

jest.mock("next/navigation", () => require("next-router-mock"));

describe("Navbar component", () => {
  beforeEach(() => {
    render(<AccessDenied />);
  });

  test("renders correctly", () => {
    const loginButton = screen.getByTestId("login-button");
    expect(loginButton).toBeInTheDocument();
    const accessDeniedBlob = screen.getByAltText("access-denied-blob");
    expect(accessDeniedBlob).toBeInTheDocument();
  });

  test("redirects to login page when login button is clicked", async () => {
    const pushMock = jest.fn();
    mockRouter.push = pushMock;
    const loginButton = screen.getByTestId("login-button");
    expect(loginButton).toBeInTheDocument();

    await waitFor(() => {
      fireEvent.click(loginButton);
      expect(mockRouter.push).toHaveBeenCalledWith("/");
    });
  });
});
