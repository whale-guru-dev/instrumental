import { SupportedNetwork } from "@/submodules/contracts-operations/src/defi/constants";
import React, { FC } from "react";
import Image from "next/image";
import { Help } from "@mui/icons-material";

type NetworkIconType = { value?: SupportedNetwork };

export const NetworkIcon: FC<NetworkIconType> = ({ value }) => {
  return value?.nativeToken ? (
    <Image
      src={value.nativeToken.image}
      alt={value.name}
      width={24}
      height={24}
    />
  ) : (
    <Help fontSize="medium" />
  );
};
