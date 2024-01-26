import {
  FormControl,
  Select,
  Typography,
  useTheme,
  Modal,
  Backdrop,
} from "@mui/material";
import { Fragment } from "react";

const SelectModal = () => {
  const theme = useTheme();

  const getSelect = () => {
    return (
      <FormControl
        sx={{
          width: "100%",
          ".MuiPaper-root": {
            background: "linear-gradient(180deg, #130517 0%, #170514 100%)",
          },
        }}
        margin="normal"
      >
        <Typography
          variant="h3"
          fontFamily="BIN Regular"
          sx={{
            marginBottom: (theme) => theme.spacing(3),
          }}
        >
          Select Network
        </Typography>

        <Select
          sx={{
            background: theme.palette.background.paper,
            "& .MuiSvgIcon-root": {
              fill: theme.palette.primary.main,
            },
            padding: 0,
          }}
          fullWidth
        ></Select>
      </FormControl>
    );
  };
  return (
    <Fragment>
      {getSelect()}
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={true}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Typography>Modal</Typography>
      </Modal>
    </Fragment>
  );
};

export default SelectModal;
