import RootLayout from "./layout";
import { render } from "setupTests";

vi.mock("next/font/local", () => ({ default: () => ({ variable: "mock-font" }) }));

it("renders the layout children", () => {
  const { getByText } = render(
    <RootLayout>
      <p>Layout content</p>
    </RootLayout>
  );
  expect(getByText("Layout content")).toBeInTheDocument();
});
