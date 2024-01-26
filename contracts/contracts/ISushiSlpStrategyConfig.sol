// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./ISushiMasterChef.sol";
import "./IUniswapV2Router02.sol";

/// @title Interface for Sushi SLP strategy config
/// @author Cosmin Grigore (@gcosmintech)
interface ISushiSlpStrategyConfig {
    event CurrentFeeChanged(uint256 newMinFee);
    event MinFeeChanged(uint256 newMinFee);
    event MaxFeeChanged(uint256 newMaxFee);
    event FeeAddressSet(
        address indexed owner,
        address indexed newAddr,
        address indexed oldAddr
    );
    event SushiTokenSet(
        address indexed owner,
        address indexed newAddr,
        address indexed oldAddr
    );
    event SlpTokenSet(
        address indexed owner,
        address indexed newAddr,
        address indexed oldAddr
    );
    event MasterChefSet(
        address indexed owner,
        address indexed newAddr,
        address indexed oldAddr
    );

    event PidSet(
        address indexed owner,
        uint256 indexed newVal,
        uint256 indexed oldVal
    );

    event WethTokenSet(
        address indexed owner,
        address indexed newAddr,
        address indexed oldAddr
    );

    event KeeperSet(
        address indexed owner,
        address indexed newAddr,
        address indexed oldAddr
    );

    event RouterSet(
        address indexed owner,
        address indexed newAddr,
        address indexed oldAddr
    );

    event RewardTokenSet(
        address indexed owner,
        address indexed newAddr,
        address indexed oldAddr
    );

    event RewardTokenStatusChange(
        address indexed owner,
        address indexed token,
        bool whitelisted
    );

    event StrategyAddressSet(
        address indexed owner,
        address indexed newAddr,
        address indexed oldAddr
    );
    
    event BridgeManagerAddressSet(
        address indexed owner,
        address indexed newAddr,
        address indexed oldAddr
    );

    /// @notice Event emitted withdrawal is paused
    event WithdrawalPaused(address indexed owner);
    /// @notice Event emitted withdrawal is resumed
    event WithdrawalResumed(address indexed owner);

    /// @notice Deposit method temporary data
    struct DepositTemporaryData {
        bool isAssetWeth;
        uint256 half;
        uint256[] swappedAmounts;
        address tokenA;
        address tokenB;
        uint256 amountADesired;
        uint256 amountBDesired;
        uint256 amountAMin;
        uint256 amountBMin;
        uint256 usedA;
        uint256 usedB;
        uint256 liquidity;
        uint256 toRefundA;
        uint256 toRefundB;
        uint256 pendingSushiTokens;
        address tokenOut;
    }
    /// @notice Transfer temporary data
    struct TransferLpTemporaryData {
        uint256 amountToTransfer;
        address transferredToken;
        uint256 totalWethAmount;
        uint256 amountIn;
        address tokenIn;
        uint256[] swapAmounts;
        uint256 amountA;
        uint256 amountB;
    }

    /// @notice Withdraw temporary data
    struct TemporaryWithdrawData {
        bool isEth;
        bool isSlp;
        ISushiMasterChef masterChef;
        uint256 pid;
        address sushiToken;
        uint256 totalSushi;
        uint256 slpAmount;
        uint256 wethAmount;
        uint256 amountA;
        uint256 amountB;
        uint256 prevEthBalance;
        uint256 afterEthBalance;
        uint256 totalEth;
    }

    /// @notice Remove liquidity temporary data
    struct RemoveLiquidityTempData {
        address tokenA;
        address tokenB;
        uint256 amountA;
        uint256 amountB;
    }

    function wethToken() external view returns (address);

    function sushiToken() external view returns (address);

    function slpToken() external view returns (address);

    function pid() external view returns (uint256);

    function masterChef() external view returns (ISushiMasterChef);

    function router() external view returns (IUniswapV2Router02);

    function keeper() external view returns (address);

    function whitelistedRewardTokens(address asset)
        external
        view
        returns (bool);

    function getRewardTokensArray() external view returns (address[] memory);

    function feeAddress() external view returns (address);

    function minFee() external view returns (uint256);

    function maxFee() external view returns (uint256);

    function currentFee() external view returns (uint256);

    function isToken0Weth() external view returns (bool);

    function isToken1Weth() external view returns (bool);

    function isWithdrawalPaused() external view returns (bool);

    function strategyAddress() external view returns (address);
    
    function bridgeManager() external view returns (address);

    function resumeWithdrawal() external;

    function pauseWithdrawal() external;
}