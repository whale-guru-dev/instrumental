import React, { useCallback, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import IconButton from "@mui/material/IconButton";
import MenuItem, { MenuItemProps } from "@mui/material/MenuItem";
import Select, { SelectProps } from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { alpha, useTheme } from "@mui/material/styles";

import Modal from "@/components/Modal";
import { useTxSettingsModal } from "store/appsettings/hooks";
import { info } from "@/assets/icons/common";

import { useAppDispatch } from "store";
import {
  setSlippage as storeSlippage,
  setDeadline as storeDeadline,
} from "@/store/transactionSettingsOptions/slice";
import { useTransactionSettingsOptions } from "store/transactionSettingsOptions/hooks";
import { InputAdornment, OutlinedInput } from "@mui/material";

const deadlineOptions = {
  5: {
    label: "5 Minutes",
    value: 5,
  },
  15: {
    label: "15 minutes",
    value: 15,
  },
  30: {
    label: "30 minutes",
    value: 30,
  },
  60: {
    label: "1 hour",
    value: 60,
  },
} as const;

const slippageNumberOptions = [0.5, 0.1, 1];
const toleranceOptions = [...slippageNumberOptions, "custom"];

const slippageToPreset = (slippage: number) =>
  slippageNumberOptions.includes(slippage) ? slippage : "custom";

const minSlippageLimit = 0.1;
const maxSlippageLimit = 3;
const minTransactionDeadlineLimit = 5;

type SlippageTolerancePreset = typeof toleranceOptions[number];

const MuiMenuItem = ({ children, ...props }: MenuItemProps) => {
  return (
    <MenuItem
      {...props}
      sx={{
        display: "flex",
        flexGrow: 1,
        justifyContent: "center",
      }}
    >
      {children}
    </MenuItem>
  );
};

const MuiSelect = ({ children, ...props }: SelectProps) => {
  const theme = useTheme();

  return (
    <Select
      {...props}
      sx={{
        background: theme.palette.background.paper,
        "& .MuiSvgIcon-root": {
          fill: theme.palette.primary.main,
        },
        fontSize: "20px",
        textAlign: "center",
        height: 56,
      }}
    >
      {children}
    </Select>
  );
};

export const TxSettingsModal = () => {
  const { isOpen, closeTxSettings } = useTxSettingsModal();
  const theme = useTheme();
  const Info = info;

  const [validSlippage, setValidSlippage] = useState(true);
  const [, setValidDeadline] = useState(true);

  const dispatch = useAppDispatch();

  const { slippage: storageSlippage, deadline: storageDeadline } =
    useTransactionSettingsOptions();

  const [slippage, setSlippage] = useState<number>(storageSlippage);
  const [slippageTolerancePreset, setSlippageTolerancePreset] =
    useState<SlippageTolerancePreset>(slippageToPreset(storageSlippage));
  const [deadline, setDeadline] = useState<number>(storageDeadline);

  useEffect(() => {
    if (slippage < minSlippageLimit || slippage > maxSlippageLimit) {
      setValidSlippage(false);
    } else {
      setValidSlippage(true);
    }
  }, [slippage]);
  useEffect(() => {
    if (deadline < minTransactionDeadlineLimit) {
      setValidDeadline(false);
    } else {
      setValidDeadline(true);
    }
  }, [deadline]);

  const onSaveInternal = useCallback(() => {
    dispatch(storeSlippage(slippage));
    dispatch(storeDeadline(deadline));
    closeTxSettings();
  }, [slippage, deadline, dispatch]);

  const onDiscardInternal = useCallback(() => {
    setSlippage(storageSlippage);
    setSlippageTolerancePreset(slippageToPreset(storageSlippage));
    setDeadline(storageDeadline);
    closeTxSettings();
  }, [storageSlippage, storageDeadline]);

  // const onCloseInternal = useCallback(() => {
  //   onDiscardInternal();
  //   closeTxSettings();
  // }, [onDiscardInternal, closeTxSettings]);

  const onBackToDefaultSlippage = useCallback(() => {
    setSlippage(0.5);
    setSlippageTolerancePreset(slippageToPreset(0.5));
  }, []);

  // const handleFeeChange = (event: SelectChangeEvent<any>) => {
  //   setFee(event.target.value as string);
  // };

  // const handleSlippageChange = (event: SelectChangeEvent<any>) => {
  //   setSlippage(event.target.value as string);
  // };

  // const handleTxDeadlineChange = (event: SelectChangeEvent<any>) => {
  //   setTxDeadline(event.target.value as string);
  // };

  // const handleSaveSettings = () => {
  //   // save settings logic here...

  //   closeTxSettings();
  // };

  return (
    <Modal fullScreen open={isOpen} onClose={closeTxSettings}>
      <Box width="39.68rem" margin="auto">
        <Stack spacing={6}>
          <Typography textAlign="center" variant="h2" fontFamily="BIN Regular">
            transaction settings
          </Typography>

          <Stack spacing={2}>
            <Box
              display="flex"
              alignItems="center"
              justifyContent={"space-between"}
            >
              <Box display={"flex"} alignItems={"center"} gap={2.5}>
                <Typography
                  variant="h6"
                  color={alpha(theme.palette.text.primary, 0.5)}
                  mr="0.5rem"
                >
                  Slippage tolerance
                </Typography>
                <Tooltip
                  sx={{ cursor: "pointer" }}
                  title="Slippage tolerance may vary depending on the token´s rarity. The rarest, the bigger will be the allowed slippage. Your transaction will revert if the price changes unfavorably by more than this percantage."
                  placement="top"
                >
                  <IconButton>
                    <Info />
                  </IconButton>
                </Tooltip>
              </Box>
              <Box sx={{ cursor: "pointer" }} onClick={onBackToDefaultSlippage}>
                <Typography
                  sx={{
                    color:
                      slippage === 0.5 ? "text.secondary" : "primary.light",
                  }}
                >
                  Back to default
                </Typography>
              </Box>
            </Box>

            <FormControl>
              <MuiSelect
                labelId="slippage-tolerance-select-label"
                id="slippage-tolerance-select"
                value={slippageTolerancePreset}
                onChange={(event) => {
                  setSlippageTolerancePreset(
                    event.target.value as SlippageTolerancePreset,
                  );
                  if (
                    typeof event.target.value !== "string" &&
                    typeof event.target.value === "number"
                  ) {
                    setSlippage(event.target.value);
                  }
                }}
              >
                {toleranceOptions.map((value, index) => {
                  return (
                    <MuiMenuItem key={index} value={value}>
                      <Typography variant="h6">{value}</Typography>
                    </MuiMenuItem>
                  );
                })}
              </MuiSelect>
            </FormControl>
          </Stack>

          {slippageTolerancePreset === "custom" && (
            <>
              <OutlinedInput
                type="number"
                fullWidth
                disabled={slippageTolerancePreset !== "custom"}
                error={!validSlippage}
                sx={{
                  borderColor: !validSlippage ? "error.main" : "",
                  color: !validSlippage ? "error.main" : "",
                }}
                endAdornment={<InputAdornment position="end">%</InputAdornment>}
                value={slippage}
                onChange={(e) => setSlippage(parseFloat(e.target.value))}
                placeholder={"Type percentage"}
              />
              {!validSlippage && slippage < minSlippageLimit && (
                <Typography mt={1} color="error.main">
                  Minimum slippage is {minSlippageLimit}%
                </Typography>
              )}
              {!validSlippage && slippage > maxSlippageLimit && (
                <Typography mt={1} color="error.main">
                  Maximum slippage is {maxSlippageLimit}%
                </Typography>
              )}
            </>
          )}

          <Stack spacing={2}>
            <Box
              display="flex"
              alignItems="center"
              justifyContent={"space-between"}
            >
              <Box display={"flex"} alignItems={"center"} gap={2.5}>
                <Typography
                  variant="h6"
                  color={alpha(theme.palette.text.primary, 0.5)}
                  mr="0.5rem"
                >
                  Transaction deadline
                </Typography>
                <Tooltip
                  sx={{ cursor: "pointer" }}
                  title="Your transaction will revert if it is pending more than this period of time."
                  placement="top"
                >
                  <IconButton>
                    <Info />
                  </IconButton>
                </Tooltip>
              </Box>
              <Box
                sx={{ cursor: "pointer" }}
                onClick={() => setDeadline(minTransactionDeadlineLimit)}
              >
                <Typography
                  sx={{
                    color:
                      deadline == minTransactionDeadlineLimit
                        ? "text.secondary"
                        : "primary.light",
                  }}
                >
                  Back to default
                </Typography>
              </Box>
            </Box>
            <FormControl>
              <MuiSelect
                labelId="tx-deadline-select-label"
                id="tx-deadline-select"
                value={deadline}
                onChange={(event) => setDeadline(event.target.value as number)}
              >
                {Object.values(deadlineOptions).map(
                  ({ label, value }, index) => (
                    <MuiMenuItem key={index} value={value}>
                      <Typography variant="h6">{label}</Typography>
                    </MuiMenuItem>
                  ),
                )}
              </MuiSelect>
            </FormControl>
          </Stack>

          <Button
            variant="contained"
            color="primary"
            onClick={onSaveInternal}
            disabled={
              validSlippage &&
              ((slippage >= minSlippageLimit && slippage <= maxSlippageLimit) ||
                slippageTolerancePreset != "custom")
                ? false
                : true
            }
          >
            Save changes
          </Button>
          <Button
            fullWidth
            variant="text"
            color="primary"
            onClick={onDiscardInternal}
          >
            <Typography variant="body2" color="primary">
              Cancel
            </Typography>
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
};

export default TxSettingsModal;
