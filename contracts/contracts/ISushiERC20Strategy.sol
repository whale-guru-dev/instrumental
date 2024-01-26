// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./ISushiSlpStrategyConfig.sol";

/// @title Interface for Sushi SLP strategy
interface ISushiERC20Strategy {
    /// @notice Event emitted when emergency save is triggered
    event EmergencySaveTriggered(address indexed owner);

    /// @notice Event emitted when a deposit is made
    event Deposit(
        address indexed user,
        address indexed token,
        uint256 amount,
        uint256 slpAmount
    );

    event ReceiveBackLPs(
        address indexed user,
        address indexed token,
        uint256 amount,
        uint256 slpAmount
    );

    /// @notice Event emitted for withdrawal
    event Withdraw(
        address indexed user,
        address indexed asset1,
        address indexed asset2,
        uint256 amount,
        uint256 amountOut1,
        uint256 amountOut2
    );

    struct WithdrawParamData {
        uint256 _assetMinAmount;
        bool _claimOtherRewards;
    }

    /// @notice struct containing user information
    struct UserInfo {
        uint256 sushiRewardDebt; // Reward debt for Sushi rewards. See explanation below.
        uint256 userAccumulatedSushi; //how many rewards this user has
        uint256 slpAmount; // How many SLP tokens the user has provided.
    }

    function userInfo(address _user)
        external
        view
        returns (
            uint256,
            uint256,
            uint256
        );

    function totalAmountOfLPs() external view returns (uint256);

    function sushiConfig() external view returns (ISushiSlpStrategyConfig);

    function getPendingRewards(address _user) external view returns (uint256);

    function transferLPs(
        uint256 bridgeId,
        uint256 destinationNetworkId,
        bool unwrap,
        uint256 amount,
        uint256 _deadline,
        uint256 _amountAMin,
        uint256 _amountBMin,
        uint256 _swapTokenOutMin,
        bytes calldata _data
    ) external returns (uint256);

    function receiveBackLPs(
        uint256 _amount,
        address _asset,
        uint256 _deadline,
        uint256 _swapTokenOutMin
    ) external;

    function deposit(
        uint256 _amount1,
        address _asset1,
        uint256 _amount2,
        address _asset2,
        uint256 _deadline,
        uint256 _swapTokenOutMin
    ) external;

    function withdraw(
        uint256 _amount,
        address _asset,
        uint256 _deadline,
        uint256 _amountAMin,
        uint256 _amountBMin
    ) external;
}