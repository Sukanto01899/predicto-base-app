import { PredictionType } from "@/lib/type";
import { ArrowDown, ArrowUp } from "lucide-react";
import React from "react";

type SingleHistoryType = {
  idx: number;
  pred: PredictionType;
};

const SingleHistory = ({ idx, pred }: SingleHistoryType) => {
  return (
    <div
      className="bg-primary rounded-xl p-4 border border-blue-700/30 animate-fadeIn"
      style={{ animationDelay: `${idx * 100}ms` }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm">{pred.asset}</span>
          </div>
          <div>
            <p className="text-white font-semibold">{pred.asset}</p>
            <div className="flex items-center gap-1">
              {pred.direction === "UP" ? (
                <ArrowUp className="w-3 h-3 text-green-400" />
              ) : (
                <ArrowDown className="w-3 h-3 text-red-400" />
              )}
              <span
                className={`text-xs font-semibold ${
                  pred.direction === "UP" ? "text-green-400" : "text-red-400"
                }`}
              >
                {pred.direction}
              </span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <p className="text-white font-bold">{pred.amount} USDT</p>
          <p className="text-blue-400 text-xs">${pred.startPrice}</p>
        </div>
      </div>

      <div className="bg-blue-950/50 rounded-lg p-2 mb-3">
        {pred.status === "active" && (
          <p className="text-blue-300 text-xs text-center">
            ⏱ Ends in {pred.timeLeft}
          </p>
        )}
        {pred.status === "won" && (
          <p className="text-green-400 text-xs text-center font-semibold">
            ✓ Won +{pred.reward} USDT
          </p>
        )}
        {pred.status === "lost" && (
          <p className="text-red-400 text-xs text-center font-semibold">
            ✗ Lost -{pred.amount} USDT
          </p>
        )}
      </div>

      {pred.status === "active" ? (
        <button className="w-full bg-blue-800/50 text-blue-300 text-sm font-semibold py-2 rounded-lg border border-blue-600/30">
          Waiting for result...
        </button>
      ) : pred.status === "won" ? (
        <button className="w-full bg-green-500/20 hover:bg-green-500/30 text-green-400 text-sm font-semibold py-2 rounded-lg border border-green-500/30 transition-all">
          Claim Reward
        </button>
      ) : (
        <button className="w-full bg-red-500/10 text-red-400 text-sm font-semibold py-2 rounded-lg border border-red-500/30 cursor-not-allowed">
          Better luck next time
        </button>
      )}
    </div>
  );
};

export default SingleHistory;
