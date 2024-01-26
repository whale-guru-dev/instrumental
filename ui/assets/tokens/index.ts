import dynamic from "next/dynamic";

const arbitrum = dynamic(() => import("./arbitrum.svg"));
const atriCrypto = dynamic(() => import("./atriCrypto.svg"));
const ernRT = dynamic(() => import("./ernRT.svg"));
const ethInst = dynamic(() => import("./eth-inst.svg"));
const inst = dynamic(() => import("./inst.svg"));
const veStrm = dynamic(() => import("./veSTRM.svg"));
const optimistic = dynamic(() => import("./optimistic.svg"));
const polygon = dynamic(() => import("./polygon.svg"));
const strRT = dynamic(() => import("./strRT.svg"));
const usdc = dynamic(() => import("./usdc.svg"));
const weth = dynamic(() => import("./weth.svg"));
const eth = dynamic(() => import("./eth.svg"));
const layr = dynamic(() => import("./layr.svg"));
const crvTricryptoUsdBtcEth = dynamic(
  () => import("./crvTricrypto-usd-btc-eth.svg"),
);
const sushiWethUsdc = dynamic(() => import("./sushi-weth-usdc.svg"));
const sushiWethUsdt = dynamic(() => import("./sushi-weth-usdt.svg"));
const aUsdc = dynamic(() => import("./ausdc.svg"));
const aUsdt = dynamic(() => import("./ausdt.svg"));
const aDai = dynamic(() => import("./adai.svg"));

export {
  arbitrum,
  atriCrypto,
  ernRT,
  ethInst,
  inst,
  optimistic,
  polygon,
  strRT,
  weth,
  usdc,
  crvTricryptoUsdBtcEth,
  layr,
  eth,
  sushiWethUsdc,
  sushiWethUsdt,
  aUsdc,
  aUsdt,
  aDai,
  veStrm,
};
