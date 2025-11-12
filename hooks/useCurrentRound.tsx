"use client";
import { useReadContract } from "wagmi";
import { formatUnits } from "viem";
import { useMemo } from "react";
import testnetAbi from "@/contracts/sol/abi";

// ✅ Custom Hook
export function useCurrentRound(assetId: number) {
  const { data, isLoading, isError, refetch } = useReadContract({
    address: testnetAbi.prediction.address,
    abi: testnetAbi.prediction.abi,
    functionName: "getCurrentRound",
    args: [BigInt(assetId)],
  });

  // 🧠 Format the returned data
  const formatted = useMemo(() => {
    if (!data) return null;

    const [
      roundId,
      status,
      lockPrice,
      currentPrice,
      totalPool,
      upAmount,
      downAmount,
      timeLeft,
    ] = data;

    return {
      roundId: Number(roundId),
      status: Number(status), // 0 = Pending, 1 = Live, 2 = Ended, 3 = Cancelled
      lockPrice: Number(formatUnits(lockPrice, 8)),
      currentPrice: Number(formatUnits(currentPrice, 8)),
      totalPool: Number(formatUnits(totalPool, 6)), // USDT 6 decimals
      upAmount: Number(formatUnits(upAmount, 6)),
      downAmount: Number(formatUnits(downAmount, 6)),
      timeLeft: Number(timeLeft),
    };
  }, [data]);

  return {
    currentRoundData: formatted,
    isLoading,
    isError,
    refetch,
  };
}
