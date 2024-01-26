import Breadcrumb from "@/components/Breadcrumb";
import { createTheme, ThemeProvider } from "@mui/material";
import { render, screen } from "tests/utils/base";

describe("Breadcrumb", () => {
  it("Renders successfully", () => {
    render(
      <ThemeProvider theme={createTheme()}>
        <Breadcrumb link={{ to: "/", text: "Test" }} />
      </ThemeProvider>,
    );

    expect(screen.queryByText("Back to Test")).toBeInTheDocument();
  });
  it("Renders the list of items", () => {
    render(
      <ThemeProvider theme={createTheme()}>
        <Breadcrumb link={{ text: "Home", to: "/" }} />
      </ThemeProvider>,
    );
    const element = screen.queryByText("Back to Home");
    expect(element).toBeInTheDocument();
    expect(element?.getAttribute("href")).toBe("/");
  });
});
