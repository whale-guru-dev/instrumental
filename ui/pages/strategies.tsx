import Button from "@/components/Button";
import { TableData } from "@/components/Table";
import Layout from "@/container/Layout";
import { useAppSelector } from "@/store";
import { Box, Grid, Typography } from "@mui/material";
import { NextPage } from "next";
import { FC, useEffect, useState } from "react";
import { inst } from "@/assets/tokens";
import Image from "next/image";
// import { useWeb3React } from "@web3-react/core";
import { useConnector } from "@integrations-lib/core";
import { Strategy } from "@/store/strategies/slice";
import { ActivePositionsTable } from "@/components/Strategies/ActivePositionsTable";
import { DisconnectedStrategiesTable } from "@/components/Strategies/DisconnectedStrategiesTable";
import { SectionHeader } from "@/components/Strategies/SectionHeader";
import { ConnnectedStrategiesTable } from "@/components/Strategies/ConnectedStrategiesTable";

export const TABLE_HEADERS: Record<string, string>[] = [
  { asset: "Asset" },
  { apy: "APY" },
  { tvl: "Total value locked" },
  { totalFees: "Total Fees" },
  { cta: "" },
];

export const ACTIVE_TABLE_HEADERS: Record<string, string>[] = [
  { asset: "Asset" },
  { apy: "APY" },
  { tvl: "Total value locked" },
  { position: "Position" },
  { poolShare: "Pool share" },
  { totalFees: "Total Fees" },
  { earnings: "Earned" },
  { cta: "" },
];

const Home: FC<NextPage> = () => {
  const strategies = useAppSelector((state) => state.strategies);
  const [strategyData, setStrategyData] = useState<{
    activeStrategies: TableData[];
    allStrategies: TableData[];
  }>({
    activeStrategies: [],
    allStrategies: [],
  });
  // const { active } = useWeb3React();
  const { isActive: active } = useConnector("metamask");
  const Instrumental = inst ?? <></>;

  const loadStrategyData = (strategies: Strategy[]) => {
    return strategies.map((strategy) => {
      const url =
        strategy.type === "picasso" ? "strategies/picasso" : "strategies";

      const token = (
        <Box marginTop={0.5}>
          <Image src={strategy.asset.icon} width={24} height={24} />
        </Box>
      );

      return {
        asset: (
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignContent: "center",
            }}
          >
            {token}
            <Typography variant="body1">{strategy.asset.symbol}</Typography>
          </Box>
        ),
        apy: <>{strategy.apy}%</>,
        tvl: (
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignContent: "center",
            }}
          >
            {token}
            <Typography variant="body1">{strategy.tvl}</Typography>
            <Typography variant="body1" color="GrayText">
              {strategy.asset.symbol}
            </Typography>
          </Box>
        ),
        totalFees: (
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignContent: "center",
            }}
          >
            <Instrumental />
            <Typography variant="body1">{strategy.fees}</Typography>
            <Typography variant="body1" color="GrayText">
              STRM
            </Typography>
          </Box>
        ),
        cta: (
          <Button
            href={`${url}/${strategy.address}`}
            fullWidth
            disabled={!Boolean(strategy.address)}
            variant="outlined"
          >
            <Typography variant="body1">Deposit</Typography>
          </Button>
        ),
      };
    });
  };

  const loadActiveStrategyData = (strategies: Strategy[]) => {
    return strategies.map((strategy) => {
      const url =
        strategy.type === "picasso"
          ? `strategies/picasso?address=`
          : `strategies/`;

      const token = (
        <Box marginTop={0.5}>
          <Image src={strategy.asset.icon} width={24} height={24} />
        </Box>
      );

      return {
        asset: (
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignContent: "center",
            }}
          >
            {token}
            <Typography variant="body1">{strategy.asset.symbol}</Typography>
          </Box>
        ),
        apy: <>{strategy.apy}%</>,
        tvl: (
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignContent: "center",
            }}
          >
            {token}
            <Typography variant="body1">{strategy.tvl}</Typography>
            <Typography variant="body1" color="GrayText">
              {strategy.asset.symbol}
            </Typography>
          </Box>
        ),
        position: (
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignContent: "center",
            }}
          >
            <Instrumental />
            <Typography variant="body1">{strategy.position}</Typography>
            <Typography variant="body1" color="GrayText">
              STRM
            </Typography>
          </Box>
        ),
        poolShare: `${strategy.poolShare}%`,
        totalFees: (
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignContent: "center",
            }}
          >
            <Instrumental />
            <Typography variant="body1">{strategy.fees}</Typography>
            <Typography variant="body1" color="GrayText">
              STRM
            </Typography>
          </Box>
        ),
        earnings: (
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignContent: "center",
            }}
          >
            <Instrumental />
            <Typography variant="body1">+{strategy.fees}</Typography>
            <Typography variant="body1">STRM</Typography>
          </Box>
        ),
        cta: (
          <Button
            href={`${url}${strategy.address}`}
            fullWidth
            disabled={!Boolean(strategy.address)}
            variant="contained"
          >
            <Typography variant="body1">Manage</Typography>
          </Button>
        ),
      };
    });
  };

  useEffect(() => {
    let activeStrategies = loadActiveStrategyData(strategies.activeStrategies);
    let allStrategies = loadStrategyData(strategies.allStratgies);
    setStrategyData({
      activeStrategies,
      allStrategies,
    });
  }, [strategies]);

  return (
    <Layout>
      <Grid container mt={14}>
        <SectionHeader active={!!active} />
        <ActivePositionsTable
          active={!!active}
          activeStrategies={strategyData.activeStrategies}
        />
        <ConnnectedStrategiesTable
          active={!!active}
          strategies={strategyData.allStrategies}
          headers={TABLE_HEADERS}
        />
        <DisconnectedStrategiesTable
          active={!!active}
          allStrategies={strategyData.allStrategies}
        />
      </Grid>
    </Layout>
  );
};

export default Home;
