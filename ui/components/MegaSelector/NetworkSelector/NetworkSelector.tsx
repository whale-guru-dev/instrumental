import {
  alpha,
  Button,
  ButtonProps,
  ClickAwayListener,
  Typography,
} from "@mui/material";
// import {Dialog} from "@/components/PreReview/Dialog";
import Box from "@mui/material/Box";
import React, { FC, useCallback, useMemo, useState } from "react";
import { useTheme } from "@mui/material/styles";
import { KeyboardArrowDown } from "@mui/icons-material";
import { ControlledProps, EdgeProps } from "../shared/types";
import { edgeStyleOverrides, listItemStyleOverrides } from "../shared/utils";
import { NetworkIcon } from "@/components/MegaSelector/NetworkSelector/Partials/NetworkIcon";
import { SupportedNetwork } from "@/submodules/contracts-operations/src/defi/constants";
import { NetworkListItem } from "@/components/MegaSelector/NetworkSelector/Partials/NetworkListItem";
import { SpacedCardHeader } from "@/components/MegaSelector/shared/SpacedCardHeader";
import { SearchInput } from "@/components/MegaSelector/TokenSelector/Partials/SearchInput";
import { AMMNotfound } from "@/components/MegaSelector/shared/AMMNotfound";
import { Dialog } from "@/components/PreReview/Dialog";

type NetworkSelectorProps = Omit<ButtonProps, "value" | "onChange"> &
  ControlledProps<SupportedNetwork> & {
    networks: SupportedNetwork[];
    edge?: EdgeProps;
  };
export const NetworkSelector: FC<NetworkSelectorProps> = ({
  value,
  onChange,
  networks,
  edge,
  ...props
}) => {
  const { sx: sxProps, ...rest } = props;
  const theme = useTheme();
  const [keyword, setKeyword] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const openDialog = () => {
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
  };

  const handleSelect = (value: SupportedNetwork) => {
    onChange(value);
    closeDialog();
  };

  const availableNetworks = networks.filter(
    (network) => network.chainId !== value?.chainId,
  );

  const filterNetworkByKeyword = useCallback(
    (network: SupportedNetwork) =>
      [network.name, network.nativeToken.symbol].some((k) =>
        k.toLowerCase().startsWith(keyword.toLowerCase()),
      ),
    [keyword],
  );

  const selectableNetworks = useMemo(() => {
    return availableNetworks.filter((network) =>
      filterNetworkByKeyword(network),
    );
  }, [availableNetworks, filterNetworkByKeyword]);
  // const searchHandler = useCallback((s: string) => setKeyword(s), []);
  // const resetHandler = useCallback(() => setKeyword(""), []);

  return (
    <>
      <Button
        fullWidth
        onClick={openDialog}
        sx={{
          px: theme.spacing(2),
          maxHeight: "52px",
          justifyContent: "space-between",
          gap: theme.spacing(2),
          ...sxProps,
          ...edgeStyleOverrides(edge),
        }}
        {...rest}
        endIcon={<KeyboardArrowDown />}
        startIcon={<NetworkIcon value={value} />}
        variant="outlined"
        color="secondary"
      >
        <Typography variant="body2">
          {value ? value.name : "Select Network"}
        </Typography>
      </Button>
      <Dialog
        fullWidth
        open={dialogOpen}
        sx={{
          backdropFilter: "blur(10px)",
        }}
        PaperProps={{
          sx: {
            backgroundColor: "transparent", // this is a hack to put buttons on the bottom of the dialog without stretching background
          },
        }}
        onClose={closeDialog}
      >
        <ClickAwayListener onClickAway={closeDialog}>
          <div>
            <Box
              sx={{
                backgroundColor: "rgba(201 ,14, 138, 0.07)",
                borderRadius: `${theme.shape.borderRadius}px`,
              }}
            >
              <SpacedCardHeader title={`Change Network`} />

              <SearchInput
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setKeyword(e.target.value)
                }
                onReset={() => setKeyword("")}
                value={keyword}
                placeholder={"Search"}
              />

              {value && (
                <NetworkListItem
                  value={value}
                  sx={{
                    ...listItemStyleOverrides(theme),
                    backgroundColor: alpha(theme.palette.common.white, 0.1),
                    boxShadow: theme.shadows[5],
                  }}
                />
              )}
              {selectableNetworks.map((network) => (
                <NetworkListItem
                  value={network}
                  key={network.chainId}
                  onClick={handleSelect}
                />
              ))}
              {selectableNetworks.length === 0 && <AMMNotfound />}
            </Box>
          </div>
        </ClickAwayListener>
      </Dialog>
    </>
  );
};
