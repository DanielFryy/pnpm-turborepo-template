import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "./button";
import { render } from "setupTests";

describe("Button", () => {
  it("renders with children and app name", () => {
    render(<Button appName="TestApp">Click me</Button>);

    expect(screen.getByText("Click me")).toBeInTheDocument();
  });

  it("shows alert with app name when clicked", async () => {
    const user = userEvent.setup();
    const alertMock = vi.spyOn(window, "alert").mockImplementation(() => {});

    render(<Button appName="TestApp">Click me</Button>);
    await user.click(screen.getByText("Click me"));

    expect(alertMock).toHaveBeenCalledWith("Hello from your TestApp app!");
    alertMock.mockRestore();
  });

  it("applies custom className", () => {
    render(
      <Button appName="TestApp" className="custom-class">
        Click me
      </Button>
    );

    expect(screen.getByText("Click me")).toHaveClass("custom-class");
  });
});
