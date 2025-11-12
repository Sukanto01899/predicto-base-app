import { assets } from "@/lib/constants";
import { RoundData } from "@/lib/type";
import { TrendingDown, TrendingUp } from "lucide-react";
import React, { useState } from "react";

type PredictionButtonsProps = {
  selectedAsset: RoundData;
  setPrediction: (dir: "up" | "down" | null) => void;
  prediction: "up" | "down" | null;
};

const PredictionButtons = ({
  selectedAsset,
  setPrediction,
  prediction,
}: PredictionButtonsProps) => {
  const [activeTab, setActiveTab] = useState("play");
  const [isAnimating, setIsAnimating] = useState(false);
  const assetId = Object.keys(assets).find(
    (key) => assets[key as "BTC" | "ETH"].id === selectedAsset.assetId
  );
  const currentAsset = assets[assetId as "BTC" | "ETH"];
  const handlePrediction = (dir: "up" | "down" | null) => {
    setIsAnimating(true);
    setPrediction(dir);
    setTimeout(() => {
      setIsAnimating(false);
      setActiveTab("history");
    }, 1000);
  };
  return (
    <div className="flex justify-between gap-3 pb-4">
      <button
        onClick={() => handlePrediction("up")}
        className={`flex-1 flex items-center gap-2 justify-center text-center bg-linear-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-green-500/20 transition-all transform hover:scale-105 ${
          isAnimating && prediction === "up" ? "animate-pulse scale-105" : ""
        }`}
      >
        <TrendingUp className="w-5 h-5" />
        <p className="text-xl">UP</p>
        <p className="text-sm opacity-90">{currentAsset.upOdds}</p>
      </button>
      <button
        onClick={() => handlePrediction("down")}
        className={`flex-1 flex items-center justify-center gap-2 text-center bg-linear-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-red-500/20 transition-all transform hover:scale-105 ${
          isAnimating && prediction === "down" ? "animate-pulse scale-105" : ""
        }`}
      >
        <TrendingDown className="w-5 h-5" />
        <p className="text-xl">DOWN</p>
        <p className="text-sm opacity-90">{currentAsset.downOdds}</p>
      </button>
    </div>
  );
};

export default PredictionButtons;
