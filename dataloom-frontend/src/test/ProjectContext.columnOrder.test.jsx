import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Table from "../Components/Table";

const mockContext = {
  columns: ["City", "Amount", "Date"],
  rows: [["Delhi", 100, "2024-01-01"]],
  dtypes: {
    City: "string",
    Amount: "int",
    Date: "date",
  },
  updateData: vi.fn(),
  columnOrder: [],
  setColumnOrder: vi.fn(),
  totalRows: 1,
  totalPages: 1,
  page: 1,
  pageSize: 10,
  setPaginationData: vi.fn(),
  refreshProject: vi.fn(),
};

vi.mock("../context/ProjectContext", () => ({
  useProjectContext: () => mockContext,
}));

describe("Table — column order rendering", () => {
  it("renders columns in default order", () => {
    mockContext.columnOrder = [];

    render(<Table projectId="test-id" />);

    const headers = screen.getAllByRole("columnheader");

    expect(headers[1]).toHaveTextContent("City");
    expect(headers[2]).toHaveTextContent("Amount");
    expect(headers[3]).toHaveTextContent("Date");
  });

  it("renders columns in reordered sequence [2, 0, 1]", () => {
    mockContext.columnOrder = [2, 0, 1];

    render(<Table projectId="test-id" />);

    const headers = screen.getAllByRole("columnheader");

    expect(headers[1]).toHaveTextContent("Date");
    expect(headers[2]).toHaveTextContent("City");
    expect(headers[3]).toHaveTextContent("Amount");
  });

  it("falls back to default order when columnOrder length mismatches", () => {
    mockContext.columnOrder = [0, 1];

    render(<Table projectId="test-id" />);

    const headers = screen.getAllByRole("columnheader");

    expect(headers[1]).toHaveTextContent("City");
    expect(headers[2]).toHaveTextContent("Amount");
    expect(headers[3]).toHaveTextContent("Date");
  });
});
