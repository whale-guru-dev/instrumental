// import { NETWORKS } from "@/defi/networks";
import { Box, Grid, Tab, Tabs } from "@mui/material";
import BigNumber from "bignumber.js";
import React from "react";
import { Spacer } from "../Spacer/spacer";
import TabPanel from "../TabPanel";
import { TransferForm } from "./transfer-form";
import { NetworkSelector } from "@/components/MegaSelector/NetworkSelector";
import { TEST_SUPPORTED_NETWORKS } from "@/submodules/contracts-operations/src/defi/constants";

const tabPanelSpacing = {
  paddingTop: "4.0625rem",
};

enum TabType {
  DEPOSIT,
  WITHDRAW,
}

export const DepositWithdrawTabs: React.FC<{
  active?: boolean;
  poolId: 0 | 1;
}> = ({ active, poolId }): JSX.Element => {
  const [value, setValue] = React.useState<TabType>(TabType.DEPOSIT);
  const [_balance, _setBalance] = React.useState<BigNumber>(new BigNumber(23));

  const handleChange = (_event: React.SyntheticEvent, newValue: TabType) => {
    setValue(newValue);
  };

  return (
    <Grid item sx={{ width: "100%" }} mx="auto" xs={12} sm={10} md={8}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          variant="fullWidth"
          value={value}
          onChange={handleChange}
          aria-label="deposit-withdraw tabs"
        >
          <Tab label="Deposit" />
          <Tab label="Withdraw" disabled={poolId === 1} />
        </Tabs>
      </Box>
      {!active && (
        <Box sx={{ py: 5 }}>
          <NetworkSelector
            onChange={console.log}
            networks={Object.values(TEST_SUPPORTED_NETWORKS)}
            value={Object.values(TEST_SUPPORTED_NETWORKS)[0]}
          />
        </Box>
      )}
      <TabPanel value={value} index={0} sx={tabPanelSpacing}>
        <TransferForm
          heading={active ? `deposit receipt tokens` : `deposit Tricrypto`}
        />
        <Spacer sx={{ marginY: (theme) => theme.spacing(6) }} />
      </TabPanel>
      <TabPanel value={value} index={1} sx={tabPanelSpacing}>
        <TransferForm heading={`withdraw`} />
        <Spacer sx={{ marginY: (theme) => theme.spacing(6) }} />
      </TabPanel>
    </Grid>
  );
};
