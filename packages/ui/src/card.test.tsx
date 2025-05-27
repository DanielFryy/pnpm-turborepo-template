import { screen } from "@testing-library/react";
import { Card } from "./card";
import { render } from "setupTests";

describe("Card", () => {
  const defaultProps = {
    title: "Test Card",
    href: "https://test.com",
    children: "Card content"
  };

  it("renders with title and content", () => {
    render(<Card {...defaultProps} />);

    expect(screen.getByText("Test Card")).toBeInTheDocument();
    expect(screen.getByText("Card content")).toBeInTheDocument();
  });

  it("includes the correct href with UTM parameters", () => {
    render(<Card {...defaultProps} />);

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute(
      "href",
      "https://test.com?utm_source=create-turbo&utm_medium=basic&utm_campaign=create-turbo"
    );
  });

  it("applies custom className", () => {
    render(<Card {...defaultProps} className="custom-class" />);

    const link = screen.getByRole("link");
    expect(link).toHaveClass("custom-class");
  });

  it("has correct link attributes", () => {
    render(<Card {...defaultProps} />);

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
    expect(link).toHaveAttribute("target", "_blank");
  });
});
