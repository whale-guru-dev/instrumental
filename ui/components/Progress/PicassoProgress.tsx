import CheckBoxIcon from "@mui/icons-material/CheckBox";
import {
  Box,
  CircularProgress,
  Grid,
  Typography,
  useTheme,
} from "@mui/material";
import { FC } from "react";

type PicassoProgressProps = {
  heading: string;
  description: string;
  isComplete?: boolean;
  isFirst?: boolean;
};
export const PicassoStatusItem: FC<PicassoProgressProps> = ({
  heading,
  description,
  isComplete,
  isFirst,
}) => {
  const theme = useTheme();
  return (
    <Grid
      container
      sx={{
        alignItems: "center",
        justifyContent: "center",
      }}
      gap={3}
    >
      <Grid item xs={6}>
        {!isFirst ? (
          <Box
            sx={{
              height: 2,
              mx: 4,
              width: !isFirst && "100%",
              backgroundColor: isComplete
                ? theme.palette.success.main
                : // @ts-ignore
                  theme.palette.text.tertiary,
            }}
          />
        ) : null}
      </Grid>
      <Grid
        item
        xs={2}
        sx={{ display: "flex", alignItems: "center", px: "30px" }}
      >
        {isComplete ? (
          <CheckBoxIcon
            color="success"
            fontSize="small"
            sx={{
              height: 42,
              width: 42,
              backgroundColor: "transparent",
              borderRadius: 0,
            }}
          />
        ) : (
          <CircularProgress size={32} sx={{}} />
        )}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            mx: 1,
            width: "max-content",
          }}
        >
          <Typography
            sx={{
              color: !isComplete
                ? theme.palette.common.white
                : // @ts-ignore
                  theme.palette.text.tertiary,
              width: "max-content",
            }}
            fontSize={16}
          >
            {heading}
          </Typography>
          <Typography
            sx={{
              color: !isComplete
                ? theme.palette.common.white
                : // @ts-ignore
                  theme.palette.text.tertiary,
              width: "max-content",
            }}
            fontSize={14}
          >
            {description}
          </Typography>
        </Box>
      </Grid>
    </Grid>
  );
};
