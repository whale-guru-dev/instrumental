import React from "react";

// import { useWeb3React } from "@web3-react/core";
import { useConnector } from "@integrations-lib/core";
// import Image from "next/image";
// import { getUserConnectors } from "defi";
import { useWalletConnectModalModal } from "store/appsettings/hooks";
import { Box, Paper, CircularProgress, Typography, Stack } from "@mui/material";
import Button from "@/components/Button";
import Modal from "@/components/Modal";
import {
  metamask as Metamask,
  walletconnect as WalletConnect,
} from "@/assets/wallets";

export const ConnectorSelection = () => {
  const { isOpen, closeWalletConnect } = useWalletConnectModalModal();

  const { account, activate, isActive, isActivating, deactivate } =
    useConnector("metamask");

  const activating = isActivating;
  const connected = isActive;
  const disabled = !!isActivating || connected;

  const onDisconnect = () => {
    deactivate ? deactivate() : () => {};
    closeWalletConnect();
  };
  // useEffect(() => {
  //   if (isActive) {
  //     closeWalletConnect();
  //   }
  // }, [closeWalletConnect, isActive]);

  return (
    <Modal fullScreen open={isOpen} onClose={closeWalletConnect}>
      {account ? (
        <Box width="40.625rem" margin="auto">
          <Stack spacing={1}>
            <Typography
              variant="h2"
              fontFamily="BIN Regular"
              textAlign="center"
              mb={3}
            >
              Disconnect wallet
            </Typography>
          </Stack>
          <Stack py={3} spacing={2}>
            <Paper
              variant="outlined"
              sx={{
                display: "grid",
                alignContent: "center",
                gridTemplateColumns: "3rem 1fr",
                gap: 2,
                p: 1,
              }}
            >
              {/* {current && ( */}
              <Box
                sx={{
                  display: "flex",
                  justifySelf: "center",
                  alignSelf: "center",
                }}
              >
                <Metamask width="24" height="24" />
                {/* <Image src={metamask} alt={"Metamask"} width="24" height="24" /> */}
              </Box>
              {/*  )}   */}
              <Typography
                variant="h6"
                textAlign="center"
                sx={{
                  alignSelf: "center",
                  justifySelf: "stretch",
                  height: "2rem",
                }}
              >
                {account}
              </Typography>
            </Paper>
          </Stack>

          <Button
            variant="contained"
            color="error"
            fullWidth
            onClick={onDisconnect}
          >
            <Typography variant="h6">Disconnect</Typography>
          </Button>
        </Box>
      ) : (
        <Box width="40.625rem" margin="auto">
          <Stack spacing={1}>
            <Typography
              variant="h2"
              fontFamily="BIN Regular"
              textAlign="center"
              mb={3}
            >
              Connect Wallet
            </Typography>
          </Stack>
          <Stack py={3} spacing={2}>
            {activating && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  pt: "3rem",
                }}
              >
                <CircularProgress size="5.25rem" color="primary" />
              </Box>
            )}
            {!activating && (
              <>
                <Button
                  disabled={disabled}
                  variant="outlined"
                  size="large"
                  color="secondary"
                  fullWidth
                  sx={{
                    display: "grid",
                    alignContent: "center",
                    gridTemplateColumns: "3rem 1fr",
                    gap: 2,
                    px: 1,
                    py: 0,
                  }}
                  onClick={() => {
                    activate();
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
                    <Metamask width="24" height="24" />
                    {/* <Image
                      src={metamask}
                      alt={"Metamask"}
                      width="24"
                      height="24"
                    /> */}
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
                    Metamask
                  </Typography>
                </Button>
                <Button
                  disabled={disabled}
                  variant="outlined"
                  size="large"
                  color="secondary"
                  fullWidth
                  sx={{
                    display: "grid",
                    alignContent: "center",
                    gridTemplateColumns: "3rem 1fr",
                    gap: 2,
                    px: 1,
                    py: 0,
                  }}
                  onClick={() => {
                    activate();
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
                    <WalletConnect width="24" height="24" />
                    {/* <Image
                      src={metamask}
                      alt={"Metamask"}
                      width="24"
                      height="24"
                    /> */}
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
                    WalletConnect
                  </Typography>
                </Button>
              </>
            )}
          </Stack>
        </Box>
      )}
    </Modal>
  );
};
