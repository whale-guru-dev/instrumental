import makeStyles from "@mui/styles/makeStyles";
import { Theme } from "@mui/material/styles";
import { useAppSelector } from "store";
import {
  Notification,
  selectNotifications,
} from "@/submodules/contracts-operations/src/store/notifications/slice";
import { NotificationBox } from "./NotificationBox";
const useStyles = makeStyles((theme: Theme) => ({
  wrapper: {
    bottom: theme.spacing(2),
    right: theme.spacing(2),
    maxWidth: 550,
    position: "fixed",
    width: "100%",
  },
}));

export const NotificationWrapper = () => {
  const notifications = useAppSelector(selectNotifications);
  const classes = useStyles();

  return (
    <div className={classes.wrapper}>
      {Object.values(notifications).map((notification, key) => (
        <NotificationBox
          notification={notification as Notification}
          key={key}
        />
      ))}
    </div>
  );
};
