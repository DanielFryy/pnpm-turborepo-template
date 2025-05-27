import { screen } from "@testing-library/react";
import { Code } from "./code";
import { render } from "setupTests";

describe("Code", () => {
  it("renders children content", () => {
    render(<Code>const hello: string</Code>);

    expect(screen.getByText("const hello: string")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(<Code className="custom-class">const test = true;</Code>);

    const codeElement = screen.getByText("const test = true;");
    expect(codeElement).toHaveClass("custom-class");
  });

  it("renders with code tag", () => {
    render(<Code>test code</Code>);

    const codeElement = screen.getByText("test code");
    expect(codeElement.tagName.toLowerCase()).toBe("code");
  });
});
