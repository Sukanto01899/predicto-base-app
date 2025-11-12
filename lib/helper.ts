import { assets } from "./constants";

export const formatTime = (seconds: number) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${h}:${m.toString().padStart(2, "0")}:${s
    .toString()
    .padStart(2, "0")}`;
};

export const getAssetById = (id: number) => {
  const assetId = Object.keys(assets).find(
    (key) => assets[key as "BTC" | "ETH"].id === id
  );
  const currentAsset = assets[assetId as "BTC" | "ETH"];
  return currentAsset;
};
