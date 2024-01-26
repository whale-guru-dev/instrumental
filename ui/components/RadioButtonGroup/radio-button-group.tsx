import { alpha, Button, Box, Theme } from "@mui/material";
import React from "react";

type Option = {
  value: any;
  label: React.ReactElement;
  isDisabled?: boolean;
};
export type RadioButtonGroupProps = {
  options: Option[];
  value: any;
  onChange: (value: any) => void;
};

export const RadioButtonGroup: React.FC<RadioButtonGroupProps> = ({
  value,
  options,
  onChange,
}) => {
  const handleChange = (value: string) => {
    onChange(value);
  };
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="space-evenly"
      flexWrap="wrap"
      gap={2}
    >
      {options.map((option) => (
        <Box key={option.value} minWidth="12rem">
          <Button
            size="large"
            onClick={() => handleChange(option.value)}
            variant={value === option.value ? "contained" : "outlined"}
            fullWidth
            sx={{
              backgroundColor: (theme: Theme) =>
                value === option.value
                  ? alpha(theme.palette.primary.main, 0.1)
                  : "secondary",
              borderColor: (theme: Theme) =>
                value === option.value
                  ? theme.palette.primary.main
                  : alpha(theme.palette.common.white, 0.2),
              borderWidth: 2,
              borderStyle: "solid",
              boxSizing: "border-box",
            }}
            disabled={option.isDisabled}
          >
            {option.label}
          </Button>
        </Box>
      ))}
    </Box>
  );
};
