import SelectNetwork from "@/components/SelectNetwork/select-network";
import { NETWORKS } from "@/defi/networks";
import { TokenInfo } from "@/defi/reducers/tokensReducer";
import { Box, Grid, Tab, Tabs } from "@mui/material";
import React, { useCallback } from "react";
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
  const [value, setValue] = React.useState<TabType>(
    poolId === 0 ? TabType.WITHDRAW : TabType.DEPOSIT,
  );

  const handleChange = (_event: React.SyntheticEvent, newValue: TabType) => {
    setValue(newValue);
  };

  const onSelectChange = useCallback((event: any) => {
    console.log(event.target.value);
  }, []);

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
          <Tab label="Withdraw" />
        </Tabs>
      </Box>
      {value === 1 && (
        <SelectNetwork
          options={Object.values(NETWORKS)}
          keyPropFn={(option: any) => option.name}
          valuePropFn={(option: any) => option.name}
          id="select-network"
          heading="Select withdraw network"
          onChange={onSelectChange}
        />
      )}
      <TabPanel value={value} index={0} sx={tabPanelSpacing}>
        <TransferForm
          poolId={poolId}
          token={token}
          heading={`Deposit stablecoins`}
          balance={token.balanceBN}
          interactionType="deposit"
        />
        <Spacer sx={{ marginY: (theme) => theme.spacing(6) }} />
      </TabPanel>
      <TabPanel value={value} index={1} sx={tabPanelSpacing}>
        <TransferForm
          poolId={poolId}
          token={token}
          heading={`Withdraw`}
          balance={token.balanceBN}
          interactionType="withdraw"
        />
        <Spacer sx={{ marginY: (theme) => theme.spacing(6) }} />
      </TabPanel>
    </Grid>
  );
};
