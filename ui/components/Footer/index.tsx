/* eslint-disable @next/next/no-img-element */
import {
  Discord,
  Medium,
  Reddit,
  Telegram,
  Twitter,
} from "@/assets/icons/social/index";
import Link from "@/components/Link";
import SvgIconWrapper from "@/components/SvgIconWrapper";
import { Box, Grid, Theme, useMediaQuery, useTheme } from "@mui/material";
import Image from "next/image";
import React, { FC } from "react";
// import InstrumentalLogo from "/assets/icons/brand/instrumental-logo.png";

interface FooterProps {
  logoVisible?: boolean;
}

const Footer: FC<FooterProps> = ({ logoVisible }) => {
  const theme = useTheme();
  const isPhone = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Grid
      py={4}
      px={{ sm: 8, md: 0 }}
      container
      spacing={4}
      justifyContent={"space-between"}
      flexDirection={`${isPhone ? "column" : "row"}`}
      alignItems={"center"}
    >
      <Grid item>
        {logoVisible && (
          <Box
            sx={{
              display: "flex",
              justifyContent: isPhone ? "column" : "row",
            }}
          >
            <Image
              src="/instrumental-logo.png"
              height={14}
              width={200}
              alt="Logo"
            />
          </Box>
        )}
      </Grid>
      <Grid item>
        <Box
          sx={{
            display: "flex",
            justifyContent: isPhone ? "justify-between" : "flex-end",
          }}
        >
          <Link
            isExternal
            href="https://twitter.com/InstrumentalFi"
            sx={{
              mx: (theme: Theme) => theme.spacing(2),
            }}
          >
            <SvgIconWrapper icon={<Twitter />} />
          </Link>

          <Link
            isExternal
            href="https://medium.com/@instrumentalfinance"
            sx={{
              mx: (theme: Theme) => theme.spacing(2),
            }}
          >
            <SvgIconWrapper icon={<Medium />} />
          </Link>

          <Link
            isExternal
            href="#"
            sx={{
              mx: (theme: Theme) => theme.spacing(2),
            }}
          >
            <SvgIconWrapper icon={<Telegram />} />
          </Link>

          <Link
            isExternal
            href="https://discord.com/invite/x26VhqFS"
            sx={{
              mx: (theme: Theme) => theme.spacing(2),
            }}
          >
            <SvgIconWrapper icon={<Discord />} />
          </Link>

          <Link
            isExternal
            href="#"
            sx={{
              mx: (theme: Theme) => theme.spacing(2),
            }}
          >
            <SvgIconWrapper icon={<Reddit />} />
          </Link>
        </Box>
      </Grid>
    </Grid>
  );
};

export default Footer;
