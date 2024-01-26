import MenuIcon from "@mui/icons-material/Menu";
import { Account } from "@/defi/components/Account";
import { PolkadotAccount } from "@/defi/components/PolkadotWallet/PolkadotAccount";
import { Link as MUILink } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import NextLink from "next/link";
import * as React from "react";
import { ClaimAirdropButton } from "./ClaimAirdropButton";

export default function MobileDrawer({
  links,
}: {
  links: { name: string; path: string; isDisabled?: boolean }[];
}) {
  const [isOpen, setOpen] = React.useState(false);
  const toggleDrawer =
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }

      setOpen(open);
    };

  const list = () => (
    <Box
      sx={{ width: "19.5rem" }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
      pt={1.625}
    >
      <List>
        <ListItem>
          <PolkadotAccount />
        </ListItem>
        <ListItem>
          <Account />
        </ListItem>
        <ListItem>
          <ClaimAirdropButton fullWidth={true} />
        </ListItem>
      </List>
      <Divider />
      <List>
        {links.map(({ name, path, isDisabled }) => (
          <ListItem
            key={name}
            component={(props) => (
              <NextLink href={path} passHref>
                <MUILink
                  component="button"
                  variant="body1"
                  disabled={isDisabled}
                  {...props}
                >
                  {name}
                </MUILink>
              </NextLink>
            )}
          >
            <ListItemText primary={name} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box mt={1.625} mr={1.625}>
      <Button
        onClick={toggleDrawer(true)}
        variant="contained"
        color="primary"
        data-testid="logo-button"
      >
        <MenuIcon />
      </Button>
      <Drawer anchor="right" open={isOpen} onClose={toggleDrawer(false)}>
        {list()}
      </Drawer>
    </Box>
  );
}
