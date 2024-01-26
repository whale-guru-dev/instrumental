// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../../interfaces/curve/tricrypto/ITricryptoStrategyConfig.sol";

import "../../libraries/FeeOperations.sol";

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/// @title A config contract for Curve Tricrypto strategy
/// @author Cosmin Grigore (@gcosmintech)
contract CurveTricryptoConfig is
    ITricryptoStrategyConfig,
    Ownable,
    ReentrancyGuard
{
    using SafeERC20 for IERC20;
    /// @notice main reward token
    address public override crvToken;

    /// @notice the LP token address
    address public override tricryptoToken;

    /// @notice the LP Vault address; L1 0x3993d34e7e99abf6b6f367309975d1360222d446
    ITricryptoLPVault public override tricryptoLPVault;

    /// @notice the Gauge address; L1 0xDeFd8FdD20e0f34115C7018CCfb655796F6B2168
    ITricryptoLPGauge public override tricryptoGauge;

    /// @notice the Minter address; L1 0xd061D61a4d941c39E5453435B6345Dc261C2fcE0
    IMinter public override minter;

    /// @notice the Swap address; L1 0xd51a44d3fae010294c616388b506acda1bfaae46
    ITricryptoSwap public override tricryptoSwap;

    /// @notice the keeper's address
    address public override keeper;

    /// @notice the bridge manager's address
    address public override bridgeManager;

    /// @notice the mapping for whitelisted underlying addresses
    mapping(address => bool) public override underlyingAssets;

    /// @notice array of reward tokens
    address[] private _rewardTokensArray;

    /// @notice the mapping for whitelisted reward tokens
    mapping(address => bool) public override whitelistedRewardTokens;

    /// @notice the fee address
    address public override feeAddress;

    /// @notice min fee per withdrawal
    uint256 public override minFee;

    /// @notice max fee per withdrawal
    uint256 public override maxFee;

    /// @notice current fee per withdrawal
    uint256 public override currentFee;

    /// @notice the number of underlying assets tricrypto has
    uint256 public override underlyingAssetsNo;

    /// @notice weth token
    address public override wethToken;

    /// @notice Constructor
    /// @param _lpVault The LP Vault contract from Curve where underlying assets are deposited in exchange of an LP
    /// @param _gauge The gauge contract from Curve where LPs are staked for rewards
    /// @param _minter The minter contract from Curve, used to claim rewards in CRV Token
    /// @param _i The numnber of underlying assets the LP vault has
    /// @param _weth WETH address
    constructor(
        address _lpVault,
        address _gauge,
        address _minter,
        uint256 _i,
        address _weth
    ) {
        require(_lpVault != address(0), "ERR: INVALID LP VAULT ADDRESS");
        require(_gauge != address(0), "ERR: INVALID GAUGE ADDRESS");
        require(_minter != address(0), "ERR: INVALID MINTER ADDRESS");
        require(_weth != address(0), "ERR: INVALID WETH ADDRESS");
        require(_i > 0, "ERR: INVALID NO OF UNDERLYING ASSETS");

        // tricryptoLPVault = ITricryptoLPVault(_lpVault);
        // tricryptoGauge = ITricryptoLPGauge(_gauge);
        // minter = IMinter(_minter);
        // tricryptoSwap = ITricryptoSwap(tricryptoLPVault.pool());
        // address _crvToken = tricryptoGauge.crv_token();
        // whitelistedRewardTokens[_crvToken] = true;
        // _rewardTokensArray.push(_crvToken);
        // crvToken = _crvToken;
        // _whitelisteUnderlyingAssetsAuto(_i);
        // tricryptoToken = tricryptoLPVault.token();

        minFee = 0;
        maxFee = 500; //5%
        currentFee = minFee;
        wethToken = _weth;
    }

    //View methods
    function getRewardTokensArray()
        external
        view
        override
        returns (address[] memory)
    {
        return _rewardTokensArray;
    }

    //Owner methods
    /// @notice Updates the WETH token's address
    /// @param _weth new address
    function setWethToken(address _weth)
        external
        validAddress(_weth)
        onlyOwner
    {
        emit WethTokenSet(msg.sender, _weth, wethToken);
        wethToken = _weth;
    }

    /// @notice Updates the Tricrypto token's address
    /// @param _token new address
    function setTricryptoToken(address _token)
        external
        validAddress(_token)
        onlyOwner
    {
        emit TricryptoTokenSet(msg.sender, _token, tricryptoToken);
        tricryptoToken = _token;
    }

    function setCrvToken(address _crv) external validAddress(_crv) onlyOwner {
        emit CrvTokenSet(msg.sender, _crv, crvToken);
        crvToken = _crv;
    }

    function setUnderlyingAssetsNumber(uint256 i) external onlyOwner {
        require(i > 0, "ERR: INVALID NUMBER");
        emit UnderlyingAssetNoChange(msg.sender, i, underlyingAssetsNo);
        underlyingAssetsNo = i;
    }

    /// @notice Updates the current fee
    /// @param _fee new fee value
    function setCurrentFee(uint256 _fee) external onlyOwner {
        currentFee = _fee;
        require(_fee >= minFee && _fee <= maxFee, "ERR: INVALID FEE");
        emit CurrentFeeChanged(_fee);
    }

    /// @notice Updates the minimum fee
    /// @param _newMinFee new minimum fee value
    function setMinFee(uint256 _newMinFee) external onlyOwner {
        require(_newMinFee < FeeOperations.FEE_FACTOR, "ERR: MIN > FACTOR");
        require(_newMinFee < maxFee, "ERR: MIN > MAX");

        minFee = _newMinFee;
        emit MinFeeChanged(_newMinFee);
    }

    /// @notice Updates the maximum fee
    /// @param _newMaxFee new maximum fee value
    function setMaxFee(uint256 _newMaxFee) external onlyOwner {
        require(_newMaxFee < FeeOperations.FEE_FACTOR, "ERR: MAX > FACTOR");
        require(_newMaxFee > minFee, "ERR: MIN > MAX");

        maxFee = _newMaxFee;
        emit MaxFeeChanged(_newMaxFee);
    }

    /// @notice Used to set the fee address
    /// @param _addr Wallet address
    function setFeeAddress(address _addr)
        external
        onlyOwner
        validAddress(_addr)
    {
        feeAddress = _addr;
        emit FeeAddressSet(msg.sender, _addr, feeAddress);
    }

    /// @notice Used to whitelist a new reward token and to add it to the array
    /// @dev When interacting over the array, we use the mapping to check if a reward is still valid
    /// @param _addr Token address
    function addRewardToken(address _addr)
        external
        onlyOwner
        validAddress(_addr)
    {
        _rewardTokensArray.push(_addr);
        whitelistedRewardTokens[_addr] = true;
        emit RewardTokenStatusChange(msg.sender, _addr, true);
    }

    /// @notice Used to remove a reward token fromt he whitelist
    /// @dev We don't remove it from the array; we have the mapping to check if a reward is still valid
    /// @param _addr Token address
    function removeRewardToken(address _addr)
        external
        onlyOwner
        validAddress(_addr)
    {
        whitelistedRewardTokens[_addr] = false;
        emit RewardTokenStatusChange(msg.sender, _addr, false);
    }

    /// @notice Used to set the LP Vault
    /// @param _addr LP Vault address
    function setGaugeVault(address _addr)
        external
        onlyOwner
        validAddress(_addr)
    {
        emit GaugeSet(msg.sender, _addr, address(tricryptoGauge));
        tricryptoGauge = ITricryptoLPGauge(_addr);
    }

    /// @notice Used to set the LP Vault
    /// @param _addr LP Vault address
    function setLPVault(address _addr) external onlyOwner validAddress(_addr) {
        emit LPVaultSet(msg.sender, _addr, address(tricryptoLPVault));
        tricryptoLPVault = ITricryptoLPVault(_addr);
        emit SwapVaultSet(
            msg.sender,
            tricryptoLPVault.pool(),
            address(tricryptoSwap)
        );
        tricryptoSwap = ITricryptoSwap(tricryptoLPVault.pool());
    }

    /// @notice Used to set the minter
    /// @param _addr Minter address
    function setMinter(address _addr) external onlyOwner validAddress(_addr) {
        emit MinterSet(msg.sender, _addr, address(minter));
        minter = IMinter(_addr);
    }

    /// @notice Used to set the LP Vault
    /// @param _addr LP Vault address
    function setSwapVault(address _addr)
        external
        onlyOwner
        validAddress(_addr)
    {
        emit SwapVaultSet(msg.sender, _addr, address(tricryptoLPVault));
        tricryptoSwap = ITricryptoSwap(_addr);
    }

    /// @notice Used to set the keeper
    /// @param _addr Keeper address
    function setKeeper(address _addr) external onlyOwner validAddress(_addr) {
        emit KeeperSet(msg.sender, _addr, keeper);
        keeper = _addr;
    }

    /// @notice Used to set the bridgeManager
    /// @param _addr bridgeManager address
    function setBridgeManager(address _addr)
        external
        onlyOwner
        validAddress(_addr)
    {
        emit BridgeManagerSet(msg.sender, _addr, bridgeManager);
        bridgeManager = _addr;
    }

    /// @notice Used to whitelist an underlying token
    /// @param _underlying Token address
    function whitelistUnderlying(address _underlying) external onlyOwner {
        require(!underlyingAssets[_underlying], "ERR: ALREADY WHITELISTED");
        underlyingAssets[_underlying] = true;
        emit UnderlyingWhitelistStatusChange(_underlying, msg.sender, true);
    }

    /// @notice Used to remove an underlying token from the whitelist
    /// @param _underlying Token address
    function removeUnderlyingFromWhitelist(address _underlying)
        external
        onlyOwner
    {
        require(underlyingAssets[_underlying], "ERR: NOT WHITELISTED");
        underlyingAssets[_underlying] = false;
        emit UnderlyingWhitelistStatusChange(_underlying, msg.sender, false);
    }

    /// @notice Automatically whitelist tokens available in the Curve Tricrypto LP Vault
    /// @param _i The numnber of underlying assets the LP vault has
    function _whitelisteUnderlyingAssetsAuto(uint256 _i) private {
        for (uint256 i = 0; i < _i; i++) {
            address underlying = tricryptoLPVault.coins(i);

            underlyingAssets[underlying] = true;
        }
    }

    modifier validAddress(address _address) {
        require(_address != address(0), "ERR: INVALID ADDRESS");
        _;
    }
}