import { uniswap, sushiswap, quickswap } from "@/assets/amm";

export const AMMs = {
  uniswap: {
    name: "Uniswap",
    icon: uniswap,
    ammAddress: "0x0000000000000000000000000",
    ammId: "1",
    imageURL: "@/assets/amm/uniswap",
    isRecommended: false,
  },
  sushiswap: {
    name: "Sushiswap",
    icon: sushiswap,
    ammAddress: "0x0000000000000000000000000",
    ammId: "1",
    imageURL: "@/assets/amm/sushiswap",
    isRecommended: false,
  },
  quickswap: {
    name: "Quickswap",
    icon: quickswap,
    ammAddress: "0x0000000000000000000000000",
    ammId: "1",
    imageURL: "@/assets/amm/quickswap",
    isRecommended: false,
  },
};
