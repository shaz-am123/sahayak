import React from "react";
import "@testing-library/jest-dom";
import {
  render,
  screen,
  fireEvent,
} from "@testing-library/react";
import FilterChip from "../../app/component/FilterChip";

describe("FilterChip component", () => {
  it("renders label and value correctly", () => {
    const label = "Category";
    const value = { id: "1", name: "Food" };
    const removeFilter = jest.fn();

    render(
      <FilterChip label={label} value={value} removeFilter={removeFilter} />
    );

    expect(screen.getByText(`${label}: ${value.name}`)).toBeInTheDocument();
  });

  it("calls removeFilter when close icon is clicked", () => {
    const label = "Category";
    const value = { id: "1", name: "Food" };
    const removeFilter = jest.fn();

    const { getByTestId } = render(
      <FilterChip label={label} value={value} removeFilter={removeFilter} />
    );

    fireEvent.click(getByTestId("close-icon"));

    expect(removeFilter).toHaveBeenCalledWith(value.id);
  });
});
