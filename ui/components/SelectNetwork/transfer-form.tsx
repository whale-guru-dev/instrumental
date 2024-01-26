import { Typography, Button, Box } from "@mui/material";
import React from "react";
import BigNumberInput from "../BigNumberInput";
import { BigNumber } from "bignumber.js";
import { getToken } from "@/defi/tokenInfo";
import DefiIcon from "@/components/DefiIcon";
type TransferFormProps = {
  heading?: string;
};

export const TransferForm: React.FC<TransferFormProps> = ({ heading }) => {
  const [_, setError] = React.useState<string | boolean>(true);
  const [transferValue, setTransferValue] = React.useState<BigNumber>(
    new BigNumber(0),
  );
  const asset = getToken("eth_strm_lp");

  const setValidation = (valid: boolean) => {
    if (valid) {
      setError(true);
    } else {
      setError("Invalid amount");
    }
  };

  return (
    <>
      {heading && (
        <Typography
          variant="h3"
          fontFamily="BIN Regular"
          sx={{
            marginBottom: (theme) => theme.spacing(3),
          }}
        >
          {heading}
        </Typography>
      )}
      <BigNumberInput
        isValid={setValidation}
        forceMaxWidth
        sx={{ marginTop: "1.5rem" }}
        maxValue={new BigNumber(0)}
        adornmentEnd={
          <Button variant="text" color="primary">
            <Typography variant="h6" fontFamily="Jost">
              Max
            </Typography>
          </Button>
        }
        adornmentStart={
          <Box sx={{ pl: 2, display: "flex", alignItems: "center" }}>
            <DefiIcon height={24} width={52} icon={asset.picture} />
            <Typography variant="h6" fontFamily="Jost">
              TriCrypto
            </Typography>
          </Box>
        }
        placeholder="Enter amount"
        labelKey="Balance"
        setter={setTransferValue}
        value={transferValue}
      />
      <Button
        size="large"
        fullWidth
        disabled
        variant="contained"
        color="primary"
        sx={{ mt: 3 }}
      >
        <Typography variant="button">Approve</Typography>
      </Button>
    </>
  );
};
