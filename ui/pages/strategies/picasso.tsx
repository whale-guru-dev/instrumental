import PicassoLogo from "@/assets/icons-abag-picasso@2x.png";
import { crvTricryptoUsdBtcEth, inst } from "@/assets/tokens";
import Breadcrumb from "@/components/Breadcrumb";
import Container from "@/components/ContainerSet";
import DefiIcon from "@/components/DefiIcon";
import Link from "@/components/Link";
import PicassoDepositWithdrawTabs from "@/components/PicassoDepositWithdrawTabs";
import DepositWithdrawTabs from "@/components/SelectNetwork";
import Spacer from "@/components/Spacer";
import Stepper from "@/components/Stepper";
import Layout from "@/container/Layout";
import { useErc20Context } from "@/defi/Erc20Context";
import { Box, Grid, Stack, Typography } from "@mui/material";
import { NextPage } from "next";
import Image from "next/image";
import { useState } from "react";

const steps = ["Deposited", "Bridged", "Deposited", "Invested"];

const Picasso: NextPage = () => {
  const { tokens } = useErc20Context();
  const [activeStep, _setActiveStep] = useState(0);
  const [progress, _setProgress] = useState(0);
  const { eth_strm_lp } = tokens;
  const data = {
    totalValueLocked: {
      heading: "Total value locked",
      description: "$89,958,324",
      md: 4,
      sm: 3,
      xs: 12,
      active: true,
    },
    apy: {
      heading: "APY",
      description: "786%",
      md: 4,
      sm: 3,
      xs: 12,
      active: true,
    },
    totalDeposited: {
      heading: "Deposited",
      description: "$0",
      md: 4,
      sm: 3,
      xs: 12,
      active: false,
    },
    expectedRewards: {
      heading: "Expected rewards",
      description: "0 INST",
      descriptionIcon: inst,
      md: 4,
      sm: 3,
      xs: 12,
      active: false,
    },
  };
  return (
    <Layout>
      <Stack px="20px">
        <Box>
          <Breadcrumb
            link={{
              text: "strategies",
              to: "/strategies",
            }}
          />
        </Box>
        <Grid item xs={12} mt={14}>
          <Box>
            <Stack spacing={2} alignItems="center">
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Image
                  width={48}
                  height={48}
                  src={PicassoLogo}
                  alt="Picasso Logo"
                />
                <Typography
                  textAlign="center"
                  variant="h2"
                  fontFamily="BIN Regular"
                  mb={4}
                  ml={2}
                >
                  picasso
                </Typography>
              </Box>
              <Typography
                sx={{ display: "flex" }}
                textAlign="center"
                variant="h5"
                color="text.secondary"
              >
                This startegy allows you to participate in the{" "}
                <Link href="#" sx={{ mx: 1, height: "auto" }}>
                  Picasso
                </Link>{" "}
                ecosystem on Kusama.
              </Typography>
              <Box display="flex" sx={{ pt: 4 }}></Box>
            </Stack>
            <Spacer mt={12.5} />
            <Grid container spacing={3}>
              {Object.values(data).map(
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
              <PicassoDepositWithdrawTabs token={eth_strm_lp} poolId={1} />
              <Stepper
                steps={steps}
                progress={progress}
                current={activeStep}
                submitted={false}
              />
            </Grid>
            <Spacer mb={18} />
          </Box>
          <Box>
            <Stack spacing={3.5}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Box sx={{ mt: 5, mr: 2 }}>
                  <DefiIcon
                    icon={crvTricryptoUsdBtcEth}
                    width={24}
                    height={24}
                  />
                </Box>
                <Typography
                  textAlign="center"
                  variant="h2"
                  fontFamily="BIN Regular"
                >
                  boost your position
                </Typography>
              </Box>
              <Typography textAlign="center" variant="h5" color="GrayText">
                Get that extra boost on your position.
              </Typography>
            </Stack>
            <Spacer mb={18} />
            <Grid
              item
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
              xs={12}
              mt={16}
            >
              <DepositWithdrawTabs active={true} poolId={0} />
            </Grid>
            <Spacer mb={18} />
          </Box>
        </Grid>
      </Stack>
    </Layout>
  );
};

export default Picasso;
