import { Fragment, useEffect, useState } from "react";
import { Snackbar as MuiSnackbar, SnackbarOrigin, Button } from "@mui/material";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LinearProgress from "@mui/material/LinearProgress";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import InfoIcon from "@mui/icons-material/Info";
import ErrorIcon from "@mui/icons-material/Error";
import OpenLink from "@/components/OpenLink";

const COLORS = {
  green: {
    main: "#69F177",
    background: "rgba(105, 241, 119, 0.1)",
    text: "[Initiate transfer of USDC] completed",
    renderIcon: () => <CheckCircleIcon sx={{ color: "#69F177" }} />,
  },
  blue: {
    main: "#43A5FF",
    background: "rgba(67, 165, 255, 0.1)",
    text: "[Initiate transfer of USDC] started",
    renderIcon: () => <InfoIcon sx={{ color: "#43A5FF" }} />,
  },
  red: {
    main: "#FF4343",
    background: "rgba(255, 67, 67, 0.1)",
    text: "Could not submit transaction",
    renderIcon: () => <ErrorIcon sx={{ color: "#FF4343" }} />,
  },
};

type ProgressBarProps = {
  color: keyof typeof COLORS | string;
};

export const ProgressBar = ({ color }: ProgressBarProps) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress === 100) return 0;

        const diff = Math.random() * 10;
        return Math.min(oldProgress + diff, 100);
      });
    }, 500);

    return () => {
      clearInterval(timer);
    };
  });

  return (
    <LinearProgress
      variant="determinate"
      value={progress}
      sx={{
        mt: "-2px",
        "& .MuiLinearProgress-bar": {
          backgroundColor: color,
        },
      }}
    />
  );
};

type SnackbarProps = {
  color: keyof typeof COLORS;
};

export interface State extends SnackbarOrigin {
  open: boolean;
}

const Snackbar = ({ color }: SnackbarProps) => {
  const { main, background, text, renderIcon } = COLORS[color];
  const [state, setState] = useState<State>({
    open: false,
    vertical: "top",
    horizontal: "center",
  });
  const { vertical, horizontal, open } = state;

  const handleClick = (newState: SnackbarOrigin) => () => {
    setState({ open: true, ...newState });
  };

  const handleClose = () => setState({ ...state, open: false });

  const action = (
    <Box sx={{ overflow: "hidden" }}>
      <Box
        sx={{
          width: "600px",
          height: "64px",
          bgcolor: background,
          display: "grid",
          alignItems: "center",
          px: "22px",
        }}
      >
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid
            item
            sx={{
              display: "grid",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {renderIcon()}
          </Grid>
          <Grid item>
            <Typography sx={{ color: main, fontSize: 16 }}>{text}</Typography>
          </Grid>
          <Grid item>
            <Box sx={{ mr: "-8px" }}>
              <OpenLink color={color} />
            </Box>
          </Grid>
        </Grid>
      </Box>
      <ProgressBar color={main} />
    </Box>
  );

  return (
    <Fragment>
      <Button
        onClick={handleClick({ vertical: "bottom", horizontal: "center" })}
      >
        Open {color} snackbar
      </Button>

      <MuiSnackbar
        anchorOrigin={{ vertical, horizontal }}
        open={open}
        onClose={handleClose}
        autoHideDuration={8000000}
        action={action}
      />
    </Fragment>
  );
};

export default Snackbar;
