import BlockchainUpdater from "store/blockchain/updater";
import TransactionUpdater from "store/tranasctions/updater";
import { SupportedNetworks } from "@/defi/types";
import { LiquidityMiningUpdater } from "@/defi/LiquidityMiningUpdater";
import { VeSTRMUpdater } from "@/defi/VeSTRMUpdater";
import { AirdropUpdater } from "@/defi/AirdropUpdater";

export default function Updaters() {
  return (
    <>
      {Array.from(
        new Set([1].concat(process.env.NODE_ENV === "development" ? [42] : [])),
      ).map((networkId) => (
        <BlockchainUpdater
          key={networkId}
          chainId={networkId as SupportedNetworks}
        />
      ))}
      <TransactionUpdater />
      <LiquidityMiningUpdater />
      <VeSTRMUpdater />
      <AirdropUpdater />
      {/* <UserDataUpdater /> */}
      {/* <RelayerVaultUpdater /> */}
    </>
  );
}
