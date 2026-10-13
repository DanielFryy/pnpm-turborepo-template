import { screen } from "@testing-library/react";
import { render } from "setupTests";
import { Button } from "@repo/ui/components/button";

describe("Button", () => {
  it("renders with children and app name", () => {
    render(<Button>Click me</Button>);

    expect(screen.getByText("Click me")).toBeInTheDocument();
  });
});
