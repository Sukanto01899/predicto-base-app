import React, { useEffect, useState } from "react";
import AssetSelector from "../main/AssetSelector";
import AssetInfoCard from "../main/AssetInfoCard";
import Timer from "../main/Timer";
// import BetAmount from "../main/BetAmount";
import PredictionButtons from "../main/PredictionButtons";
import { useAllCurrentRounds } from "@/hooks/useGetAllCurrentRond";
import { RoundData } from "@/lib/type";
import BetAmount from "../main/BetAmount";

const Play = () => {
  const { btc, eth, isLoading } = useAllCurrentRounds();
  const [selectedAsset, setSelectedAsset] = useState<RoundData | null>(null);
  const [prediction, setPrediction] = useState<"up" | "down" | null>(null);

  useEffect(() => {
    if (btc && !selectedAsset) {
      setSelectedAsset(btc);
    }
  }, [btc, selectedAsset]);

  return (
    <div className="p-4 space-y-2 max-w-2xl mx-auto">
      {isLoading && <h1>Loading...</h1>}
      {selectedAsset && btc && eth && (
        <AssetSelector
          setSelectedAsset={setSelectedAsset}
          selectedAsset={selectedAsset}
          assets={{ btc, eth }}
        />
      )}
      {selectedAsset && <AssetInfoCard selectedAsset={selectedAsset} />}
      {selectedAsset && <Timer timeLeft={selectedAsset?.timeLeft} />}
      {/* <BetAmount /> */}
      {selectedAsset && (
        <PredictionButtons
          prediction={prediction}
          setPrediction={setPrediction}
          selectedAsset={selectedAsset}
        />
      )}

      {prediction && selectedAsset && (
        <BetAmount
          assetId={selectedAsset.assetId}
          setPrediction={setPrediction}
          prediction={prediction}
        />
      )}
    </div>
  );
};

export default Play;
