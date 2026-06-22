import { render, screen } from "@testing-library/react";
import StatusBadge from "../StatusBadge";

describe("StatusBadge", () => {
  it("renders PENDING status correctly", () => {
    render(<StatusBadge status="PENDING" />);
    expect(screen.getByText("pending")).toBeInTheDocument();
  });

  it("renders WON status correctly", () => {
    render(<StatusBadge status="WON" />);
    expect(screen.getByText("won")).toBeInTheDocument();
  });

  it("renders LOST status correctly", () => {
    render(<StatusBadge status="LOST" />);
    expect(screen.getByText("lost")).toBeInTheDocument();
  });
});
