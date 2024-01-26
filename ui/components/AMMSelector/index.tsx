import React, { useState } from "react";
import {
  alpha,
  Box,
  InputAdornment,
  ListItem,
  MenuItem,
  Paper,
  PaperProps,
  styled,
  TextField,
  Theme,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import ClearIcon from "@mui/icons-material/Clear";
import { createStyles, makeStyles } from "@mui/styles";

import Image from "next/image";
import { check as CheckIcon } from "assets/icons/common";
import { SupportedAmm } from "@/submodules/contracts-operations/src/store/supportedTokens/slice";
import { Search } from "@mui/icons-material";

export type AMMSelectorProps = {
  label?: string;
  amms: Readonly<Array<SupportedAmm>>;
  selected?: SupportedAmm;
  isExpandMore?: boolean;
  onChange: (selected: SupportedAmm) => void;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    label: {
      color: theme.palette.text.primary,
      marginBottom: theme.spacing(1),
    },
  }),
);

const AMMMenuItem = styled(MenuItem)(({ theme }) => ({
  padding: theme.spacing(1.5, 3),
  textAlign: "center",
}));

const AMMSelectDropdownPane = React.forwardRef<
  HTMLDivElement,
  Partial<
    PaperProps<"div", { value: string; onChange: (value: string) => void }>
  >
>(({ children, value, onChange, ...rest }, ref) => {
  const theme = useTheme();
  const iconColor = alpha(theme.palette.common.white, 0.6);
  return (
    <Paper ref={ref} {...rest}>
      <ListItem>
        <TextField
          color="primary"
          type="text"
          margin="normal"
          fullWidth
          onKeyDown={(e) => e.stopPropagation()}
          value={value}
          onChange={(e) => onChange && onChange(e.target.value)}
          placeholder="Search"
          sx={{
            textAlign: "center",
            ":hover": {
              borderColor: "primary.main",
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                {/* <Image src={SearchIcon} alt={"Search"} width="22" height="22" /> */}
                <Search
                  sx={{
                    color: iconColor,
                  }}
                />
              </InputAdornment>
            ),
            endAdornment:
              value == "" ? (
                <Box ml={2} />
              ) : (
                <InputAdornment position="end">
                  <ClearIcon
                    fontSize="small"
                    onClick={() => onChange && onChange("")}
                    sx={{ cursor: "pointer" }}
                  />
                </InputAdornment>
              ),
          }}
        />
      </ListItem>
      {children}
    </Paper>
  );
});
AMMSelectDropdownPane.displayName = "AMMSelectDropdownPane";

const AMMSelector = ({ label, amms, selected, onChange }: AMMSelectorProps) => {
  const [searchKey, setSearchKey] = useState("");
  const classes = useStyles();

  return (
    <div>
      {label && <Typography className={classes.label}>{label}</Typography>}
      <TextField
        color="primary"
        select
        fullWidth
        placeholder="Select"
        margin="normal"
        hiddenLabel
        value={selected?.ammId ?? ""}
        onChange={(e) =>
          onChange(
            amms.find(
              (amm: SupportedAmm) => amm.ammId === e.target.value,
            ) as SupportedAmm,
          )
        }
        sx={{
          mb: 0,
          height: 52,
        }}
        SelectProps={{
          displayEmpty: true,
          sx: {
            "&:hover": {
              borderColor: "primary.main",
            },
            "& .checkImage": {
              display: "none !important",
            },
          },
          MenuProps: {
            anchorOrigin: {
              vertical: "bottom",
              horizontal: "center",
            },
            transformOrigin: {
              vertical: "top",
              horizontal: "center",
            },
            PaperProps: {
              component: AMMSelectDropdownPane,
              value: searchKey,
              onChange: setSearchKey,
              elevation: 17,
              sx: {
                maxHeight: 400,
                border: "1px solid",
                maxWidth: 100,
                borderColor: "other.border.d1",
                "& .MuiMenuItem-root.Mui-selected": {
                  backgroundColor: "primary.main",
                },
                "& .MuiMenuItem-root:hover": {
                  backgroundColor: "primary.dark",
                },
                "& .MuiMenuItem-root.Mui-selected:hover": {
                  backgroundColor: "primary.dark",
                },
              },
            } as any,
          },
        }}
      >
        <AMMMenuItem value="" hidden style={{ display: "none" }}>
          Select AMM
        </AMMMenuItem>
        {amms
          .filter((amm: SupportedAmm) =>
            amm.name.toLowerCase().includes(searchKey.toLocaleUpperCase()),
          )
          .map((amm: SupportedAmm) => (
            <AMMMenuItem key={amm.ammId} value={amm.ammId}>
              <Image width={24} height={24} src={amm.image} alt={amm.name} />
              &nbsp;&nbsp;
              <Typography
                component="p"
                align="center"
                textOverflow="ellipsis"
                overflow="hidden"
                margin="auto"
              >
                {amm.name}
              </Typography>
              {amm.ammId === selected?.ammId ? (
                <Image
                  width={24}
                  height={24}
                  src={CheckIcon}
                  alt="check"
                  className="checkImage"
                />
              ) : (
                <Box ml={3} />
              )}
            </AMMMenuItem>
          ))}
      </TextField>
    </div>
  );
};

export default AMMSelector;
