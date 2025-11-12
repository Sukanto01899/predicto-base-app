import { useCurrentRound } from "@/hooks/useCurrentRound";
import { ArrowDown, TrendingDown, TrendingUp, X } from "lucide-react";
import React, { useEffect, useState } from "react";

type BetAmountProps = {
  setPrediction: (dir: "up" | "down" | null) => void;
  prediction: "up" | "down" | null;
  assetId: number;
};

const BetAmount = ({ prediction, setPrediction, assetId }: BetAmountProps) => {
  const [betAmount, setBetAmount] = useState("1");
  const [betReward, setBetReward] = useState<number | null>(null);
  const { currentRoundData } = useCurrentRound(assetId);

  useEffect(() => {
    if (!currentRoundData || !betAmount || parseFloat(betAmount) <= 0) {
      setBetReward(0);
      return;
    }

    const bet = parseFloat(betAmount);
    const feePercent = 5;
    const direction = prediction; // 'up' or 'down'

    // Simulate new pool after user adds their bet
    const newTotalPool = currentRoundData.totalPool + bet;
    const newUpAmount =
      direction === "up"
        ? currentRoundData.upAmount + bet
        : currentRoundData.upAmount;
    const newDownAmount =
      direction === "down"
        ? currentRoundData.downAmount + bet
        : currentRoundData.downAmount;

    const poolAfterFee = newTotalPool * (1 - feePercent / 100);

    const userSideAmount = direction === "up" ? newUpAmount : newDownAmount;
    const oppositeSideAmount = direction === "up" ? newDownAmount : newUpAmount;

    let reward = 0;
    let profit = 0;

    // 🧩 Handle first user case (no opposite bets)
    if (oppositeSideAmount === 0) {
      // assume virtual opposite bets equal to user’s amount
      const virtualTotalPool = bet * 2;
      const virtualPoolAfterFee = virtualTotalPool * (1 - feePercent / 100);

      reward = (virtualPoolAfterFee * bet) / bet; // fair 1:1 odds
      profit = reward - bet;
    } else {
      const winningAmount = userSideAmount;
      reward = (poolAfterFee * bet) / winningAmount;
      profit = reward - bet;
    }

    // Clamp negatives
    if (profit < 0) profit = 0;

    setBetReward(reward);
  }, [currentRoundData, betAmount, prediction]);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 ">
      <div className="space-y-2 bg-primary animate-fadeIn rounded-xl p-4  max-w-md w-full transform relative shadow-2xl shadow-blue-950">
        <span
          onClick={() => setPrediction(null)}
          className="absolute right-3 top-3 text-red-400 p-1 font-bold cursor-pointer"
        >
          <X size={24} />
        </span>
        <h2 className="text-indigo-100 text-lg text-center font-semibold uppercase tracking-wide">
          Bet Amount (USDT)
        </h2>
        <div className=" ">
          <input
            type="number"
            value={betAmount}
            onChange={(e) => setBetAmount(e.target.value)}
            min="0.1"
            max="1000"
            step="0.1"
            className="w-full bg-secondary text-white text-2xl font-bold text-center rounded-lg p-3 border border-blue-600/30 focus:outline-none focus:border-blue-400"
          />
          <div className="flex justify-center items-center w-full my-1">
            <span className="h-8 w-8 flex justify-center items-center">
              <ArrowDown className="text-white text-xl font-bold" />
            </span>
          </div>
          <div className="flex justify-between items-center w-full p-2 bg-secondary text-white font-semibold rounded-lg">
            <span className="text-sm">If you&apos;re right:</span>
            <span className="text-lg text-green-300">
              ${betReward?.toFixed(2)}
            </span>
          </div>
          <div className="flex gap-2 mt-3">
            {["0.1", "1", "10", "50", "100"].map((amount) => (
              <button
                key={amount}
                onClick={() => setBetAmount(amount)}
                className="flex-1 bg-secondary hover:bg-indigo-700/50 text-indigo-100 text-xs font-semibold py-2 rounded-lg border border-blue-600/30 transition-all"
              >
                {amount}
              </button>
            ))}
          </div>

          <button
            className={`flex items-center justify-center gap-2 w-full mt-4 text-center bg-linear-to-br  text-white font-bold py-4 rounded-xl shadow-lg shadow-red-500/20 transition-all transform hover:scale-105 ${
              prediction === "down"
                ? "from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
                : "from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
            }`}
          >
            {prediction === "down" ? (
              <TrendingDown className="w-5 h-5" />
            ) : (
              <TrendingUp className="w-5 h-5" />
            )}
            <p className="text-xl">{prediction}</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BetAmount;
