import { Button, LinearProgress, Typography, Box, Grid } from "@mui/material";
// import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import makeStyles from "@mui/styles/makeStyles";
import withStyles from "@mui/styles/withStyles";
import { useAppDispatch } from "store";
import {
  Notification,
  removeNotification,
} from "@/submodules/contracts-operations/src/store/notifications/slice";
import { useEffect, useState } from "react";
import Timer from "tiny-timer";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ClearIcon from "@mui/icons-material/Clear";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import Image from "next/image";
import NextLink from "next/link";
import { openInNewTab } from "utils";
import * as externalLinks from "assets/icons/common/externalLink";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";

const useStyles = makeStyles(() => ({
  wrapper: {
    transition: "0.3s all",
    width: "100%",
    opacity: 0,
    borderRadius: "10px 10px",
  },
  wrapped: {
    padding: "12px 24px",
    display: "flex",
  },
}));

const colors = {
  success: {
    light: "#1E1716",
    dark: "#00C60D",
    between: "#C4E8B8",
  },
  warning: {
    light: "#1F1005",
    between: "#FFDAB8",
    dark: "#FF8311",
  },
  error: {
    light: "#340315",
    between: "#FAC9CB",
    dark: "#E10000",
  },
  info: {
    light: "#06111E",
    between: "#BCE0FB",
    dark: "#2196F3",
  },
};

const NotificationProgressError = withStyles(() =>
  createStyles({
    root: {
      height: 2,
      borderRadius: 20,
    },
    colorPrimary: {
      backgroundColor: "#340315",
    },
    bar: {
      borderRadius: 20,
      backgroundColor: "#E10000",
    },
  }),
)(LinearProgress);

const NotificationProgressSuccess = withStyles(() =>
  createStyles({
    root: {
      height: 2,
      borderRadius: 20,
    },
    colorPrimary: {
      backgroundColor: "#1E1716",
    },
    bar: {
      borderRadius: 20,
      backgroundColor: "#3EB859",
    },
  }),
)(LinearProgress);

const NotificationProgressWarning = withStyles(() =>
  createStyles({
    root: {
      height: 2,
      borderRadius: 20,
    },
    colorPrimary: {
      backgroundColor: "#1F1005",
    },
    bar: {
      borderRadius: 20,
      backgroundColor: "#FF8311",
    },
  }),
)(LinearProgress);

const NotificationProgressInfo = withStyles(() =>
  createStyles({
    root: {
      height: 2,
      borderRadius: 20,
    },
    colorPrimary: {
      backgroundColor: "#06111E",
    },
    bar: {
      borderRadius: 20,
      backgroundColor: "#2196F3",
    },
  }),
)(LinearProgress);

export const NotificationBox = ({
  notification: { id, message, timeout, title, type, url, button },
}: {
  notification: Notification;
}) => {
  const dispatch = useAppDispatch();
  const classes = useStyles();

  const getProportionalTime = (timeMs: number) => {
    return Math.round((timeMs * 100) / timeout);
  };

  const [timeLeft, setTimeLeft] = useState(getProportionalTime(timeout));
  const [closing, setClosing] = useState(false);
  const [timeoutTimer, _] = useState(new Timer());

  const [appear, setAppear] = useState(false);

  useEffect(() => {
    if (closing) {
      setTimeLeft(0);
      setTimeout(() => {
        dispatch(removeNotification({ id }));
      }, 500);
    }
  }, [closing, dispatch, id]);

  useEffect(() => {
    setTimeout(() => setAppear(true), 100);
    timeoutTimer.on("tick", (ms: number) =>
      setTimeLeft(getProportionalTime(ms)),
    );
    timeoutTimer.on("done", () => setClosing(true));
    timeoutTimer.start(timeout);
  });

  const overridenNotifications = ["depositFunds"];
  const isOverriden = overridenNotifications.includes(message);

  return isOverriden ? null : (
    <Box
      style={{
        opacity: closing ? 0 : appear ? 1 : 0,
        backgroundColor: colors[type].light,
        color: colors[type].dark,
      }}
      className={classes.wrapper}
      onMouseOver={() => timeoutTimer.pause()}
      onMouseOut={() => timeoutTimer.resume()}
      position={"relative"}
      overflow={"hidden"}
      mb={1}
    >
      <Grid className={classes.wrapped} alignItems="center" spacing={2}>
        <Grid xs={10}>
          <Box display="flex" flexGrow={1} alignItems="center" gap={2} mr={2}>
            <Box
              component="div"
              style={{
                color: colors[type].dark,
              }}
              // @ts-ignore // TODO fix
              bgColor={
                type === "success"
                  ? "darkgreen"
                  : type === "error"
                  ? "red"
                  : type === "warning"
                  ? "orange"
                  : "blue"
              }
              height={18}
              width={18}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              {type === "success" ? (
                <CheckCircleOutlineIcon color="inherit" />
              ) : type === "error" ? (
                <ErrorOutlineIcon color="inherit" />
              ) : type === "info" ? (
                <ErrorOutlineIcon color="inherit" />
              ) : type === "warning" ? (
                <WarningAmberRoundedIcon color="inherit" />
              ) : (
                <ClearIcon color="inherit" />
              )}
            </Box>
            <Box color={"text.primary"}>
              <Typography color="inherit" variant="caption">
                {title}
              </Typography>
              <Typography>{message}</Typography>
            </Box>
          </Box>
        </Grid>
        <Grid xs={2}>
          <Box display="flex" alignItems="center" justifyContent="center">
            {button && (
              <Box mr={2}>
                <NextLink href={button.path} passHref>
                  <Button size="small">{button.label}</Button>
                </NextLink>
              </Box>
            )}
            <Box display={"flex"} alignItems={"center"} gap={2}>
              {url ? (
                <Box height={18} width={18} sx={{ cursor: "pointer" }}>
                  <Image
                    onClick={() => openInNewTab(url)}
                    src={
                      type === "success"
                        ? externalLinks.externalLinkSuccess
                        : type === "warning"
                        ? externalLinks.externalLinkWarning
                        : type === "error"
                        ? externalLinks.externalLinkError
                        : externalLinks.externalLinkInfo
                    }
                    alt={"View on Etherscan"}
                    width={18}
                    height={18}
                    color={"inherit"}
                  />
                </Box>
              ) : null}

              <ClearIcon
                color="inherit"
                style={{ cursor: "pointer" }}
                onClick={() => {
                  timeoutTimer.stop();
                  setClosing(true);
                }}
              />
            </Box>
          </Box>
        </Grid>
      </Grid>

      <Box position={"absolute"} width={"100%"} height={"2px"} bottom={0}>
        {type === "success" ? (
          <NotificationProgressSuccess variant="determinate" value={timeLeft} />
        ) : type === "warning" ? (
          <NotificationProgressWarning variant="determinate" value={timeLeft} />
        ) : type === "error" ? (
          <NotificationProgressError variant="determinate" value={timeLeft} />
        ) : (
          <NotificationProgressInfo variant="determinate" value={timeLeft} />
        )}
      </Box>
    </Box>
  );
};
