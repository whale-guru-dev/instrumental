import TimeLeft from "@/components/TimeLeft";
import { screen, render } from "tests/utils/base";

const NOW = 1577836800000; // 2020-01-01;
const ONE_MINUTE = 60000;
const ONE_HOUR = ONE_MINUTE * 60;
const ONE_DAY = ONE_HOUR * 24;
const ONE_YEAR = ONE_DAY * 365;

describe("TimeLeft", () => {
  beforeAll(() => {
    jest.useFakeTimers().setSystemTime(new Date("2020-01-01").getTime());
  });

  it("Renders time properly", () => {
    render(<TimeLeft timestamp={NOW + ONE_DAY} />);

    screen.getByText(/1d - 0h - 0m/i);
  });

  it("Renders too far in the future", () => {
    render(<TimeLeft timestamp={NOW + ONE_YEAR + ONE_HOUR + ONE_MINUTE} />);

    screen.getByText(/365d - 1h - 1m/i);
  });

  it("Renders 0 when time is passed", () => {
    render(<TimeLeft timestamp={NOW - ONE_MINUTE} />);

    screen.getByText(/0d - 0h - 0m/i);
  });

  it("Renders 0 when time is invalid", () => {
    render(<TimeLeft timestamp={0} />);

    screen.getByText(/0d - 0h - 0m/i);
  });
});
