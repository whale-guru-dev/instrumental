import { QUERY_NETWORKS, QueryNetworkChainId } from "./constants";
import { BlockResultType, TokenMetadataResultType } from "./types";

interface Props {
  type: string;
  name: string;
  chainId: QueryNetworkChainId;
  result?: any;
  excludeResult?: Array<string>;
  fragment?: string;
  useArguments: boolean;
  additionalArgs?: string;
}

export function REQUEST ({
  type,
  name,
  chainId,
  result,
  excludeResult,
  fragment,
  useArguments,
  additionalArgs,
}: Props) : string {
  const unwrap = (obj: any): string => {
    return Object.keys(obj).reduce(
      (
        reduceResult, value
      ) => {
        return reduceResult + (!excludeResult || !excludeResult.includes(value) ? value + (typeof obj[value] === 'object' && !(obj[value] instanceof Date) ? ' {' + unwrap(obj[value]) + '}' : '') + "\n" : '');
      },
      "\n"
    );
  }

  return (
    `# Name: ${name} \n` +
    `${type} {\n` +
    `${name}` +
    `${`(\nnetwork: ${QUERY_NETWORKS.filter(network => network.chainId === chainId)[0].name}\n)`}` +
    `${useArguments ? `arguments(smartContractAddress: {is: ${additionalArgs}}) {` : ''}` +
    `${result && Object.keys(result).length > 0 ? ` {${unwrap(result)}}` : ''}` +
    `}` +
    `${useArguments ? `}` : ''}` +
    `${fragment ? fragment : ''}`
  );
}

const BlockResult = { ...new BlockResultType() }

export const BLOCK_NUMBER = (chainId: QueryNetworkChainId) => REQUEST({
  type: 'query',
  name: 'ethereum',
  result: BlockResult,
  chainId,
  useArguments: false,
});

const TokenMetadataResult = { ...new TokenMetadataResultType() }

export const TOKEN_METADATA = (
  chainId: QueryNetworkChainId, tokenAddress: string
) => REQUEST({
  type: 'query',
  name: 'ethereum',
  result: TokenMetadataResult,
  chainId,
  useArguments: true,
  additionalArgs: tokenAddress,
});