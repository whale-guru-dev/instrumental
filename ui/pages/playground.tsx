import { ethInst } from "@/assets/tokens";
import BigNumberInput from "@/components/BigNumberInput";
import Breadcrumb from "@/components/Breadcrumb";
import CloseRounded from "@/components/CloseRounded";
import Container, { ContainerProps } from "@/components/ContainerSet";
import Dropdown from "@/components/Dropdown";
import Footer from "@/components/Footer";
import IconButton from "@/components/IconButton";
import Loader from "@/components/Loader";
import OpenLink from "@/components/OpenLink";
import Snackbar from "@/components/Snackbar";
// import {NETWORKS} from "@/defi/networks";
import Strategy from "@/components/Strategies";
import TimeLeft from "@/components/TimeLeft";
import { tokensArray } from "@/defi/tokenInfo";
import HistoryIcon from "@mui/icons-material/History";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import {
  Button,
  Container as MuiContainer,
  GridProps,
  Typography,
} from "@mui/material";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import BigNumber from "bignumber.js";
import * as React from "react";
import Link from "../components/Link";

// const EthIcon: any = NETWORKS[1].logo;

type BoxInfo = GridProps & ContainerProps;
const boxInformation: BoxInfo[] = [
  {
    heading: "ETH-STRM APY",
    description: "567%",
    headingIcon: ethInst,
    xs: 6,
    active: false,
  },
  {
    heading: "INST APY",
    description: "252%",
    xs: 6,
  },
  {
    heading: "Deposited",
    description: "$10,846",
    xs: 3,
  },
  {
    heading: "Expected rewards",
    description: "$2,156",
    xs: 3,
  },
  {
    heading: "Earned",
    description: "15 INST",
    xs: 3,
  },
  {
    heading: "Advanced Blockchain",
    description: "ABAG",
    xs: 3,
  },
];

export default function Index() {
  return (
    <MuiContainer maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
        Playground
      </Typography>

      <Box mb="10px">
        <Button variant="contained" color="primary">
          Primary Button
        </Button>
      </Box>

      <Box mb="10px">
        <Button variant="contained" color="secondary">
          Secondary Button
        </Button>
      </Box>

      <Box mb="10px">
        <Button variant="contained" color="secondary">
          Ethereum
        </Button>
      </Box>

      <Box mb="10px">
        <Button variant="contained" color="primary" disabled>
          Disabled Button
        </Button>
      </Box>

      <Box mb="10px">
        <IconButton Icon={<SwapHorizIcon fontSize="small" />} />
      </Box>

      <Box mb="10px">
        <IconButton Icon={<HistoryIcon fontSize="small" />} />
      </Box>

      <Box py={1}>
        <Breadcrumb
          link={{
            text: "Explorer",
            to: "#",
          }}
        />
      </Box>
      <Box py={1}>
        <Dropdown
          id="name"
          width={200}
          height={30}
          onChange={(event: any) => console.log(`Clicked ${event}`)}
          data={tokensArray}
        />
      </Box>

      <Box py={1}>
        <BigNumberInput
          value={new BigNumber(0)}
          maxValue={new BigNumber(50)}
          isValid={(state) => {
            console.log("State is Valid:", state);
          }}
          forceDisable={false}
          forceMaxWidth={false}
          setter={(setterValue) => {
            console.log("Setter Value:", setterValue);
          }}
          size="small"
          fullWidth
          placeholder="Enter amount"
          adornmentStart={
            <Dropdown
              id="name"
              width={200}
              height={30}
              onChange={(event: any) => console.log(`Clicked ${event}`)}
              data={tokensArray}
            />
          }
          adornmentEnd={
            <Typography variant="button" color="primary">
              Max
            </Typography>
          }
        />
      </Box>

      <Box py={1}>
        <Strategy name="eth_strm_lp" />
      </Box>

      <Breadcrumb
        link={{
          text: "Explorer",
          to: "#",
        }}
      />

      <Box mb="10px">
        <OpenLink color="gray" />
        <OpenLink color="green" />
        <OpenLink color="red" />
        <OpenLink color="blue" />
        <OpenLink color="purple" />
        <Box mb="10px">
          <OpenLink color="gray" />
          <OpenLink color="green" />
          <OpenLink color="red" />
          <OpenLink color="blue" />
          <OpenLink color="purple" />
        </Box>

        <Box mb="10px">
          <CloseRounded color="gray" />
          <CloseRounded color="green" />
          <CloseRounded color="red" />
          <CloseRounded color="blue" />
        </Box>

        <Box mb="10px">
          <Loader />
        </Box>
      </Box>

      <Box mb="10px">
        <CloseRounded color="gray" />
        <CloseRounded color="green" />
        <CloseRounded color="red" />
        <CloseRounded color="blue" />
      </Box>

      <Grid container spacing={2} mb="10px">
        <Grid item>
          <Link href="#">Max</Link>
        </Grid>
        <Grid item>
          <Link
            href="https://www.advancedblockchain.com/"
            target="_blank"
            rel="noopener"
          >
            Advanced Blockchain
          </Link>
        </Grid>
      </Grid>

      <Box mb="10px">
        <Snackbar color="green" />
        <Snackbar color="blue" />
        <Snackbar color="red" />
      </Box>

      <Box mb="10px">
        {boxInformation.map(({ heading, description, xs, ...rest }, index) => (
          <Grid item xs={xs}>
            <Container
              heading={heading}
              description={description}
              key={index}
              {...rest}
            />
          </Grid>
        ))}
      </Box>
      <Box mb="10px">
        <TimeLeft timestamp={1640995199000} />
      </Box>

      <Box mb="10px">
        <Loader />
      </Box>
      <Footer />
    </MuiContainer>
  );
}
