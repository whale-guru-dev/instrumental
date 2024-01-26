import { act, screen, render } from "tests/utils/base";
import * as hook from "@web3-react/core";
import { Account } from "@/defi/components/Account";
import { Provider } from "react-redux";
import { store } from "@/store";
jest.mock("@web3-react/core", () => {
  const useWeb3React = jest.fn();

  return { useWeb3React };
});

describe("Account", () => {
  it("tries to activate network when account is falsy", async () => {
    let activateHook = jest.fn(() => Promise.resolve());
    hook.useWeb3React.mockImplementation(() => ({
      account: undefined,
      chainId: undefined,
      library: undefined,
      active: false,
      activate: activateHook,
    }));

    render(
      <Provider store={store}>
        <Account />
      </Provider>,
    );

    await act(() => Promise.resolve());
    expect(screen.getByText(/Connect Wallet/i)).toBeInTheDocument();
    expect(activateHook).toHaveBeenCalled();
  });

  it("shows wallet information when account is truthy", async () => {
    hook.useWeb3React.mockImplementation(() => ({
      account: "0x0123456789012345678901234567890123456789",
      chainId: 1,
      library: undefined,
      active: true,
    }));
    render(
      <Provider store={store}>
        <Account />
      </Provider>,
    );

    await act(() => Promise.resolve());

    expect(screen.getByText(/0x0123...6789/i)).toBeInTheDocument();
  });

  it("Shows unsupported network when chainId is not in the supported network list", async () => {
    hook.useWeb3React.mockImplementation(() => ({
      account: "0x0123456789012345678901234567890123456789",
      chainId: 99999, // Some random number
      library: undefined,
      active: true,
      network: undefined,
    }));
    render(
      <Provider store={store}>
        <Account />
      </Provider>,
    );

    await act(() => Promise.resolve());

    expect(screen.getByText(/Unsupported network/i)).toBeInTheDocument();
  });

  it("Disconnects wallet", async () => {
    hook.useWeb3React.mockImplementation(() => ({
      account: "0x0123456789012345678901234567890123456789",
      chainId: 99999, // Some random number
      library: undefined,
      active: true,
      network: undefined,
    }));
    render(
      <Provider store={store}>
        <Account />
      </Provider>,
    );

    await act(() => Promise.resolve());

    expect(screen.getByText(/Unsupported network/i)).toBeInTheDocument();
  });
});
