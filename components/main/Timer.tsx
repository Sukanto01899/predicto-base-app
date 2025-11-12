import { formatTime } from "@/lib/helper";
import { Clock } from "lucide-react";
import React, { useEffect, useState } from "react";

const Timer = ({ timeLeft }: { timeLeft: number }) => {
  const initial = Math.max(0, timeLeft ?? 0);
  const [remaining, setRemaining] = useState<number>(initial);

  // when the incoming prop changes, reset the remaining counter
  useEffect(() => {
    setRemaining(Math.max(0, timeLeft ?? 0));
  }, [timeLeft]);

  // decrement remaining every second; if remaining is 0 we don't start the interval
  useEffect(() => {
    if (remaining <= 0) return;
    const id = setInterval(() => {
      setRemaining((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(id);
  }, [remaining]);

  return (
    <div className="bg-primary rounded-xl p-2 border border-blue-700/30 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Clock className="w-5 h-5 text-indigo-200" />
        <span className="text-blue-100 text-sm">CLOSES IN</span>
      </div>
      <span className="text-white font-bold">{formatTime(remaining)}</span>
    </div>
  );
};

export default Timer;
