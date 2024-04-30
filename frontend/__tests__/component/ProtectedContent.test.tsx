import React from "react";
import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import { isAuthenticated } from "../../app/api/auth";
import ProtectedContent from "../../app/component/ProtectedContent";
jest.mock("next/navigation", () => require("next-router-mock"));

jest.mock("../../app/api/auth", () => ({
  isAuthenticated: jest.fn(() => Promise.resolve(null)),
}));

describe("ProtectedContent component", () => {
  beforeEach(() => {
    const pageContent = (
      <div data-testid="protected-content">Protected Content</div>
    );
    const accessDenied = (
      <div data-testid="access-denied-blob">Access Denied</div>
    );
    render(
      <ProtectedContent
        pageContent={pageContent}
        alternateContent={accessDenied}
      />,
    );
  });

  test("renders correctly if user is authenticated", async () => {
    (isAuthenticated as jest.Mock).mockResolvedValueOnce(true);
    await waitFor(() => {
      expect(screen.getByTestId("protected-content")).toBeInTheDocument();
    });
  });

  test("renders access denied component if user is not-authenticated", async () => {
    (isAuthenticated as jest.Mock).mockResolvedValueOnce(false);

    await waitFor(() => {
      expect(screen.getByTestId("access-denied-blob")).toBeInTheDocument();
    });
  });
});
