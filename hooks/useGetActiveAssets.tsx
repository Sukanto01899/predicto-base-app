import testnetAbi from "@/contracts/sol/abi";
import { useReadContract } from "wagmi";

const useGetActiveAssets = () => {
  const { data: activeAssets, isLoading } = useReadContract({
    address: testnetAbi.prediction.address,
    abi: testnetAbi.prediction.abi,
    functionName: "getActiveAssets",
  });

  console.log(activeAssets);
  return { activeAssets };
};

export default useGetActiveAssets;
