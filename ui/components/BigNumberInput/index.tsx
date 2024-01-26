import React, { FC } from "react";
import BigNumber from "bignumber.js";
import { useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";
import {
  OutlinedInput,
  OutlinedInputProps,
  Typography,
  Box,
} from "@mui/material";
import { useValidation } from "./hooks";
type BigNumberInputProps = OutlinedInputProps & {
  value: BigNumber;
  isValid: (value: boolean) => any;
  setter: (value: BigNumber) => any;
  maxDecimals?: number;
  minValue?: BigNumber;
  maxValue: BigNumber;
  adornmentStart?: JSX.Element;
  adornmentEnd?: JSX.Element;
  disabled?: boolean;
  forceMaxWidth?: boolean;
  forceDisable?: boolean;
  placeholder: string;
  labelKey?: string;
  labelValue?: React.ReactNode;
  width?: number;
  height?: number;
};

const BigNumberInput: FC<BigNumberInputProps> = ({
  value,
  isValid,
  setter,
  maxDecimals,
  minValue,
  maxValue,
  adornmentStart,
  adornmentEnd,
  disabled = false,
  forceMaxWidth,
  forceDisable,
  placeholder,
  labelKey,
  labelValue,
  width,
  height,
  sx,
  ...rest
}) => {
  const theme = useTheme();
  const maxDec = maxDecimals ? maxDecimals : 18;
  const { bignrValue, stringValue, hasError, validate, setValue } =
    useValidation({
      initialValue: value,
      maxDec,
      maxValue,
    });

  React.useEffect(() => {
    isValid && isValid(!hasError);
  }, [hasError, isValid]);

  React.useEffect(() => {
    setter && setter(bignrValue);
  }, [bignrValue]);

  React.useEffect(() => {
    if (value !== bignrValue) {
      setValue(value);
    }
  }, [value]);

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          ...sx,
        }}
      >
        {labelKey && (
          <Typography
            sx={{
              paddingBottom: theme.spacing(2),
              color: alpha(theme.palette.text.primary, 0.5),
            }}
            variant="h6"
          >
            {labelKey}
          </Typography>
        )}
        {labelValue ? (
          <Box textAlign="right">
            <Typography
              sx={{
                paddingLeft: theme.spacing(1),
                paddingBottom: theme.spacing(0.5),
                color: alpha(theme.palette.text.primary, 0.5),
                float: "left",
              }}
              variant="h6"
            >
              Balance:
            </Typography>
            <Typography
              sx={{
                color: theme.palette.text.primary,
                float: "right",
              }}
              ml={theme.spacing(1)}
              variant="h6"
            >
              {labelValue}
            </Typography>
          </Box>
        ) : (
          <Box textAlign="right">-</Box>
        )}
      </Box>
      <OutlinedInput
        style={
          !forceMaxWidth
            ? { maxWidth: 420, textAlign: "center", borderStyle: "none" }
            : undefined
        }
        type="text"
        fullWidth
        {...rest}
        value={stringValue}
        placeholder={placeholder}
        startAdornment={adornmentStart}
        endAdornment={adornmentEnd}
        sx={{
          width,
          height,
          paddingY: (theme) => theme.spacing(1.25),
          lineHeight: (theme) => theme.spacing(1.5),
          input: {
            textAlign: "center",
          },
          ".MuiOutlinedInput-notchedOutline": {
            background: disabled
              ? alpha("#7844E6", 0.05)
              : hasError
              ? alpha(theme.palette.error.main, 0.1)
              : "transparent",
            border: disabled
              ? "none"
              : hasError
              ? `1px solid ${theme.palette.error.main}`
              : `2px solid ${alpha(theme.palette.common.white, 0.2)}`,
          },
          "&.MuiOutlinedInput-root": {
            backgroundColor: "transparent",
            paddingY: theme.spacing(2),
          },
          ".MuiOutlinedInput-input": {
            fontSize: "20px",
            boxSizing: "border-box",
            color: disabled
              ? alpha(theme.palette.common.white, 0.16)
              : hasError
              ? theme.palette.error.main
              : theme.palette.common.white,
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            border: disabled
              ? "none"
              : hasError
              ? `1px solid ${theme.palette.error.main}`
              : "2px solid #6D3ED1",
          },
        }}
        onChange={validate}
        disabled={disabled}
        inputProps={{
          disabled: forceDisable,
        }}
      />
      {!disabled && hasError && (
        <Typography
          sx={{ color: theme.palette.error.main, mt: 2 }}
          variant="h6"
        >
          Please insert a correct amount
        </Typography>
      )}
    </>
  );
};

export default BigNumberInput;
