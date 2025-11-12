import React from "react";
import { baseSepolia } from "viem/chains";
import { farcasterMiniApp as miniAppConnector } from "@farcaster/miniapp-wagmi-connector";
import {
  useAccount,
  useChainId,
  useConnect,
  useDisconnect,
  useSwitchChain,
} from "wagmi";
import Button from "./Button";
import { Power } from "lucide-react";

const ConnectedWallet = () => {
  const { isConnected, address, chainId } = useAccount();
  const { disconnect } = useDisconnect();
  const { switchChain, isPending: switching } = useSwitchChain();
  const { connect, isPending: connecting } = useConnect();

  if (isConnected) {
    return chainId === baseSepolia.id ? (
      <Button>
        {`${address?.slice(0, 4)}...${address?.slice(
          address.length - 3,
          address.length
        )}`}{" "}
        {/* <Power
          className="cursor-pointer text-red-500"
          size={20}
          onClick={() => disconnect()}
        /> */}
      </Button>
    ) : (
      <Button onClick={() => switchChain({ chainId: baseSepolia.id })}>
        {switching ? "Switching" : "Switch chain"}
      </Button>
    );
  }

  if (!isConnected) {
    return (
      <Button onClick={() => connect({ connector: miniAppConnector() })}>
        {connecting ? "Connecting..." : "Connect"}
      </Button>
    );
  }

  return <Button>Only For Warpcast</Button>;
};

export default ConnectedWallet;
