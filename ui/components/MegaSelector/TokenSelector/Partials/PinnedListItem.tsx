import { alpha, ListItemProps, styled } from "@mui/material";
import { SelectableListItem } from "./SelectableListItem";

export const PinnedListItem = styled(SelectableListItem)<ListItemProps>(
  ({ theme }) => ({
    justifyContent: "flex-start",
    backgroundColor: alpha(theme.palette.common.white, 0.1),
    boxShadow: theme.shadows[10],
  }),
);
