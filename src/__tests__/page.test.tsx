import Page from "@/app/page";
import { render } from "@testing-library/react";

it("renders homepage unchanged", () => {
  const { container } = render(<Page />);
  expect(container).toMatchSnapshot();
});
