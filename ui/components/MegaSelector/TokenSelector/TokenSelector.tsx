import {
  Button,
  ButtonProps,
  ClickAwayListener,
  Typography,
} from "@mui/material";
import Box from "@mui/material/Box";
import { NativeTokenSelector } from "./Partials/NativeTokenSelector";
import { AMMSelector } from "./Partials/AMMSelector";
import React, { FC, useCallback, useState } from "react";
import { useTheme } from "@mui/material/styles";
import { KeyboardArrowDown } from "@mui/icons-material";
import {
  SupportedAmm,
  Token,
} from "@/submodules/contracts-operations/src/store/supportedTokens/slice";
import { StartIcon } from "@/components/MegaSelector/TokenSelector/Partials/TokenSelectorIcon";
import {
  ControlledProps,
  EdgeProps,
} from "@/components/MegaSelector/shared/types";
import { edgeStyleOverrides } from "@/components/MegaSelector/shared/utils";
import { Dialog } from "@/components/PreReview/Dialog";

type TokenSelectorProps = Omit<ButtonProps, "value" | "onChange"> &
  ControlledProps<Token> & {
    tokens: Token[];
    edge?: EdgeProps;
    ammList: SupportedAmm[];
    getTokens: (s: string) => Promise<Token[]>;
  };
export const TokenSelector: FC<TokenSelectorProps> = ({
  value: selectedToken,
  onChange,
  tokens,
  edge,
  getTokens,
  ammList,
  ...props
}) => {
  const { sx: sxProps, ...rest } = props;

  const theme = useTheme();
  const [dialogOpen, setDialogOpen] = useState(false);

  const [customModeActive, setCustomModeActive] = useState<boolean>(false);

  const isNotCustomToken =
    !selectedToken || selectedToken?.provider !== "custom" || !customModeActive;

  const isCustomTokenPhase =
    customModeActive && selectedToken?.provider === "custom";

  const onCustomTokenModification = useCallback(
    (token: Token) => {
      onChange(token);
      setCustomModeActive(true);
    },
    [onChange],
  );

  const setInternalToken = (t: Token) => {
    onChange(t);
    closeDialog();
  };

  const setCustomToken = () => {
    onChange(selectedToken!);
    setCustomModeActive(false);
    closeDialog();
  };

  const openDialog = () => {
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
  };

  const onBackButtonClick = () => {
    setCustomModeActive(false);
  };

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
        startIcon={<StartIcon value={selectedToken} />}
        variant="outlined"
        color="secondary"
      >
        <Typography variant="body2">
          {selectedToken?.symbol || "Selected Token"}
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
              {isNotCustomToken && (
                <NativeTokenSelector
                  value={selectedToken}
                  onChange={setInternalToken}
                  tokens={tokens}
                  getTokens={getTokens}
                  closeDialog={closeDialog}
                  onCustomTokenModification={onCustomTokenModification}
                />
              )}
              {isCustomTokenPhase && selectedToken && (
                <AMMSelector
                  ammList={ammList}
                  value={selectedToken}
                  onChange={onCustomTokenModification}
                  onBackButtonClick={onBackButtonClick}
                />
              )}
            </Box>
            {isCustomTokenPhase && (
              <Button
                variant="contained"
                size="large"
                fullWidth
                onClick={setCustomToken}
                sx={{
                  marginTop: theme.spacing(2),
                }}
              >
                <Typography variant="body2">Confirm</Typography>
              </Button>
            )}
          </div>
        </ClickAwayListener>
      </Dialog>
    </>
  );
};
