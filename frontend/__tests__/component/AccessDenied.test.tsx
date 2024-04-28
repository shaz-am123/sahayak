import React from "react";
import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AccessDenied from "../../app/component/AccessDenied";

jest.mock("next/navigation", () => require("next-router-mock"));

jest.mock("../../app/api/auth", () => ({
  handleLogout: jest.fn(),
}));

describe("Navbar component", () => {
  beforeEach(() => {
    render(<AccessDenied />);
  });
  test("renders correctly", () => {
    const accessDeniedBlob = screen.getByAltText("access-denied-blob");
    expect(accessDeniedBlob).toBeInTheDocument();
  });
});
