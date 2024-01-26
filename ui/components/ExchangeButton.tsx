import Button from "./Button";
import { ButtonProps as MuiButtonProps } from "@mui/material";
// import Image from "next/image";

import { exchange as ExchangeIcon } from "assets/icons/common";

interface ExchangeButtonProps extends MuiButtonProps {
  vertical?: boolean;
}

const ExchangeBtn = ({
  vertical = false,
  disabled = false,
  ...rest
}: ExchangeButtonProps) => {
  const { sx: sxProps, ...restProps } = rest;
  return (
    <Button
      variant="outlined"
      color="primary"
      disabled={disabled}
      sx={{
        minWidth: "unset",
        width: 52,
        height: 52,
        transform: vertical ? "rotate(90deg)" : "",
        p: "0px !important",
        borderColor: "other.border.d2",
        "& img": {
          opacity: 0.4,
        },
        "&:hover img": {
          opacity: 1,
        },
        "&:hover": {
          backgroundColor: "rgba(201, 14, 138, 0.2) !important",
        },
        ...sxProps,
      }}
      {...restProps}
    >
      {/* <Image src={ExchangeIcon} alt={"Exchange"} width={22} height={22} /> */}
      <ExchangeIcon width={22} height={22} />
    </Button>
  );
};

export default ExchangeBtn;
