import { FC } from "react";
import { Dialog, DialogProps, Box, IconButton, useTheme } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

type ModalProps = DialogProps & {
  open: boolean;
  onClose: () => void;
  breadcrumb?: JSX.Element | null;
};

const Modal: FC<ModalProps> = ({
  open,
  onClose,
  breadcrumb,
  children,
  ...rest
}) => {
  const theme = useTheme();
  return (
    <Dialog
      PaperProps={{
        style: {
          backgroundColor: "transparent",
          boxShadow: "none",
        },
      }}
      BackdropProps={{
        style: {
          background:
            "linear-gradient(180deg, rgba(19, 5, 23, 0.8) 0%, rgba(23, 5, 20, 0.8) 100%)",
          backdropFilter: "blur(36px)",
        },
      }}
      {...rest}
      open={open}
    >
      <Box
        sx={{
          position: "absolute",
          left: "1rem",
          top: "1rem",
          cursor: "pointer",
        }}
      >
        {breadcrumb}
      </Box>
      <Box
        sx={{
          position: "absolute",
          right: "1rem",
          top: "1rem",
          cursor: "pointer",
        }}
      >
        {onClose && (
          <IconButton aria-label="close" onClick={() => onClose()}>
            <CloseIcon sx={{ color: theme.palette.text.secondary }} />
          </IconButton>
        )}
      </Box>
      {children}
    </Dialog>
  );
};

export default Modal;
