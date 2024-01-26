import { crvTricryptoUsdBtcEth } from "@/assets/tokens";
import Breadcrumb from "@/components/Breadcrumb";
import Container from "@/components/ContainerSet";
import DefiIcon from "@/components/DefiIcon";
import DepositWithdrawTabs from "@/components/SelectNetwork";
import Spacer from "@/components/Spacer";
import Layout from "@/container/Layout";
import { Box, Grid, Stack, Typography } from "@mui/material";
import { NextPage } from "next";

const Strategy: NextPage = () => {
  const boxInformation = {
    totalValueLocked: {
      heading: "Total value locked",
      description: "$89,958,324",
      md: 3,
      sm: 12,
      xs: 12,
    },
    totalAPY: {
      heading: "APY",
      description: "786%",
      md: 3,
      sm: 12,
      xs: 12,
    },
    totalDeposited: {
      heading: "Deposited",
      description: "$0",
      md: 3,
      sm: 12,
      xs: 12,
    },
    totalExpectedRewards: {
      heading: "Expected rewards",
      description: "0 STRM",
      md: 3,
      sm: 12,
      xs: 12,
    },
  };

  return (
    <Layout>
      <Stack px="20px">
        <Box>
          <Breadcrumb
            link={{
              text: "strategies",
              to: "/",
            }}
          />
        </Box>
        <Grid item xs={12} mt={5}>
          <Box>
            <Stack spacing={3.5}>
              <Box
                sx={{
                  textAlign: "center",
                }}
              >
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
                    Tricrypto
                  </Typography>
                </Box>
              </Box>

              <Typography textAlign="center" variant="h5" color="GrayText">
                Manage your tricrypto liquidity pool tokens.
              </Typography>
            </Stack>
            <Spacer mt={12.5} />
            <Grid container spacing={3}>
              {Object.values(boxInformation).map(
                ({ heading, description, xs, sm, md, ...rest }, index) => (
                  <Grid item xs={xs} sm={sm} md={md} key={index}>
                    <Container
                      heading={heading}
                      description={description}
                      {...rest}
                    />
                  </Grid>
                ),
              )}
            </Grid>
            <Spacer mb={18} />
            <Grid
              item
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
              xs={12}
              mt={16}
            >
              <DepositWithdrawTabs poolId={0} />
            </Grid>
            <Spacer mb={18} />
          </Box>
          <Box>
            <Stack spacing={3.5}>
              <Box
                sx={{
                  display: "flex",
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
              <DepositWithdrawTabs active poolId={0} />
            </Grid>
            <Spacer mb={18} />
          </Box>
        </Grid>
      </Stack>
    </Layout>
  );
};

export default Strategy;
