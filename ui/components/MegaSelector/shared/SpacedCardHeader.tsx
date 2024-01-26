import { CardHeaderProps, IconButton, Typography } from "@mui/material";
import { VoidFunctionComponent } from "react";
import { ChevronLeftRounded } from "@mui/icons-material";
import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";
import { iconButtonOverrides } from "./utils";

export const SpacedCardHeader: VoidFunctionComponent<
  CardHeaderProps & {
    onBackButtonClick?: () => void;
  }
> = ({ onBackButtonClick, title, ...props }) => {
  const theme = useTheme();
  const adjustedLineHeight = 2.16; // This value is hardcoded to match the height of IconButton, instead of reaching for the DOM element.
  const renderedTitle = (
    <Box>
      <Typography
        lineHeight={adjustedLineHeight}
        textAlign="center"
        variant="h6"
      >
        {title}
      </Typography>
    </Box>
  );
  const Title = !!onBackButtonClick ? (
    <Box position="relative">
      <Box
        sx={{
          position: "absolute",
          left: theme.spacing(2),
          top: theme.spacing(0),
        }}
      >
        <IconButton
          sx={iconButtonOverrides(theme)}
          edge="start"
          onClick={onBackButtonClick}
        >
          <ChevronLeftRounded />
        </IconButton>
      </Box>
      {renderedTitle}
    </Box>
  ) : (
    renderedTitle
  );
  return (
    <Box
      sx={{
        width: "100%",
        padding: theme.spacing(6.125, 3),
      }}
      {...props}
    >
      {Title}
    </Box>
  );
};
