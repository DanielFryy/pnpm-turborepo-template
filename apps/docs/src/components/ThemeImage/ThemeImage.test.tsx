import ThemeImage from "./ThemeImage";
import { render } from "setupTests";

it("renders both theme images with minimum props", () => {
  const { getAllByAltText } = render(
    <ThemeImage alt="Logo" srcLight="/next.svg" srcDark="/vercel.svg" width={20} height={20} />
  );
  expect(getAllByAltText("Logo")).toHaveLength(2);
});

it("preserves caller classes on both theme images", () => {
  const { getAllByAltText } = render(
    <ThemeImage alt="Logo" srcLight="/next.svg" srcDark="/vercel.svg" width={20} height={20} className="custom-logo" />
  );
  for (const image of getAllByAltText("Logo")) expect(image).toHaveClass("custom-logo");
});
