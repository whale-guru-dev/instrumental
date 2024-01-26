// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../../interfaces/curve/tricrypto/ITricryptoStrategyConfig.sol";
import "../../interfaces/curve/tricrypto/ITricryptoStrategy.sol";
import "../../interfaces/IBridgeManager.sol";

import "../../libraries/FeeOperations.sol";

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";

//TODO:
// - tests

/// @notice User should be able to enter with either Tricrypto LP or any of the assets underlying
contract CurveTricryptoStrategy is
    ITricryptoStrategy,
    Ownable,
    ReentrancyGuard
{
    using SafeERC20 for IERC20;

    /// @notice the config's contract address
    ITricryptoStrategyConfig public override tricryptoConfig;

    /// @notice pause state for withdrawal
    bool public override isWithdrawalPaused;

    /// @notice last emergency save initalization timestamp
    uint256 public override emergencyTimestamp;

    /// @notice emergency save time window
    uint256 public emergencyWindow = 2 days;

    /// @notice struct related to user's past actions in the strategy
    struct UserHistory {
        mapping(address => uint256) claimedRewards;
        uint256 lastWithdrawTimestamp;
    }

    /// @notice mapping containg user's info
    mapping(address => UserInfo) public userInfo;

    /// @notice mapping containg user's past information
    mapping(address => UserHistory) public userHistory;

    /// @notice total amount of LPs the strategy has
    uint256 public override totalAmountOfLPs;

    /// @notice start time considered for calculating rewards
    uint256 public rewardsStartime;

    /// @notice Constructor
    /// @param _config the config's contract address
    constructor(address _config) {
        require(_config != address(0), "ERR: INVALID CONFIG");
        tricryptoConfig = ITricryptoStrategyConfig(_config);
        isWithdrawalPaused = false;
    }

    //-----------------
    //----------------- Owner methods -----------------
    //-----------------
    /// @notice Pause withdraw operations
    function pauseWithdrawal() external onlyOwner {
        isWithdrawalPaused = true;
        emit WithdrawalPaused(msg.sender);
    }

    /// @notice Resume withdraw operations
    function resumeWithdrawal() external onlyOwner {
        isWithdrawalPaused = false;
        emit WithdrawalResumed(msg.sender);
    }

    /// @notice Initialize emergency save
    function initEmergency() external onlyOwner {
        emergencyTimestamp = block.timestamp;
        emit EmergencySaveTriggered(msg.sender);
    }

    /// @notice Save funds from the contract
    /// @param _token Tokens's address
    /// @param _amount Tokens's amount
    function emergencySave(address _token, uint256 _amount) external onlyOwner {
        require(emergencyTimestamp > 0, "ERR: NOT INITIALIZED");
        require(
            emergencyTimestamp + emergencyWindow < block.timestamp,
            "ERR: NOT AUTHORIZED"
        );
        uint256 balance = IERC20(_token).balanceOf(address(this));
        require(_amount <= balance, "ERR: EXCEEDS BALANCE");
        IERC20(_token).safeTransfer(msg.sender, _amount);
        emit EmergencySaveTriggered(msg.sender);
        emergencyTimestamp = 0;
    }

    //-----------------
    //----------------- View methods -----------------
    //-----------------
    /// @notice Return current user information
    /// @param _user User's address
    /// @return UserInfo struct
    function getUserInfo(address _user)
        external
        view
        override
        returns (UserInfo memory)
    {
        return userInfo[_user];
    }

    /// @notice Return current reward amount for user
    /// @param _user User's address
    /// @return Reward amount
    function getPendingRewards(address _user)
        public
        view
        override
        returns (uint256)
    {
        return
            userInfo[_user].accruedCrvRewards +
            _calculateRewardsForUser(
                userInfo[_user].lastDepositTimestamp,
                userInfo[_user].lastLPAmount,
                totalAmountOfLPs
            );
    }

    /// @notice Return current rewards for user (others than the main one)
    /// @param tokens Tokens to check
    /// @param _user User's address
    /// @return Reward amounts
    function tokenRewards(address[] memory tokens, address _user)
        public
        view
        override
        returns (uint256[] memory)
    {
        uint256[] memory result = new uint256[](tokens.length);
        uint256 crvRatio = _getCrvRatioForUser(_user);
        for (uint256 i = 0; i < tokens.length; i++) {
            require(
                tricryptoConfig.whitelistedRewardTokens(tokens[i]),
                "ERR: NOT A REWARD"
            );

            uint256 tokenAmount = IERC20(tokens[i]).balanceOf(address(this));
            if (tokenAmount == 0) {
                result[i] = 0;
            } else {
                uint256 decimals = IERC20Metadata(tokens[i]).decimals();

                uint256 tokenShares = 0;
                if (decimals < 18) {
                    tokenShares =
                        (tokenAmount * (10**(18 - decimals)) * crvRatio) /
                        (10**(18 - decimals));
                } else {
                    tokenShares = tokenAmount * crvRatio;
                }
                result[i] = tokenShares;
            }
        }
        return result;
    }

    //-----------------
    //----------------- Non-view methods -----------------
    //-----------------
    /// @notice Deposit asset into the strategy
    /// @param _asset Deposited asset
    /// @param _amount Amount
    /// @param _minLpAmount In case asset is not LP, minimum amount of LPs to receive
    /// @return Staked LP amount
    function deposit(
        address _asset,
        uint256 _amount,
        uint256 _minLpAmount
    )
        external
        override
        nonReentrant
        validAmount(_amount)
        validAddress(_asset)
        returns (uint256)
    {
        require(
            tricryptoConfig.underlyingAssets(_asset) ||
                tricryptoConfig.tricryptoToken() == _asset,
            "ERR: TOKEN NOT ACCEPTED"
        );
        if (_asset != tricryptoConfig.tricryptoToken()) {
            require(_minLpAmount > 0, "ERR: INVALID LP AMOUNT");
        }

        IERC20(_asset).safeTransferFrom(msg.sender, address(this), _amount);

        address lpAddress = tricryptoConfig.tricryptoToken();

        //get LPs
        uint256 lpAmount = _getLPAmount(
            lpAddress,
            _asset,
            _amount,
            _minLpAmount
        );

        //stake LPs into the gauge
        if (rewardsStartime == 0) {
            rewardsStartime = block.timestamp;
        }
        _safeApprove(
            lpAddress,
            address(tricryptoConfig.tricryptoGauge()),
            lpAmount
        );
        tricryptoConfig.tricryptoGauge().deposit(lpAmount, address(this), true);

        //fill user & general info
        uint256 newRewards = _calculateRewardsForUser(
            userInfo[msg.sender].lastDepositTimestamp,
            lpAmount,
            totalAmountOfLPs
        );
        _fillUserInfo(msg.sender, lpAmount, newRewards, false);

        // if (!_isSenderKeeperOrOwner(msg.sender)) {
        totalAmountOfLPs = totalAmountOfLPs + lpAmount;
        // }

        emit Deposit(msg.sender, _asset, _amount, lpAmount);
        return lpAmount;
    }

    /// @notice Withdraw LP from the strategy
    /// @param _amount LP Amount for withdrawal
    /// @param _asset Asset user wants to receive
    /// @param params _assetMinAmount In case asset is not LP, minimum amount of the asset to receive; _claimOtherRewards In case asset is not LP, minimum amount of the asset to receive
    /// @return The amount of CRV tokens obtained
    function withdraw(
        uint256 _amount,
        address _asset,
        ITricryptoStrategy.WithdrawParamData memory params
    )
        external
        override
        nonReentrant
        validAmount(_amount)
        validAddress(_asset)
        returns (uint256)
    {
        address lpAddress = tricryptoConfig.tricryptoToken();
        if (!_isSenderKeeperOrOwner(msg.sender)) {
            require(!isWithdrawalPaused, "ERR: WITHDRAWAL PAUSED");
            require(
                tricryptoConfig.underlyingAssets(_asset) || lpAddress == _asset,
                "ERR: TOKEN NOT ACCEPTED"
            );
            require(
                _amount <= userInfo[msg.sender].lastLPAmount,
                "ERR: EXCEEDS RANGE"
            );
        }
        //unstake from the gauge
        uint256 lpAmount = _unstake(_amount, lpAddress);

        //transfer asset to user
        uint256 assetAmount = 0;
        if (_asset == lpAddress) {
            assetAmount = lpAmount;
            IERC20(lpAddress).safeTransfer(msg.sender, assetAmount);
        } else {
            //unwrap if necessary
            assetAmount = _unwrapLPsIntoAsset(
                _asset,
                params._assetMinAmount,
                _amount,
                _getTokenIndex(_asset)
            );
            IERC20(_asset).safeTransfer(msg.sender, assetAmount);
        }

        //We have to claim the CRV rewards first
        tricryptoConfig.minter().mint(
            address(tricryptoConfig.tricryptoGauge())
        );
        //compute rewards & user info
        uint256 newRewards = _calculateRewardsForUser(
            userInfo[msg.sender].lastDepositTimestamp,
            lpAmount,
            totalAmountOfLPs
        );
        _fillUserInfo(msg.sender, lpAmount, newRewards, true);
        // if (!_isSenderKeeperOrOwner(msg.sender)) {
        totalAmountOfLPs = totalAmountOfLPs - lpAmount;
        // }

        //transfer CRV rewards
        uint256 crvRewardsAmount = _transferCRVRewards(msg.sender);

        if (params._claimOtherRewards) {
            _claimOtherTokens(msg.sender);
        }

        emit Withdraw(
            msg.sender,
            _asset,
            lpAmount,
            assetAmount,
            crvRewardsAmount,
            params._claimOtherRewards
        );

        return crvRewardsAmount;
    }

    /// @notice Claim rewards other than crvToken
    function claimOtherRewards() external override nonReentrant {
        _claimOtherTokens(msg.sender);
    }

    /// @notice Claims rewards to this contract
    function updateRewards() external override nonReentrant {
        tricryptoConfig.tricryptoGauge().claim_rewards(
            address(this),
            address(this)
        );
    }

    /// @notice Stake transferred LPs into the gauge
    /// @param _lpAmount Amount of tricrypto LP token
    function stakeIntoGauge(uint256 _lpAmount)
        external
        override
        onlyOwnerOrKeeper
        nonReentrant
    {
        require(_lpAmount > 0, "ERR: INVALID AMOUNT");
        _safeApprove(
            tricryptoConfig.tricryptoToken(),
            address(tricryptoConfig.tricryptoGauge()),
            _lpAmount
        );
        tricryptoConfig.tricryptoGauge().deposit(
            _lpAmount,
            address(this),
            true
        );
    }

    /// @notice Transfer LPs or WETH to another layer
    /// @param bridgeId The bridge id to be used for this operation
    /// @param unwrap If 'true', the LP is unwrapped into WETH
    /// @param wethMinAmount When 'unwrap' is true, this should be represent the minimum amount of WETH to be received
    /// @return An unique id
    function transferLPs(
        uint256 bridgeId,
        uint256 _destinationNetworkId,
        bool unwrap,
        uint256 wethMinAmount,
        uint256 lpAmountToTransfer,
        bytes calldata _data
    ) external override onlyOwnerOrKeeper nonReentrant returns (uint256) {
        require(bridgeId > 0, "ERR: INVALID BRIDGE");
        require(lpAmountToTransfer > 0, "ERR: INVALID AMOUNT");
        isWithdrawalPaused = true;
        address transferredToken = tricryptoConfig.tricryptoToken();
        uint256 balance = tricryptoConfig.tricryptoGauge().balanceOf(
            address(this)
        );

        require(lpAmountToTransfer <= balance, "ERR: EXCEEDS RANGE");
        tricryptoConfig.tricryptoGauge().withdraw(lpAmountToTransfer, true);
        if (unwrap) {
            //unwrap LP into weth
            transferredToken = tricryptoConfig.tricryptoLPVault().coins(2);

            require(
                transferredToken == tricryptoConfig.wethToken(),
                "ERR: NOT WETH"
            );

            lpAmountToTransfer = _unwrapLPsIntoAsset(
                transferredToken,
                wethMinAmount,
                lpAmountToTransfer,
                2
            );
            require(lpAmountToTransfer > 0, "ERR: INVALID UNWRAPPED AMOUNT");
        }

        require(
            tricryptoConfig.underlyingAssets(transferredToken) ||
                tricryptoConfig.tricryptoToken() == transferredToken,
            "ERR: TOKEN NOT ACCEPTED"
        );

        // transfer the tokens to another layer
        address bridgeManager = tricryptoConfig.bridgeManager();
        FeeOperations.safeApprove(
            transferredToken,
            bridgeManager,
            lpAmountToTransfer
        );
        IBridgeManager(bridgeManager).transferERC20(
            bridgeId,
            _destinationNetworkId,
            transferredToken,
            lpAmountToTransfer,
            tricryptoConfig.keeper(), // the keeper will deposit the funds on the destination layer
            _data
        );
        return lpAmountToTransfer;
    }

    /// @notice Receive LPs or WETH that come back from another Layer, basically deposit but with the transferral of all accumulated CRV tokens in the owner/keeper account (NEED Owner/Keeper to approve the CRV spending by this contract)
    /// @param _asset Deposited asset
    /// @param _amount Amount
    /// @param _minLpAmount In case asset is not LP, minimum amount of LPs to receive
    /// @return Staked LP amount
    function receiveBackLPs(
        address _asset,
        uint256 _amount,
        uint256 _minLpAmount
    )
        external
        override
        onlyOwnerOrKeeper
        nonReentrant
        validAmount(_amount)
        validAddress(_asset)
        returns (uint256)
    {
        require(
            tricryptoConfig.underlyingAssets(_asset) ||
                tricryptoConfig.tricryptoToken() == _asset,
            "ERR: TOKEN NOT ACCEPTED"
        );
        if (_asset != tricryptoConfig.tricryptoToken()) {
            require(_minLpAmount > 0, "ERR: INVALID LP AMOUNT");
        }

        uint256 balanceCRVOwner = IERC20(tricryptoConfig.crvToken()).balanceOf(
            msg.sender
        );
        IERC20(tricryptoConfig.crvToken()).safeTransferFrom(
            msg.sender,
            address(this),
            balanceCRVOwner
        );

        IERC20(_asset).safeTransferFrom(msg.sender, address(this), _amount);

        address lpAddress = tricryptoConfig.tricryptoToken();

        //get LPs
        uint256 lpAmount = _getLPAmount(
            lpAddress,
            _asset,
            _amount,
            _minLpAmount
        );

        //stake LPs into the gauge
        if (rewardsStartime == 0) {
            rewardsStartime = block.timestamp;
        }
        _safeApprove(
            lpAddress,
            address(tricryptoConfig.tricryptoGauge()),
            lpAmount
        );
        tricryptoConfig.tricryptoGauge().deposit(lpAmount, address(this), true);

        emit Deposit(msg.sender, _asset, _amount, lpAmount);
        return lpAmount;
    }

    //-----------------
    //----------------- Private methods -----------------
    //-----------------
    /// @notice Extracts fee from amount & transfers it to the feeAddress
    /// @param _amount Amount from which the fee is subtracted from
    /// @param _asset Asset that's going to be transferred
    function _takeFee(uint256 _amount, address _asset)
        private
        returns (uint256)
    {
        uint256 feePart = FeeOperations.getFeeAbsolute(
            _amount,
            tricryptoConfig.currentFee()
        );
        if (feePart > 0) {
            IERC20(_asset).safeTransfer(tricryptoConfig.feeAddress(), feePart);
        }
        return feePart;
    }

    /// @notice Get CRV ratio for a user
    /// @param _user User address
    /// @return Ratio
    function _getCrvRatioForUser(address _user) private view returns (uint256) {
        uint256 crvTokenRewards = getPendingRewards(_user);
        uint256 crvBalance = IERC20(tricryptoConfig.crvToken()).balanceOf(
            address(this)
        );
        return FeeOperations.getRatio(crvTokenRewards, crvBalance, 18);
    }

    /// @notice Unstake from LP Gauge
    /// @param _amount Amount to unstake
    /// @param lpAddress LP token address
    /// @return Received LP tokens
    function _unstake(uint256 _amount, address lpAddress)
        private
        returns (uint256)
    {
        uint256 balanceOfLPsBefore = IERC20(lpAddress).balanceOf(address(this));
        _safeApprove(
            lpAddress,
            address(tricryptoConfig.tricryptoGauge()),
            _amount
        );
        tricryptoConfig.tricryptoGauge().withdraw(_amount, true);
        uint256 balanceOfLPsAfter = IERC20(lpAddress).balanceOf(address(this));
        require(balanceOfLPsAfter > balanceOfLPsBefore, "ERR: UNSTAKE FAILED");
        return balanceOfLPsAfter - balanceOfLPsBefore;
    }

    /// @notice Transfers CRV rewards to user
    /// @param _user Receiver address
    /// @return (total CRV available, total CRV user is entitled to)
    function _transferCRVRewards(address _user) private returns (uint256) {
        address crvToken = tricryptoConfig.crvToken();
        uint256 crvRewardsAmount = userInfo[_user].accruedCrvRewards -
            userHistory[_user].claimedRewards[crvToken];
        uint256 totalCrvAmount = IERC20(crvToken).balanceOf(address(this));
        require(
            crvRewardsAmount <= totalCrvAmount,
            "ERR: CRV REWARDS EXCEED BALANCE"
        );
        if (msg.sender != tricryptoConfig.feeAddress()) {
            uint256 fee = _takeFee(crvRewardsAmount, crvToken);
            crvRewardsAmount = crvRewardsAmount - fee;
            emit FeeTaken(_user, crvToken, fee);
        }
        IERC20(crvToken).safeTransfer(_user, crvRewardsAmount);
        userHistory[_user].claimedRewards[crvToken] = userInfo[_user]
            .accruedCrvRewards;
        userHistory[_user].lastWithdrawTimestamp = block.timestamp;
        emit CRVRewardClaimed(_user, crvRewardsAmount);
        return crvRewardsAmount;
    }

    /// @notice Used to claim rewards other than the crvToken
    /// @dev Same crvRatio will be applied to extra rewards
    /// @param _user User receiving them
    function _claimOtherTokens(address _user) private {
        address[] memory rewardsArr = tricryptoConfig.getRewardTokensArray();
        uint256[] memory shares = tokenRewards(rewardsArr, _user);

        for (uint256 i = 0; i < rewardsArr.length; i++) {
            if (shares[i] > 0) {
                IERC20(rewardsArr[i]).safeTransfer(_user, shares[i]);
                emit ExtraRewardClaimed(_user, rewardsArr[i], shares[i]);
            }
        }
    }

    /// @notice Calculate rewards for a specific time interval
    /// @param _lastDepositTimestamp Start time to start computing rewards for
    /// @param _lastLPAmount Last deposit amount for user
    /// @param _totalLPAmount Total deposited LPs
    /// @return Reward amount
    function _calculateRewardsForUser(
        uint256 _lastDepositTimestamp,
        uint256 _lastLPAmount,
        uint256 _totalLPAmount
    ) private view returns (uint256) {
        if (
            _lastLPAmount == 0 ||
            _totalLPAmount == 0 ||
            rewardsStartime == block.timestamp
        ) {
            return 0;
        }
        uint256 timeInVault = block.timestamp - _lastDepositTimestamp;
        uint256 shareInVault = FeeOperations.getRatio(
            _lastLPAmount,
            _totalLPAmount,
            18
        );
        uint256 rewardsAmount = IERC20(tricryptoConfig.crvToken()).balanceOf(
            address(this)
        );
        uint256 rewardPerBlock = rewardsAmount /
            (block.timestamp - rewardsStartime);
        uint256 userRewards = rewardPerBlock * timeInVault * shareInVault;
        // Add to divide by 18 to get the correct amount of rewards but maybe it should be done elsewhere
        return userRewards / 10**18;
    }

    /// @notice Fill user info with latest details
    /// @param _user User address
    /// @param _lpAmount New LP amount
    /// @param _newRewards New rewrds
    function _fillUserInfo(
        address _user,
        uint256 _lpAmount,
        uint256 _newRewards,
        bool isWithdrawal
    ) private {
        // if (!_isSenderKeeperOrOwner(msg.sender)) {
        UserInfo storage info = userInfo[_user];
        if (isWithdrawal) {
            info.lastLPAmount = info.lastLPAmount - _lpAmount;
        } else {
            info.lastLPAmount = info.lastLPAmount + _lpAmount;
            info.lastDepositTimestamp = block.timestamp;
        }
        info.accruedCrvRewards = info.accruedCrvRewards + _newRewards;
        // }
    }

    /// @notice Depending on asset address, either use it directly or add liquidity to get the LP token
    /// @param _lpAddress Address of the LP token
    /// @param _asset Asset address
    /// @param _amount Asset amount
    /// @param _minLpAmount Minimum LP amount to receive in case of an add liquidity event
    /// @return Amount of LPs
    function _getLPAmount(
        address _lpAddress,
        address _asset,
        uint256 _amount,
        uint256 _minLpAmount
    ) private returns (uint256) {
        uint256 lpAmount = 0;
        if (_asset == _lpAddress) {
            lpAmount = _amount;
        } else {
            uint256[] memory amountsArr = _createLiquidityArray(
                _asset,
                _amount
            );
            uint256[3] memory liquidityArr;
            for (uint256 i = 0; i < amountsArr.length; i++) {
                liquidityArr[i] = amountsArr[i];
            }

            uint256 balanceOfLPsBefore = IERC20(_lpAddress).balanceOf(
                address(this)
            );
            _safeApprove(
                _asset,
                address(tricryptoConfig.tricryptoLPVault()),
                _amount
            );
            tricryptoConfig.tricryptoLPVault().add_liquidity(
                liquidityArr,
                _minLpAmount,
                address(this)
            );
            uint256 balanceOfLPsAfter = IERC20(_lpAddress).balanceOf(
                address(this)
            );

            lpAmount = balanceOfLPsAfter - balanceOfLPsBefore;
            require(lpAmount > 0, "ERR: LIQUIDITY ADD FAILED");
        }

        return lpAmount;
    }

    /// @notice Unwrap LPs using remove_liquidity_one_coin into an underlying asset
    /// @param _asset Asset address
    /// @param _assetMinAmount The minimum amount of asset to receive
    /// @param _lpAmount The LP amount to unwrap
    /// @param _index Asset index from the underlying asset array
    /// @return The amount of asset obtained
    function _unwrapLPsIntoAsset(
        address _asset,
        uint256 _assetMinAmount,
        uint256 _lpAmount,
        uint256 _index
    ) private returns (uint256) {
        require(_assetMinAmount > 0, "ERR: MIN TOO LOW");
        require(_lpAmount > 0, "ERR: INVALID LP AMOUNT");

        uint256 assetBalanceBefore = IERC20(_asset).balanceOf(address(this));
        _safeApprove(
            tricryptoConfig.tricryptoToken(),
            address(tricryptoConfig.tricryptoLPVault()),
            _lpAmount
        );
        tricryptoConfig.tricryptoSwap().remove_liquidity_one_coin(
            _lpAmount,
            _index,
            _assetMinAmount
        );
        uint256 assetBalanceAfter = IERC20(_asset).balanceOf(address(this));
        require(
            assetBalanceAfter > assetBalanceBefore,
            "ERR: REMOVE LIQUIDITY FAILED"
        );

        return assetBalanceAfter - assetBalanceBefore;
    }

    /// @notice Create amounts array for an add_liquidity call
    /// @param _asset Asset to add as liquidity
    /// @param _amount Amount of asset
    /// @return The amounts array
    function _createLiquidityArray(address _asset, uint256 _amount)
        private
        view
        returns (uint256[] memory)
    {
        uint256 index = _getTokenIndex(_asset);
        uint256 noOfAssets = tricryptoConfig.underlyingAssetsNo();
        uint256[] memory amountsArr = new uint256[](3);
        for (uint256 i = 0; i < noOfAssets; i++) {
            if (i == index) {
                amountsArr[i] = _amount;
            } else {
                amountsArr[i] = 0;
            }
        }
        return amountsArr;
    }

    /// @notice Get index of a token from the LP pool
    /// @param _asset Asset to add as liquidity
    /// @return The index
    function _getTokenIndex(address _asset) private view returns (uint256) {
        uint256 returnIndex = 99;
        for (uint256 i = 0; i < tricryptoConfig.underlyingAssetsNo(); i++) {
            address underlyingAddr = tricryptoConfig.tricryptoLPVault().coins(
                i
            );
            if (underlyingAddr == _asset) {
                returnIndex = i;
            }
        }
        require(returnIndex < 99, "ERR: INVALID INDEX");
        return returnIndex;
    }

    /// @notice Save approve token for spending on contract
    /// @param token Token's address
    /// @param to Contract's address
    /// @param value Amount
    function _safeApprove(
        address token,
        address to,
        uint256 value
    ) private {
        (bool success, bytes memory data) = token.call(
            abi.encodeWithSelector(0x095ea7b3, to, value)
        );
        require(
            success && (data.length == 0 || abi.decode(data, (bool))),
            "ERR::safeApprove: approve failed"
        );
    }

    function _isSenderKeeperOrOwner(address _user) private view returns (bool) {
        return _user == owner() || _user == tricryptoConfig.keeper();
    }

    //-----------------
    //----------------- Modifiers -----------------
    //-----------------
    modifier onlyOwnerOrKeeper() {
        require(
            msg.sender == owner() || msg.sender == tricryptoConfig.keeper(),
            "ERR: NOT AUTHORIZED"
        );
        _;
    }
    modifier onlyWhitelistedUnderlying(address token) {
        require(
            tricryptoConfig.underlyingAssets(token),
            "ERR: NOT WHITELISTED"
        );
        _;
    }

    modifier validAmount(uint256 _amount) {
        require(_amount > 0, "ERR: INVALID AMOUNT");
        _;
    }
    modifier validAddress(address _address) {
        require(_address != address(0), "ERR: INVALID ADDRESS");
        _;
    }
}