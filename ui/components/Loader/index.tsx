import { useEffect, useState } from "react";
import { alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";

type LoaderProps = {
  size?: number;
};

const Loader = ({ size = 42 }: LoaderProps) => {
  const [_progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prevProgress) =>
        prevProgress >= 100 ? 0 : prevProgress + 10,
      );
    }, 800);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <Box sx={{ position: "relative" }}>
      <CircularProgress
        variant="indeterminate"
        value={25}
        size={size}
        thickness={4.5}
        sx={{
          color: "#A77DFF",
          position: "absolute",
          top: 0,
          left: 0,
        }}
      />
      <CircularProgress
        variant="determinate"
        value={100}
        size={size}
        thickness={4.5}
        sx={{
          color: alpha("#7844E6", 0.16),
          position: "absolute",
          top: 0,
          left: 0,
        }}
      />
    </Box>
  );
};

export default Loader;
