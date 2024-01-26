import { Box, Button, Stack, Typography } from "@mui/material";
import { Fragment } from "react";
import { polkadot } from "@/assets/networks";
import { polkadot as PolkadotJS } from "@/assets/wallets";
// import { usePolkadotWalletModal } from "@/store/appsettings/hooks";
import Modal from "@/components/Modal";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  connectPolkaDotWallet,
  setSelectedAccount,
} from "@/store/polkadot/slice";
import { PolkadotAccountForm } from "./PolkadotAccountForm";
import Breadcrumb from "@/components/Breadcrumb";

export const PolkadotAccount = () => {
  const NetworkIcon = polkadot ?? <></>;
  const WalletIcon = PolkadotJS ?? <></>;
  // const { isOpen, closeWalletConnect, openWalletConnect } =
  //   usePolkadotWalletModal();

  const dispatch = useAppDispatch();

  const isConnected = useAppSelector((state) => state.polkadot.connected);
  const isConnecting = useAppSelector((state) => state.polkadot.connecting);

  const selectedAccountName = useAppSelector(
    (state) => state.polkadot.accountName,
  );

  return (
    <Fragment>
      {isConnected ? (
        <Button
          variant="outlined"
          sx={{ width: "15.3rem", height: "4rem" }}
          color="primary"
        >
          <NetworkIcon />
          <Typography variant="h5" sx={{ px: 1 }}>
            {selectedAccountName}
          </Typography>
        </Button>
      ) : (
        <Button
          variant="outlined"
          sx={{ width: "15.3rem", height: "4rem" }}
          color="primary"
        >
          <NetworkIcon width="24" height="24" />
          <Typography variant="button" sx={{ px: 1 }}>
            Connect wallet
          </Typography>
        </Button>
      )}

      <Modal
        fullScreen
        onClose={() => {}}
        open={false}
        breadcrumb={
          isConnected ? (
            <Breadcrumb
              link={{
                text: "wallet",
                to: "/",
              }}
            />
          ) : null
        }
      >
        <Box width="40.625rem" margin="auto">
          {isConnecting && !isConnected && (
            <Fragment>
              <Stack spacing={1}>
                <Typography
                  variant="h4"
                  fontFamily="BIN Regular"
                  textAlign="center"
                  mb={3}
                >
                  select account
                </Typography>
                <Typography variant="body1" textAlign="center" color="GrayText">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                </Typography>
              </Stack>
              <PolkadotAccountForm
                onSelectChange={(account) => {
                  dispatch(setSelectedAccount(account));
                }}
              />
            </Fragment>
          )}
          {isConnected && (
            <Fragment>
              <Stack spacing={1}>
                <Typography
                  variant="h4"
                  fontFamily="BIN Regular"
                  textAlign="center"
                  mb={3}
                >
                  account
                </Typography>
                <Typography variant="body1" textAlign="center" color="GrayText">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                </Typography>
              </Stack>
              <PolkadotAccountForm
                onSelectChange={(account) => {
                  dispatch(setSelectedAccount(account));
                }}
              />
            </Fragment>
          )}
          {!isConnecting && !isConnected && (
            <Fragment>
              <Stack spacing={1}>
                <Typography
                  variant="h4"
                  fontFamily="BIN Regular"
                  textAlign="center"
                  mb={3}
                >
                  Connect dotsama wallet
                </Typography>
                <Typography variant="body1" textAlign="center" color="GrayText">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                </Typography>
              </Stack>
              <Stack py={3} spacing={2}>
                <Button
                  variant="outlined"
                  size="large"
                  fullWidth
                  onClick={() => dispatch(connectPolkaDotWallet())}
                  sx={{
                    display: "grid",
                    alignContent: "center",
                    gridTemplateColumns: "3rem 1fr",
                    gap: 2,
                    px: 1,
                    py: 0,
                  }}
                  type="button"
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifySelf: "center",
                      alignSelf: "center",
                    }}
                  >
                    <WalletIcon />
                  </Box>
                  <Typography
                    variant="h6"
                    textAlign="center"
                    sx={{
                      alignSelf: "center",
                      justifySelf: "stretch",
                      height: "2rem",
                    }}
                  >
                    Polkadot.js
                  </Typography>
                </Button>
              </Stack>
            </Fragment>
          )}
        </Box>
      </Modal>
    </Fragment>
  );
};
