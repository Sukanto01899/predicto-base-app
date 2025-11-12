import React from "react";
import CryptoChart from "../common/CryptoChart";
import { RoundData } from "@/lib/type";
import { getAssetById } from "@/lib/helper";
import { formatUnits } from "viem";
import Image from "next/image";

const AssetInfoCard = ({ selectedAsset }: { selectedAsset: RoundData }) => {
  const currentAsset = getAssetById(selectedAsset.assetId);
  const price = Number(
    formatUnits(BigInt(selectedAsset.lockPrice), 8)
  ).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <div className="bg-primary rounded-xl p-2 border border-blue-700/30">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full flex items-center justify-center">
            <Image src={currentAsset.logo} alt="logo" width={50} height={50} />
          </div>
          <div>
            <p className="text-white font-semibold text-lg">
              🔥 {currentAsset.symbol} above{" "}
              <span className="font-bold">${price}</span> when time’s up?
            </p>
            <p className="text-indigo-100 text-xs">Baseline Price: ${price}</p>
          </div>
        </div>
      </div>

      {/* Simple Price Chart */}
      <div className="bg-secondary backdrop-blur-sm rounded-lg h-44 p-2 relative">
        <CryptoChart currency={currentAsset.name} />
      </div>
    </div>
  );
};

export default AssetInfoCard;
