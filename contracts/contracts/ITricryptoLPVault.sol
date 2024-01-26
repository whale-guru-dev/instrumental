// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/// @title Interface for Curve Tricrypto swaps & liquidity
/// @author Cosmin Grigore (@gcosmintech)
interface ITricryptoLPVault {
    function add_liquidity(
        uint256[3] calldata amounts,
        uint256 min_mint_amount,
        address _receiver
    ) external;

    function remove_liquidity(
        uint256 _amount,
        uint256[3] calldata min_amounts,
        address _receiver
    ) external;

    function remove_liquidity_one_coin(
        uint256 _token_amount,
        uint256 i,
        uint256 _min_amount
    ) external;

    function token() external view returns (address);

    function coins(uint256 i) external view returns (address);

    function pool() external view returns (address);
}