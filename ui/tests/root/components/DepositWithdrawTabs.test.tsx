import DepositWithdrawTabs from "@/components/SelectNetwork";
import { fireEvent, render, screen } from "tests/utils/base";
describe("DepositWithdrawTabs", () => {
  beforeEach(async () => {
    render(<DepositWithdrawTabs active={false} poolId={1} />);
  });
  it("should mount", () => {
    const tab = screen.getByRole("tablist");
    expect(tab).toBeInTheDocument();
  });
  it("Withdrawal tab should be disabled", () => {
    const tab = screen.getByRole("tab", { selected: false });
    fireEvent.click(tab);
    expect(screen.getByText("Deposit")).toBeVisible();
  });
});
