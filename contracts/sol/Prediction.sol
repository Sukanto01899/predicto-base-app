// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "@chainlink/contracts/src/v0.8/automation/AutomationCompatible.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract PricePredictionGame is ReentrancyGuard, Pausable, Ownable, AutomationCompatibleInterface {
    using SafeERC20 for IERC20;
    
    IERC20 public usdtToken;
    
    uint256 public minBetAmount = 100000; // 0.1 USDT (6 decimals)
    uint256 public maxBetAmount = 1000000000; // 1000 USDT (6 decimals)
    uint256 public platformFee = 5; // 5% fee
    uint256 public constant PREDICTION_DURATION = 1 hours;
    uint256 public constant ROUND_INTERVAL = 1 hours;
    
    uint256 public nextRoundStartTime;
    
    enum Direction { DOWN, UP }
    enum RoundStatus { Pending, Live, Ended, Cancelled }
    
    struct Asset {
        string symbol;
        string name;
        address priceFeed;
        bool isActive;
        bool exists;
    }
    
    struct Prediction {
        address player;
        uint256 assetId;
        uint256 roundId;
        Direction direction;
        uint256 betAmount;
        bool claimed;
        bool exists;
    }
    
    struct Round {
        uint256 id;
        uint256 startTime;
        uint256 lockTime;
        uint256 endTime;
        int256 lockPrice;
        int256 closePrice;
        uint256 totalPool;
        uint256 upBets;
        uint256 downBets;
        uint256 upAmount;
        uint256 downAmount;
        RoundStatus status;
    }
    
    // Storage
    mapping(uint256 => Asset) public assets;
    
    // assetId => roundId => Round
    mapping(uint256 => mapping(uint256 => Round)) public rounds;
    
    // user => assetId => roundId => Prediction
    mapping(address => mapping(uint256 => mapping(uint256 => Prediction))) public predictions;
    
    // assetId => roundId => user => hasPredicted
    mapping(uint256 => mapping(uint256 => mapping(address => bool))) public roundParticipants;
    
    // assetId => currentRoundId
    mapping(uint256 => uint256) public currentRoundId;
    
    uint256 public assetCount;
    uint256 public totalFeesCollected;
    
    // Events
    event AssetAdded(uint256 indexed assetId, string symbol, string name, address priceFeed);
    event AssetStatusChanged(uint256 indexed assetId, bool isActive);
    
    event RoundStarted(uint256 indexed assetId, uint256 indexed roundId, uint256 startTime, uint256 endTime);
    event RoundLocked(uint256 indexed assetId, uint256 indexed roundId, int256 lockPrice);
    event RoundEnded(uint256 indexed assetId, uint256 indexed roundId, int256 lockPrice, int256 closePrice, Direction winningDirection);
    
    event PredictionMade(
        address indexed player,
        uint256 indexed assetId,
        uint256 indexed roundId,
        Direction direction,
        uint256 betAmount
    );
    
    event RewardClaimed(
        address indexed player,
        uint256 indexed assetId,
        uint256 indexed roundId,
        bool won,
        uint256 reward
    );
    
    constructor(
        address _usdtToken,
        address _btcPriceFeed,
        address _ethPriceFeed
    ) Ownable(msg.sender) {
        require(_usdtToken != address(0), "Invalid USDT address");
        require(_btcPriceFeed != address(0), "Invalid BTC feed");
        require(_ethPriceFeed != address(0), "Invalid ETH feed");
        
        usdtToken = IERC20(_usdtToken);
        
        // Add initial assets
        _addAsset("BTC", "Bitcoin", _btcPriceFeed);
        _addAsset("ETH", "Ethereum", _ethPriceFeed);
        
        // Set next round start time
        nextRoundStartTime = ((block.timestamp / ROUND_INTERVAL) + 1) * ROUND_INTERVAL;
    }
    
    // ==================== CHAINLINK AUTOMATION ====================
    
    function checkUpkeep(bytes calldata) 
        external 
        view 
        override 
        returns (bool upkeepNeeded, bytes memory performData) 
    {
        // Check if time to start new rounds for all assets
        if (block.timestamp >= nextRoundStartTime) {
            return (true, abi.encode(0, uint256(0), uint256(0))); // Action: Start new rounds
        }
        
        // Check each asset for lock/end needed
        for (uint256 assetId = 1; assetId <= assetCount; assetId++) {
            if (!assets[assetId].isActive) continue;
            
            uint256 roundId = currentRoundId[assetId];
            if (roundId == 0) continue;
            
            Round memory round = rounds[assetId][roundId];
            
            // Check if round needs to be locked
            if (round.status == RoundStatus.Pending && block.timestamp >= round.lockTime) {
                return (true, abi.encode(1, assetId, roundId)); // Action: Lock round
            }
            
            // Check if round needs to be ended
            if (round.status == RoundStatus.Live && block.timestamp >= round.endTime) {
                return (true, abi.encode(2, assetId, roundId)); // Action: End round
            }
        }
        
        return (false, "");
    }
    
    function performUpkeep(bytes calldata performData) external override {
        (uint256 action, uint256 assetId, uint256 roundId) = abi.decode(performData, (uint256, uint256, uint256));
        
        if (action == 0) {
            // Start new rounds for all active assets
            _startNewRounds();
        } else if (action == 1) {
            // Lock specific round
            _lockRound(assetId, roundId);
        } else if (action == 2) {
            // End specific round
            _endRound(assetId, roundId);
        }
    }
    
    // ==================== INTERNAL ROUND MANAGEMENT ====================
    
    function _startNewRounds() internal {
        require(block.timestamp >= nextRoundStartTime, "Too early");
        
        uint256 startTime = block.timestamp;
        uint256 lockTime = startTime;
        uint256 endTime = lockTime + PREDICTION_DURATION;
        
        // Start round for each active asset
        for (uint256 assetId = 1; assetId <= assetCount; assetId++) {
            if (!assets[assetId].isActive) continue;
            
            currentRoundId[assetId]++;
            uint256 newRoundId = currentRoundId[assetId];
            
            rounds[assetId][newRoundId] = Round({
                id: newRoundId,
                startTime: startTime,
                lockTime: lockTime,
                endTime: endTime,
                lockPrice: 0,
                closePrice: 0,
                totalPool: 0,
                upBets: 0,
                downBets: 0,
                upAmount: 0,
                downAmount: 0,
                status: RoundStatus.Pending
            });
            
            emit RoundStarted(assetId, newRoundId, startTime, endTime);
            
            // Lock immediately
            _lockRound(assetId, newRoundId);
        }
        
        // Set next round start time
        nextRoundStartTime = startTime + ROUND_INTERVAL;
    }
    
    function _lockRound(uint256 _assetId, uint256 _roundId) internal {
        Round storage round = rounds[_assetId][_roundId];
        require(round.status == RoundStatus.Pending, "Round not pending");
        require(block.timestamp >= round.lockTime, "Too early to lock");
        
        int256 currentPrice = getCurrentPrice(_assetId);
        require(currentPrice > 0, "Invalid price");
        
        round.lockPrice = currentPrice;
        round.status = RoundStatus.Live;
        
        emit RoundLocked(_assetId, _roundId, currentPrice);
    }
    
    function _endRound(uint256 _assetId, uint256 _roundId) internal {
        Round storage round = rounds[_assetId][_roundId];
        require(round.status == RoundStatus.Live, "Round not live");
        require(block.timestamp >= round.endTime, "Too early to end");
        
        int256 currentPrice = getCurrentPrice(_assetId);
        require(currentPrice > 0, "Invalid price");
        
        round.closePrice = currentPrice;
        round.status = RoundStatus.Ended;
        
        Direction winningDirection;
        if (currentPrice > round.lockPrice) {
            winningDirection = Direction.UP;
        } else {
            winningDirection = Direction.DOWN;
        }
        
        emit RoundEnded(_assetId, _roundId, round.lockPrice, currentPrice, winningDirection);
    }
    
    // ==================== INTERNAL FUNCTIONS ====================
    
    function _addAsset(string memory _symbol, string memory _name, address _priceFeed) internal {
        require(_priceFeed != address(0), "Invalid price feed");
        
        assetCount++;
        assets[assetCount] = Asset({
            symbol: _symbol,
            name: _name,
            priceFeed: _priceFeed,
            isActive: true,
            exists: true
        });
        
        emit AssetAdded(assetCount, _symbol, _name, _priceFeed);
    }
    
    // ==================== OWNER FUNCTIONS ====================
    
    function addAsset(string memory _symbol, string memory _name, address _priceFeed) external onlyOwner {
        _addAsset(_symbol, _name, _priceFeed);
    }
    
    function setAssetStatus(uint256 _assetId, bool _isActive) external onlyOwner {
        require(assets[_assetId].exists, "Asset doesn't exist");
        assets[_assetId].isActive = _isActive;
        emit AssetStatusChanged(_assetId, _isActive);
    }
    
    function updateAssetPriceFeed(uint256 _assetId, address _newPriceFeed) external onlyOwner {
        require(assets[_assetId].exists, "Asset doesn't exist");
        require(_newPriceFeed != address(0), "Invalid price feed");
        assets[_assetId].priceFeed = _newPriceFeed;
    }
    
    function setBetLimits(uint256 _minAmount, uint256 _maxAmount) external onlyOwner {
        require(_minAmount < _maxAmount, "Invalid limits");
        minBetAmount = _minAmount;
        maxBetAmount = _maxAmount;
    }
    
    function setPlatformFee(uint256 _fee) external onlyOwner {
        require(_fee <= 10, "Fee too high");
        platformFee = _fee;
    }
    
    function withdrawFees(uint256 _amount) external onlyOwner nonReentrant {
        require(_amount > 0, "Amount must be > 0");
        require(_amount <= totalFeesCollected, "Insufficient fees");
        
        totalFeesCollected -= _amount;
        usdtToken.safeTransfer(owner(), _amount);
    }
    
    function pause() external onlyOwner {
        _pause();
    }
    
    function unpause() external onlyOwner {
        _unpause();
    }
    
    function manualStartRounds() external onlyOwner {
        _startNewRounds();
    }
    
    // ==================== USER FUNCTIONS ====================
    
    /**
     * @dev User makes prediction on specific asset's current round
     * User can predict on multiple assets in the same round period
     */
    function predict(uint256 _assetId, Direction _direction, uint256 _betAmount) 
        external 
        nonReentrant 
        whenNotPaused 
    {
        require(_betAmount >= minBetAmount, "Bet too low");
        require(_betAmount <= maxBetAmount, "Bet too high");
        require(assets[_assetId].exists, "Asset doesn't exist");
        require(assets[_assetId].isActive, "Asset not active");
        
        uint256 roundId = currentRoundId[_assetId];
        require(roundId > 0, "No active round");
        
        Round storage round = rounds[_assetId][roundId];
        require(round.status == RoundStatus.Live, "Round not accepting bets");
        
        // Check if user already predicted for this asset in this round
        require(!roundParticipants[_assetId][roundId][msg.sender], "Already predicted for this asset");
        
        // Transfer USDT
        usdtToken.safeTransferFrom(msg.sender, address(this), _betAmount);
        
        // Update round stats
        round.totalPool += _betAmount;
        if (_direction == Direction.UP) {
            round.upBets++;
            round.upAmount += _betAmount;
        } else {
            round.downBets++;
            round.downAmount += _betAmount;
        }
        
        // Store prediction
        predictions[msg.sender][_assetId][roundId] = Prediction({
            player: msg.sender,
            assetId: _assetId,
            roundId: roundId,
            direction: _direction,
            betAmount: _betAmount,
            claimed: false,
            exists: true
        });
        
        roundParticipants[_assetId][roundId][msg.sender] = true;
        
        emit PredictionMade(msg.sender, _assetId, roundId, _direction, _betAmount);
    }
    
    /**
     * @dev Claim reward for specific asset and round
     */
    function claimReward(uint256 _assetId, uint256 _roundId) external nonReentrant whenNotPaused {
        Prediction storage pred = predictions[msg.sender][_assetId][_roundId];
        require(pred.exists, "No prediction found");
        require(!pred.claimed, "Already claimed");
        
        Round memory round = rounds[_assetId][_roundId];
        require(round.status == RoundStatus.Ended, "Round not ended");
        
        pred.claimed = true;
        
        // Check if won
        bool won = false;
        if (pred.direction == Direction.UP && round.closePrice > round.lockPrice) {
            won = true;
        } else if (pred.direction == Direction.DOWN && round.closePrice < round.lockPrice) {
            won = true;
        }
        
        if (won) {
            uint256 winningAmount = pred.direction == Direction.UP ? round.upAmount : round.downAmount;
            require(winningAmount > 0, "No winning pool");
            
            uint256 poolAfterFee = (round.totalPool * (100 - platformFee)) / 100;
            uint256 reward = (poolAfterFee * pred.betAmount) / winningAmount;
            
            uint256 fee = round.totalPool - poolAfterFee;
            totalFeesCollected += (fee * pred.betAmount) / round.totalPool;
            
            require(usdtToken.balanceOf(address(this)) >= reward, "Insufficient balance");
            usdtToken.safeTransfer(msg.sender, reward);
            
            emit RewardClaimed(msg.sender, _assetId, _roundId, true, reward);
        } else {
            uint256 fee = (pred.betAmount * platformFee) / 100;
            totalFeesCollected += fee;
            
            emit RewardClaimed(msg.sender, _assetId, _roundId, false, 0);
        }
    }
    
    /**
     * @dev Batch claim rewards for multiple assets/rounds
     */
    function claimMultipleRewards(uint256[] calldata _assetIds, uint256[] calldata _roundIds) 
        external 
        nonReentrant 
        whenNotPaused 
    {
        require(_assetIds.length == _roundIds.length, "Length mismatch");
        
        for (uint256 i = 0; i < _assetIds.length; i++) {
            uint256 assetId = _assetIds[i];
            uint256 roundId = _roundIds[i];
            
            Prediction storage pred = predictions[msg.sender][assetId][roundId];
            if (!pred.exists || pred.claimed) continue;
            
            Round memory round = rounds[assetId][roundId];
            if (round.status != RoundStatus.Ended) continue;
            
            pred.claimed = true;
            
            bool won = false;
            if (pred.direction == Direction.UP && round.closePrice > round.lockPrice) {
                won = true;
            } else if (pred.direction == Direction.DOWN && round.closePrice < round.lockPrice) {
                won = true;
            }
            
            if (won) {
                uint256 winningAmount = pred.direction == Direction.UP ? round.upAmount : round.downAmount;
                if (winningAmount == 0) continue;
                
                uint256 poolAfterFee = (round.totalPool * (100 - platformFee)) / 100;
                uint256 reward = (poolAfterFee * pred.betAmount) / winningAmount;
                
                uint256 fee = round.totalPool - poolAfterFee;
                totalFeesCollected += (fee * pred.betAmount) / round.totalPool;
                
                if (usdtToken.balanceOf(address(this)) >= reward) {
                    usdtToken.safeTransfer(msg.sender, reward);
                    emit RewardClaimed(msg.sender, assetId, roundId, true, reward);
                }
            } else {
                uint256 fee = (pred.betAmount * platformFee) / 100;
                totalFeesCollected += fee;
                emit RewardClaimed(msg.sender, assetId, roundId, false, 0);
            }
        }
    }
    
    // ==================== VIEW FUNCTIONS ====================
    
    function getCurrentPrice(uint256 _assetId) public view returns (int256) {
        require(assets[_assetId].exists, "Asset doesn't exist");
        AggregatorV3Interface priceFeed = AggregatorV3Interface(assets[_assetId].priceFeed);
        (, int256 price, , , ) = priceFeed.latestRoundData();
        return price;
    }
    
    function getActiveAssets() external view returns (
        uint256[] memory ids,
        string[] memory symbols,
        string[] memory names
    ) {
        uint256 activeCount = 0;
        for (uint256 i = 1; i <= assetCount; i++) {
            if (assets[i].isActive) activeCount++;
        }
        
        ids = new uint256[](activeCount);
        symbols = new string[](activeCount);
        names = new string[](activeCount);
        
        uint256 index = 0;
        for (uint256 i = 1; i <= assetCount; i++) {
            if (assets[i].isActive) {
                ids[index] = i;
                symbols[index] = assets[i].symbol;
                names[index] = assets[i].name;
                index++;
            }
        }
        
        return (ids, symbols, names);
    }
    
    function getCurrentRound(uint256 _assetId) external view returns (
        uint256 roundId,
        RoundStatus status,
        int256 lockPrice,
        int256 currentPrice,
        uint256 totalPool,
        uint256 upAmount,
        uint256 downAmount,
        uint256 timeLeft
    ) {
        roundId = currentRoundId[_assetId];
        require(roundId > 0, "No round yet");
        
        Round memory round = rounds[_assetId][roundId];
        
        uint256 timeRemaining = 0;
        if (round.status == RoundStatus.Live && block.timestamp < round.endTime) {
            timeRemaining = round.endTime - block.timestamp;
        }
        
        return (
            roundId,
            round.status,
            round.lockPrice,
            getCurrentPrice(_assetId),
            round.totalPool,
            round.upAmount,
            round.downAmount,
            timeRemaining
        );
    }
    
    function getAllCurrentRounds() external view returns (
        uint256[] memory assetIds,
        uint256[] memory roundIds,
        RoundStatus[] memory statuses,
        int256[] memory lockPrices,
        int256[] memory currentPrices,
        uint256[] memory timesLeft
    ) {
        uint256 activeCount = 0;
        for (uint256 i = 1; i <= assetCount; i++) {
            if (assets[i].isActive && currentRoundId[i] > 0) activeCount++;
        }
        
        assetIds = new uint256[](activeCount);
        roundIds = new uint256[](activeCount);
        statuses = new RoundStatus[](activeCount);
        lockPrices = new int256[](activeCount);
        currentPrices = new int256[](activeCount);
        timesLeft = new uint256[](activeCount);
        
        uint256 index = 0;
        for (uint256 i = 1; i <= assetCount; i++) {
            if (!assets[i].isActive || currentRoundId[i] == 0) continue;
            
            uint256 roundId = currentRoundId[i];
            Round memory round = rounds[i][roundId];
            
            uint256 timeRemaining = 0;
            if (round.status == RoundStatus.Live && block.timestamp < round.endTime) {
                timeRemaining = round.endTime - block.timestamp;
            }
            
            assetIds[index] = i;
            roundIds[index] = roundId;
            statuses[index] = round.status;
            lockPrices[index] = round.lockPrice;
            currentPrices[index] = getCurrentPrice(i);
            timesLeft[index] = timeRemaining;
            index++;
        }
        
        return (assetIds, roundIds, statuses, lockPrices, currentPrices, timesLeft);
    }
    
    function getMyPrediction(uint256 _assetId, uint256 _roundId) external view returns (
        bool exists,
        Direction direction,
        uint256 betAmount,
        bool claimed,
        bool canClaim
    ) {
        Prediction memory pred = predictions[msg.sender][_assetId][_roundId];
        Round memory round = rounds[_assetId][_roundId];
        
        bool claimable = pred.exists && !pred.claimed && round.status == RoundStatus.Ended;
        
        return (pred.exists, pred.direction, pred.betAmount, pred.claimed, claimable);
    }
    
    function getMyAllPredictions(uint256 _assetId) external view returns (
        uint256[] memory roundIds,
        Direction[] memory directions,
        uint256[] memory betAmounts,
        bool[] memory claimedStatus,
        bool[] memory canClaimStatus
    ) {
        uint256 roundId = currentRoundId[_assetId];
        if (roundId == 0) {
            return (new uint256[](0), new Direction[](0), new uint256[](0), new bool[](0), new bool[](0));
        }
        
        // Count user's predictions
        uint256 count = 0;
        for (uint256 i = 1; i <= roundId; i++) {
            if (predictions[msg.sender][_assetId][i].exists) count++;
        }
        
        roundIds = new uint256[](count);
        directions = new Direction[](count);
        betAmounts = new uint256[](count);
        claimedStatus = new bool[](count);
        canClaimStatus = new bool[](count);
        
        uint256 index = 0;
        for (uint256 i = 1; i <= roundId; i++) {
            Prediction memory pred = predictions[msg.sender][_assetId][i];
            if (!pred.exists) continue;
            
            Round memory round = rounds[_assetId][i];
            
            roundIds[index] = i;
            directions[index] = pred.direction;
            betAmounts[index] = pred.betAmount;
            claimedStatus[index] = pred.claimed;
            canClaimStatus[index] = !pred.claimed && round.status == RoundStatus.Ended;
            index++;
        }
        
        return (roundIds, directions, betAmounts, claimedStatus, canClaimStatus);
    }
}