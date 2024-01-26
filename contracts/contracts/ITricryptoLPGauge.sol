// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/// @title Interface for Curve Tricrypto LP staking gauge
/// @author Cosmin Grigore (@gcosmintech)
interface ITricryptoLPGauge {
    function crv_token() external view returns (address);

    function deposit(
        uint256 _value,
        address _addr,
        bool _claim_rewards
    ) external;

    function withdraw(uint256 value, bool _claim_rewards) external;

    function claim_rewards(address _addr, address _receiver) external;

    function balanceOf(address _addr) external view returns (uint256);
}