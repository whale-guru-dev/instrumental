import {
  Box,
  ListItem,
  ListItemProps,
  ListItemText,
  Stack,
} from "@mui/material";
import { FC } from "react";
import { useTheme } from "@mui/material/styles";
import Image from "next/image";
import { SupportedNetwork } from "@/submodules/contracts-operations/src/defi/constants";
import { listItemStyleOverrides } from "@/components/MegaSelector/shared/utils";

export const NetworkListItem: FC<
  Omit<ListItemProps, "onClick" | "value"> & {
    value: SupportedNetwork;
    onClick?: (s: SupportedNetwork) => void;
  }
> = ({ value, onClick, ...props }) => {
  const theme = useTheme();
  return (
    <ListItem
      onClick={() => onClick?.(value)}
      sx={listItemStyleOverrides(theme)}
      {...props}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
        }}
      >
        <Stack direction="row" gap={2}>
          <Box>
            <Image
              width={24}
              height={24}
              src={value.nativeToken.image}
              alt={value.nativeToken.symbol}
            />
          </Box>
          <ListItemText
            primaryTypographyProps={{
              variant: "body2",
            }}
          >
            {value.name}
          </ListItemText>
        </Stack>
      </Box>
    </ListItem>
  );
};
