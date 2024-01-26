import { FC, Fragment } from "react";
import Typography from "@mui/material/Typography";

type TimeLeftProps = {
  // in miliseconds
  timestamp: number;
  startTime?: number;
};

const TimeLeft: FC<TimeLeftProps> = ({ timestamp, startTime }) => {
  const futureDate = timestamp;
  const now = startTime ? new Date(startTime).getTime() : new Date().getTime();
  let diffInMilliSeconds = (futureDate - now) / 1000;

  const diffDays = Math.floor(diffInMilliSeconds / 86400);
  diffInMilliSeconds -= diffDays * 86400;

  const diffHours = Math.floor(diffInMilliSeconds / 3600) % 24;
  diffInMilliSeconds -= diffHours * 3600;

  const diffMinutes = Math.floor(diffInMilliSeconds / 60) % 60;
  diffInMilliSeconds -= diffMinutes * 60;

  return (
    <Fragment>
      {futureDate - now <= 0 && (
        <Typography variant="h4">0d - 0h - 0m</Typography>
      )}
      {futureDate - now > 0 && (
        <Typography variant="h4">
          {`${diffDays}d - ${diffHours}h - ${diffMinutes}m`}
        </Typography>
      )}
    </Fragment>
  );
};

export default TimeLeft;
