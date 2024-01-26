import React, { useContext } from "react";

import { useAirdropModal } from "store/appsettings/hooks";
import { Button, Box, Typography, Stack, Grid } from "@mui/material";
import Modal from "@/components/Modal";
// import { useWeb3React } from "@web3-react/core";
import { useConnector } from "@integrations-lib/core";
import { usePendingTransactions } from "@/hooks/usePendingTransactions";
import { tokens } from "@/defi/tokenInfo";
import { ContractsContext } from "../ContractsContext";
import { useAddresses } from "../hooks";
import { useAppSelector } from "@/store";
import {
  selectAirdropProof,
  selectAirdropVolume,
  selectedPendingAirdropRewards,
  selectVestingIds,
} from "@/store/airdrop/slice";
import { ethers } from "ethers";
import { vestingData } from "../AirdropUpdater";
import DefiIcon from "@/components/DefiIcon";
import { inst } from "@/assets/tokens";

export const AirdropModal = () => {
  const proofs = useAppSelector(selectAirdropProof);
  const volumes = useAppSelector(selectAirdropVolume);
  const vIds = useAppSelector(selectVestingIds);
  const pendingRewards = useAppSelector(selectedPendingAirdropRewards);
  const { isOpen, closeAirdrop } = useAirdropModal();

  // const { account } = useWeb3React();
  const { account } = useConnector("metamask");
  const addresses = useAddresses();
  const { contracts } = useContext(ContractsContext);
  const isPendingClaim = usePendingTransactions(addresses.vesting, "claim");

  const claim = async () => {
    if (contracts && account) {
      const { vesting } = contracts;

      vesting
        .claimAll(
          vIds.map((i) => ethers.BigNumber.from(i)),
          account,
          proofs,
          volumes.map((i) => ethers.BigNumber.from(i)),
        )
        .catch((err) => console.log(err));
    }
  };

  const isAnythingToClaim = Object.values(pendingRewards).some((x) => x);

  return (
    <Modal fullScreen open={isOpen} onClose={closeAirdrop}>
      <Box width="40.625rem" margin="auto">
        <Stack spacing={4}>
          <Typography
            variant="h2"
            fontFamily="BIN Regular"
            textAlign="center"
            mb={3}
          >
            claim airdrop
          </Typography>
          <Grid container>
            {Object.entries(pendingRewards)
              .filter(([_, reward]) => reward !== 0)
              .map(([index, reward]) => (
                <>
                  <Grid item xs={6}>
                    <Typography variant="h5" textAlign="left">
                      {(vestingData as any)[index].name}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Box
                      sx={{
                        display: "flex",
                        flex: "1 1 auto",
                        justifyContent: "flex-end",
                      }}
                    >
                      <DefiIcon width={32} height={32} icon={inst} />
                      <Typography variant="h5" color="white">
                        {reward.toFixed(tokens.strm.displayedDecimals + 2)}
                      </Typography>
                    </Box>
                  </Grid>
                </>
              ))}
          </Grid>

          {isAnythingToClaim ? (
            <Button
              disabled={isPendingClaim || !pendingRewards}
              fullWidth
              onClick={claim}
              variant="contained"
              color="primary"
            >
              Claim All
            </Button>
          ) : (
            <Typography variant="h4" color="GrayText" textAlign="center">
              Nothing to claim
            </Typography>
          )}
        </Stack>
      </Box>
    </Modal>
  );
};
