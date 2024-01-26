import { Alert as MuiAlert, AlertProps as MuiAlertProps } from "@mui/material";
import React from "react";

import OpenLink from "../OpenLink";
import { ProgressBar } from "../Snackbar";

type AlertProps = {
  message: string;
  link: string;
  progressBarColor: string;
} & MuiAlertProps;

const Alert = ({ message, link, progressBarColor, ...rest }: AlertProps) => {
  return (
    <>
      <MuiAlert {...rest} variant="filled" action={<OpenLink link={link} />}>
        {message}
      </MuiAlert>
      <ProgressBar color={progressBarColor} />
    </>
  );
};

export default Alert;
