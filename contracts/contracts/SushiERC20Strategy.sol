// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../../interfaces/sushiswap/ISushiSlpStrategyConfig.sol";
import "../../interfaces/sushiswap/ISushiERC20Strategy.sol";
import "../../interfaces/sushiswap/ISushiMasterChef.sol";
import "../../interfaces/sushiswap/ISushiLpToken.sol";
import "../../interfaces/sushiswap/IWeth.sol";
import "../../interfaces/sushiswap/IUniswapV2Router02.sol";
import "../../interfaces/IBridgeManager.sol";

import "../../libraries/FeeOperations.sol";

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";

/// @title Contract for depositing LP into Sushi MasterChef
/// @author Kush Goyal (@kushgoyal42)

contract SushiERC20Strategy is ISushiERC20Strategy, Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    /// @notice the config's contract address
    ISushiSlpStrategyConfig public override sushiConfig;

    /// @notice info for each user.
    mapping(address => UserInfo) public override userInfo;

    /// @notice total amount of LPs the strategy has
    uint256 public override totalAmountOfLPs;

    /// @notice Constructor
    /// @param _config the config's contract address
    constructor(address _config) {
        require(_config != address(0), "ERR: INVALID CONFIG");
        sushiConfig = ISushiSlpStrategyConfig(_config);
    }

    //-----------------
    //----------------- Owner methods -----------------
    //-----------------

    /// @notice Save funds from the contract
    /// @param _token Token's address
    /// @param _amount Token's amount
    function emergencySave(address _token, uint256 _amount) external onlyOwner {
        uint256 balance = IERC20(_token).balanceOf(address(this));
        require(_amount <= balance, "ERR: BALANCE");
        IERC20(_token).safeTransfer(msg.sender, _amount);
        emit EmergencySaveTriggered(msg.sender);
    }

    //-----------------
    //----------------- View methods -----------------
    //-----------------
    /// @notice Return current reward amount for user
    /// @param _user User's address
    /// @return Reward amount
    function getPendingRewards(address _user)
        public
        view
        override
        returns (uint256)
    {
        ISushiMasterChef masterChef = sushiConfig.masterChef();
        UserInfo storage user = userInfo[_user];
        ISushiMasterChef.PoolInfo memory sushiPool = masterChef.poolInfo(
            sushiConfig.pid()
        );
        // lp locked in master chef
        uint256 lpSupply = sushiPool.lpToken.balanceOf(address(masterChef));

        if (block.number > sushiPool.lastRewardBlock && lpSupply != 0) {
            uint256 multiplier = masterChef.getMultiplier(
                sushiPool.lastRewardBlock,
                block.number
            );
            uint256 sushiReward = (multiplier *
                masterChef.sushiPerBlock() *
                sushiPool.allocPoint) / masterChef.totalAllocPoint();

            sushiPool.accSushiPerShare =
                sushiPool.accSushiPerShare +
                ((sushiReward * (1e12)) / lpSupply);
        }

        uint256 accumulatedSushi = (user.slpAmount *
            sushiPool.accSushiPerShare) / (1e12);

        // reward debt is the sushi tokens already received by the user
        if (accumulatedSushi < user.sushiRewardDebt) {
            return 0;
        }

        return accumulatedSushi - user.sushiRewardDebt;
    }

    //-----------------
    //----------------- Non-view methods -----------------
    //-----------------

    /// @notice Deposit token0, token1, ETH, or the SLP
    /// @param _amount1 Deposited amount
    /// @param _asset1 Deposited asset
    /// @param _deadline No of blocks until swap/add_liquidity transactions expire
    /// @param _swapTokenOutMin The minimum for the other token being exchanged; can be 0 when _asset is the SLP
    function deposit(
        uint256 _amount1,
        address _asset1,
        uint256 _amount2,
        address _asset2,
        uint256 _deadline,
        uint256 _swapTokenOutMin
    ) external override nonReentrant validAddress(_asset1) {
        _deposit(
            _amount1,
            _asset1,
            _amount2,
            _asset2,
            _deadline,
            _swapTokenOutMin,
            false
        );
    }

    /// @notice Withdraw SLP token or  the provided tokens
    /// @param _amount Withdrawal amount
    /// @param _asset Withdrawal asset
    /// @param _deadline No of blocks until swap/remove_liquidity transactions expire
    /// @param _amountAMin Minimum amount for the SLP's token0
    /// @param _amountBMin Minimum amount for the SLP's token1
    function withdraw(
        uint256 _amount,
        address _asset,
        uint256 _deadline,
        uint256 _amountAMin,
        uint256 _amountBMin
    ) external override nonReentrant {
        
        if (!_isSenderKeeperOrOwner(msg.sender)) {
            require(userInfo[msg.sender].slpAmount >= _amount, "ERR: AMOUNT");
            require(!sushiConfig.isWithdrawalPaused(), "ERR: PAUSED");
        }
        
        require(_amount > 0, "ERR: AMOUNT");
        
        if (_asset == address(0)) {
            // withdraw the tokens and not the slp
            require(_amountAMin > 0, "ERR: MIN AMOUNT A");
            require(_amountBMin > 0, "ERR: MIN AMOUNT B");
        }

        ISushiSlpStrategyConfig.TemporaryWithdrawData memory tempData;

        tempData.isSlp = _asset == sushiConfig.slpToken();
        tempData.masterChef = sushiConfig.masterChef();
        tempData.pid = sushiConfig.pid();
        tempData.sushiToken = sushiConfig.sushiToken();

        // -----
        // withdraw from sushi master chef
        // -----
        // https://github.com/sushiswap/sushiswap/blob/canary/contracts/MasterChef.sol#L210
        tempData.masterChef.updatePool(tempData.pid);

        (tempData.totalSushi, tempData.slpAmount) = _withdrawLpAndSushi(
            _amount,
            tempData.pid,
            tempData.masterChef
        );

        if (
            !_isSenderKeeperOrOwner(msg.sender) &&
            msg.sender != sushiConfig.feeAddress()
        ) {
            uint256 fee = _takeFee(tempData.totalSushi, tempData.sushiToken);
            tempData.totalSushi = tempData.totalSushi - fee;
        }

        //transfer sushi to the user
        IERC20(tempData.sushiToken).safeTransfer(
            msg.sender,
            tempData.totalSushi
        );

        totalAmountOfLPs = totalAmountOfLPs - tempData.slpAmount;

        if (tempData.isSlp) {
            IERC20(sushiConfig.slpToken()).safeTransfer(
                msg.sender,
                tempData.slpAmount
            );
            emit Withdraw(
                msg.sender,
                _asset,
                address(0),
                _amount,
                tempData.slpAmount,
                0
            );
        } else {
            //unwrap the lp tokens
            (tempData.amountA, tempData.amountB) = _unwrapLiquidity(
                tempData.slpAmount,
                _deadline,
                _amountAMin,
                _amountBMin
            );

            IERC20(ISushiLpToken(sushiConfig.slpToken()).token0()).safeTransfer(
                    msg.sender,
                    tempData.amountA
                );

            IERC20(ISushiLpToken(sushiConfig.slpToken()).token1()).safeTransfer(
                    msg.sender,
                    tempData.amountB
                );

            emit Withdraw(
                msg.sender,
                ISushiLpToken(sushiConfig.slpToken()).token0(),
                ISushiLpToken(sushiConfig.slpToken()).token1(),
                _amount,
                tempData.amountA,
                tempData.amountB
            );
        }
    }

    /// @notice Transfer LPs or one of the tokens to another layer
    /// @param _bridgeId The bridge id to be used for this operation
    /// @param _unwrap If 'true', the LP is unwrapped into WETH
    /// @param _amount Amount of LPs to transfer/unwrap & transfer
    /// @param _data additional data needed for the bridge
    /// @return An unique id
    function transferLPs(
        uint256 _bridgeId,
        uint256 _destinationNetworkId,
        bool _unwrap,
        uint256 _amount,
        uint256 _deadline,
        uint256 _amountAMin,
        uint256 _amountBMin,
        uint256 _swapTokenOutMin,
        bytes calldata _data
    ) external override onlyOwnerOrKeeper nonReentrant returns (uint256) {
        ISushiMasterChef.UserInfo memory user = sushiConfig
            .masterChef()
            .userInfo(sushiConfig.pid(), address(this));

        require(user.amount >= _amount, "ERR: EXCEEDS BALANCE");

        if (user.amount == _amount) {
            // cannot withdraw because of no LP in the contract
            sushiConfig.pauseWithdrawal();
        }

        ISushiSlpStrategyConfig.TransferLpTemporaryData memory tempData;
        tempData.amountToTransfer = 0;
        tempData.transferredToken = sushiConfig.slpToken();

        // unstake from master chef
        sushiConfig.masterChef().withdraw(sushiConfig.pid(), _amount);

        tempData.amountToTransfer = _amount;

        if (_unwrap) {
            require(_amountAMin > 0, "ERR: MIN AMOUNT A");
            require(_amountBMin > 0, "ERR: MIN AMOUNT B");
            require(_swapTokenOutMin > 0, "ERR: MIN SWAP AMOUNT OUT");
            (tempData.amountA, tempData.amountB) = _unwrapLiquidity(
                _amount,
                _deadline,
                _amountAMin,
                _amountBMin
            );

            //swap the other token1 for token0 so that only token0 can be transferred
            uint256 swappedAmount = _getTheOtherToken(
                ISushiLpToken(sushiConfig.slpToken()).token1(),
                ISushiLpToken(sushiConfig.slpToken()).token0(),
                tempData.amountB,
                _swapTokenOutMin,
                _deadline
            )[1];

            tempData.amountToTransfer = swappedAmount + tempData.amountA;

            // token0 will be transferred
            tempData.transferredToken = ISushiLpToken(sushiConfig.slpToken())
                .token0();
        }

        require(tempData.amountToTransfer > 0, "ERR: AMOUNT");
        require(_bridgeId > 0, "ERR: BRIDGE");
        require(
            tempData.transferredToken ==
                ISushiLpToken(sushiConfig.slpToken()).token0() ||
                tempData.transferredToken == sushiConfig.slpToken(),
            "ERR: TOKEN"
        );
        // transfer the tokens to another layer
        address bridgeManager = sushiConfig.bridgeManager();
        FeeOperations.safeApprove(
            tempData.transferredToken,
            bridgeManager,
            tempData.amountToTransfer
        );
        IBridgeManager(bridgeManager).transferERC20(
            _bridgeId,
            _destinationNetworkId,
            tempData.transferredToken,
            tempData.amountToTransfer,
            sushiConfig.keeper(), // the keeper will deposit the funds on the destination layer
            _data
        );
        return tempData.amountToTransfer;
    }

    /// @notice Receive WETH or the SLP that come back from another Layer,
    ///         basically deposit but with the transfer of all accumulated SUSHI tokens
    ///         in the owner/keeper account (NEED Owner/Keeper to approve the SUSHI spending by this contract)
    /// @param _amount Deposited amount
    /// @param _asset Deposited asset
    /// @param _deadline No of blocks until swap/add_liquidity transactions expire
    /// @param _swapTokenOutMin The minimum for the other token being exchanged; can be 0 when _asset is the SLP
    function receiveBackLPs(
        uint256 _amount,
        address _asset,
        uint256 _deadline,
        uint256 _swapTokenOutMin
    ) external override onlyOwnerOrKeeper nonReentrant validAddress(_asset) {
        _deposit(
            _amount,
            _asset,
            0,
            address(0),
            _deadline,
            _swapTokenOutMin,
            true
        );

        // Transfer accumulated sushi rewards from other Layers:
        uint256 ownerSushiBalance = IERC20(sushiConfig.sushiToken()).balanceOf(
            msg.sender
        );
        IERC20(sushiConfig.sushiToken()).safeTransferFrom(
            msg.sender,
            address(this),
            ownerSushiBalance
        );
    }

    //-----------------
    //----------------- Private methods -----------------
    //-----------------

    /// @notice INTERNAL Function for deposit token0, token1, ETH, or the SLP called by deposit and receiveBackLPs
    /// @param _amount1 Deposited amount
    /// @param _asset1 Deposited asset
    /// @param _deadline No of blocks until swap/add_liquidity transactions expire
    /// @param _swapTokenOutMin The minimum for the other token being exchanged; can be 0 when _asset is the SLP
    /// @param _swapTokenOutMin The minimum for the other token being exchanged; can be 0 when _asset is the SLP
    /// @param _isReceiveBackLP true when the deposit is made by the keeper for the funds from another layer
    function _deposit(
        uint256 _amount1,
        address _asset1,
        uint256 _amount2,
        address _asset2,
        uint256 _deadline,
        uint256 _swapTokenOutMin,
        bool _isReceiveBackLP
    ) internal validAddress(_asset1) {
        require(_amount1 > 0, "ERR: AMOUNT1");

        require(
            (_asset1 == sushiConfig.slpToken() && _asset2 == address(0)) || // directly provided slp
                (_asset1 == ISushiLpToken(sushiConfig.slpToken()).token0() &&
                    _asset2 ==
                    ISushiLpToken(sushiConfig.slpToken()).token1()) || // assets case
                (_asset1 == ISushiLpToken(sushiConfig.slpToken()).token1() &&
                    _asset2 == ISushiLpToken(sushiConfig.slpToken()).token0()), // assets case
            "ERR: INVALID ASSETS"
        );

        if (_asset1 != sushiConfig.slpToken() && _amount2 == 0) {
            // it is mandatory to swap asset1 into asset2 for providing LP
            require(_swapTokenOutMin > 0, "ERR: TOKEN OUT MIN");
        }
        
        IERC20(_asset1).safeTransferFrom(msg.sender, address(this), _amount1);

        ISushiSlpStrategyConfig.DepositTemporaryData memory tempData;

        //trade & add liquidity
        // -----
        if (sushiConfig.slpToken() != _asset1) {
            tempData.tokenA = _asset1;
            tempData.tokenB = _asset2;

            if (_amount2 == 0) {
                //swap existing asset with token0 or token1
                tempData.half = _amount1 / 2;
                _amount1 = _amount1 - tempData.half;

                tempData.tokenOut = _asset2;
                //swap half of asset
                tempData.swappedAmounts = _getTheOtherToken(
                    _asset1,
                    tempData.tokenOut,
                    tempData.half,
                    _swapTokenOutMin,
                    _deadline
                );
            } else {
                IERC20(_asset2).safeTransferFrom(msg.sender, address(this), _amount2);
                tempData.swappedAmounts = new uint[](2);
                tempData.swappedAmounts[0] = _amount1;
                tempData.swappedAmounts[1] = _amount2;
            }

            // convert the assets in LP
            (
                tempData.usedA,
                tempData.usedB,
                tempData.liquidity,
                tempData.toRefundA,
                tempData.toRefundB
            ) = _addLiquidity(tempData, _amount1, _deadline);
        } else {
            // _asset1 is slp token
            tempData.liquidity = _amount1;
        }

        // refund excess tokens after providing liquidity
        if (tempData.toRefundA > 0) {
            IERC20(tempData.tokenA).transfer(msg.sender, tempData.toRefundA);
        }

        if (tempData.toRefundB > 0) {
            IERC20(tempData.tokenB).transfer(msg.sender, tempData.toRefundB);
        }

        UserInfo storage user = userInfo[msg.sender];

        // update rewards
        // -----
        if (_isSenderKeeperOrOwner(msg.sender) && _isReceiveBackLP) {} else {
            (
                user.slpAmount,
                tempData.pendingSushiTokens,
                user.sushiRewardDebt
            ) = _updatePool(
                user.slpAmount,
                user.sushiRewardDebt,
                tempData.liquidity
            );
        }

        uint256 prevSushiBalance = IERC20(sushiConfig.sushiToken()).balanceOf(
            address(this)
        );

        // deposit LP into the master chef
        // -----
        FeeOperations.safeApprove(
            sushiConfig.slpToken(),
            address(sushiConfig.masterChef()),
            tempData.liquidity
        );

        sushiConfig.masterChef().deposit(sushiConfig.pid(), tempData.liquidity);

        // accrue rewards
        // -----
        if (tempData.pendingSushiTokens > 0) {
            uint256 sushiBalance = IERC20(sushiConfig.sushiToken()).balanceOf(
                address(this)
            );

            if (sushiBalance > prevSushiBalance) {
                uint256 actualSushiTokens = sushiBalance - prevSushiBalance;
                
                // tempData.pendingSushiTokens is the calculated value
                // actualSushiTokens are the ones received from masterChef after the LP deposit
                if (tempData.pendingSushiTokens > actualSushiTokens) {
                    user.userAccumulatedSushi =
                        user.userAccumulatedSushi +
                        actualSushiTokens;
                } else {
                    user.userAccumulatedSushi =
                        user.userAccumulatedSushi +
                        tempData.pendingSushiTokens;
                }
            }
        }

        if (_isSenderKeeperOrOwner(msg.sender) && _isReceiveBackLP) {} else {
            totalAmountOfLPs = totalAmountOfLPs + tempData.liquidity;
        }

        if (_isReceiveBackLP) {
            emit ReceiveBackLPs(
                msg.sender,
                _asset1,
                _amount1 + tempData.half,
                tempData.liquidity
            );
        } else {
            emit Deposit(
                msg.sender,
                _asset1,
                _amount1 + tempData.half,
                tempData.liquidity
            );
        }
    }

    /// @notice Extracts fee from amount & transfers it to the feeAddress
    /// @param _amount Amount from which the fee is subtracted from
    /// @param _asset Asset that's going to be transferred
    function _takeFee(uint256 _amount, address _asset)
        private
        returns (uint256)
    {
        uint256 feePart = FeeOperations.getFeeAbsolute(
            _amount,
            sushiConfig.currentFee()
        );
        IERC20(_asset).safeTransfer(sushiConfig.feeAddress(), feePart);
        return feePart;
    }

    /// @notice Unwrap liquidity
    /// @param _deadline No of blocks until transaction expires
    /// @param _amountAMin Min amount for the first token
    /// @param _amountBMin Min amount for the second token
    /// @return Total Weth amount
    function _unwrapLiquidity(
        uint256 _amount,
        uint256 _deadline,
        uint256 _amountAMin,
        uint256 _amountBMin
    ) private returns (uint256, uint256) {
        ISushiSlpStrategyConfig.TransferLpTemporaryData memory tempData;

        tempData.amountToTransfer = _amount;

        //unwrap LP into token0, token1
        (tempData.amountA, tempData.amountB) = _removeLiquidity(
            tempData.amountToTransfer,
            _deadline,
            _amountAMin,
            _amountBMin
        );

        return (tempData.amountA, tempData.amountB);
    }

    /// @notice Removes liquidity
    /// @param _liquidity Liquidity amount
    /// @param _deadline No of blocks until transaction expires
    /// @param _amountAMin Min amount for the first token
    /// @param _amountBMin Min amount for the second token
    /// @return tokenA amount, tokenB amount
    function _removeLiquidity(
        uint256 _liquidity,
        uint256 _deadline,
        uint256 _amountAMin,
        uint256 _amountBMin
    ) private returns (uint256, uint256) {
        ISushiSlpStrategyConfig.RemoveLiquidityTempData memory tempData;
        tempData.tokenA = ISushiLpToken(sushiConfig.slpToken()).token0();
        tempData.tokenB = ISushiLpToken(sushiConfig.slpToken()).token1();

        FeeOperations.safeApprove(
            sushiConfig.slpToken(),
            address(sushiConfig.router()),
            _liquidity
        );

        (tempData.amountA, tempData.amountB) = IUniswapV2Router02(
            sushiConfig.router()
        ).removeLiquidity(
                tempData.tokenA,
                tempData.tokenB,
                _liquidity,
                _amountAMin,
                _amountBMin,
                address(this),
                _deadline
            );

        return (tempData.amountA, tempData.amountB);
    }

    /// @notice Withdraw and return sushi amount
    /// @param _amount Withdrawal amount
    /// @param pid Pool id
    /// @param masterChef Master chef contract
    /// @return sushi amount, slp amount
    function _withdrawLpAndSushi(
        uint256 _amount,
        uint256 pid,
        ISushiMasterChef masterChef
    ) private returns (uint256, uint256) {
        UserInfo storage user = userInfo[msg.sender];
        uint256 userSushiShare = (_amount *
            (masterChef.poolInfo(pid).accSushiPerShare)) / (1e12);

        uint256 pendingSushiTokens = 0;
        if (userSushiShare >= user.sushiRewardDebt) {
            pendingSushiTokens = (userSushiShare) - user.sushiRewardDebt;
        }

        uint256 slpAmount = _withdraw(_amount, masterChef, pid);
        require(slpAmount > 0, "ERR: INVALID UNSTAKE");
        user.slpAmount = user.slpAmount - slpAmount;

        user.sushiRewardDebt =
            (user.slpAmount * (masterChef.poolInfo(pid).accSushiPerShare)) /
            (1e12);

        uint256 sushiBalance = IERC20(sushiConfig.sushiToken()).balanceOf(
            address(this)
        );

        // pendingSushiTokens is the calculated value
        // sushiBalance is the actual contract balance
        if (pendingSushiTokens > 0) {
            if (pendingSushiTokens > sushiBalance) {
                user.userAccumulatedSushi =
                    user.userAccumulatedSushi +
                    sushiBalance;
            } else {
                user.userAccumulatedSushi =
                    user.userAccumulatedSushi +
                    pendingSushiTokens;
            }
        }

        if (user.userAccumulatedSushi > sushiBalance) {
            return (sushiBalance, slpAmount);
        }

        return (user.userAccumulatedSushi, slpAmount);
    }

    /// @notice Withdraw from masterchef
    /// @param _amount Withdrawal amount
    /// @param masterChef Master chef contract
    /// @param pid Pool id
    /// @return slp amount
    function _withdraw(
        uint256 _amount,
        ISushiMasterChef masterChef,
        uint256 pid
    ) private returns (uint256) {
        
        uint256 prevSlpAmount = IERC20(sushiConfig.slpToken()).balanceOf(
            address(this)
        );

        // https://github.com/sushiswap/sushiswap/blob/canary/contracts/MasterChef.sol#L255
        // along with the lp this will also transfer the pending sushi
        // for the _amount of lp withdrawn to this contract
        masterChef.withdraw(pid, _amount);

        uint256 currentSlpAmount = IERC20(sushiConfig.slpToken()).balanceOf(
            address(this)
        );
        
        require(currentSlpAmount >= prevSlpAmount, "ERR: LP WITHDRAW FAILED");
        
        return currentSlpAmount - prevSlpAmount;
    }

    /// @notice Add liquidity
    /// @param tempData Temporary data used internally
    /// @param _amount1 Deposited amount
    /// @param _deadline No of blocks until add_liquidity transactions expire
    /// @return  tokenA used amount,tokenB used amount, liquidity obtained, tokenA amount to be refunded, tokenB amount to be refunded
    function _addLiquidity(
        ISushiSlpStrategyConfig.DepositTemporaryData memory tempData,
        uint256 _amount1,
        uint256 _deadline
    )
        private
        returns (
            uint256,
            uint256,
            uint256,
            uint256,
            uint256
        )
    {
        tempData.amountADesired = _amount1;
        tempData.amountBDesired = tempData.swappedAmounts[1];

        tempData.amountAMin =
            tempData.amountADesired -
            FeeOperations.getFeeAbsolute(tempData.amountADesired, 1000);
        tempData.amountBMin =
            tempData.amountBDesired -
            FeeOperations.getFeeAbsolute(tempData.amountBDesired, 1000);

        FeeOperations.safeApprove(
            tempData.tokenA,
            address(sushiConfig.router()),
            tempData.amountADesired
        );
        FeeOperations.safeApprove(
            tempData.tokenB,
            address(sushiConfig.router()),
            tempData.amountBDesired
        );

        (tempData.usedA, tempData.usedB, tempData.liquidity) = sushiConfig
            .router()
            .addLiquidity(
                tempData.tokenA,
                tempData.tokenB,
                tempData.amountADesired,
                tempData.amountBDesired,
                tempData.amountAMin,
                tempData.amountBMin,
                address(this),
                _deadline
            );

        if (tempData.amountADesired - tempData.usedA > 0) {
            tempData.toRefundA = tempData.amountADesired - tempData.usedA;
        }
        if (tempData.amountBDesired - tempData.usedB > 0) {
            tempData.toRefundB = tempData.amountBDesired - tempData.usedB;
        }

        return (
            tempData.usedA,
            tempData.usedB,
            tempData.liquidity,
            tempData.toRefundA,
            tempData.toRefundB
        );
    }

    /// @notice Trade one token with the other one
    /// @param _tokenIn Deposited amount
    /// @param _amountIn Deposited asset
    /// @param _tokenOutAmountMin Deposited asset
    /// @param _deadline No of blocks until swap/add_liquidity transactions expire
    /// @return amounts  Array of 2 items: token0 amount, token1 amount
    function _getTheOtherToken(
        address _tokenIn,
        address _tokenOut,
        uint256 _amountIn,
        uint256 _tokenOutAmountMin,
        uint256 _deadline
    ) private returns (uint256[] memory amounts) {
        address[] memory path = new address[](2);
        path[0] = _tokenIn;
        path[1] = _tokenOut;
        FeeOperations.safeApprove(
            _tokenIn,
            address(sushiConfig.router()),
            _amountIn
        );
        amounts = IUniswapV2Router02(sushiConfig.router())
            .swapExactTokensForTokens(
                _amountIn,
                _tokenOutAmountMin,
                path,
                address(this),
                _deadline
            );
    }

    /// @notice Get Sushi token ratio for a user
    /// @param _amount User address
    /// @param _sushiRewardDebt User address
    /// @param _liquidity User address
    /// @return amount, pendingSushiTokens, sushiRewardDebt
    function _updatePool(
        uint256 _amount,
        uint256 _sushiRewardDebt,
        uint256 _liquidity
    )
        internal
        returns (
            uint256,
            uint256,
            uint256
        )
    {
        ISushiMasterChef masterChef = sushiConfig.masterChef();
        uint256 masterChefPoolId = sushiConfig.pid();

        // this will update the reward variables of the pool
        // https://github.com/sushiswap/sushiswap/blob/canary/contracts/MasterChef.sol#L210
        masterChef.updatePool(masterChefPoolId);

        // accSushiPerShare is a multiple of 1e12
        uint256 pendingSushiTokens = ((_amount *
            masterChef.poolInfo(masterChefPoolId).accSushiPerShare) / (1e12)) -
            _sushiRewardDebt;

        _amount = _amount + _liquidity;

        _sushiRewardDebt =
            (_amount * masterChef.poolInfo(masterChefPoolId).accSushiPerShare) /
            (1e12);

        return (_amount, pendingSushiTokens, _sushiRewardDebt);
    }

    function _isSenderKeeperOrOwner(address _user) private view returns (bool) {
        return _user == owner() || _user == sushiConfig.keeper();
    }

    //-----------------
    //----------------- Modifiers -----------------
    //-----------------
    modifier onlyOwnerOrKeeper() {
        require(
            msg.sender == owner() || msg.sender == sushiConfig.keeper(),
            "ERR: NOT AUTHORIZED"
        );
        _;
    }
    modifier validAddress(address _address) {
        require(_address != address(0), "ERR: INVALID ADDRESS");
        _;
    }
}