import { Account } from "@/defi/components/Account";
import {
  Box,
  Button,
  Link as MUILink,
  Stack,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import Image from "next/image";
import NextLink from "next/link";
import { useRouter } from "next/router";
import React, { FC } from "react";
import { ClaimAirdropButton } from "./ClaimAirdropButton";
import MobileDrawer from "./MenuDrawer";
// import InstrumentalLogo from "@/assets/icons/brand/instrumental-logo.png";

const menuItems: { name: string; path: string; isDisabled?: boolean }[] = [
  { name: "Strategies (Coming Soon)", path: "/strategies", isDisabled: true },
  { name: "Swap", path: "/swap", isDisabled: false },
  { name: "Staking", path: "/" },
  { name: "Lock", path: "/lock" },
];

const NavBar: FC<{
  menuVisible?: boolean;
}> = ({ menuVisible }) => {
  const router = useRouter();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("lg"));
  const isPhone = useMediaQuery(theme.breakpoints.down("md"));
  const getColor = (path: string, disabled?: boolean) => {
    if (disabled) {
      return "text.disabled";
    }
    if (path === router.pathname) {
      return "text.primary";
    }
    return "text.secondary";
  };

  if (isDesktop) {
    return (
      <Box p="20px">
        <Box display="flex" justifyContent="space-between">
          <Box display="flex" alignItems="center">
            <NextLink href="/">
              <Image
                src="/instrumental-logo.png"
                height={14}
                width={200}
                alt="Logo"
              />
            </NextLink>
          </Box>

          {menuVisible && (
            <Box>
              <Stack spacing={2} direction="row">
                <Stack
                  spacing={4.5}
                  direction="row"
                  pr={8}
                  sx={{
                    display: {
                      sm: "none",
                      md: "none",
                      lg: "flex",
                    },
                  }}
                >
                  {menuItems.map((item, i) => (
                    <NextLink href={item.path} key={i} passHref>
                      <MUILink
                        component="button"
                        variant="h6"
                        disabled={item.isDisabled}
                        color={getColor(item.path, item.isDisabled)}
                        sx={{
                          minHeight: "3.5rem",
                          "&:hover": {
                            cursor: "pointer",
                            color: item.isDisabled
                              ? "text.disabled"
                              : "text.primary",
                          },
                        }}
                      >
                        {item.name}
                      </MUILink>
                    </NextLink>
                  ))}
                </Stack>
                {!isPhone && <ClaimAirdropButton />}
                {/* <Button
                  variant="outlined"
                  color="primary"
                  sx={{
                    width: "4rem",
                    height: "4rem",
                  }}
                >
                  <HistoryIcon />
                </Button>
                */}
                <Stack direction="row" spacing={4}>
                  {/* <PolkadotAccount /> */}
                  <Account />
                </Stack>
                {isTablet && <MobileDrawer links={menuItems} />}
              </Stack>
            </Box>
          )}
        </Box>
      </Box>
    );
  }

  // Mobile drawer
  return (
    <Box display="flex" alignItems="center" justifyContent="space-between">
      <NextLink href="/">
        <Button variant="text" color="inherit" data-testid="logo-button">
          <Image
            src="/instrumental-logo.png"
            height={14}
            width={200}
            alt="Logo"
          />
        </Button>
      </NextLink>
      <MobileDrawer links={menuItems} />
    </Box>
  );
};

export default NavBar;
