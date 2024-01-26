// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/// @title Interface for Curve Tricrypto remove liquidity operation
/// @author Cosmin Grigore (@gcosmintech)
interface ITricryptoSwap {
    function remove_liquidity_one_coin(
        uint256 _token_amount,
        uint256 i,
        uint256 _min_amount
    ) external;
}