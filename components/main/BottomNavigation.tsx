import { Gamepad2, History } from "lucide-react";
import React from "react";

const BottomNavigation = ({
  activeTab,
  setActiveTab,
}: {
  activeTab: "play" | "history";
  setActiveTab: (tab: "play" | "history") => void;
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-blue-950/90 backdrop-blur-md border-t border-blue-700/30 px-4 py-3 flex gap-2">
      <button
        onClick={() => setActiveTab("play")}
        className={`flex-1 py-3 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
          activeTab === "play"
            ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
            : "text-blue-300 hover:bg-blue-900/50"
        }`}
      >
        <Gamepad2 className="w-5 h-5" />
        <span>Play</span>
      </button>
      <button
        onClick={() => setActiveTab("history")}
        className={`flex-1 py-3 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
          activeTab === "history"
            ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
            : "text-blue-300 hover:bg-blue-900/50"
        }`}
      >
        <History className="w-5 h-5" />
        <span>History</span>
      </button>
    </div>
  );
};

export default BottomNavigation;
