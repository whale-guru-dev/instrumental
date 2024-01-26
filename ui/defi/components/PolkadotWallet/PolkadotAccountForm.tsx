import { Box, Button, Typography, useTheme } from "@mui/material";
import { useAppDispatch, useAppSelector } from "@/store";
import { Account, resetPolkadot } from "@/store/polkadot/slice";
import { dotsama } from "@/assets/wallets";

export const PolkadotAccountForm: React.FC<{
  onSelectChange?: (account: Account) => void;
}> = ({ onSelectChange }) => {
  const WalletLogo = dotsama ?? <></>;
  const theme = useTheme();
  const dispatch = useAppDispatch();

  const handleDisconnect = () => {
    dispatch(resetPolkadot());
  };

  const polkadotAccounts = useAppSelector((state) => state.polkadot.accounts);
  const connected = useAppSelector((state) => state.polkadot.connected);

  return (
    <Box
      sx={{
        marginTop: theme.spacing(8),
        display: "flex",
        flexDirection: "column",
        gap: 4,
        width: "100%",
      }}
    >
      {polkadotAccounts.map((account, index) => (
        <Button
          key={index}
          variant="outlined"
          color="success"
          size="large"
          fullWidth
          onClick={() => {
            if (onSelectChange) {
              onSelectChange(account);
            }
          }}
          sx={{
            display: "grid",
            alignContent: "center",
            gridTemplateColumns: "3rem 1fr",
            gap: 2,
            px: 1,
            py: 0,
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifySelf: "center",
              alignSelf: "center",
            }}
          >
            <WalletLogo />
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography
              variant="h6"
              textAlign="center"
              sx={{
                alignSelf: "center",
                justifySelf: "stretch",
                height: "2rem",
                pr: 5,
              }}
            >
              {account.label}
            </Typography>
          </Box>
        </Button>
      ))}
      {connected && (
        <Button
          fullWidth
          variant="contained"
          color="error"
          onClick={() => handleDisconnect()}
        >
          Disconnect wallet
        </Button>
      )}
    </Box>
  );
};
