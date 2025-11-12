const testnetAbi = {
  prediction: {
    address: "0x576558807a2255aa3e73dc3322e5665037174874",
    abi: [
      {
        inputs: [
          {
            internalType: "address",
            name: "_usdtToken",
            type: "address",
          },
          {
            internalType: "address",
            name: "_btcPriceFeed",
            type: "address",
          },
          {
            internalType: "address",
            name: "_ethPriceFeed",
            type: "address",
          },
        ],
        stateMutability: "nonpayable",
        type: "constructor",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "owner",
            type: "address",
          },
        ],
        name: "OwnableInvalidOwner",
        type: "error",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "account",
            type: "address",
          },
        ],
        name: "OwnableUnauthorizedAccount",
        type: "error",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "token",
            type: "address",
          },
        ],
        name: "SafeERC20FailedOperation",
        type: "error",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "uint256",
            name: "assetId",
            type: "uint256",
          },
          {
            indexed: false,
            internalType: "string",
            name: "symbol",
            type: "string",
          },
          {
            indexed: false,
            internalType: "string",
            name: "name",
            type: "string",
          },
          {
            indexed: false,
            internalType: "address",
            name: "priceFeed",
            type: "address",
          },
        ],
        name: "AssetAdded",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "uint256",
            name: "assetId",
            type: "uint256",
          },
          {
            indexed: false,
            internalType: "bool",
            name: "isActive",
            type: "bool",
          },
        ],
        name: "AssetStatusChanged",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "previousOwner",
            type: "address",
          },
          {
            indexed: true,
            internalType: "address",
            name: "newOwner",
            type: "address",
          },
        ],
        name: "OwnershipTransferred",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: false,
            internalType: "address",
            name: "account",
            type: "address",
          },
        ],
        name: "Paused",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "player",
            type: "address",
          },
          {
            indexed: true,
            internalType: "uint256",
            name: "assetId",
            type: "uint256",
          },
          {
            indexed: true,
            internalType: "uint256",
            name: "roundId",
            type: "uint256",
          },
          {
            indexed: false,
            internalType: "enum PricePredictionGame.Direction",
            name: "direction",
            type: "uint8",
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "betAmount",
            type: "uint256",
          },
        ],
        name: "PredictionMade",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "player",
            type: "address",
          },
          {
            indexed: true,
            internalType: "uint256",
            name: "assetId",
            type: "uint256",
          },
          {
            indexed: true,
            internalType: "uint256",
            name: "roundId",
            type: "uint256",
          },
          {
            indexed: false,
            internalType: "bool",
            name: "won",
            type: "bool",
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "reward",
            type: "uint256",
          },
        ],
        name: "RewardClaimed",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "uint256",
            name: "assetId",
            type: "uint256",
          },
          {
            indexed: true,
            internalType: "uint256",
            name: "roundId",
            type: "uint256",
          },
          {
            indexed: false,
            internalType: "int256",
            name: "lockPrice",
            type: "int256",
          },
          {
            indexed: false,
            internalType: "int256",
            name: "closePrice",
            type: "int256",
          },
          {
            indexed: false,
            internalType: "enum PricePredictionGame.Direction",
            name: "winningDirection",
            type: "uint8",
          },
        ],
        name: "RoundEnded",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "uint256",
            name: "assetId",
            type: "uint256",
          },
          {
            indexed: true,
            internalType: "uint256",
            name: "roundId",
            type: "uint256",
          },
          {
            indexed: false,
            internalType: "int256",
            name: "lockPrice",
            type: "int256",
          },
        ],
        name: "RoundLocked",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "uint256",
            name: "assetId",
            type: "uint256",
          },
          {
            indexed: true,
            internalType: "uint256",
            name: "roundId",
            type: "uint256",
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "startTime",
            type: "uint256",
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "endTime",
            type: "uint256",
          },
        ],
        name: "RoundStarted",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: false,
            internalType: "address",
            name: "account",
            type: "address",
          },
        ],
        name: "Unpaused",
        type: "event",
      },
      {
        inputs: [],
        name: "PREDICTION_DURATION",
        outputs: [
          {
            internalType: "uint256",
            name: "",
            type: "uint256",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "ROUND_INTERVAL",
        outputs: [
          {
            internalType: "uint256",
            name: "",
            type: "uint256",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "string",
            name: "_symbol",
            type: "string",
          },
          {
            internalType: "string",
            name: "_name",
            type: "string",
          },
          {
            internalType: "address",
            name: "_priceFeed",
            type: "address",
          },
        ],
        name: "addAsset",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [],
        name: "assetCount",
        outputs: [
          {
            internalType: "uint256",
            name: "",
            type: "uint256",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "uint256",
            name: "",
            type: "uint256",
          },
        ],
        name: "assets",
        outputs: [
          {
            internalType: "string",
            name: "symbol",
            type: "string",
          },
          {
            internalType: "string",
            name: "name",
            type: "string",
          },
          {
            internalType: "address",
            name: "priceFeed",
            type: "address",
          },
          {
            internalType: "bool",
            name: "isActive",
            type: "bool",
          },
          {
            internalType: "bool",
            name: "exists",
            type: "bool",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "bytes",
            name: "",
            type: "bytes",
          },
        ],
        name: "checkUpkeep",
        outputs: [
          {
            internalType: "bool",
            name: "upkeepNeeded",
            type: "bool",
          },
          {
            internalType: "bytes",
            name: "performData",
            type: "bytes",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "uint256[]",
            name: "_assetIds",
            type: "uint256[]",
          },
          {
            internalType: "uint256[]",
            name: "_roundIds",
            type: "uint256[]",
          },
        ],
        name: "claimMultipleRewards",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "uint256",
            name: "_assetId",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "_roundId",
            type: "uint256",
          },
        ],
        name: "claimReward",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "uint256",
            name: "",
            type: "uint256",
          },
        ],
        name: "currentRoundId",
        outputs: [
          {
            internalType: "uint256",
            name: "",
            type: "uint256",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "getActiveAssets",
        outputs: [
          {
            internalType: "uint256[]",
            name: "ids",
            type: "uint256[]",
          },
          {
            internalType: "string[]",
            name: "symbols",
            type: "string[]",
          },
          {
            internalType: "string[]",
            name: "names",
            type: "string[]",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "getAllCurrentRounds",
        outputs: [
          {
            internalType: "uint256[]",
            name: "assetIds",
            type: "uint256[]",
          },
          {
            internalType: "uint256[]",
            name: "roundIds",
            type: "uint256[]",
          },
          {
            internalType: "enum PricePredictionGame.RoundStatus[]",
            name: "statuses",
            type: "uint8[]",
          },
          {
            internalType: "int256[]",
            name: "lockPrices",
            type: "int256[]",
          },
          {
            internalType: "int256[]",
            name: "currentPrices",
            type: "int256[]",
          },
          {
            internalType: "uint256[]",
            name: "timesLeft",
            type: "uint256[]",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "uint256",
            name: "_assetId",
            type: "uint256",
          },
        ],
        name: "getCurrentPrice",
        outputs: [
          {
            internalType: "int256",
            name: "",
            type: "int256",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "uint256",
            name: "_assetId",
            type: "uint256",
          },
        ],
        name: "getCurrentRound",
        outputs: [
          {
            internalType: "uint256",
            name: "roundId",
            type: "uint256",
          },
          {
            internalType: "enum PricePredictionGame.RoundStatus",
            name: "status",
            type: "uint8",
          },
          {
            internalType: "int256",
            name: "lockPrice",
            type: "int256",
          },
          {
            internalType: "int256",
            name: "currentPrice",
            type: "int256",
          },
          {
            internalType: "uint256",
            name: "totalPool",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "upAmount",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "downAmount",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "timeLeft",
            type: "uint256",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "uint256",
            name: "_assetId",
            type: "uint256",
          },
        ],
        name: "getMyAllPredictions",
        outputs: [
          {
            internalType: "uint256[]",
            name: "roundIds",
            type: "uint256[]",
          },
          {
            internalType: "enum PricePredictionGame.Direction[]",
            name: "directions",
            type: "uint8[]",
          },
          {
            internalType: "uint256[]",
            name: "betAmounts",
            type: "uint256[]",
          },
          {
            internalType: "bool[]",
            name: "claimedStatus",
            type: "bool[]",
          },
          {
            internalType: "bool[]",
            name: "canClaimStatus",
            type: "bool[]",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "uint256",
            name: "_assetId",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "_roundId",
            type: "uint256",
          },
        ],
        name: "getMyPrediction",
        outputs: [
          {
            internalType: "bool",
            name: "exists",
            type: "bool",
          },
          {
            internalType: "enum PricePredictionGame.Direction",
            name: "direction",
            type: "uint8",
          },
          {
            internalType: "uint256",
            name: "betAmount",
            type: "uint256",
          },
          {
            internalType: "bool",
            name: "claimed",
            type: "bool",
          },
          {
            internalType: "bool",
            name: "canClaim",
            type: "bool",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "manualStartRounds",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [],
        name: "maxBetAmount",
        outputs: [
          {
            internalType: "uint256",
            name: "",
            type: "uint256",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "minBetAmount",
        outputs: [
          {
            internalType: "uint256",
            name: "",
            type: "uint256",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "nextRoundStartTime",
        outputs: [
          {
            internalType: "uint256",
            name: "",
            type: "uint256",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "owner",
        outputs: [
          {
            internalType: "address",
            name: "",
            type: "address",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "pause",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [],
        name: "paused",
        outputs: [
          {
            internalType: "bool",
            name: "",
            type: "bool",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "bytes",
            name: "performData",
            type: "bytes",
          },
        ],
        name: "performUpkeep",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [],
        name: "platformFee",
        outputs: [
          {
            internalType: "uint256",
            name: "",
            type: "uint256",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "uint256",
            name: "_assetId",
            type: "uint256",
          },
          {
            internalType: "enum PricePredictionGame.Direction",
            name: "_direction",
            type: "uint8",
          },
          {
            internalType: "uint256",
            name: "_betAmount",
            type: "uint256",
          },
        ],
        name: "predict",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "",
            type: "uint256",
          },
        ],
        name: "predictions",
        outputs: [
          {
            internalType: "address",
            name: "player",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "assetId",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "roundId",
            type: "uint256",
          },
          {
            internalType: "enum PricePredictionGame.Direction",
            name: "direction",
            type: "uint8",
          },
          {
            internalType: "uint256",
            name: "betAmount",
            type: "uint256",
          },
          {
            internalType: "bool",
            name: "claimed",
            type: "bool",
          },
          {
            internalType: "bool",
            name: "exists",
            type: "bool",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "renounceOwnership",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "uint256",
            name: "",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "",
            type: "address",
          },
        ],
        name: "roundParticipants",
        outputs: [
          {
            internalType: "bool",
            name: "",
            type: "bool",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "uint256",
            name: "",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "",
            type: "uint256",
          },
        ],
        name: "rounds",
        outputs: [
          {
            internalType: "uint256",
            name: "id",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "startTime",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "lockTime",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "endTime",
            type: "uint256",
          },
          {
            internalType: "int256",
            name: "lockPrice",
            type: "int256",
          },
          {
            internalType: "int256",
            name: "closePrice",
            type: "int256",
          },
          {
            internalType: "uint256",
            name: "totalPool",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "upBets",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "downBets",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "upAmount",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "downAmount",
            type: "uint256",
          },
          {
            internalType: "enum PricePredictionGame.RoundStatus",
            name: "status",
            type: "uint8",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "uint256",
            name: "_assetId",
            type: "uint256",
          },
          {
            internalType: "bool",
            name: "_isActive",
            type: "bool",
          },
        ],
        name: "setAssetStatus",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "uint256",
            name: "_minAmount",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "_maxAmount",
            type: "uint256",
          },
        ],
        name: "setBetLimits",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "uint256",
            name: "_fee",
            type: "uint256",
          },
        ],
        name: "setPlatformFee",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [],
        name: "totalFeesCollected",
        outputs: [
          {
            internalType: "uint256",
            name: "",
            type: "uint256",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "newOwner",
            type: "address",
          },
        ],
        name: "transferOwnership",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [],
        name: "unpause",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "uint256",
            name: "_assetId",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "_newPriceFeed",
            type: "address",
          },
        ],
        name: "updateAssetPriceFeed",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [],
        name: "usdtToken",
        outputs: [
          {
            internalType: "contract IERC20",
            name: "",
            type: "address",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "uint256",
            name: "_amount",
            type: "uint256",
          },
        ],
        name: "withdrawFees",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
    ],
  },
} as const;
const abi = {
  prediction: {
    address: "",
    abi: [],
  },
};

export default testnetAbi;
