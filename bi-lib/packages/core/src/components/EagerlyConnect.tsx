import { useContext, useEffect, useState } from "react";

import { BlockchainProviderContext, ConnectorData } from "../context";
import { NonStaticConnectorType } from "../hooks";

export interface EagerlyConnectProps {
  connectorType: NonStaticConnectorType;
}

export const EagerlyConnect = ({ connectorType }: EagerlyConnectProps) => {
  const { connectors } = useContext(BlockchainProviderContext);

  const [connector, hooks] = connectors[connectorType] as ConnectorData;

  const account = hooks.useAccount();

  const [alreadyTriedEagerConnecting, setTriedEagerConnecting] = useState<boolean>(false);

  useEffect(
    () => {
      const timeout = setTimeout(
        () => {
          if (!account && !alreadyTriedEagerConnecting) {
            console.log(`BI-LIB - Try to connect eagerly to ${connectorType}`);
            connector.connectEagerly?.();
          }
          setTriedEagerConnecting(true);
        },
        1200
      );

      return () => clearTimeout(timeout);
    },
    [account, connector, connectorType, alreadyTriedEagerConnecting]
  );

  return null;
}