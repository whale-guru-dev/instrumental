import { useAppSelector } from "store";
import { selectSlippage, selectDeadline } from "./slice";

export function useTransactionSettingsOptions() {
  const slippage = useAppSelector(selectSlippage);
  const deadline = useAppSelector(selectDeadline);
  return { slippage, deadline };
}
