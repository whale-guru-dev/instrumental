import { polygon } from "@/assets/tokens";
import DefiIcon from "@/components/DefiIcon";
import Link from "@/components/Link";
import {
  ADDRESSES,
  ContractAddresses,
  getAddressesByChainId,
} from "@/defi/addresses";
import { ContractsContext } from "@/defi/ContractsContext";
import { useErc20Context } from "@/defi/Erc20Context";
import { useAddresses } from "@/defi/hooks";
import { TokenInfo } from "@/defi/reducers/tokensReducer";
import { SupportedNetworks } from "@/defi/types";
import { usePendingTransactions } from "@/hooks/usePendingTransactions";
import { toBaseUnitBN } from "@/utils";
import {
  Box,
  Button,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
  useTheme,
} from "@mui/material";
// import { useWeb3React } from "@web3-react/core";
import { useConnector } from "@integrations-lib/core";
import { BigNumber } from "bignumber.js";
import { ethers } from "ethers";
import React, { useContext, useEffect, useState } from "react";
import BalanceInputAdornment from "../BalanceInputAdornment";
import BigNumberInput from "../BigNumberInput";

type TransferFormProps = {
  token: TokenInfo;
  heading?: string;
  balance: BigNumber;
  poolId: number;
  interactionType: "withdraw" | "deposit";
};

export const TransferForm: React.FC<TransferFormProps> = ({
  token,
  heading,
  balance,
  poolId,
  interactionType,
}) => {
  // const { account, chainId } = useWeb3React();
  const { account, chainId } = useConnector("metamask");
  const { contracts } = useContext(ContractsContext);
  const [tokenChanged, _setTokenChanged] = useState("select-token");

  const theme = useTheme();

  const { tokens } = useErc20Context();
  const tokensArray = Object.values(tokens);

  const addresses = useAddresses();
  let isPendingDepositTx = usePendingTransactions(
    addresses.liquidityMining,
    "deposit",
  );
  let isPendingApproveTx = usePendingTransactions(
    ADDRESSES[token.tokenId as ContractAddresses][chainId as SupportedNetworks],
    "approve",
  );

  let isPendingWithdrawTx = usePendingTransactions(
    addresses.liquidityMining,
    "withdrawAndHarvest",
  );

  const [lockedLp, setLockedLp] = useState(new BigNumber(0));

  useEffect(() => {
    if (account && contracts && poolId === 0 && !isPendingWithdrawTx) {
      contracts.liquidityMining
        .userInfoBN(new BigNumber(poolId), account)
        .then((x) => {
          setLockedLp(new BigNumber(x.locked));
        });
    }
  }, [account, contracts, poolId, isPendingWithdrawTx]);

  const [approved, setApproved] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | true>(true);
  const [transferValue, setTransferValue] = React.useState<BigNumber>(
    new BigNumber(0),
  );

  useEffect(() => {
    if (contracts && token.allowance && account) {
      const { liquidityMining } = contracts;
      token
        .allowance(account, liquidityMining.getContractAddress())
        .then((allowanceEthersBn) => {
          if (
            allowanceEthersBn.gte(
              ethers.BigNumber.from("0xffffffffffffffffffffffff"),
            )
          ) {
            setApproved(true);
          }
        });
    }
  }, [contracts, token, account]);

  const approve = async (): Promise<void> => {
    if (token.allowance && token.approveMax && chainId) {
      const tx = await token.approveMax(
        getAddressesByChainId(chainId as SupportedNetworks).liquidityMining,
      );

      await tx.wait();
      setApproved(true);
    }
  };

  const deposit = async (): Promise<void> => {
    if (contracts && token.allowance && token.transfer && chainId && account) {
      let transferValConv = toBaseUnitBN(
        transferValue.toFixed(),
        token.decimals,
      );

      let tx = await contracts.liquidityMining.deposit(
        new BigNumber(poolId),
        transferValConv,
        account,
      );

      await tx.wait();
    }
  };

  const withdraw = async (): Promise<void> => {
    if (contracts && token.allowance && token.transfer && chainId && account) {
      let transferValConv = toBaseUnitBN(
        transferValue.toFixed(),
        token.decimals,
      );

      let tx = await contracts.liquidityMining.withdrawAndHarvest(
        new BigNumber(poolId),
        transferValConv,
        account,
      );

      await tx.wait();
    }
  };

  const setValidation = (valid: boolean) => {
    if (valid) {
      setError(true);
    } else {
      setError("Invalid amount");
    }
  };

  const handleSelectChange = (event: SelectChangeEvent<HTMLInputElement>) => {
    const tokenId = event.target.value;

    if (tokenId !== "select-token") {
      // @ts-ignore
      const token: TokenInfo = tokensArray.find((el) => el.tokenId === tokenId);
    }
  };

  return (
    <>
      {heading && (
        <Typography
          variant="h3"
          fontFamily="BIN Regular"
          sx={{
            marginBottom: (theme) => theme.spacing(4),
          }}
        >
          {heading}
        </Typography>
      )}

      {/* <BigNumberInput
        isValid={setValidation}
        forceMaxWidth
        sx={{ marginTop: "1.5rem" }}
        maxValue={interactionType === "deposit" ? balance : lockedLp}
        adornmentStart={
          <Box sx={{ pl: 2 }}>
            <DefiIcon height={24} width={52} icon={asset.picture} />
          </Box>
        }
        adornmentEnd={
          <Link
            onClick={() =>
              setTransferValue(
                interactionType === "deposit" ? balance : lockedLp,
              )
            }
          >
            Max
          </Link>
        }
        placeholder="Enter amount"
        labelValue={
          <BalanceInputAdornment
            balance={interactionType === "deposit" ? token.balanceBN : lockedLp}
            token={token}
            maxDecimals={4}
          />
        }
        labelKey={interactionType === "deposit" ? "Amount" : "Deposited"}
        setter={setTransferValue}
        value={transferValue}
      /> */}
      <Box>
        <BigNumberInput
          height={80}
          isValid={setValidation}
          forceMaxWidth
          maxValue={interactionType === "deposit" ? balance : lockedLp}
          adornmentStart={
            <Select
              sx={{
                background: theme.palette.background.paper,
                "& .MuiSvgIcon-root": {
                  fill: theme.palette.primary.main,
                },
                fontSize: "20px",
                textAlign: "center",
                width: 400,
                height: 48,
              }}
              labelId="token-select-label"
              id="token-select"
              // @ts-ignore
              value={tokenChanged}
              onChange={handleSelectChange}
            >
              <MenuItem
                sx={{
                  fontSize: "20px",
                  height: 56,
                }}
                value="select-token"
              >
                <Box
                  sx={{
                    display: "flex",
                    flexGrow: 1,
                    justifyContent: "center",
                  }}
                >
                  <Typography mx={1}>Select token</Typography>
                </Box>
              </MenuItem>
              {tokensArray.map((token, index) => {
                return (
                  <MenuItem
                    key={index}
                    sx={{
                      fontSize: "20px",
                      height: 56,
                    }}
                    value={token.tokenId}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        width: "100%",
                      }}
                    >
                      <DefiIcon width={24} height={24} icon={polygon} />
                      <Box
                        sx={{
                          display: "flex",
                          flexGrow: 1,
                          justifyContent: "center",
                        }}
                      >
                        <Typography variant="h6">{token.symbol}</Typography>
                      </Box>
                    </Box>
                  </MenuItem>
                );
              })}
            </Select>
          }
          adornmentEnd={
            <Link
              onClick={() =>
                setTransferValue(
                  interactionType === "deposit" ? balance : lockedLp,
                )
              }
            >
              Max
            </Link>
          }
          placeholder="Enter amount"
          labelValue={
            <BalanceInputAdornment
              balance={
                interactionType === "deposit" ? token.balanceBN : lockedLp
              }
              token={token}
              maxDecimals={4}
            />
          }
          labelKey={interactionType === "deposit" ? "Amount" : "Deposited"}
          setter={setTransferValue}
          value={transferValue}
        />
      </Box>
      <Button
        size="large"
        fullWidth
        variant="contained"
        color="primary"
        sx={{ mt: 3 }}
        disabled={
          error !== true ||
          !account ||
          isPendingDepositTx ||
          isPendingApproveTx ||
          (isPendingWithdrawTx && interactionType === "withdraw")
        }
        onClick={
          interactionType === "deposit"
            ? approved
              ? deposit
              : approve
            : withdraw
        }
      >
        <Typography variant="button">
          {interactionType === "deposit"
            ? approved
              ? "Deposit"
              : "Approve"
            : "Withdraw"}
        </Typography>
      </Button>
    </>
  );
};
