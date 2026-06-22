import { render, screen } from "@testing-library/react";
import EmptyState from "../../ui/EmptyState";

describe("EmptyState", () => {
  it("renders with default translations", () => {
    render(<EmptyState />);
    expect(screen.getByText("title")).toBeInTheDocument();
    expect(screen.getByText("description")).toBeInTheDocument();
    // The link text
    expect(screen.getByText("cta")).toBeInTheDocument();
  });

  it("renders with custom props", () => {
    render(
      <EmptyState
        title="Custom Title"
        description="Custom Desc"
        ctaLabel="Custom CTA"
        ctaHref="/custom"
      />,
    );
    expect(screen.getByText("Custom Title")).toBeInTheDocument();
    expect(screen.getByText("Custom Desc")).toBeInTheDocument();

    const link = screen.getByText("Custom CTA");
    expect(link).toBeInTheDocument();
    expect(link.closest("a")).toHaveAttribute("href", "/custom");
  });
});
