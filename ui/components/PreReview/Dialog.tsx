import React, { MouseEvent } from "react";
import {
  Box,
  Dialog as MuiDialog,
  DialogProps as MuiDialogProps,
} from "@mui/material";
// import Image from "next/image";
import { close as Close } from "@/assets/icons/common";

export const Dialog = ({
  children,
  PaperProps,
  onClose,
  ...rest
}: MuiDialogProps) => {
  const handleClose = (e: MouseEvent<HTMLDivElement>) => {
    if (onClose) {
      onClose(e, "escapeKeyDown");
    }
  };

  return (
    <MuiDialog
      sx={{
        maxWidth: "100%",
        height: "100%",
        backdropFilter: "blur(32px)",
      }}
      PaperProps={{
        style: {
          background: "transparent",
          overflow: "hidden",
        },
        elevation: 0,
        ...PaperProps,
      }}
      fullWidth
      {...rest}
    >
      {onClose && (
        <Box
          sx={{
            position: "fixed",
            top: 45,
            right: 45,
            cursor: "pointer",
          }}
          component="div"
          onClick={handleClose}
        >
          {/* <Image src={close} width={14} height={14} alt="Close modal" /> */}
          <Close width={24} height={24} />
        </Box>
      )}

      {children}
    </MuiDialog>
  );
};
