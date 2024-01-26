import { useContext } from "react";
// import {useWeb3React} from "@web3-react/core";
// import { useConnector } from "@integrations-lib/core";
// import {network, userConnectorsByName} from "./connectors";
import { ContractsContext } from "./ContractsContext";
import { getNetworkUrl } from "defi";
import { getAddressesByChainId } from "./addresses";
import { SupportedNetworks } from "./types";
// import {useAppDispatch, useAppSelector} from "store";
// import {selectHasTriedEeager, triedEagerConnect} from "store/appsettings/slice";

// const injected = userConnectorsByName["Injected"].connector;

// export function useEagerConnect() {
//   const dispatch = useAppDispatch();
//   const tried = useAppSelector(selectHasTriedEeager);

//   // const {activate, active, account} = useWeb3React();
//   const {activate, isActive, account} = useConnector("metamask");

//   useEffect(() => {
//     injected.isAuthorized().then((isAuthorized: boolean) => {
//       if (isAuthorized) {
//         activate(injected, undefined, true)
//           // .catch(() => {
//           //   dispatch(triedEagerConnect());
//           // })
//           // .then(() => {});
//       } else {
//         activate(network, undefined, true)
//         //   .catch(() => {})
//         //   .then(() => {});
//         // dispatch(triedEagerConnect());
//       }
//     });
//   }, []); // intentionally only running on mount (make sure it's only mounted once :))

//   // if the connection worked, wait until we get confirmation of that to flip the flag

//   useEffect(() => {
//     if (!tried && isActive && account) {
//       dispatch(triedEagerConnect());
//     }
//   }, [tried, isActive]);

//   return tried;
// }

// export function useInactiveListener(suppress: boolean = false) {
//   const {active, error, activate} = useWeb3React();

//   useEffect((): any => {
//     const {ethereum} = window as any;
//     if (ethereum && ethereum.on && !active && !error && !suppress) {
//       const handleConnect = () => {
//         activate(injected);
//       };
//       const handleChainChanged = (_: string | number) => {
//         activate(injected);
//       };
//       const handleAccountsChanged = (accounts: string[]) => {
//         if (accounts.length > 0) {
//           activate(injected);
//         }
//       };
//       const handleNetworkChanged = (_: string | number) => {
//         activate(injected);
//       };

//       ethereum.on("connect", handleConnect);
//       ethereum.on("chainChanged", handleChainChanged);
//       ethereum.on("accountsChanged", handleAccountsChanged);
//       ethereum.on("networkChanged", handleNetworkChanged);

//       return () => {
//         if (ethereum.removeListener) {
//           ethereum.removeListener("connect", handleConnect);
//           ethereum.removeListener("chainChanged", handleChainChanged);
//           ethereum.removeListener("accountsChanged", handleAccountsChanged);
//           ethereum.removeListener("networkChanged", handleNetworkChanged);
//         }
//       };
//     }
//   }, [active, error, suppress, activate]);
// }

export function useNetworkUrl() {
  const { chainId } = useContext(ContractsContext);

  return getNetworkUrl(chainId ?? 1);
}

export function useAddresses() {
  const { chainId } = useContext(ContractsContext);

  return getAddressesByChainId(
    chainId ? (chainId as SupportedNetworks) : (1 as SupportedNetworks),
  );
}
