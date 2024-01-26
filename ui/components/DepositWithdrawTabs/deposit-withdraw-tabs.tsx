import { TokenInfo } from "@/defi/reducers/tokensReducer";
import { Box, Grid, Tab, Tabs } from "@mui/material";
import React from "react";
import { Spacer } from "../Spacer/spacer";
import TabPanel from "../TabPanel";
import { TransferForm } from "./transfer-form";

const tabPanelSpacing = {
  paddingTop: "4.0625rem",
};

enum TabType {
  DEPOSIT,
  WITHDRAW,
}

export const DepositWithdrawTabs: React.FC<{
  token: TokenInfo;
  poolId: 0 | 1; // 1 - 3 months and 0 - 3 weeks
}> = ({ token, poolId }): JSX.Element => {
  const [value, setValue] = React.useState<TabType>(TabType.WITHDRAW);

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
          <Tab label="Deposit" disabled={true} />
          <Tab label="Withdraw" />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0} sx={tabPanelSpacing}>
        <TransferForm
          poolId={poolId}
          token={token}
          heading={`deposit LP & earn rewards`}
          balance={token.balanceBN}
          interactionType="deposit"
        />
        <Spacer sx={{ marginY: (theme) => theme.spacing(6) }} />
      </TabPanel>
      <TabPanel value={value} index={1} sx={tabPanelSpacing}>
        <TransferForm
          poolId={poolId}
          token={token}
          heading={`this pool has ended`}
          balance={token.balanceBN}
          interactionType="withdraw"
        />
        <Spacer sx={{ marginY: (theme) => theme.spacing(6) }} />
      </TabPanel>
    </Grid>
  );
};
