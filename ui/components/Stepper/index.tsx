import CheckBoxIcon from "@mui/icons-material/CheckBox";
import {
  Grid,
  Box,
  CircularProgress,
  Typography,
  useTheme,
} from "@mui/material";
import LinearProgress from "@mui/material/LinearProgress";
import { FC } from "react";

type StepperProps = {
  steps: string[];
  current: number;
  progress: number;
  submitted: boolean;
};

const Stepper: FC<StepperProps> = (props) => {
  const { current, steps, progress, submitted } = props;
  const theme = useTheme();

  const ProgressBar = ({
    current,
    step,
    progress,
    done,
  }: {
    current: number;
    step: any;
    progress: number;
    done: boolean;
  }) => {
    let value = 0;
    if (current + 1 === step) {
      value = progress;
    } else if (current >= step) {
      value = 100;
    }

    return (
      <LinearProgress
        variant="determinate"
        value={value}
        sx={{
          flex: "1 1 auto",
          position: "absolute",
          top: 15,
          left: "calc(-30% + 20px)",
          right: "calc(70% + 20px)",
          backgroundColor: done ? "#69f177" : "rgba(255, 255, 255, 0.4)",
        }}
      />
    );
  };

  const renderStep = (label: any, key: any) => {
    const done = key < current;
    const currentStep = key === current;

    return (
      <Box
        sx={{
          display: "flex",
          position: "relative",
          justifyContent: "space-around",
          width: "100%",
          alignItems: "center",
          flexFlow: "row nowrap",
        }}
        key={key}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flexFlow: "row nowrap",
          }}
        >
          {done ? (
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
          ) : submitted && currentStep ? (
            <CircularProgress size={32} sx={{}} />
          ) : (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                border: "1px solid #6d3ed1",
                width: "40",
                height: "40",
                py: theme.spacing(0.25),
                px: theme.spacing(1.25),
              }}
            >
              {key + 1}
            </Box>
          )}
          <Box sx={{ px: 1 }}>
            <Typography
              sx={{
                color: !done
                  ? theme.palette.common.white
                  : // @ts-ignore
                    theme.palette.text.tertiary,
                width: "max-content",
              }}
              fontSize={16}
            >
              {label}
            </Typography>
          </Box>
        </Box>
        {!!key && (
          <ProgressBar
            current={current}
            step={key}
            progress={progress}
            done={done}
          />
        )}
      </Box>
    );
  };

  return (
    <Grid item sx={{ width: "100%" }} mx="auto" xs={12} sm={12} md={9}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-around",
          width: "100%",
          flexFlow: "row nowrap",
        }}
      >
        {steps.map(renderStep, { current, progress })}
      </Box>
    </Grid>
  );
};

export default Stepper;
