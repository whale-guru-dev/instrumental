import { Typography, Box, alpha } from "@mui/material";
import React, { FC } from "react";

const EmptyComponent: FC = () => {
  return null;
};

export const SmallInfoBox: FC<{
  heading: React.ReactNode;
  headingIcon?: React.ElementType;
  descriptionIcon?: React.ElementType;
  description: React.ReactNode;
}> = ({ heading, description, headingIcon, descriptionIcon }) => {
  const HeadingIcon = headingIcon || EmptyComponent;
  const DescriptionIcon = descriptionIcon || EmptyComponent;

  return (
    <Box
      p={2}
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      gap={2}
      sx={{
        backgroundColor: alpha("#7844E6", 0.1),
      }}
    >
      <Box display="flex" alignItems="center" justifyContent="center" gap={2}>
        <HeadingIcon />
        <Typography variant="h6" color="text.accent">
          {heading}
        </Typography>
      </Box>
      <Box display="flex" alignItems="center" justifyContent="center" gap={2}>
        <DescriptionIcon />
        <Typography variant="h4">{description}</Typography>
      </Box>
    </Box>
  );
};
