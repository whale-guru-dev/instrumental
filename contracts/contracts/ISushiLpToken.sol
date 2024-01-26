// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/// @title Interface for SLP token
/// @author Cosmin Grigore (@gcosmintech)
interface ISushiLpToken {
    function token0() external view returns (address);

    function token1() external view returns (address);
}