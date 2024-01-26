import { ethInst, inst } from "@/assets/tokens";
import Button from "@/components/Button";
import Container, { ContainerProps } from "@/components/ContainerSet";
import DepositWithdrawTabs from "@/components/DepositWithdrawTabs";
import Spacer from "@/components/Spacer";
import TimeLeft from "@/components/TimeLeft";
import Layout from "@/container/Layout";
import { useErc20Context } from "@/defi/Erc20Context";
import { useAppSelector } from "@/store";
import { useBlockNumber } from "@/store/blockchain/hooks";
import {
  LiquidityMiningPool,
  selectLiquidityMiningPools,
  selectLiquidityMiningUserInfo,
  selectLMPendingSTRM,
  UserLMInfo,
} from "@/store/liquidityMining/slice";
import {
  Box,
  Grid,
  GridProps,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useEffect, useState } from "react";

type GridAwareContainerSetProps = GridProps & ContainerProps;
type InfoBox = {
  [key: string]: GridAwareContainerSetProps;
};

const getInfoBox = (): InfoBox => {
  return {
    ethStrmAPY: {
      heading: "ETH-STRM APY",
      description: "0%",
      headingIcon: ethInst,
      sm: 4,
      xs: 12,
    },
    timeLeft: {
      heading: "Time left",
      description: <TimeLeft timestamp={Date.now()} />,
      sm: 4,
      xs: 12,
    },
    totalValueLocked: {
      heading: "Total value locked",
      description: "$0",
      sm: 4,
      xs: 12,
    },
    deposited: {
      heading: "Deposited",
      description: "$0",
      sm: 6,
      xs: 12,
    },
    climable: {
      heading: "Claimable",
      description: "0 STRM",
      descriptionIcon: inst,
      sm: 6,
      xs: 12,
    },
  };
};

const clone = getInfoBox();
const infoBoxes = getInfoBox();

const onUserInfoUpdate = (
  infoBoxes: InfoBox,
  userInfo: UserLMInfo,
  lpPrice: number,
  pendingSTRM: number,
): InfoBox => {
  infoBoxes.deposited.description = `$ ${(
    +userInfo.lockedLPTokens * lpPrice
  ).toFixed(2)}`;
  infoBoxes.climable.description = `${pendingSTRM.toFixed(2)} STRM`;
  return infoBoxes;
};

const onBlockUpdate = (
  infoBox: InfoBox,
  block: number,
  strmPrice: number,
  lpPrice: number,
  lmPool: LiquidityMiningPool,
): InfoBox => {
  if (lmPool.supply) {
    let instPerYear = lmPool.instrumentalPerBlock * 2021538 * strmPrice; // 3600 * 24 * 365
    let apy = (instPerYear / (lmPool.supply * lpPrice)) * 100;
    infoBox.totalValueLocked.description = `$ ${(
      lmPool.supply * lpPrice
    ).toFixed(2)}`;
    infoBox.ethStrmAPY.description = `${apy.toFixed(2)}%`;
  }
  let timeLeft3Wks = (lmPool.end - block) * (14 * 1000); // 14 second block time
  infoBox.timeLeft.description = (
    <TimeLeft timestamp={Date.now() + timeLeft3Wks} />
  );
  return infoBox;
};

const Staking = () => {
  const { tokens } = useErc20Context();
  const { eth_strm_lp, strm } = tokens;
  const ETHInstrumentalIcon = ethInst;
  const { blockNumber } = useBlockNumber();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("sm"));

  const liquidityMiningPools = useAppSelector(selectLiquidityMiningPools);
  const userInfo = useAppSelector(selectLiquidityMiningUserInfo);
  const pendingSTRM = useAppSelector(selectLMPendingSTRM);

  const [_staking3Wks, setStaking3Wks] = useState<InfoBox>(infoBoxes);
  const [_staking3Mos, setStaking3Mos] = useState<InfoBox>(clone);

  useEffect(() => {
    if (userInfo && Object.keys(userInfo).length === 2) {
      setStaking3Wks((staking3Wks) => {
        if (userInfo[0]) {
          return onUserInfoUpdate(
            staking3Wks,
            userInfo[0],
            eth_strm_lp.price,
            pendingSTRM[0],
          );
        }
        return staking3Wks;
      });

      setStaking3Mos((staking3Mos) => {
        if (userInfo[1]) {
          return onUserInfoUpdate(
            staking3Mos,
            userInfo[1],
            eth_strm_lp.price,
            pendingSTRM[1],
          );
        }
        return staking3Mos;
      });
    }
  }, [userInfo, pendingSTRM]);

  const fetchLMPools = async () => {
    if (blockNumber) {
      setStaking3Wks((staking3Wks) => {
        if (liquidityMiningPools[0]) {
          return onBlockUpdate(
            staking3Wks,
            blockNumber,
            strm.price,
            eth_strm_lp.price,
            liquidityMiningPools[0],
          );
        }

        return staking3Wks;
      });

      setStaking3Mos((staking3Mos) => {
        if (liquidityMiningPools[1]) {
          return onBlockUpdate(
            staking3Mos,
            blockNumber,
            strm.price,
            eth_strm_lp.price,
            liquidityMiningPools[1],
          );
        }
        return staking3Mos;
      });
    }
  };

  useEffect(() => {
    fetchLMPools();
  }, [blockNumber, liquidityMiningPools[0], liquidityMiningPools[1]]);

  return (
    <Layout>
      <Grid item xs={12} mt={14}>
        <Box>
          <Stack spacing={2} alignItems="center">
            <Typography
              textAlign="center"
              variant="h2"
              fontFamily="BIN Regular"
              mb={2}
            >
              3 month liquidity program
            </Typography>
            <Typography textAlign="center" variant="h5" color="text.secondary">
              Stake your STRM-ETH Sushiswap LP tokens for 3 months for superior
              yield.
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexDirection: isDesktop ? "row" : "column",
                justifyContent: "center",
                pt: 6,
                width: isDesktop ? "35rem" : "18rem",
              }}
            >
              <Button
                href="https://app.sushi.com/swap?inputCurrency=0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2&outputCurrency=0x0edf9bc41bbc1354c70e2107f80c42cae7fbbca8"
                variant="contained"
                fullWidth
                color="secondary"
                startIcon={<ETHInstrumentalIcon />}
              >
                <Typography variant="h6" ml={3} fontFamily="Jost">
                  Get STRM
                </Typography>
              </Button>
              <Button
                href="https://app.sushi.com/add/0x0edf9bc41bbc1354c70e2107f80c42cae7fbbca8/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"
                variant="contained"
                color="secondary"
                fullWidth
                startIcon={<ETHInstrumentalIcon />}
                sx={{
                  ml: isDesktop ? 2 : 0,
                  mt: isDesktop ? 0 : 2,
                }}
              >
                <Typography variant="h6" ml={3} fontFamily="Jost">
                  Get ETH-STRM
                </Typography>
              </Button>
            </Box>
          </Stack>
          <Spacer mt={12.5} />
          <Grid container spacing={3}>
            {Object.values(_staking3Mos).map(
              ({ heading, description, xs, sm, ...rest }, index) => (
                <Grid item xs={xs} sm={sm} key={index}>
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
          >
            <DepositWithdrawTabs token={eth_strm_lp} poolId={1} />
          </Grid>
          <Spacer mb={18} />
        </Box>

        <Box>
          <Stack spacing={3.5} pt={4}>
            <Typography
              textAlign="center"
              variant="h2"
              fontFamily="BIN Regular"
              mb={2}
            >
              3 week liquidity rush program
            </Typography>
            <Typography textAlign="center" variant="h5" color="text.secondary">
              The 3 week liquidity rush program has ended. Stake your STRM-ETH
              on the 3 month pool above to keep earning $STRM rewards.
            </Typography>
          </Stack>
          <Spacer mt={12.5} />
          <Grid container spacing={3}>
            {Object.values(_staking3Wks).map(
              ({ heading, description, xs, sm, ...rest }, index) => (
                <Grid item xs={xs} sm={sm} key={index}>
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
            mb={20}
          >
            <DepositWithdrawTabs token={eth_strm_lp} poolId={0} />
          </Grid>
        </Box>
      </Grid>
    </Layout>
  );
};

export default Staking;
