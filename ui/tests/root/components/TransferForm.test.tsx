import { TransferForm } from "@/components/SelectNetwork/transfer-form";
import { render, screen } from "tests/utils/base";
describe("TransferForm", () => {
  beforeEach(async () => {
    render(<TransferForm heading="Withdraw" />);
  });
  it("should mount", () => {
    screen.getByText("Withdraw");
    screen.getByText("Approve");
  });
});
