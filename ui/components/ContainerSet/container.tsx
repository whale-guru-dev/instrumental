import { alpha, Box, BoxProps, Grid, Theme, Typography } from "@mui/material";
import { ElementType, FC, ReactNode } from "react";

const EmptyComponent: FC = () => null;

export type ContainerProps = BoxProps & {
  active?: boolean;
  heading: ReactNode;
  headingIcon?: ElementType;
  description: ReactNode;
  descriptionIcon?: ElementType;
};

const Container: FC<ContainerProps> = ({
  active = true,
  heading,
  headingIcon,
  description,
  descriptionIcon,
  ...boxProps
}) => {
  const HeadingIcon = headingIcon || EmptyComponent;
  const DescriptionIcon = descriptionIcon || EmptyComponent;

  return (
    <Box
      sx={{
        background: (theme: Theme) =>
          alpha(theme.palette.primary.main, active ? 0.1 : 0.05),
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "1rem 0",
      }}
      {...boxProps}
    >
      <Grid
        container
        direction="column"
        justifyContent="space-between"
        alignItems="center"
        spacing={1}
        minHeight="4.5rem"
      >
        <Grid item sx={{ color: active ? "inherit" : alpha("#FFF", 0.16) }}>
          <Box display="flex" alignItems="center">
            <HeadingIcon />
            <Typography variant="h6" color="text.secondary" mx={1}>
              {heading}
            </Typography>
          </Box>
        </Grid>
        <Grid
          item
          sx={{
            color: active ? "inherit" : alpha("#FFF", 0.16),
            width: "100%",
          }}
        >
          <Box
            display="flex"
            alignItems="center"
            flexGrow={1}
            justifyContent="center"
          >
            <DescriptionIcon />
            {typeof description === "string" ? (
              <Typography variant="h4" mx={1}>
                {description}
              </Typography>
            ) : (
              <>{description}</>
            )}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Container;
