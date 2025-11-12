import { Wallet } from "lucide-react";
import React, { ReactNode } from "react";

type ButtonProps = {
  children: ReactNode;
  onClick?: () => void;
};

const Button = ({ children, onClick }: ButtonProps) => {
  return (
    <button
      className="flex items-center gap-2 cursor-pointer"
      onClick={onClick}
    >
      <Wallet className="w-4 h-4 text-blue-400" />
      <span className="text-white font-semibold text-sm">{children}</span>
    </button>
  );
};

export default Button;
