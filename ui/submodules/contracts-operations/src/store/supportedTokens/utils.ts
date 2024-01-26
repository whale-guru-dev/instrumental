import { ammAPINames, AmmID } from "../../defi/constants"

export const getTokenIconURL = (
  chainId: number, address: string
) => `https://s3.eu-central-1.amazonaws.com/static.chain/tokens/evm/${chainId}/${address}.png`

export const getChainIconURL = (chainId: number) => getTokenIconURL(
  chainId,
  "0x0000000000000000000000000000000000000000"
)

export const getAmmIconURL = (ammId: AmmID) => `https://s3.eu-central-1.amazonaws.com/static.chain/amms/${ammAPINames[ammId].toLowerCase()}.png`