import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import Table from "../Components/Table";

const mockContext = {
  columns: ["City", "Amount", "Date"],
  rows: [
    ["New York", "100", "2024-01-01"],
    ["London", "200", "2024-01-02"],
  ],
  dtypes: {
    City: "string",
    Amount: "float",
    Date: "date",
  },
  columnOrder: [0, 1, 2],
  setColumnOrder: vi.fn(),
  updateData: vi.fn(),
  totalRows: 2,
  totalPages: 1,
  page: 1,
  pageSize: 50,
  setPaginationData: vi.fn(),
  refreshProject: vi.fn(),
};

vi.mock("../context/ProjectContext", () => ({
  useProjectContext: () => mockContext,
}));

describe("Table — column order rendering", () => {
  it("renders columns in default order", () => {
    mockContext.columnOrder = [0, 1, 2];

    render(<Table projectId="test-id" />);

    const headers = screen.getAllByRole("columnheader");

    expect(headers[1].textContent).toContain("City");
    expect(headers[2].textContent).toContain("Amount");
    expect(headers[3].textContent).toContain("Date");
  });

  it("renders columns in reordered sequence [2, 0, 1]", () => {
    mockContext.columnOrder = [2, 0, 1];

    render(<Table projectId="test-id" />);

    const headers = screen.getAllByRole("columnheader");

    expect(headers[1].textContent).toContain("Date");
    expect(headers[2].textContent).toContain("City");
    expect(headers[3].textContent).toContain("Amount");
  });

  it("falls back to default order when columnOrder length mismatches", () => {
    mockContext.columnOrder = [0, 1];

    render(<Table projectId="test-id" />);

    const headers = screen.getAllByRole("columnheader");

    expect(headers[1].textContent).toContain("City");
    expect(headers[2].textContent).toContain("Amount");
    expect(headers[3].textContent).toContain("Date");
  });
});
