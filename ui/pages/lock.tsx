import React, { useContext, useEffect, useState } from "react";
import Layout from "@/container/Layout";
import {
  Box,
  Stack,
  Grid,
  Typography,
  Button,
  Tab,
  Tabs,
  GridProps,
} from "@mui/material";
import BalanceInputAdornment from "@/components/BalanceInputAdornment";
import BigNumberInput from "@/components/BigNumberInput";
import TabPanel from "@/components/TabPanel";
import { BigNumber } from "bignumber.js";
import RadioButtonGroup from "@/components/RadioButtonGroup";
import Spacer from "@/components/Spacer";
import Link from "@/components/Link";
import { useErc20Context } from "@/defi/Erc20Context";

// import { useWeb3React } from "@web3-react/core";
import { useConnector, useBlockchainProvider } from "@integrations-lib/core";
import { ethers } from "ethers";
import { toBaseUnitBN, toTokenUnitsBN } from "@/utils";
import { usePendingTransactions } from "@/hooks/usePendingTransactions";
import { useAppSelector } from "@/store";
import { selectveSTRM } from "@/store/veSTRM/slice";
import { ContractsContext } from "@/defi/ContractsContext";
import Container, { ContainerProps } from "@/components/ContainerSet";
import TimeLeft from "@/components/TimeLeft";
import { inst, veStrm } from "@/assets/tokens";
import { useAddresses } from "@/defi/hooks";
import {
  LockPeriods,
  LOCK_PERIODS_TO_DAYS,
  LOCK_PERIODS_TO_MONTHS,
} from "@/constants/locking";
import { ERC20Service } from "@/defi/contracts/erc20";
import { ADDRESSES } from "@/defi/addresses";
import { NETWORKS } from "@/defi/networks";
import { handleErr } from "@/defi/errorHandling";
import { gqlClient } from "@/store/graphql";
import DefiIcon from "@/components/DefiIcon";
import InfoIcon from "@mui/icons-material/Info";
import { IThemeOptions } from "@/styles/theme";
import { useAirdropModal } from "@/store/appsettings/hooks";
import { getToken } from "@/defi/tokenInfo";

const tabPanelSpacing = {
  paddingTop: "4.0625rem",
};
type GridAwareContainerSetProps = {
  [key: string]: GridProps & ContainerProps;
};

const boxInformation: GridAwareContainerSetProps = {
  tvlStrm: {
    heading: "Total value locked",
    description: "0 STRM",
    headingIcon: inst,
    xs: 6,
    md: 4,
  },
  totalVeStrm: {
    heading: "Total veSTRM",
    headingIcon: veStrm,
    description: "1,019,565 veSTRM",
    xs: 6,
    md: 4,
  },
  averageLockTime: {
    heading: "Average lock time",
    description: "3y - 6m",
    xs: 6,
    md: 4,
  },
  yourLockTimeLeft: {
    heading: "Your lock time left",
    description: <TimeLeft timestamp={0} />,
    xs: 6,
    md: 4,
  },
  yourDeposit: {
    heading: "Your deposit",
    description: "0 STRM",
    xs: 6,
    md: 4,
  },
  /*
  yourVeStrmStatus: {
    heading: "Your veSTRM status",
    headingIcon: veStrm,
    description: (
      <Box
        sx={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mx: 2,
        }}
      >
        <Box sx={{ flex: "0 0 auto" }}>
          <Typography variant="body2" fontFamily="Jost">
            0 STRM
          </Typography>
        </Box>
        <Box sx={{ width: "100%", mx: 2 }}>
          <LinearProgress variant="buffer" value={100} valueBuffer={100} />
        </Box>
        <Box
          sx={{
            flex: "0 0 auto",
            height: "1.5rem",
            alignItems: "center",
            display: "flex",
          }}
        >
          <Box>
            <Typography variant="body2" fontFamily="Jost">
              0 STRM
            </Typography>
          </Box>
          <Box height="1.5rem" ml={1}>
            <InfoIcon
              sx={{
                color: (theme: unknown) =>
                  (theme as IThemeOptions).palette.text.accent,
              }}
            />
          </Box>
        </Box>
      </Box>
    ),
    md: 4,
    xs: 6,
  },
  */
  yourCurrentVeStrm: {
    heading: "Your current veSTRM",
    headingIcon: veStrm,
    description: "0 veSTRM",
    xs: 6,
    md: 4,
  },
};

const getVotingPowerNumber = (amount: BigNumber, duration: number) => {
  let x;
  switch (duration) {
    case 24:
      x = amount.multipliedBy(0.5);
      return x.minus(x.multipliedBy(0.025));
    case 12:
      x = amount.multipliedBy(0.25);
      return x.minus(x.multipliedBy(0.025));
    case 6:
      x = amount.multipliedBy(0.125);
      return x.minus(x.multipliedBy(0.025));
    case 3:
      x = amount.multipliedBy(0.125 / 2);
      return x.minus(x.multipliedBy(0.025));
    default:
      x = amount.multipliedBy(0.125 / 6);
      return x.minus(x.multipliedBy(0.025));
  }
};

const LabelForRadioButton: React.FC<{
  period: number;
  transferValue: BigNumber;
}> = ({ transferValue, period }) => {
  const votingPower = React.useMemo(() => {
    return getVotingPowerNumber(transferValue, period).toFormat(0);
  }, [transferValue, period]);
  const periodLabel = React.useMemo(() => {
    if (period < 12) {
      return `${period}m`;
    } else {
      return `${period / 12}y`;
    }
  }, [period]);
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexDirection: "column",
      }}
    >
      <Box>
        <Typography variant="body1" fontFamily="Jost" color="text.secondary">
          {periodLabel} lock
        </Typography>
      </Box>
      <Box sx={{ display: "flex", flex: "1 1 auto" }}>
        <DefiIcon width={32} height={32} icon={veStrm} />
        <Typography variant="h4" color="white">
          {votingPower}
        </Typography>
      </Box>
    </Box>
  );
};

const Lock = () => {
  const { openAirdrop } = useAirdropModal();

  const { account } = useConnector("metamask");
  const { chainId, contracts } = useContext(ContractsContext);
  const { provider: library } = useBlockchainProvider(chainId);
  const { tokens } = useErc20Context();
  const { strm } = tokens;
  const asset = getToken(strm.tokenId);
  const veSTRM = useAppSelector(selectveSTRM);
  const [approved, setApproved] = useState(false);
  const [value, setValue] = React.useState<number>(0);
  const [error, setError] = React.useState<false | true>(false);
  const [selectedLockPeriod, setSelectedLockPeriod] =
    React.useState<LockPeriods>(25);

  const addresses = useAddresses();
  const [transferValue, setTransferValue] = React.useState<BigNumber>(
    new BigNumber(0),
  );
  const InstrumentalIcon = inst;
  let isPendingLockTx = usePendingTransactions(addresses.veSTRM, [
    "create_lock_days",
    "increase_amount",
    "increase_unlock_time_days",
  ]);
  let isPendingApproveTx = usePendingTransactions(addresses.strm, "approve");

  const [tvl, setTvl] = useState(0);

  const [_userPeriod, setUserPeriod] = useState<LockPeriods>();

  useEffect(() => {
    const provider = new ethers.providers.StaticJsonRpcProvider(
      NETWORKS[1].rpcUrl,
      1,
    );

    const strmERC20 = new ERC20Service(
      ADDRESSES.strm[1],
      provider as any,
      "",
      "" as any,
    );

    handleErr(() => strmERC20.balanceOf(ADDRESSES.veSTRM[1]), 10)
      .then((x: ethers.BigNumber) => {
        setTvl(toTokenUnitsBN(x.toString(), 18).toNumber());
      })
      .catch((e) => console.warn(e));
  }, []);

  const setValidation = (valid: boolean) => {
    if (valid) {
      setError(true);
    } else {
      setError(false);
    }
  };

  const [_boxes, setBoxes] = useState<typeof boxInformation>(boxInformation);

  useEffect(() => {
    setBoxes((s) => {
      s.tvlStrm.description = new BigNumber(tvl).toFormat(0) + " STRM";
      return s;
    });
  }, [tvl]);

  const [_canWithdraw, setCanWithdraw] = useState(false);

  useEffect(() => {
    setBoxes((s) => {
      // [TODO: Defi] - this is moved as comments since the original data is removed.
      // s.yourAPY.description =
      //   veSTRM.locked !== 0
      //     ? getCurrentLockStrmApyPercentageForPeriod(
      //         tvl,
      //         _userPeriod ?? 4,
      //         true,
      //       )
      //     : "0"; // TODO fix

      s.yourDeposit.description = new BigNumber(veSTRM.locked).toFormat(2);
      s.yourCurrentVeStrm.description = new BigNumber(veSTRM.balance).toFormat(
        2,
      );

      s.totalVeStrm.description = new BigNumber(veSTRM.totalSupply).toFormat(2);

      const timestamp = veSTRM.end ? veSTRM.end * 1000 : 0;
      const futureDate = timestamp;
      const now = new Date().getTime();
      setCanWithdraw(futureDate - now <= 0);
      s.yourLockTimeLeft.description = <TimeLeft timestamp={timestamp} />;

      return s;
    });
  }, [
    veSTRM.end,
    veSTRM.locked,
    tvl,
    _userPeriod,
    veSTRM.balance,
    veSTRM.totalSupply,
  ]);

  useEffect(() => {
    if (contracts && strm.allowance && account) {
      strm
        .allowance(account, contracts.votingEscrow.getContractAddress())
        .then((allowanceEthersBn) => {
          if (
            allowanceEthersBn.gte(
              ethers.BigNumber.from("0xffffffffffffffffffffffff"),
            )
          ) {
            setApproved(true);
          } else {
            setApproved(false);
          }
        });
    }
  }, [contracts, strm, account]);

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const approve = async (): Promise<void> => {
    if (strm.allowance && strm.approveMax && chainId) {
      const tx = await strm.approveMax(addresses.veSTRM);

      await tx.wait();
      setApproved(true);
    }
  };

  const lock = async (weeks: LockPeriods): Promise<void> => {
    let transferValConv = toBaseUnitBN(transferValue.toFixed(), strm.decimals);

    if (library && account && contracts) {
      let unlockTime = ethers.BigNumber.from(LOCK_PERIODS_TO_DAYS[weeks]);
      const txr = await contracts.votingEscrow.create_lock_days(
        transferValConv,
        unlockTime,
      );

      txr.wait();
    }
  };

  const withdraw = async (): Promise<void> => {
    if (library && account && contracts) {
      const txr = await contracts.votingEscrow.withdraw();
      txr.wait();
    }
  };

  useEffect(() => {
    // TODO move this to the slice and updater
    const GET_USER_LOCK_PERIOD = `query GetUser($address: String!) {
  user(id: $address) {
    days
  }
}
`;

    if (account) {
      gqlClient
        .query(GET_USER_LOCK_PERIOD, { address: account.toLowerCase() })
        .toPromise()
        .then((x) => {
          const {
            data: { user },
          } = x;
          let days = 0;
          if (user !== null) {
            days = parseInt(user.days);
            const found = Object.entries(LOCK_PERIODS_TO_DAYS).find(
              ([_k, v]) => v === days,
            );
            if (found) {
              setUserPeriod(parseInt(found[0]) as LockPeriods);
              setSelectedLockPeriod(parseInt(found[0]) as LockPeriods);
            }
          }
        });
    }
  }, [account]);

  useEffect(() => {
    // TODO move this to the slice and updater
    const GET_LOCK_GENERAL_DATA = `query getGeneralData {
      lockingGeneralInfos {
        averageDaysLocked
      }
}
`;

    gqlClient
      .query(GET_LOCK_GENERAL_DATA)
      .toPromise()
      .then((x) => {
        const averageDays = parseInt(
          x.data.lockingGeneralInfos[0].averageDaysLocked,
        );
        setBoxes((s) => {
          const avgTime = new Date(averageDays * 24 * 60 * 60 * 1000).getTime();
          s.averageLockTime.description = (
            <TimeLeft timestamp={avgTime} startTime={1} />
          );

          return s;
        });
      });
  }, []);

  const increaseAmount = async (): Promise<void> => {
    let transferValConv = toBaseUnitBN(transferValue.toFixed(), strm.decimals);

    if (library && account && contracts) {
      const txr = await contracts.votingEscrow.increase_amount(transferValConv);

      txr.wait();
    }
  };

  const increasePeriod = async (weeks: LockPeriods): Promise<void> => {
    if (library && account && contracts && _userPeriod) {
      let unlockTime = ethers.BigNumber.from(
        LOCK_PERIODS_TO_DAYS[weeks] - LOCK_PERIODS_TO_DAYS[_userPeriod],
      );
      const txr = await contracts.votingEscrow.increase_unlock_time_days(
        unlockTime,
      );

      txr.wait();
    }
  };

  return (
    <Layout>
      <Grid item xs={12} mt={14}>
        <Box>
          <Stack spacing={3.5} alignItems="center">
            <Typography
              textAlign="center"
              variant="h2"
              fontFamily="BIN Regular"
              mb={2}
            >
              lock
            </Typography>
            <Typography textAlign="center" variant="h5" color="text.secondary">
              Lock STRM tokens to gain voting power.
            </Typography>
            <Link
              href="https://app.sushi.com/swap?inputCurrency=0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2&outputCurrency=0x0edf9bc41bbc1354c70e2107f80c42cae7fbbca8"
              isExternal
              sx={{ pt: 3 }}
            >
              <Button
                variant="contained"
                color="secondary"
                startIcon={<InstrumentalIcon />}
                sx={{ width: "400px" }}
              >
                <Typography variant="h6" fontFamily="Jost">
                  Get STRM
                </Typography>
              </Button>
            </Link>
          </Stack>
          <Spacer mt={12.5} />
          <Grid container spacing={3}>
            {Object.values(boxInformation).map(
              ({ xs, md, heading, description, ...rest }, index) => (
                <Grid item xs={xs} md={md} key={index}>
                  <Container
                    heading={heading}
                    description={description}
                    {...rest}
                  />
                </Grid>
              ),
            )}
          </Grid>
          <Grid
            item
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            xs={12}
            mt={16}
            sx={{
              minHeight: "60vh",
            }}
          >
            <Grid item sx={{ width: "100%" }} mx="auto" xs={12} sm={10} md={8}>
              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <Tabs
                  variant="fullWidth"
                  value={value}
                  onChange={handleChange}
                  aria-label="deposit-withdraw tabs"
                >
                  <Tab label="Deposit" />
                  <Tab label="Withdraw &amp; Claim" />
                </Tabs>
              </Box>
              <TabPanel value={value} index={0} sx={tabPanelSpacing}>
                <Typography variant="h3" fontFamily="BIN Regular">
                  deposit strm &amp; gain voting power
                </Typography>
                <BigNumberInput
                  isValid={setValidation}
                  forceMaxWidth
                  sx={{ marginTop: "2rem" }}
                  maxValue={strm.balanceBN}
                  adornmentEnd={
                    <Link onClick={() => setTransferValue(strm.balanceBN)}>
                      Max
                    </Link>
                  }
                  adornmentStart={
                    <Box
                      sx={{
                        pl: 2,
                        gap: 1,
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <Box>
                        <DefiIcon height={24} width={24} icon={asset.picture} />
                      </Box>
                      <Box>
                        <Typography variant="body2" fontFamily="Jost">
                          {asset.symbol}
                        </Typography>
                      </Box>
                    </Box>
                  }
                  placeholder="Enter amount"
                  labelValue={
                    <BalanceInputAdornment
                      balance={strm.balanceBN}
                      token={strm}
                      maxDecimals={strm.displayedDecimals}
                    />
                  }
                  labelKey="Amount"
                  setter={setTransferValue}
                  value={transferValue}
                />
                <Spacer mt={6} />
                <Typography variant="h3" fontFamily="BIN Regular">
                  Select lock period{" "}
                  <InfoIcon
                    sx={{
                      color: (theme: unknown) =>
                        (theme as IThemeOptions).palette.text.accent,
                    }}
                  />
                </Typography>

                <Spacer mt={4.25} />
                <Typography variant="h5" color="grayText">
                  Your starting voting power increases with initial lock time.
                </Typography>
                <Spacer mt={3} />
                <RadioButtonGroup
                  options={Object.entries(LOCK_PERIODS_TO_MONTHS).map(
                    ([period, months]) => {
                      return {
                        isDisabled: _userPeriod
                          ? LOCK_PERIODS_TO_MONTHS[_userPeriod] >= months
                          : false,
                        label: (
                          <LabelForRadioButton
                            transferValue={transferValue}
                            period={months}
                          />
                        ),
                        value: period,
                      };
                    },
                  )}
                  value={selectedLockPeriod}
                  onChange={(value) => setSelectedLockPeriod(value)}
                />
                <Spacer mt={4} />
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  disabled={
                    !error ||
                    isPendingApproveTx ||
                    isPendingLockTx ||
                    !account ||
                    (veSTRM.locked === 0 && transferValue.isZero()) ||
                    (_userPeriod &&
                      _userPeriod === selectedLockPeriod &&
                      transferValue.isZero())
                  }
                  onClick={() => {
                    approved
                      ? _userPeriod && _userPeriod !== selectedLockPeriod
                        ? increasePeriod(selectedLockPeriod)
                        : veSTRM.locked !== 0
                        ? increaseAmount()
                        : lock(selectedLockPeriod)
                      : approve();
                  }}
                >
                  {approved
                    ? _userPeriod && _userPeriod !== selectedLockPeriod
                      ? "Update lock period"
                      : veSTRM.locked !== 0
                      ? "Increase locked amount"
                      : "Lock"
                    : "Approve"}
                </Button>
              </TabPanel>
              <TabPanel value={value} index={1} sx={tabPanelSpacing}>
                <Spacer mt={4} />
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Container
                      heading={"STRM Deposited"}
                      description={`${new BigNumber(veSTRM.locked).toFormat(
                        2,
                      )} STRM`}
                      headingIcon={inst}
                    />
                  </Grid>
                </Grid>
                <Spacer mt={3} />
                <Grid container spacing={3}>
                  <Grid item xs={6}>
                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      disabled={new BigNumber(veSTRM.locked).isZero()}
                      onClick={() => withdraw()}
                    >
                      Withdraw
                    </Button>
                  </Grid>
                  <Grid item xs={6}>
                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      onClick={() => openAirdrop()}
                    >
                      Claim rewards
                    </Button>
                  </Grid>
                </Grid>
              </TabPanel>
            </Grid>
          </Grid>
        </Box>
      </Grid>
    </Layout>
  );
};

export default Lock;
