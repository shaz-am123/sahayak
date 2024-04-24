import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import Home from "../../app/home/page";
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("../../app/api/auth", () => ({
  getUser: jest.fn(() => Promise.resolve({ name: "Test User" })),
  isAuthenticated: jest.fn(() => Promise.resolve(true)),
}));

describe("HomePage component", () => {
  it("renders welcome message with user's name", async () => {
    render(<Home />);

    expect(screen.getByText("Loading")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Welcome Test User!")).toBeInTheDocument();
      expect(
        screen.getByText(
          "Sahayak, your trusted partner for effortless money management. Simplify your finances and achieve your goals with confidence.",
        ),
      ).toBeInTheDocument();
    });
  });
});
