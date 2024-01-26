import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  alpha,
  Box,
  Button,
  Step,
  StepIconProps,
  StepLabel,
  Stepper,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import CircularProgress from "@mui/material/CircularProgress";
import { Dialog } from "./Dialog";
import {
  AccessTime,
  CheckCircleOutline,
  CheckOutlined,
} from "@mui/icons-material";
import { openInNewTab } from "@/utils";
import {
  getNetworkUrl,
  SupportedNetworkId,
} from "@/submodules/contracts-operations/src/defi/constants";
import { Token } from "@/submodules/contracts-operations/src/store/supportedTokens/slice";
import { ContractTransaction } from "ethers";
import Image from "next/image";
import { metamask } from "@/assets/wallets";
// import { useDispatch } from "react-redux";
import { useConnector } from "@integrations-lib/core";

const ConfirmStepsIcon = (props: StepIconProps) => {
  const { active, completed, icon } = props;
  const theme = useTheme();

  return (
    <Box
      sx={{
        borderRadius: "50%",
        backgroundColor: completed
          ? theme.palette.success.main
          : theme.palette.primary.main,
        width: "32px",
        height: "32px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {active && icon}
      {completed && <CheckOutlined />}
      {!active && !completed && <AccessTime />}
    </Box>
  );
};

export interface ModalTextsProps {
  heading: string;
  description: string;
}

const ModalTexts = ({ heading, description }: ModalTextsProps) => {
  const theme = useTheme();
  return (
    <>
      <Typography variant="h5">{heading}</Typography>
      <Typography
        variant="h6"
        sx={{
          color: alpha(theme.palette.common.white, 0.6),
        }}
      >
        {description}
      </Typography>
    </>
  );
};

type PromiseAction = () => Promise<any>;

export interface Step {
  heading: string;
  description: string;
  action: PromiseAction;
  icon: any;
}

interface OperationsProps {
  closeConfirmation: () => void;
  setCompleted: (value: boolean) => void;
  setInProgress: (value: boolean) => void;
  setTx: (value: ContractTransaction) => void;
  steps: Array<Step>;
}

const Operations = ({
  closeConfirmation,
  setCompleted,
  setInProgress,
  setTx,
  steps,
}: OperationsProps) => {
  const theme = useTheme();

  const [currentStepIndex, setCurrentStepIndex] = React.useState<number>(0);
  const currentStep = steps[currentStepIndex];

  const isLastStep = useMemo(
    () => currentStepIndex === steps.length - 1,
    [steps, currentStepIndex],
  );

  const isAtStep = useCallback(
    (step: number) => {
      return step === currentStepIndex;
    },
    [currentStepIndex],
  );

  const isStepCompleted = useCallback(
    (step: number) => {
      return step < currentStepIndex;
    },
    [currentStepIndex],
  );

  const [loading, setLoading] = React.useState<boolean>(false);

  const [stepsExecuted, setStepsExecuted] = React.useState<Array<boolean>>(
    steps.map(() => false),
  );

  const isStepExecuted = useCallback(
    (step: number) => {
      return stepsExecuted[step];
    },
    [stepsExecuted],
  );

  const executeAction = useCallback(() => {
    setInProgress(true);
    setLoading(true);

    currentStep
      .action()
      .then((value: any) => {
        if (isLastStep) {
          setTx(value as ContractTransaction);
          setCompleted(true);
          setInProgress(false);
        } else {
          setCurrentStepIndex((stepIndex) => stepIndex + 1);
        }
      })
      .catch((e: any) => {
        console.log(e);
        closeConfirmation();
        setCompleted(true);
        setInProgress(false);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [
    closeConfirmation,
    currentStep,
    isLastStep,
    setCompleted,
    setInProgress,
    setTx,
  ]);

  const isLastStepInProgress = useMemo(
    () => loading && isLastStep,
    [isLastStep, loading],
  );

  useEffect(() => {
    if (!isLastStep && !isStepExecuted(currentStepIndex)) {
      setStepsExecuted((stepsExecuted) => {
        stepsExecuted[currentStepIndex] = true;
        return stepsExecuted;
      });
      setTimeout(() => executeAction());
    }
  }, [currentStepIndex, executeAction, isStepExecuted, isLastStep]);

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      gap={3}
    >
      <CircularProgress color="inherit" size={96} />

      {!isLastStepInProgress && <ModalTexts {...currentStep} />}

      {isLastStepInProgress && (
        <ModalTexts
          heading="Confirming transaction"
          description={currentStep.description}
        />
      )}

      {loading && (
        <Typography variant="body1" color="text.secondary">
          Confirm this transaction in your wallet
        </Typography>
      )}

      {!isLastStepInProgress && (
        <Stepper
          alternativeLabel
          activeStep={currentStepIndex}
          sx={{
            marginY: theme.spacing(8),
            width: "100%",
          }}
        >
          {steps.map((step: Step, stepIndex: number) => (
            <Step
              key={stepIndex}
              completed={isStepCompleted(stepIndex)}
              active={isAtStep(stepIndex)}
            >
              <StepLabel StepIconComponent={ConfirmStepsIcon} icon={step.icon}>
                <Typography whiteSpace="nowrap" variant="caption">
                  {step.heading}
                </Typography>
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      )}

      {!isLastStepInProgress && (
        <Button
          sx={{
            paddingBottom: loading ? theme.spacing(1) : theme.spacing(2),
          }}
          type="button"
          fullWidth
          variant="contained"
          color="primary"
          disabled={loading || !isLastStep}
          onClick={executeAction}
        >
          {!loading && isLastStep ? (
            currentStep.heading
          ) : (
            <Box>
              <CircularProgress
                sx={{
                  color: theme.palette.common.white,
                }}
                size={24}
              />
            </Box>
          )}
        </Button>
      )}
    </Box>
  );
};

export interface ConfirmationModalProps {
  backButtonText: string;
  closeConfirmation: () => void;
  isOpen: boolean;
  allPossibleSteps: Array<Step>;
  executingStepsIndices: Array<number>;
  transactionsChainId: SupportedNetworkId | undefined;
  tokens: Array<Token | undefined>;
}

export const ConfirmationModal = ({
  backButtonText,
  closeConfirmation,
  isOpen,
  allPossibleSteps,
  executingStepsIndices,
  transactionsChainId,
  tokens,
}: ConfirmationModalProps) => {
  const { watchAsset } = useConnector("metamask");

  const theme = useTheme();
  // const dispatch = useDispatch();

  const [completed, setCompleted] = useState(false);
  const [inProgress, setInProgress] = useState(false);
  const [usedExecutingStepsIndices, setUsedExecutingSteps] = useState(
    executingStepsIndices,
  );
  const [tx, setTx] = React.useState<ContractTransaction | undefined>(
    undefined,
  );

  const isModalValid = useMemo(
    () => isOpen && (completed || usedExecutingStepsIndices.length > 0),
    [completed, isOpen, usedExecutingStepsIndices],
  );

  const steps = useMemo(
    () =>
      allPossibleSteps.filter((step: Step, index: number) => {
        console.log(step);
        return usedExecutingStepsIndices.includes(index);
      }),
    [allPossibleSteps, usedExecutingStepsIndices],
  );

  useEffect(() => setCompleted(false), [isOpen]);

  useEffect(() => {
    if (!inProgress) {
      setUsedExecutingSteps(executingStepsIndices);
    }
  }, [executingStepsIndices, inProgress]);

  const handleComplete = useCallback((value: boolean) => {
    setCompleted(value);
  }, []);

  const closeConfirmationInternal = () => {
    closeConfirmation();
    setInProgress(false);
  };

  const watchAssetsInternal = useCallback(
    (tokens: Array<Token | undefined>) => {
      if (tokens.length > 0) {
        const token = tokens[tokens.length];
        if (token) {
          watchAsset?.(token).finally(() => {
            watchAssetsInternal(tokens.slice(0, -1));
          });
        } else {
          watchAssetsInternal(tokens.slice(0, -1));
        }
      }
    },
    [watchAsset],
  );

  return (
    (isModalValid && (
      <Dialog open={isOpen} onClose={closeConfirmationInternal}>
        <Box
          margin="auto"
          width="100%"
          sx={{
            maxWidth: {
              [theme.breakpoints.up("lg")]: "lg",
              [theme.breakpoints.down("md")]: "560px",
            },
          }}
        >
          {!completed && (
            <Operations
              closeConfirmation={closeConfirmationInternal}
              steps={steps}
              setCompleted={handleComplete}
              setInProgress={setInProgress}
              setTx={setTx}
            />
          )}

          {completed && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
                justifyContent: "center",
              }}
              gap={theme.spacing(5)}
            >
              <CheckCircleOutline
                sx={{
                  fontSize: "5rem",
                  color: alpha(theme.palette.common.white, 0.6),
                }}
              />
              <Typography variant="h5">Transaction submitted</Typography>
              {tx && transactionsChainId && (
                <Button
                  variant="contained"
                  size="large"
                  color="primary"
                  fullWidth
                  onClick={() =>
                    openInNewTab(getNetworkUrl(transactionsChainId) + tx.hash)
                  }
                >
                  Go to transaction detail
                </Button>
              )}
              <Button
                size="large"
                color="primary"
                fullWidth
                onClick={() => watchAssetsInternal(tokens)}
                sx={{ display: "flex", alignItems: "end" }}
              >
                <Image src={metamask} alt={"Metamask"} width="24" height="24" />
                <Typography variant="body2" ml={2}>
                  Add{" "}
                  {tokens
                    .map((token: Token | undefined) => token?.symbol)
                    .join(" and ")}{" "}
                  to Metamask
                </Typography>
              </Button>
              <Button
                fullWidth
                variant="text"
                onClick={closeConfirmationInternal}
                size="medium"
              >
                <Typography variant="body2" color="primary">
                  {backButtonText}
                </Typography>
              </Button>
            </Box>
          )}
        </Box>
      </Dialog>
    )) ||
    null
  );
};

ConfirmationModal.defaultProps = {
  backButtonText: "Back",
};
