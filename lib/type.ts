export type PredictionType = {
  asset: string;
  direction: string;
  amount: string;
  status: string;
  startPrice: string;
  reward?: string;
  timeLeft?: string;
};

export type RoundData = {
  assetId: number;
  roundId: number;
  status: "Pending" | "Live" | "Ended" | "Cancelled";
  lockPrice: number;
  currentPrice: number;
  timeLeft: number;
};
