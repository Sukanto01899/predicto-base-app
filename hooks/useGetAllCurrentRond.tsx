import { useMemo } from "react";
import { useReadContract } from "wagmi";
import testnetAbi from "@/contracts/sol/abi";

/**
 * Custom hook to fetch all current BTC & ETH rounds
 */
export function useAllCurrentRounds() {
  const { data, isLoading, error, refetch } = useReadContract({
    address: testnetAbi.prediction.address,
    abi: testnetAbi.prediction.abi,
    functionName: "getAllCurrentRounds",
  });

  const { btc, eth } = useMemo(() => {
    if (!data) return { btc: null, eth: null };

    const [assetIds, roundIds, statuses, lockPrices, currentPrices, timesLeft] =
      data as [bigint[], bigint[], number[], bigint[], bigint[], bigint[]];

    const statusMap: Record<
      number,
      "Pending" | "Live" | "Ended" | "Cancelled"
    > = {
      0: "Pending",
      1: "Live",
      2: "Ended",
      3: "Cancelled",
    };

    const roundObjects = assetIds.map((id, index) => ({
      assetId: Number(id),
      roundId: Number(roundIds[index]),
      status: statusMap[Number(statuses[index])],
      lockPrice: Number(lockPrices[index]),
      currentPrice: Number(currentPrices[index]),
      timeLeft: Number(timesLeft[index]),
    }));

    // 🧠 Map to readable names
    const btcRound = roundObjects.find((r) => r.assetId === 1) || null;
    const ethRound = roundObjects.find((r) => r.assetId === 2) || null;

    return { btc: btcRound, eth: ethRound };
  }, [data]);

  console.log({ btc, eth, data, error });

  return {
    btc,
    eth,
    isLoading,
    error,
    refetch,
  };
}
