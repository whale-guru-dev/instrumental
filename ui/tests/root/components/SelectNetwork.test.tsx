import { screen, render } from "tests/utils/base";
import SelectNetwork from "@/components/SelectNetwork/select-network";

const OPTIONS = ["Test 1", "Test 2", "Test 3"];

describe("SelectNetwork", () => {
  it("should mount", () => {
    render(
      <SelectNetwork
        id="select-network"
        keyPropFn={(option) => option}
        valuePropFn={(option) => option}
        options={OPTIONS}
        value={OPTIONS[0]}
      />,
    );

    screen.getByDisplayValue("Test 1");
  });
});
