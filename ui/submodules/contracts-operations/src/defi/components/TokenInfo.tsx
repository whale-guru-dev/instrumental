import { TokenInfo as BiLibTokenBalances } from "@integrations-lib/interaction";
import { useDispatch } from "react-redux";

export interface TokenInfoProps {
  children: any;
}

export const TokenInfo = (props: TokenInfoProps) => {
  const dispatch = useDispatch();

  return (
    <BiLibTokenBalances
      dispatch={dispatch}
    >
      {props.children}
    </BiLibTokenBalances>
  );
}
