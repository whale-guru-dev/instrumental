import { Box, Skeleton } from "@mui/material";
import { useTheme } from "@mui/material/styles";

export const ListItemsSkeletonLoader = ({ count = 1 }: { count: number }) => {
  const theme = useTheme();
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <Box
          key={index}
          width={"100%"}
          display="flex"
          alignItems="center"
          gap={2}
          sx={{
            padding: theme.spacing(2, 4, 2, 2),
          }}
        >
          <Box sx={{ minWidth: "24px" }}>
            <Skeleton variant="circular" width={24} height={24} />
          </Box>
          <Box
            sx={{
              flexGrow: 1,
            }}
          >
            <Skeleton variant="text" />
          </Box>
          <Box sx={{ minWidth: "24px" }}>
            <Skeleton variant="circular" width={24} height={24} />
          </Box>
        </Box>
      ))}
    </>
  );
};
