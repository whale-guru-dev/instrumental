// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./ITricryptoLPVault.sol";
import "./ITricryptoLPGauge.sol";
import "./ITricryptoSwap.sol";
import "./IMinter.sol";

/// @title Interface for Curve Tricrypto strategy config
/// @author Cosmin Grigore (@gcosmintech)
interface ITricryptoStrategyConfig {
    event CurrentFeeChanged(uint256 newMinFee);
    event MinFeeChanged(uint256 newMinFee);
    event MaxFeeChanged(uint256 newMaxFee);
    event FeeAddressSet(
        address indexed owner,
        address indexed newAddr,
        address indexed oldAddr
    );
    event TricryptoTokenSet(
        address indexed owner,
        address indexed newAddr,
        address indexed oldAddr
    );
    event CrvTokenSet(
        address indexed owner,
        address indexed newAddr,
        address indexed oldAddr
    );
    event LPVaultSet(
        address indexed owner,
        address indexed newAddr,
        address indexed oldAddr
    );
    event SwapVaultSet(
        address indexed owner,
        address indexed newAddr,
        address indexed oldAddr
    );
    event GaugeSet(
        address indexed owner,
        address indexed newAddr,
        address indexed oldAddr
    );
    event MinterSet(
        address indexed owner,
        address indexed newAddr,
        address indexed oldAddr
    );
    event KeeperSet(
        address indexed owner,
        address indexed newAddr,
        address indexed oldAddr
    );
    event BridgeManagerSet(
        address indexed owner,
        address indexed newAddr,
        address indexed oldAddr
    );

    event RewardTokenSet(
        address indexed owner,
        address indexed newAddr,
        address indexed oldAddr
    );
    event UnderlyingWhitelistStatusChange(
        address indexed underlying,
        address indexed owner,
        bool whitelisted
    );
    event RewardTokenStatusChange(
        address indexed owner,
        address indexed token,
        bool whitelisted
    );
    event UnderlyingAssetNoChange(
        address indexed owner,
        uint256 newNo,
        uint256 previousNo
    );

    event WethTokenSet(
        address indexed owner,
        address indexed newAddr,
        address indexed oldAddr
    );

    function wethToken() external view returns (address);

    function crvToken() external view returns (address);

    function tricryptoToken() external view returns (address);

    function tricryptoLPVault() external view returns (ITricryptoLPVault);

    function tricryptoSwap() external view returns (ITricryptoSwap);

    function tricryptoGauge() external view returns (ITricryptoLPGauge);

    function minter() external view returns (IMinter);

    function keeper() external view returns (address);

    function bridgeManager() external view returns (address);

    function underlyingAssets(address asset) external view returns (bool);

    function whitelistedRewardTokens(address asset)
        external
        view
        returns (bool);

    function getRewardTokensArray() external view returns (address[] memory);

    function feeAddress() external view returns (address);

    function minFee() external view returns (uint256);

    function maxFee() external view returns (uint256);

    function currentFee() external view returns (uint256);

    function underlyingAssetsNo() external view returns (uint256);
}