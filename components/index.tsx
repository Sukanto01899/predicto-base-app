import React, { useState, useEffect } from "react";
import { History, Gamepad2 } from "lucide-react";
import Play from "./tab/Play";
import HistoryTab from "./tab/History";
import Header from "./main/Header";

export default function PricePredictionGame() {
  const [activeTab, setActiveTab] = useState("play");

  const [timeLeft, setTimeLeft] = useState(3600);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft]);

  return (
    <div className="h-screen max-w-[800px] min-w-full bg-linear-to-br from-indigo-100 via-indigo-200 to-indigo-300 flex flex-col overflow-hidden">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto pb-32">
        {activeTab === "play" && <Play />}

        {activeTab === "history" && <HistoryTab />}
      </div>

      {/* Bottom Navigation */}
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
    </div>
  );
}
