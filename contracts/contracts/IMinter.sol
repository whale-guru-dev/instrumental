// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/// @title Interface for Curve Minter
interface IMinter {
    function mint(address _gauge_addr) external;

}