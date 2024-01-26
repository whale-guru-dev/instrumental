import { useAirdropModal } from "@/store/appsettings/hooks";
import { Button, ButtonProps, Typography } from "@mui/material";
// import { useWeb3React } from "@web3-react/core";
import { useConnector } from "@integrations-lib/core";
import * as React from "react";

export const ClaimAirdropButton = (props: ButtonProps) => {
  const { openAirdrop } = useAirdropModal();
  // const { account } = useWeb3React();
  const { account } = useConnector("metamask");

  if (!account) return null;

  return (
    <Button
      variant="contained"
      color="primary"
      onClick={openAirdrop}
      {...props}
    >
      <Typography variant="button">Claim</Typography>
    </Button>
  );
};
ClaimAirdropButton.muiName = "Button";
