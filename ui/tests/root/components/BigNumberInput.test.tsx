import BigNumberInput from "@/components/BigNumberInput";
import { fireEvent, screen, render } from "@/tests/utils/base";
import BigNumber from "bignumber.js";

describe("BigNumberInput", () => {
  it("Should mount", () => {
    const receiveValidState = jest.fn();
    render(
      <BigNumberInput
        maxValue={new BigNumber(0)}
        setter={() => null}
        placeholder="token"
        value={new BigNumber(0)}
        isValid={receiveValidState}
      />,
    );

    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  describe("Validation checks <BigNumberInput maxDecimals={1} maxValue={2} />", () => {
    const truthyValues = ["0", "0.1", "2"];
    const falsyValues = ["3", "0.11", ""];
    const silentFails = [".", "-0.1", "-2", ".1"];

    silentFails.forEach((value) => {
      it(`Silently fails with "${value}" as input`, () => {
        const receiveValidState = jest.fn();
        let stateValue = new BigNumber(0);
        const setter = (v) => (stateValue = v);
        render(
          <BigNumberInput
            placeholder="token"
            value={stateValue}
            setter={setter}
            maxValue={new BigNumber(2)}
            isValid={receiveValidState}
            maxDecimals={1}
          />,
        );
        const textbox = screen.getByRole("textbox");
        fireEvent.change(textbox, { target: { value } });
        expect(receiveValidState).toBeCalledTimes(1);
        let expectedValue;
        if (parseInt(value) > 2) {
          expectedValue = 2;
        }
        if (
          parseInt(value) <= 0 ||
          value === "." ||
          value === "-." ||
          value === ".1"
        ) {
          expectedValue = 0;
        }
        expect(stateValue.toFixed()).toBe(expectedValue?.toString());
      });
    });

    truthyValues.forEach((value) => {
      it(`Accepts "${value}" as truthy value`, () => {
        const receiveValidState = jest.fn();
        let stateValue = new BigNumber(0);
        const setter = (v) => (stateValue = v);
        render(
          <BigNumberInput
            placeholder="token"
            value={stateValue}
            setter={setter}
            maxValue={new BigNumber(2)}
            isValid={receiveValidState}
            maxDecimals={1}
          />,
        );
        const textbox = screen.getByRole("textbox");
        fireEvent.change(textbox, { target: { value } });
        expect(receiveValidState).toHaveBeenCalledWith(true);
        expect(stateValue.toFixed()).toBe(value);
      });
    });

    falsyValues.forEach((value) => {
      it(`Fails with "${value}" as invalid input`, () => {
        const receiveValidState = jest.fn();
        let stateValue = new BigNumber(0);
        const setter = (v) => (stateValue = v);
        render(
          <BigNumberInput
            value={stateValue}
            setter={setter}
            maxValue={new BigNumber(2)}
            isValid={receiveValidState}
            maxDecimals={1}
          />,
        );
        const textbox = screen.getByRole("textbox");
        fireEvent.change(textbox, { target: { value } });
        expect(receiveValidState).toHaveBeenCalledWith(false);
      });
    });
  });
});
