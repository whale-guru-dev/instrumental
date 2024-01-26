import { Token } from "@/submodules/contracts-operations/src/store/supportedTokens/slice";
import Image from "next/image";
import { Help } from "@mui/icons-material";
import React from "react";

export const StartIcon = ({ value }: { value?: Token }) => {
  if (!value) {
    return null;
  }

  return value.image ? (
    <Image src={value.image} alt={value.symbol} width={24} height={24} />
  ) : (
    <Help fontSize="medium" />
  );
};
