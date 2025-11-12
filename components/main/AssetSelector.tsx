import { assets as assetDetails } from "@/lib/constants";
import { RoundData } from "@/lib/type";
import React from "react";

type AssetSelectorProps = {
  setSelectedAsset: (asset: RoundData) => void;
  selectedAsset: RoundData;
  assets: { btc: RoundData; eth: RoundData };
};

const AssetSelector = ({
  setSelectedAsset,
  selectedAsset,
  assets,
}: AssetSelectorProps) => {
  return (
    <div className="bg-primary rounded-xl p-2 border border-blue-700/30 flex gap-2">
      {Object.keys(assetDetails).map((assetKey) => {
        const id = assetDetails[assetKey as "BTC" | "ETH"].id;
        return (
          <button
            key={id}
            onClick={() =>
              id === 1
                ? setSelectedAsset(assets.btc)
                : setSelectedAsset(assets.eth)
            }
            className={`flex-1 py-2 px-3 rounded-lg font-semibold text-sm transition-all ${
              selectedAsset.assetId === id
                ? "bg-indigo-400 text-white shadow-lg"
                : "text-indigo-300 hover:bg-blue-800/50"
            }`}
          >
            {assetKey}
          </button>
        );
      })}
    </div>
  );
};

export default AssetSelector;
