import { useWalletConnectModalModal } from "@/store/appsettings/hooks";
import Brightness1Icon from "@mui/icons-material/Brightness1";
import { alpha, Box, Typography } from "@mui/material";
import { makeStyles, createStyles } from "@mui/styles";
import { Theme } from "@mui/material/styles";
import { ethConnect as EthConnect } from "@/assets/wallets/index";
// import { useWeb3React } from "@web3-react/core";
import { useConnector } from "@integrations-lib/core";
import { isValidNetwork } from "defi";
import { NETWORKS } from "defi/networks";
// import { useEffect } from "react";
import { SupportedNetworks } from "../types";
// import { mainnet } from "@/assets/networks";
// import Button from "@/components/Button";
import Image from "next/image";
import { getChainIconURL } from "@/submodules/contracts-operations/src/store/supportedTokens/utils";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: theme.spacing(1.5, 2),
      minWidth: 240,
      borderRadius: "10px",
      cursor: "pointer",
      height: 50,
      "&:hover": {
        opacity: 0.8,
      },
    },
    message: {
      color: theme.palette.text.primary,
      textAlign: "center",
      width: "100%",
    },
    icon: {
      display: "flex",
      alignItems: "center",
      height: 25,
      width: 25,
      cursor: "pointer",
      marginRight: 5,
    },
    exit: {
      display: "flex",
      alignItems: "center",
      height: 50,
      width: 50,
      cursor: "pointer",
      marginLeft: theme.spacing(2),
      border: `1px solid ${theme.palette.primary.main}`,
      borderRadius: "8px",
      justifyContent: "space-around",
      "&:hover": {
        opacity: 0.8,
      },
    },
  }),
);

export const Account = () => {
  // const NetworkIcon = mainnet ?? <></>;
  const {
    account,
    chainId,
    // activate,
    isActive,
  } = useConnector("metamask");
  const network =
    chainId && account ? NETWORKS[chainId as SupportedNetworks] : undefined;
  const { openWalletConnect } = useWalletConnectModalModal();
  const classes = useStyles();
  const getMessage = () => {
    if (!account) {
      return "Connect wallet";
    }
    if (chainId) {
      return `${account.substring(0, 6)}...${account.substring(
        account.length - 4,
      )}`;
    } else {
      return "Unsupported network";
    }
  };

  return (
    <>
      <Box display="flex">
        <Box
          className={`${classes.root}`}
          onClick={() => openWalletConnect()}
          sx={{
            border: (theme: Theme) =>
              account ? "none" : `1px solid ${theme.palette.primary.main}`,
            backgroundColor: (theme: Theme) =>
              !account
                ? "transparent"
                : alpha(theme.palette.primary.main, 0.15),
          }}
        >
          {account && chainId && (
            <div className={classes.icon}>
              {account && network && chainId ? (
                <Image
                  src={getChainIconURL(chainId)}
                  alt={network.name}
                  width="24"
                  height="24"
                />
              ) : (
                <Brightness1Icon
                  style={{
                    color:
                      isActive && account && isValidNetwork(chainId)
                        ? "#61BC70"
                        : (isActive && !account) || !isValidNetwork(chainId)
                        ? "#FDD835"
                        : "#ff6666",
                    display: !isActive || !account ? "none" : "flex",
                  }}
                />
              )}
            </div>
          )}
          {!account && (
            <div className={classes.icon}>
              <EthConnect width="24" height="24" />
              {/* <Image
                src={ethConnect}
                alt="EVM connect"
                width="24"
                height="24"
              /> */}
            </div>
          )}
          <Typography className={classes.message}>{getMessage()}</Typography>
        </Box>
      </Box>
    </>
  );
};
