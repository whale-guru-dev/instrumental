// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./ITricryptoStrategyConfig.sol";

/// @title Interface for Curve Tricrypto strategy
/// @author Cosmin Grigore (@gcosmintech)
interface ITricryptoStrategy {
    event Deposit(
        address indexed user,
        address indexed asset,
        uint256 amount,
        uint256 lpAmount
    );
    event Withdraw(
        address indexed user,
        address indexed asset,
        uint256 lpAmount,
        uint256 assetAmount,
        uint256 crvRewards,
        bool claimOtherTokens
    );
    event ExtraRewardClaimed(
        address indexed user,
        address indexed token,
        uint256 amount
    );
    event CRVRewardClaimed(address indexed user, uint256 amount);
    event WithdrawalPaused(address indexed owner);
    event WithdrawalResumed(address indexed owner);
    event EmergencySaveTriggered(address indexed owner);
    event EmergencySaveInitialized(address indexed owner);
    event FeeTaken(address indexed user, address indexed asset, uint256 amount);

    struct WithdrawParamData {
        uint256 _assetMinAmount;
        bool _claimOtherRewards;
    }

    /// @notice struct containing user information
    struct UserInfo {
        uint256 lastDepositTimestamp;
        uint256 lastLPAmount;
        uint256 accruedCrvRewards;
    }

    function tricryptoConfig() external view returns (ITricryptoStrategyConfig);

    function totalAmountOfLPs() external view returns (uint256);

    function isWithdrawalPaused() external view returns (bool);

    function emergencyTimestamp() external view returns (uint256);

    function getPendingRewards(address _user) external view returns (uint256);

    function tokenRewards(address[] memory tokens, address _user)
        external
        view
        returns (uint256[] memory);

    function getUserInfo(address _user) external view returns (UserInfo memory);

    function deposit(
        address _asset,
        uint256 _amount,
        uint256 _minLpAmount
    ) external returns (uint256);

    function withdraw(
        uint256 _amount,
        address _asset,
        ITricryptoStrategy.WithdrawParamData memory params
    ) external returns (uint256);

    function claimOtherRewards() external;

    function updateRewards() external;

    function transferLPs(
        uint256 bridgeId,
        uint256 _destinationNetworkId,
        bool unwrap,
        uint256 wethMinAmount,
        uint256 lpAmountToTransfer,
        bytes calldata _data
    ) external returns (uint256);

    function receiveBackLPs(
        address _asset,
        uint256 _amount,
        uint256 _minLpAmount
    ) external returns (uint256);

    function stakeIntoGauge(uint256 _lpAmount) external;
}