import React, {
  // ChangeEvent,
  Fragment,
  useEffect,
  useState,
  useMemo,
  useCallback,
  useContext,
} from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Checkbox,
  // FormControl,
  Grid,
  IconButton as MuiIconButton,
  // MenuItem,
  OutlinedInput,
  // Select,
  // SelectChangeEvent,
  Stack,
  styled,
  Typography,
  useTheme,
  Hidden,
  CircularProgress,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import Tooltip, { TooltipProps, tooltipClasses } from "@mui/material/Tooltip";
// import { Autorenew, GppGood, Repeat } from "@mui/icons-material";
import { BigNumber } from "bignumber.js";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
// import SwapHorizRoundedIcon from "@mui/icons-material/SwapHorizRounded";
// import SwapVertRoundedIcon from "@mui/icons-material/SwapVertRounded";

import BalanceInputAdornmentSwap from "@/components/BalanceInputAdornmentSwap";
import BigNumberInput from "@/components/BigNumberInput";
// import DefiIcon from "components/DefiIcon";
// import IconButton from "@/components/IconButton";
import Layout from "@/container/Layout";
import Link from "@/components/Link";
// import SelectNetwork from "@/components/SelectNetwork/select-network";
import Spacer from "@/components/Spacer";
import SwapDetails from "@/components/SwapDetails";
import SwapDetailsRow from "@/components/SwapDetails/row-details";
// import SwapToken from "@/components/SwapDetails/token-received";
import { info, settings } from "@/assets/icons/common";
// import { polygon } from "@/assets/tokens";
// import { NETWORKS } from "@/defi/networks";
// import { AMMs } from "@/defi/amm";
// import { TokenInfo } from "@/defi/reducers/tokensReducer";
import {
  // useTxConfirmationModal,
  useTxSettingsModal,
} from "@/store/appsettings/hooks";
import { useTransactionSettingsOptions } from "@/store/transactionSettingsOptions/hooks";

import { useAppDispatch, useAppSelector } from "store";
import {
  CrossChainId,
  PartialTokenWithAmms,
  selectCustomTokens,
  selectMosaicTokens,
  selectSupportedTokens,
  SupportedAmm,
  SupportedTokens,
  Token,
  TransferPair,
  updateCustomToken,
} from "@/submodules/contracts-operations/src/store/supportedTokens/slice";
// import Timer from "tiny-timer";
import {
  SupportedNetworkId,
  ETHERIUM_MAINNET_NETWORK,
  liquidityFeePercentage,
  mosaicFeePercentage,
  SUPPORTED_NETWORKS,
  SupportedNetwork,
  SwapAmmID,
  TEST_SUPPORTED_NETWORKS,
  // TestSupportedNetworkId,
  toNativeDisabledThreshold,
  supportedAMMs as allSupportedAMMs,
} from "@/submodules/contracts-operations/src/defi/constants";
import { getChainIconURL } from "@/submodules/contracts-operations/src/store/supportedTokens/utils";
import {
  getTokenId,
  TokenCompositeKey,
  TokenId,
  TokenMetaResult,
  useConnector,
  useTokenMetadata,
} from "@integrations-lib/core";
import { APIFees, getFees } from "@/submodules/contracts-operations/src/api";
import { NetworkTokenOperationsContext } from "@/submodules/contracts-operations/src/defi/components/NetworkTokenOperationsProvider";
import { toBaseUnitBN, toTokenUnitsBN } from "@integrations-lib/interaction";
import { contractAddresses } from "@/phase2/constants";
// import {
//   composeApproval,
//   composeSwap,
//   composeSwitchNetwork,
// } from "@/components/SwapDetails/utils";
// import {
//   // ConfirmationModal,
//   Step,
// } from "@/components/PreReview/ConfirmationModal";
import Warning from "@/components/SwapDetails/Warning";
import Image from "next/image";
import AMMSelector from "@/components/AMMSelector";
import { TokenSelector } from "@/components/MegaSelector/TokenSelector";
import { NetworkSelector } from "@/components/MegaSelector/NetworkSelector";
import ExchangeButton from "@/components/ExchangeButton";

const MuiBox = styled(Box)(() => ({
  display: "grid",
  alignItems: "center",
  marginRight: "1rem",
}));

const LightTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip
    sx={{ cursor: "pointer" }}
    {...props}
    classes={{ popper: className }}
  />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "gray",
    color: theme.palette.text.primary,
    boxShadow: theme.shadows[1],
    fontSize: "1rem",
  },
}));

const Swap = () => {
  const theme = useTheme();
  const Info = info;
  const Settings = settings;

  const minEthWalletGasRemaining = 0.05 as const;
  const tokensLoadingStep = 75;

  const {
    getNativeTokenAmountDecimals,
    getNativeTokenPrice,
    getTokenPrice,
    getTokenAmountDecimals,
    getEthBalance,
    setNetwork,
    setToken,
    getBalance,
    getLiquidity,
    hasApprovedFunds: _hasApprovedFunds,
    approveFunds: _approveFunds,
    swapFunds: _swapFunds,
    canApproveFunds: _canApproveFunds,
    canSwapFunds: _canSwapFunds,
  } = useContext(NetworkTokenOperationsContext);

  const { openTxSettings } = useTxSettingsModal();
  // const { openTxConfirmation } = useTxConfirmationModal();

  const [from, _setFrom] = useState<SupportedNetwork | undefined>(undefined);
  const [to, _setTo] = useState<SupportedNetwork | undefined>(undefined);

  const [fromTokenInitSample, setFromTokenInitSample] = useState<
    CrossChainId | undefined
  >(undefined);
  const [fromTokenInit, setFromTokenInit] = useState<boolean>(false);
  const [fromTokenId, setFromTokenId] = useState<TokenId | undefined>(
    undefined,
  );

  const supportedTokens: SupportedTokens = useAppSelector(
    selectSupportedTokens,
  );
  const mosaicNativeTokens = useAppSelector(selectMosaicTokens);
  const customTokens = useAppSelector(selectCustomTokens);

  const [supportedFromTokens, setSupportedFromTokens] = useState<Array<Token>>(
    [],
  );

  useEffect(() => {
    setSupportedFromTokens(
      from
        ? [
            {
              ...from.nativeToken,
              amms: [...from.nativeToken.amms],
            },
          ]
        : [],
    );
  }, [from]);

  useEffect(() => {
    setSupportedFromTokens((supportedFromTokens) => {
      if (!from) {
        return supportedFromTokens;
      }

      const result = supportedFromTokens
        .filter(
          (token: Token) =>
            !mosaicNativeTokens.find(
              (nativeToken: Token) =>
                getTokenId(nativeToken) === getTokenId(token),
            ),
        )
        .concat(
          mosaicNativeTokens.filter(
            (token: Token) => token.chainId === from.chainId,
          ),
        )
        .sort((a: Token, b: Token) =>
          a.image !== undefined && b.image === undefined ? -1 : 1,
        );

      return result;
    });
  }, [mosaicNativeTokens, from]);

  useEffect(() => {
    setSupportedFromTokens((supportedFromTokens) => {
      if (!from) {
        return supportedFromTokens;
      }

      const result = supportedFromTokens
        .filter(
          (token: Token) =>
            !customTokens.find(
              (customToken: Token) =>
                getTokenId(customToken) === getTokenId(token),
            ),
        )
        .concat(
          customTokens.filter((token: Token) => token.chainId === from.chainId),
        )
        .sort((a: Token, b: Token) =>
          a.image !== undefined && b.image === undefined ? -1 : 1,
        );

      return result;
    });
  }, [customTokens, from]);

  const from_token = useMemo(() => {
    return supportedFromTokens.find(
      (token: Token) => getTokenId(token) === fromTokenId,
    );
  }, [fromTokenId, supportedFromTokens]);

  const mosaicTransferPairs: Array<TransferPair> = useMemo(
    () =>
      (from !== undefined &&
        to !== undefined &&
        supportedTokens[from.chainId]?.mosaicTransferPairs.filter(
          (pair: TransferPair) => pair.destinationChainId === to.chainId,
        )) ||
      [],
    [from, supportedTokens, to],
  );

  const availableTokenPairs: Array<TransferPair> = useMemo(
    () =>
      mosaicTransferPairs.filter(
        (pair: TransferPair) =>
          pair.sourceToken.address === from_token?.address,
      ),
    [from_token, mosaicTransferPairs],
  );

  const toNonNativeTokenIds = useMemo(() => {
    const toSupportedTokens = to && supportedTokens[to.chainId];

    return (
      (to &&
        toSupportedTokens !== undefined &&
        (toSupportedTokens.tokens as Array<TokenCompositeKey>).map(
          (token: TokenCompositeKey) => getTokenId(token),
        )) ||
      []
    );
  }, [supportedTokens, to]);

  const [toTokensToLoad, setToTokensToLoad] =
    useState<number>(tokensLoadingStep);

  useEffect(() => {
    const h = setInterval(() => {
      setToTokensToLoad((toTokensToLoad) =>
        toTokensToLoad + tokensLoadingStep >= toNonNativeTokenIds.length
          ? toNonNativeTokenIds.length
          : toTokensToLoad + tokensLoadingStep,
      );
    }, 1000);

    return () => clearInterval(h);
  });

  const toNonNativeTokens: Array<TokenMetaResult> = useTokenMetadata(
    toNonNativeTokenIds.slice(0, toTokensToLoad),
  );

  const [supportedToTokens, setSupportedToTokens] = useState<Array<Token>>([]);

  useEffect(() => {
    setSupportedToTokens(
      to && to.chainId !== ETHERIUM_MAINNET_NETWORK.chainId
        ? [
            {
              ...to.nativeToken,
              amms: [...to.nativeToken.amms],
            },
          ]
        : [],
    );
  }, [from, to]);

  useEffect(() => {
    const newSupportedToTokens =
      (to &&
        toNonNativeTokens
          .filter(
            (metadata: TokenMetaResult) =>
              metadata.tokenMeta &&
              !supportedToTokens.find(
                (supportedToken: Token) =>
                  metadata.tokenMeta &&
                  getTokenId(supportedToken) === getTokenId(metadata.tokenMeta),
              ),
          )
          .map((metadata: TokenMetaResult) => {
            const storeToken = supportedTokens[to.chainId]?.tokens.find(
              (currentStoreToken: PartialTokenWithAmms) =>
                metadata.tokenMeta &&
                getTokenId(currentStoreToken) ===
                  getTokenId(metadata.tokenMeta),
            );
            return {
              ...storeToken,
              ...metadata.tokenMeta,
              image: metadata.tokenMeta?.image
                ? metadata.tokenMeta?.image
                : undefined,
              decimals: parseInt(
                (metadata.tokenMeta?.decimals as unknown as string) || "",
              ), // TODO(Marko): Fix decimals type in tokenMeta to be string as it is
              crossChainId: metadata.tokenMeta?.symbol,
              amms: storeToken?.amms ? storeToken.amms : [],
              provider: storeToken?.provider ? storeToken.provider : "custom",
            } as Token;
          })) ||
      [];

    if (newSupportedToTokens.length > 0) {
      setSupportedToTokens((supportedToTokens) =>
        supportedToTokens
          .concat(newSupportedToTokens)
          .sort((a: Token, b: Token) =>
            a.image !== undefined && b.image === undefined ? -1 : 1,
          ),
      );
    }
  }, [supportedToTokens, supportedTokens, to, toNonNativeTokens]);

  useEffect(() => {
    setSupportedToTokens((supportedToTokens) => {
      if (!to) {
        return supportedToTokens;
      }

      const nativeTokensToUse =
        !from_token || from_token.provider === "native"
          ? availableTokenPairs
              .filter(
                (pair: TransferPair) => pair.destinationChainId === to.chainId,
              )
              .map((pair: TransferPair) => ({ ...pair.destinationToken }))
          : mosaicNativeTokens.filter(
              (token: Token) => token.chainId === to.chainId,
            );

      const result = supportedToTokens
        .filter(
          (token: Token) =>
            !nativeTokensToUse.find(
              (nativeToken: Token) =>
                getTokenId(nativeToken) === getTokenId(token),
            ),
        )
        .concat(nativeTokensToUse)
        .sort((a: Token, b: Token) =>
          a.image !== undefined && b.image === undefined ? -1 : 1,
        );

      return result;
    });
  }, [availableTokenPairs, mosaicNativeTokens, to, from_token]);

  useEffect(() => {
    setSupportedToTokens((supportedToTokens) => {
      if (!to) {
        return supportedToTokens;
      }

      const result = supportedToTokens
        .filter(
          (token: Token) =>
            !customTokens.find(
              (customToken: Token) =>
                getTokenId(customToken) === getTokenId(token),
            ),
        )
        .concat(
          customTokens.filter((token: Token) => token.chainId === to.chainId),
        )
        .sort((a: Token, b: Token) =>
          a.image !== undefined && b.image === undefined ? -1 : 1,
        );

      return result;
    });
  }, [customTokens, to]);

  const [toTokenInitSample, setToTokenInitSample] = useState<
    CrossChainId | undefined
  >(undefined);
  const [toTokenInit, setToTokenInit] = useState<boolean>(false);
  const [toTokenId, setToTokenId] = useState<TokenId | undefined>(undefined);

  const to_token = useMemo(() => {
    return supportedToTokens.find(
      (token: Token) => getTokenId(token) === toTokenId,
    );
  }, [toTokenId, supportedToTokens]);

  const [amountValidation] = useState<[boolean, string]>([true, ""]);

  const [isAmountValid, amountValidationMessage] = amountValidation;

  const setFrom = useCallback(
    (value: SupportedNetwork | undefined) => {
      _setFrom(value);
      setNetwork(value?.chainId);
    },
    [setNetwork],
  );

  const setFromToken = useCallback(
    (value: Token | undefined) => {
      setFromTokenId(value ? getTokenId(value) : undefined);
      setToken(value);
    },
    [setToken],
  );

  const setTo = useCallback(
    (value: SupportedNetwork | undefined) => {
      _setTo(value);
      setNetwork(value?.chainId);
    },
    [setNetwork],
  );

  const setToToken = useCallback(
    (value: Token | undefined) => {
      setToTokenId(value ? getTokenId(value) : undefined);
      setToken(value);
    },
    [setToken],
  );

  const liquidity = useMemo(
    () => getLiquidity(to_token),
    [getLiquidity, to_token],
  );

  const fromTokenPrice = useMemo(
    () => getTokenPrice(from_token),
    [getTokenPrice, from_token],
  );

  const fromDecimals = useMemo(
    () => getTokenAmountDecimals(from_token),
    [getTokenAmountDecimals, from_token],
  );

  const toTokenPrice = useMemo(
    () => getTokenPrice(to_token),
    [getTokenPrice, to_token],
  );

  const toDecimals = useMemo(
    () => getTokenAmountDecimals(to_token),
    [getTokenAmountDecimals, to_token],
  );

  const toNativeTokenPrice = useMemo(
    () => getNativeTokenPrice(to?.chainId),
    [getNativeTokenPrice, to],
  );

  const toNativeDecimals = useMemo(
    () => getNativeTokenAmountDecimals(to?.chainId),
    [getNativeTokenAmountDecimals, to],
  );

  const ethBalance = useMemo(
    () => getEthBalance(from?.chainId),
    [getEthBalance, from],
  );

  const ethToBalance = useMemo(
    () => getEthBalance(to?.chainId),
    [getEthBalance, to],
  );

  const isFromTokenNative = useMemo(
    () =>
      from &&
      from_token &&
      getTokenId(from_token) === getTokenId(from.nativeToken),
    [from, from_token],
  );

  const isToTokenNative = useMemo(
    () => to && to_token && getTokenId(to_token) === getTokenId(to.nativeToken),
    [to, to_token],
  );

  const {
    account,
    activate,
    // chainId: connectedChainId,
  } = useConnector("metamask");

  const balance = useMemo(
    () =>
      isFromTokenNative
        ? {
            value: ethBalance,
            isLoading: !!account && ethBalance === undefined,
          }
        : getBalance(from_token),
    [account, ethBalance, getBalance, from_token, isFromTokenNative],
  );

  const toBalance = useMemo(
    () =>
      isToTokenNative
        ? {
            value: ethToBalance,
            isLoading: !!account && ethToBalance === undefined,
          }
        : getBalance(to_token),
    [account, ethToBalance, getBalance, to_token, isToTokenNative],
  );

  const spenderVaultAddress = useMemo(
    () => (from ? contractAddresses[from.chainId]?.vault : undefined),
    [from],
  );

  const hasApprovedFunds = useMemo(
    () =>
      spenderVaultAddress
        ? _hasApprovedFunds(from_token, spenderVaultAddress)
        : false,
    [_hasApprovedFunds, spenderVaultAddress, from_token],
  );

  const canApproveFunds = useMemo(
    () =>
      from_token && spenderVaultAddress
        ? _canApproveFunds(from_token, spenderVaultAddress)
        : false,
    [_canApproveFunds, spenderVaultAddress, from_token],
  );

  const approveFunds = useCallback(() => {
    if (!spenderVaultAddress) {
      return Promise.reject("Spender vault address not defined");
    }

    return _approveFunds(from_token, spenderVaultAddress);
  }, [_approveFunds, spenderVaultAddress, from_token]);

  useEffect(() => {
    if (!from && TEST_SUPPORTED_NETWORKS[4]) {
      setFrom(TEST_SUPPORTED_NETWORKS[4]);
    }
  }, [from, setFrom]);

  useEffect(() => {
    if (!to && TEST_SUPPORTED_NETWORKS[42]) {
      setTo(TEST_SUPPORTED_NETWORKS[42]);
    }
  }, [to, setTo]);

  const [agreedSwap, setAgreedSwap] = useState<boolean>(false);

  const [ammUsed, setAmmUsed] = useState<boolean>(false);

  /* TODO(Marko): Fetch properly
  const allTransfers = useAppSelector(selectAllRelayerTransfers);
  const general = useAppSelector(selectRelayerVaultGeneral);
  */

  const [selectedAMM, setSelectedAMM] = useState<SupportedAmm | undefined>(
    undefined,
  );

  useEffect(() => {
    if (to !== undefined) {
      const firstAmm = supportedTokens[to.chainId]?.supportedAmms?.[0];
      setSelectedAMM(firstAmm);
    }
  }, [to, supportedTokens]);

  const supportedAMMs: Array<SupportedAmm> = useMemo(
    () =>
      (from_token !== undefined &&
        to_token !== undefined &&
        from_token.amms.filter((amm: SupportedAmm) =>
          to_token.amms.find(
            (currentAmm: SupportedAmm) => currentAmm.ammId === amm.ammId,
          ),
        )) ||
      [],
    [from_token, to_token],
  );

  // const selectedTokenPair = useMemo(
  //   () =>
  //     availableTokenPairs.find(
  //       (pair: TransferPair) =>
  //         pair.sourceToken.address === from_token?.address &&
  //         pair.destinationToken.address === to_token?.address,
  //     ),
  //   [availableTokenPairs, from_token, to_token],
  // );

  const [dest_address, setDestAddress] = useState<string>("");
  const [fees, setFees] = useState<APIFees | undefined>(undefined);

  const [searchForToken, setSearchForToken] = useState<TokenId | undefined>(
    undefined,
  );

  const customTokensMetadata: Array<TokenMetaResult> = useTokenMetadata(
    searchForToken ? [searchForToken] : [],
  );

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (customTokensMetadata.length > 0) {
      const token = customTokensMetadata[0];
      if (!token.isLoading && token.tokenMeta) {
        dispatch(
          updateCustomToken({
            ...token.tokenMeta,
            amms: [],
            provider: "custom",
            crossChainId: token.tokenMeta.symbol,
            chainId: token.tokenMeta.chainId as SupportedNetworkId,
          }),
        );
        setSearchForToken(undefined);
      }
    }
  }, [customTokensMetadata, dispatch]);

  const [from_value, setFromValue] = useState<BigNumber>(new BigNumber(0));

  // const [lockTimer, _] = useState(new Timer());
  const [_t] = useState(0);
  const { slippage, deadline } = useTransactionSettingsOptions();

  const toValueFromValuePriceRation = useMemo(
    () =>
      (fromTokenPrice && toTokenPrice && toTokenPrice / fromTokenPrice) || 1,
    [fromTokenPrice, toTokenPrice],
  );

  const fromValueToValuePriceRatio = useMemo(
    () => 1 / toValueFromValuePriceRation,
    [toValueFromValuePriceRation],
  );

  /*
  const latestTimestamp = useCallback(() => {
    if (!account) {
      return 0;
    }
    const v = Object.values(allTransfers)
      .filter(
        (x) =>
          x.fromChainId === from?.chainId &&
          x.fromAddress.toLowerCase() === account.toLowerCase()
      )
      .sort((a, b) => b.toTimestamp - a.toTimestamp);
    return v.length ? v[0].toTimestamp : 0;
  }, [account, allTransfers, from]);
  */

  const handleChangeToToken = useCallback(
    (value: Token | undefined) => {
      setToToken(value);
      setAmmUsed(value?.symbol !== from_token?.symbol);
    },
    [from_token, setToToken],
  );

  useEffect(() => {
    if (
      to &&
      !toTokenId &&
      !toTokenInit &&
      supportedToTokens[0]?.chainId === to.chainId
    ) {
      const analogToken = toTokenInitSample
        ? supportedToTokens.find(
            (token: Token) => token.crossChainId === toTokenInitSample,
          )
        : undefined;
      handleChangeToToken(analogToken || supportedToTokens[0]);
      setToTokenInit(true);
    }
  }, [
    handleChangeToToken,
    toTokenInit,
    toTokenId,
    supportedToTokens,
    to,
    toTokenInitSample,
  ]);

  const handleChangeFromToken = useCallback(
    (value: Token | undefined) => {
      setFromToken(value);
    },
    [setFromToken],
  );

  useEffect(() => {
    if (
      from &&
      !fromTokenId &&
      !fromTokenInit &&
      supportedFromTokens[0]?.chainId === from.chainId
    ) {
      const analogToken = fromTokenInitSample
        ? supportedFromTokens.find(
            (token: Token) => token.crossChainId === fromTokenInitSample,
          )
        : undefined;
      handleChangeFromToken(analogToken || supportedFromTokens[0]);
      setFromTokenInit(true);
    }
  }, [
    fromTokenInit,
    fromTokenId,
    handleChangeFromToken,
    supportedFromTokens,
    from,
    fromTokenInitSample,
  ]);

  useEffect(() => {
    setAmmUsed(from_token?.symbol !== to_token?.symbol);
  }, [from_token, to_token]);

  const fromValid =
    !!from_token &&
    supportedFromTokens.some(
      (token: Token) => token.address === from_token.address,
    );

  /*
  useEffect(() => {
    const depositTimeout =
      (fromValid &&
        from_token !== undefined &&
        from !== undefined &&
        general[from_token.symbol]?.[from.chainId].depositTimeout * 1000) ||
      0;
    if (latestTimestamp() && depositTimeout && account) {
      const now = new Date().getTime();
      if (latestTimestamp() + depositTimeout > now) {
        lockTimer.on("tick", (ms: number) => setTimeLeft(ms));
        lockTimer.start(latestTimestamp() + depositTimeout - now);
      }
    }
    return () => {
      lockTimer.stop();
    };
  }, [
    account,
    from,
    from_token,
    fromValid,
    general,
    latestTimestamp,
    lockTimer,
  ]);
  */

  const handleChangeFrom = useCallback(
    (network: SupportedNetwork | undefined) => {
      setFrom(network);

      if (to?.chainId === network?.chainId) {
        setTo(from);
      }

      setFromTokenInitSample(from_token?.crossChainId);
      setFromTokenId(undefined);
      setFromTokenInit(false);
    },
    [from, from_token, setFrom, setTo, to],
  );

  const handleChangeTo = useCallback(
    (network: SupportedNetwork | undefined) => {
      setTo(network);

      if (from?.chainId === network?.chainId) {
        setFrom(to);
      }

      if (network?.chainId === ETHERIUM_MAINNET_NETWORK.chainId) {
        setAgreedSwap(false);
      }

      setToTokenInitSample(to_token?.crossChainId);
      setToTokenId(undefined);
      setToTokenInit(false);
    },
    [from, setFrom, setTo, to_token, to],
  );

  const handleExchangeNetwork = useCallback(() => {
    handleChangeFrom(to);
    handleChangeTo(from);

    if (!from_token || !to_token) {
      return;
    }

    const newToToken = supportedFromTokens.find(
      (t: Token) => t.crossChainId === to_token.crossChainId,
    );
    handleChangeToToken(newToToken);

    const newFromToken = supportedToTokens.find(
      (t: Token) => t.crossChainId === from_token.crossChainId,
    );
    handleChangeFromToken(newFromToken);
  }, [
    handleChangeFrom,
    handleChangeFromToken,
    handleChangeTo,
    handleChangeToToken,
    from,
    from_token,
    supportedFromTokens,
    supportedToTokens,
    to,
    to_token,
  ]);

  const disableExchangeTokenButton = useMemo(() => {
    if (!from_token || !to_token) {
      return true;
    }

    const newToToken = supportedToTokens.find(
      (t: Token) => t.crossChainId === from_token.crossChainId,
    );
    const newFromToken = supportedFromTokens.find(
      (t: Token) => t.crossChainId === to_token.crossChainId,
    );

    return !newToToken || !newFromToken;
  }, [from_token, supportedToTokens, supportedFromTokens, to_token]);

  const handleExchangeToken = useCallback(() => {
    if (!from_token || !to_token) {
      return;
    }

    const newToToken = supportedToTokens.find(
      (t: Token) => t.crossChainId === from_token.crossChainId,
    );
    handleChangeToToken(newToToken);

    const newFromToken = supportedFromTokens.find(
      (t: Token) => t.crossChainId === to_token.crossChainId,
    );
    handleChangeFromToken(newFromToken);
  }, [
    from_token,
    handleChangeFromToken,
    handleChangeToToken,
    supportedFromTokens,
    supportedToTokens,
    to_token,
  ]);

  const minFromValue = useMemo(
    () =>
      from_token?.minTransferAmount
        ? toTokenUnitsBN(from_token?.minTransferAmount, from_token.decimals)
        : new BigNumber(Number.EPSILON),
    [from_token],
  );

  const maxFromValue = useMemo(() => {
    const balanceValue = balance?.value || new BigNumber(0);
    const maxTransferAmount = from_token?.maxTransferAmount
      ? toTokenUnitsBN(from_token.maxTransferAmount, from_token.decimals)
      : new BigNumber(Infinity);
    return balanceValue.isLessThan(maxTransferAmount)
      ? balanceValue
      : maxTransferAmount;
  }, [balance, from_token]);

  const handleMax = useCallback(() => {
    setFromValue(maxFromValue);
  }, [maxFromValue]);

  // const handleToMax = useCallback(() => {
  //   setToValue(maxFromValue);
  // }, [maxFromValue]);

  const swapAmmParameter: SwapAmmID | undefined = useMemo(
    () => (ammUsed ? selectedAMM?.ammId : "0"),
    [ammUsed, selectedAMM],
  );

  const swapDestinationAddress = useMemo(
    () => dest_address || account,
    [account, dest_address],
  );

  const grossToValue = useMemo(
    () => from_value.times(toValueFromValuePriceRation),
    [from_value, toValueFromValuePriceRation],
  );

  const liquidityFee = useMemo(
    () =>
      fees?.mosaicFeePercentage
        ? grossToValue.times(
            (fees.mosaicFeePercentage / 100) * liquidityFeePercentage,
          )
        : new BigNumber(0),
    [fees, grossToValue],
  );

  const toTokenPriceToNativeTokenPriceRatio = useMemo(
    () =>
      (toTokenPrice &&
        toNativeTokenPrice &&
        toTokenPrice / toNativeTokenPrice) ||
      1,
    [toTokenPrice, toNativeTokenPrice],
  );

  const transactionFee = useMemo(
    () =>
      fees?.baseFee
        ? fees.baseFee.times(toTokenPriceToNativeTokenPriceRatio)
        : new BigNumber(0),
    [fees, toTokenPriceToNativeTokenPriceRatio],
  );

  const mosaicFee = useMemo(
    () =>
      fees?.mosaicFeePercentage
        ? grossToValue.times(
            (fees.mosaicFeePercentage / 100) * mosaicFeePercentage,
          )
        : new BigNumber(0),
    [fees, grossToValue],
  );

  const totalToValue = useMemo(
    () =>
      grossToValue.minus(liquidityFee).minus(mosaicFee).minus(transactionFee),
    [grossToValue, liquidityFee, mosaicFee, transactionFee],
  );

  const minimumReceived = useMemo(
    () => (ammUsed ? totalToValue.times(1 - slippage / 100) : totalToValue),
    [ammUsed, slippage, totalToValue],
  );

  const minimumReceivedUSD = useMemo(
    () =>
      (toTokenPrice && minimumReceived?.times(toTokenPrice).toNumber()) || 0,
    [minimumReceived, toTokenPrice],
  );

  const toNativeValueUSD = 10;

  const to_value = useMemo(
    () =>
      agreedSwap && toTokenPrice
        ? new BigNumber((minimumReceivedUSD - toNativeValueUSD) / toTokenPrice)
        : minimumReceived,
    [
      agreedSwap,
      minimumReceived,
      minimumReceivedUSD,
      toNativeValueUSD,
      toTokenPrice,
    ],
  );

  const toNativeValue = useMemo(
    () =>
      agreedSwap && toNativeTokenPrice
        ? new BigNumber(toNativeValueUSD / toNativeTokenPrice)
        : new BigNumber(0),
    [agreedSwap, toNativeValueUSD, toNativeTokenPrice],
  );

  const toValueValid = to_value > new BigNumber(0);
  const toValid =
    !!to_token &&
    supportedToTokens.some(
      (token: Token) => token.address === to_token.address,
    );

  const canSwapFunds = useMemo(
    () =>
      from_token &&
      to_token &&
      !minFromValue.isLessThanOrEqualTo(0) &&
      !from_value.isLessThan(minFromValue) &&
      !from_value.isGreaterThan(maxFromValue) &&
      !minimumReceived.isLessThanOrEqualTo(0) &&
      deadline &&
      swapDestinationAddress &&
      swapAmmParameter
        ? _canSwapFunds(
            from_token,
            to_token,
            from_value,
            swapDestinationAddress || "",
            deadline,
            swapAmmParameter || ("1" as SwapAmmID),
            minimumReceived,
          )
        : false,
    [
      _canSwapFunds,
      from_token,
      to_token,
      minFromValue,
      from_value,
      maxFromValue,
      minimumReceived,
      deadline,
      swapDestinationAddress,
      swapAmmParameter,
    ],
  );

  const swapFunds = useCallback(
    () =>
      _swapFunds(
        from_token,
        to_token,
        from_value,
        swapDestinationAddress || "",
        deadline,
        swapAmmParameter || ("1" as SwapAmmID),
        minimumReceived,
        agreedSwap,
      ),
    [
      _swapFunds,
      from_value,
      swapDestinationAddress,
      deadline,
      swapAmmParameter,
      minimumReceived,
      agreedSwap,
      to_token,
      from_token,
    ],
  );

  const shouldShowEthWarning = useMemo(
    () =>
      isAmountValid &&
      (isFromTokenNative
        ? ethBalance?.minus(from_value)?.isLessThan(minEthWalletGasRemaining)
        : ethBalance?.isLessThan(minEthWalletGasRemaining)),
    [isAmountValid, isFromTokenNative, ethBalance, from_value],
  );

  // const buttonDisabled = useMemo(
  //   () =>
  //     !from_token ||
  //     minFromValue.isLessThanOrEqualTo(0) ||
  //     from_value.isLessThan(minFromValue) ||
  //     from_value.isGreaterThan(maxFromValue) ||
  //     !to_token ||
  //     minimumReceived.isLessThanOrEqualTo(0) ||
  //     !deadline ||
  //     !swapDestinationAddress ||
  //     !account ||
  //     !swapAmmParameter ||
  //     shouldShowEthWarning ||
  //     !isAmountValid,
  //   [
  //     account,
  //     from_token,
  //     from_value,
  //     to_token,
  //     maxFromValue,
  //     minFromValue,
  //     minimumReceived,
  //     deadline,
  //     swapAmmParameter,
  //     swapDestinationAddress,
  //     isAmountValid,
  //     shouldShowEthWarning,
  //   ],
  // );

  useEffect(() => {
    if (fromValid && toValid && from && from_token && swapAmmParameter) {
      getFees(
        "transfer_fee",
        swapAmmParameter,
        toBaseUnitBN(from_value.toString(), from_token.decimals),
        from_token.address,
        from.chainId,
      ).then((value: APIFees) => {
        setFees(value);
      });
    }
  }, [from, from_token, from_value, fromValid, swapAmmParameter, toValid]);

  // const networkSwitchDisabled = from && from.chainId === connectedChainId;
  // const canHaveSwitchNetworkStep = to && !networkSwitchDisabled;
  const isFundsSufficient =
    Number(from_value.toString()) > Number(maxFromValue.toString());
  // const switchNetworkStep: Step = useMemo(
  //   () => ({
  //     ...composeSwitchNetwork(
  //       connectedChainId as TestSupportedNetworkId,
  //       from?.chainId,
  //     ),
  //     action: () => {
  //       return new Promise<void>((resolve, reject) => {
  //         const result: Promise<void> = activate(from) as Promise<void>;
  //         result.then(() => resolve()).catch(() => reject());
  //       });
  //     },
  //     icon: <Repeat />,
  //   }),
  //   [activate, from, connectedChainId],
  // );

  // const approveFundsStep: Step = useMemo(
  //   () => ({
  //     ...composeApproval(),
  //     action: approveFunds,
  //     icon: <GppGood />,
  //   }),
  //   [approveFunds],
  // );

  // const swapFundsStep: Step = useMemo(
  //   () => ({
  //     ...composeSwap(from_token, to_token, from_value, to_value),
  //     action: swapFunds,
  //     icon: <Autorenew />,
  //   }),
  //   [from_token, to_token, from_value, swapFunds, to_value],
  // );

  // const allPossibleModalSteps: Array<Step> = useMemo(
  //   () => [switchNetworkStep, approveFundsStep, swapFundsStep],
  //   [switchNetworkStep, approveFundsStep, swapFundsStep],
  // );

  // const executingStepsIndices: Array<number> = useMemo(
  //   () => [
  //     ...(canHaveSwitchNetworkStep ? [0] : []), // TODO(Marko): Dynamically get indices
  //     ...(!hasApprovedFunds ? [1] : []),
  //     2,
  //   ],
  //   [canHaveSwitchNetworkStep, hasApprovedFunds],
  // );

  useEffect(() => {
    if (minimumReceivedUSD < toNativeDisabledThreshold) {
      setAgreedSwap(false);
    }
  }, [minimumReceivedUSD]);

  // const [isConfirmationModalOpen, setConfirmationModalOpen] =
  //   useState<boolean>(false);

  return (
    <Layout>
      <Box mx="auto">
        <Stack spacing={3} mt={10}>
          <Typography
            textAlign="center"
            variant="h2"
            fontFamily="BIN Regular"
            mb={2}
          >
            cross-chain swaps
          </Typography>
          <Typography textAlign="center" variant="h5" color="text.secondary">
            Perform cross-layer swaps and transfers with the best yield
            guaranteed
          </Typography>
        </Stack>

        <Spacer mt={16} />

        <Box>
          <Grid container justifyContent="space-between" spacing={2}>
            <Grid item>
              <Box>
                <Typography variant="h6" color="text.secondary">
                  From network
                </Typography>
                <NetworkSelector
                  networks={Object.values(TEST_SUPPORTED_NETWORKS)}
                  value={from}
                  onChange={handleChangeFrom}
                  sx={{
                    width: "376px",
                    height: "56px",
                  }}
                />
              </Box>
            </Grid>
            <Grid sx={{ display: "grid", alignItems: "flex-end" }} item>
              <Hidden mdUp>
                {/* <IconButton
                  onClick={handleExchangeNetwork}
                  width="56px"
                  height="56px"
                  disabled={!!(from && to)}
                  Icon={<SwapHorizRoundedIcon />}
                /> */}
                <ExchangeButton
                  onClick={handleExchangeNetwork}
                  vertical={true}
                  disabled={!!(from && to)}
                  sx={{ width: "56px", height: "56px" }}
                />
              </Hidden>
              <Hidden mdDown>
                {/* <IconButton
                  onClick={handleExchangeNetwork}
                  width="56px"
                  height="56px"
                  Icon={<SwapHorizRoundedIcon />}
                /> */}
                <ExchangeButton
                  onClick={handleExchangeNetwork}
                  sx={{ width: "56px", height: "56px" }}
                />
              </Hidden>
            </Grid>
            <Grid item>
              <Box>
                <Typography variant="h6" color="text.secondary">
                  To network
                </Typography>
                <NetworkSelector
                  networks={Object.values(TEST_SUPPORTED_NETWORKS)}
                  value={to}
                  onChange={handleChangeTo}
                  sx={{
                    width: "376px",
                    height: "56px",
                  }}
                />
              </Box>
            </Grid>
          </Grid>
        </Box>

        <Spacer mt={8} />

        <Box>
          <Box textAlign="right">
            <MuiIconButton onClick={openTxSettings}>
              <Settings />
            </MuiIconButton>
          </Box>

          <Spacer mt={1} />

          <Box>
            <BigNumberInput
              value={from_value}
              isValid={() => {}}
              setter={setFromValue}
              error={!isAmountValid}
              sx={{
                borderTopLeftRadius: 0,
                borderBottomLeftRadius: 0,
                height: 52,
              }}
              forceDisable={!account}
              adornmentStart={
                <TokenSelector
                  ammList={allSupportedAMMs}
                  tokens={supportedFromTokens}
                  value={from_token}
                  onChange={handleChangeFromToken}
                  edge="end"
                  getTokens={(tokenAddress: string) => {
                    if (from) {
                      setSearchForToken(
                        getTokenId({
                          address: tokenAddress.toLowerCase(),
                          chainId: from.chainId,
                        }),
                      );
                    }
                    return Promise.resolve([]);
                  }}
                />
              }
              adornmentEnd={<Link onClick={handleMax}>Max</Link>}
              forceMaxWidth
              // minValue={minFromValue}
              maxValue={maxFromValue}
              maxDecimals={from_token?.decimals || 0}
              placeholder={from_value.toString()}
              labelKey="Swap from"
              labelValue={
                balance?.isLoading ? (
                  <CircularProgress size={16} />
                ) : (
                  <BalanceInputAdornmentSwap
                    balance={balance.value}
                    token={from_token}
                    maxDecimals={fromDecimals}
                  />
                )
              }
            />
          </Box>
        </Box>

        <Grid
          mt={1}
          sx={{
            display: "flex",
            flexDirection: "row-reverse",
            justifyContent: "space-between",
          }}
        >
          {/*Just make sure Balance is the first element, and we can remove unnecessary layout conditions in JS*/}
          <Typography color={"textSecondary"}>
            {fromTokenPrice
              ? `~ ${from_value?.times(fromTokenPrice).toFixed(2)} USD`
              : "-"}
          </Typography>
          {!isAmountValid && (
            <Typography variant="body2" color="error">
              {amountValidationMessage}
            </Typography>
          )}
          {shouldShowEthWarning && (
            <Typography color="other.alert.primary" width="65%">
              To ensure the transaction, at least {minEthWalletGasRemaining} ETH
              must be left on your wallet to pay for gas fees.
            </Typography>
          )}
          {isFundsSufficient && (
            <Typography color="error.main">Insufficient funds.</Typography>
          )}
        </Grid>

        <Spacer mt={4} />

        <Box height="56px" textAlign="center">
          {/* <IconButton
            disabled={disableExchangeTokenButton}
            onClick={handleExchangeToken}
            width="56px"
            height="56px"
            Icon={<SwapVertRoundedIcon />}
          /> */}
          <ExchangeButton
            disabled={disableExchangeTokenButton}
            onClick={handleExchangeToken}
            vertical={true}
            sx={{ width: "56px", height: "56px" }}
          />
        </Box>

        <Spacer mt={4} />
        <Box>
          <BigNumberInput
            height={80}
            isValid={() => {}}
            forceMaxWidth
            adornmentStart={
              <TokenSelector
                ammList={allSupportedAMMs}
                tokens={supportedToTokens}
                value={to_token}
                onChange={handleChangeToToken}
                edge="end"
                getTokens={(tokenAddress: string) => {
                  if (to) {
                    setSearchForToken(
                      getTokenId({
                        address: tokenAddress.toLowerCase(),
                        chainId: to.chainId,
                      }),
                    );
                  }
                  return Promise.resolve([]);
                }}
              />
            }
            // adornmentEnd={
            //   <Link onClick={() => setTransferValue(toT.balanceBN)}>Max</Link>
            // }
            // placeholder="Enter amount"
            maxValue={new BigNumber(100)}
            maxDecimals={to_token?.decimals || 0}
            placeholder={toValueValid ? to_value.toString() : "0"}
            forceDisable={true}
            labelValue={
              toBalance?.isLoading ? (
                <CircularProgress size={16} />
              ) : (
                <BalanceInputAdornmentSwap
                  balance={toBalance.value}
                  token={to_token}
                  maxDecimals={toDecimals}
                />
              )
            }
            labelKey="Swap to"
            setter={() => {}}
            value={toValueValid ? to_value : new BigNumber(0)}
          />
        </Box>
        <Box mt={1} textAlign="right">
          <Typography color={"textSecondary"}>
            {(from_token?.symbol &&
              to_token?.symbol &&
              `1 ${from_token.symbol} = ${fromValueToValuePriceRatio} ${to_token.symbol}`) ||
              "-"}
          </Typography>
        </Box>

        {account && (
          <>
            <Spacer mt={4} />
            {ammUsed && (
              <Box mt={1}>
                <Typography variant="h6" color="text.secondary">
                  AMM
                </Typography>
                <AMMSelector
                  label="Select AMM"
                  amms={supportedAMMs}
                  selected={selectedAMM}
                  onChange={setSelectedAMM}
                />
              </Box>
            )}

            <Spacer mt={4} />
            {to &&
              to.chainId !== ETHERIUM_MAINNET_NETWORK.chainId &&
              !isToTokenNative && (
                <Box mb={6}>
                  <Box display="flex" alignItems="center">
                    <Checkbox
                      sx={{
                        padding: 0,
                        mr: "1rem",
                        "& .MuiSvgIcon-root": { fontSize: "2rem", padding: 0 },
                      }}
                      disabled={minimumReceivedUSD < toNativeDisabledThreshold}
                      checked={agreedSwap}
                      onChange={(e) => setAgreedSwap(e.target.checked)}
                    />
                    <Typography variant="h6" color="text.primary" mr="1rem">
                      I would like to swap a portion of my tokens to
                    </Typography>
                    <Image
                      src={getChainIconURL(to.chainId)}
                      width={24}
                      height={24}
                      alt={to.name}
                    />
                    <Typography variant="h6" color="text.primary" mr="1rem">
                      {to.nativeToken.symbol}
                    </Typography>
                    <LightTooltip
                      title="Enabling this option will allow to swap the minimum amount
                      to operate on the destination network. If you do not have
                      any funds in your wallet, this will help you to use your
                      swapped tokens on this network."
                      placement="top"
                    >
                      <MuiBox>
                        <Info />
                      </MuiBox>
                    </LightTooltip>
                  </Box>
                </Box>
              )}

            <Spacer mt={4} />

            <Box>
              <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon sx={{ color: "#A77DFF" }} />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <Typography variant="h6" sx={{ color: "#A77DFF" }}>
                    Change destination address (optional)
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <OutlinedInput
                    sx={{
                      backgroundColor: "inherit",
                      fontSize: "20px",
                    }}
                    onChange={(e) => setDestAddress(e.target.value)}
                    type="text"
                    fullWidth
                    value={dest_address}
                    placeholder="Enter address"
                  />
                </AccordionDetails>
              </Accordion>
            </Box>

            <Spacer mt={4} />

            {fromValid &&
              isAmountValid &&
              to &&
              to_token &&
              fromTokenPrice &&
              toTokenPrice &&
              (!ammUsed || selectedAMM) &&
              toNativeTokenPrice && (
                <Fragment>
                  <SwapDetails>
                    <SwapDetailsRow
                      label={
                        <Box display="flex" alignItems="center">
                          <Typography
                            variant="h6"
                            color="text.secondary"
                            mr="1rem"
                          >
                            Liquidity provider fee
                          </Typography>
                          <LightTooltip
                            title="Fixed Percentage Fee = 0.3% from the transfer amount.
                            This fee is the amount that the platform will need to proceed with the transaction."
                            placement="top"
                          >
                            <MuiBox>
                              <Info />
                            </MuiBox>
                          </LightTooltip>
                        </Box>
                      }
                      value={`${liquidityFee?.toFixed(fromDecimals * 3)} ${
                        to_token.symbol
                      }`}
                      valueDetail={`${liquidityFee
                        ?.times(fromTokenPrice)
                        .toFixed(2)} USD`}
                    />
                    <SwapDetailsRow
                      label={
                        <Box display="flex" alignItems="center">
                          <Typography
                            variant="h6"
                            color="text.secondary"
                            mr="1rem"
                          >
                            Instrumental fees
                          </Typography>
                          <LightTooltip
                            title="Fixed Percentage Fee = 0.3% from the transfer amount.
                            This fee is the amount that the platform will need to proceed with the transaction."
                            placement="top"
                          >
                            <MuiBox>
                              <Info />
                            </MuiBox>
                          </LightTooltip>
                        </Box>
                      }
                      value={`${mosaicFee?.toFixed(fromDecimals * 3)} ${
                        to_token.symbol
                      }`}
                      valueDetail={`${mosaicFee
                        ?.times(fromTokenPrice)
                        .toFixed(2)} USD`}
                    />
                    <SwapDetailsRow
                      label={
                        // <SwapToken symbol={to_token.symbol} icon={polygon} />
                        <Box display="flex" alignItems="center">
                          <Typography
                            variant="h6"
                            color="text.secondary"
                            mr="1rem"
                          >
                            Transaction fees
                          </Typography>
                          <LightTooltip
                            title="Fixed Percentage Fee = 0.3% from the transfer amount.
                            This fee is the amount that the platform will need to proceed with the transaction."
                            placement="top"
                          >
                            <MuiBox>
                              <Info />
                            </MuiBox>
                          </LightTooltip>
                        </Box>
                      }
                      value={`${transactionFee?.toFixed(fromDecimals * 3)} ${
                        to_token.symbol
                      }`}
                      valueDetail={`${transactionFee
                        ?.times(fromTokenPrice)
                        .toFixed(2)} USD`}
                      // bgColor={alpha(theme.palette.primary.main, 0.1)}
                    />
                    <SwapDetailsRow
                      label={
                        <Box display="flex" alignItems="center">
                          <Image
                            src={to_token.image}
                            width={24}
                            height={24}
                            alt=""
                          />
                          <Typography
                            variant="h6"
                            color="text.secondary"
                            mr="1rem"
                          >
                            {to_token.symbol} received
                          </Typography>
                        </Box>
                      }
                      value={`${minimumReceived?.toFixed(toDecimals)} ${
                        to_token.symbol
                      }`}
                      valueDetail={`~ ${minimumReceived
                        ?.times(toTokenPrice)
                        .toFixed(2)} USD`}
                      bgColor={alpha(theme.palette.primary.main, 0.1)}
                    />
                    {SUPPORTED_NETWORKS[to.chainId].nativeToken &&
                      toNativeValue?.isGreaterThan(0) && (
                        <SwapDetailsRow
                          label={`${
                            SUPPORTED_NETWORKS[to.chainId].nativeToken.symbol
                          } received`}
                          value={`${toNativeValue?.toFixed(toNativeDecimals)} ${
                            SUPPORTED_NETWORKS[to.chainId].nativeToken.symbol
                          }`}
                          valueDetail={`~ ${toNativeValue
                            ?.times(toNativeTokenPrice)
                            .toFixed(2)} USD`}
                          bgColor={alpha(theme.palette.primary.main, 0.1)}
                          image={
                            SUPPORTED_NETWORKS[to.chainId].nativeToken.image
                          }
                        />
                      )}
                    {ammUsed && (
                      <SwapDetailsRow
                        label={"AMM"}
                        value={
                          <Box display="flex" alignItems="center">
                            {selectedAMM?.image && (
                              <Image
                                src={selectedAMM?.image}
                                width={24}
                                height={24}
                                alt={selectedAMM?.name}
                              />
                            )}
                            <Typography variant="h6" color="text.primary">
                              {selectedAMM?.name}
                            </Typography>
                          </Box>
                        }
                      />
                    )}
                    {ammUsed && (
                      <SwapDetailsRow
                        label={"Allowed slippage"}
                        value={`${slippage} $`}
                      />
                    )}
                    <SwapDetailsRow
                      label={"Transaction deadline"}
                      value={`${deadline} Minutes`}
                    />
                  </SwapDetails>
                </Fragment>
              )}

            <Spacer mt={4} />

            {from_token && (
              <Box>
                <Typography color="text.secondary">
                  Output is estimated. You will receive at least{" "}
                  {minimumReceived.toFixed(toDecimals)} {from_token.symbol} or
                  the transaction will revert.
                </Typography>
                <Typography color="text.secondary" fontSize={12} mt={1}>
                  Note: In the event that the transaction fails, the funds will
                  be returned to the deposit address with the transaction costs
                  applied. Transaction cost will be approximately{" "}
                  {transactionFee.toFixed(fromDecimals * 3)}{" "}
                  {from_token?.symbol}
                </Typography>
              </Box>
            )}
            {liquidity?.isLessThan(to_value) && (
              <React.Fragment>
                <Box mb={4} />
                <Warning
                  caution={true}
                  title="There is not enough liquidity on the destination network to proceed. Please increase transaction deadline to 1 hour to avoid a failed transaction."
                />
              </React.Fragment>
            )}
            {/* slippage condition needed  */}
            {ammUsed && slippage < 1 && (
              <React.Fragment>
                <Box mb={4}>
                  <Warning
                    caution={true}
                    title="There is not enough slippage to swap this asset. Please increase slippage tolerance to at least 1% to avoid a failed transaction."
                  />
                </Box>
              </React.Fragment>
            )}
          </>
        )}

        <Spacer mt={4} />

        <Box display="flex" justifyContent="space-between">
          {account ? (
            <>
              <Button
                sx={{ width: "50%", mr: theme.spacing(2) }}
                variant="contained"
                color="primary"
                fullWidth
                onClick={approveFunds}
                disabled={hasApprovedFunds ? true : !canApproveFunds}
              >
                Approve
              </Button>
              <Button
                sx={{ width: "50%", ml: theme.spacing(2) }}
                variant="contained"
                color="primary"
                onClick={swapFunds}
                fullWidth
                disabled={hasApprovedFunds ? !canSwapFunds : true}
              >
                Swap
              </Button>
            </>
          ) : (
            <>
              <Button
                sx={{ width: "50%", mr: theme.spacing(2) }}
                variant="contained"
                color="primary"
                fullWidth
                onClick={activate}
                disabled={!account}
              >
                Connect Wallet
              </Button>
              <Button
                sx={{ width: "50%", ml: theme.spacing(2) }}
                variant="contained"
                color="primary"
                onClick={activate}
                fullWidth
                disabled={!account}
              >
                Connect Wallet
              </Button>
            </>
          )}
        </Box>

        <Spacer mt={20} />
      </Box>
    </Layout>
  );
};

export default Swap;
