import { alpha, Theme } from "@mui/material";
import { EdgeProps } from "@/components/MegaSelector/shared/types";
import { SupportedAmm } from "@/submodules/contracts-operations/src/store/supportedTokens/slice";
import { SxProps } from "@mui/system";

export function shortenEvmAddress(address: string) {
  return address.slice(0, 4) + "..." + address.slice(-4);
}

export function iconButtonOverrides(theme: Theme) {
  return {
    border: 0,
    width: 40,
    height: 40,
    color: theme.palette.primary.main,
  };
}

export function edgeStyleOverrides(edge?: EdgeProps) {
  if (!edge) {
    return {};
  }
  return edge === "start"
    ? {
        borderTopLeftRadius: 0,
        borderBottomLeftRadius: 0,
      }
    : { borderTopRightRadius: 0, borderBottomRightRadius: 0 };
}

export function listItemStyleOverrides(theme: Theme): SxProps<Theme> {
  return {
    padding: theme.spacing(2.375, 2),
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    cursor: "pointer",
    alignItems: "center",
    color: theme.palette.text.primary,
    borderRadius: 0,
    "&:hover": {
      backgroundColor: alpha(theme.palette.common.white, 0.06),
    },
  };
}

export function sameAmm(amm: SupportedAmm) {
  return (item: SupportedAmm) => item.ammId === amm.ammId;
}
