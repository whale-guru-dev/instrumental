import { Token } from "@/defi/tokenInfo";
import OutlinedInput from "@mui/material/OutlinedInput";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { useTheme } from "@mui/system";
import React, { FC } from "react";
import { MenuItem, Box, Typography } from "@mui/material";
import DefiIcon from "components/DefiIcon";

type DropdownProps = {
  id: string;
  value?: string | undefined;
  label?: string;
  onChange: (event: SelectChangeEvent) => void;
  data: Token[];
  size?: "small" | "medium";
  width?: number;
  height?: number;
};

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: "auto",
    },
  },
};

const Dropdown: FC<DropdownProps> = ({
  id,
  value,
  onChange,
  label,
  data,
  size,
  width,
  height,
}) => {
  const theme = useTheme();

  return (
    <Select
      labelId={`${id}-label`}
      id={id}
      sx={{
        background: "inherit",
        width,
        height,
        "& .MuiSvgIcon-root": {
          fill: theme.palette.primary.main,
        },
      }}
      value={value}
      onChange={onChange}
      size={size}
      input={<OutlinedInput sx={{ width }} label={label} />}
      MenuProps={MenuProps}
    >
      {data.map((item, index: number) => {
        return (
          <MenuItem
            key={index}
            value={item.symbol.toString()}
            sx={{ width: width }}
          >
            <Box display={"flex"}>
              {item.picture && <DefiIcon icon={item.picture} />}
              <Box
                sx={{
                  display: "flex",
                  flexGrow: 1,
                  justifyContent: "center",
                }}
              >
                {item.decimals && (
                  <Typography mx={1}>{item.decimals}</Typography>
                )}
                <Typography mx={1}>{item.symbol}</Typography>
              </Box>
            </Box>
          </MenuItem>
        );
      })}
    </Select>
  );
};

export default Dropdown;
