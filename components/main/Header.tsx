import {
  Address,
  Avatar,
  EthBalance,
  Identity,
  Name,
} from "@coinbase/onchainkit/identity";
import {
  Wallet,
  WalletDropdown,
  WalletDropdownBasename,
  WalletDropdownDisconnect,
} from "@coinbase/onchainkit/wallet";
import { Zap } from "lucide-react";
import React from "react";
import { useAccount, useConnect, useDisconnect, useSwitchChain } from "wagmi";
import ConnectedWallet from "../common/ConnectWallet";

const Header = () => {
  const { isConnected, address, chainId } = useAccount();
  const { disconnect } = useDisconnect();
  const { switchChain, isPending: switching } = useSwitchChain();
  const { connect, isPending: connecting } = useConnect();
  return (
    <div className="bg-primary border-b border-blue-700/30 px-4 py-2 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-linear-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center animate-pulse">
          <Zap className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-white font-bold text-lg">Predicto</h1>
          <p className="text-blue-300 text-xs">Win Big, Predict Right!</p>
        </div>
      </div>
      <div className="flex items-center gap-2 bg-blue-900/50 px-3 py-1.5 rounded-full border border-blue-600/30">
        {/* <Wallet>
          <ConnectWallet>
            <Avatar className="h-2 w-2" />
            <Name />
          </ConnectWallet>
          <WalletDropdown>
            <Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick>
              <Avatar />
              <Name />
              <Address className="text-white" />
              <EthBalance />
            </Identity>
            <WalletDropdownBasename />
            <WalletDropdownDisconnect />
          </WalletDropdown>
        </Wallet> */}
        <ConnectedWallet />
        {/* <Wallet className="w-4 h-4 text-blue-400" />
        <span className="text-white font-semibold text-sm">1,250</span> */}
      </div>
    </div>
  );
};

export default Header;
