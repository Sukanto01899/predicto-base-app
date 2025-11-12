import React from "react";
import SingleHistory from "../main/SingleHistory";

const myPredictions = [
  {
    asset: "BTC",
    direction: "UP",
    amount: "10",
    status: "active",
    timeLeft: "45m",
    startPrice: "96,500",
  },
  {
    asset: "ETH",
    direction: "DOWN",
    amount: "5",
    status: "won",
    reward: "9.2",
    startPrice: "3,480",
  },
  {
    asset: "LINK",
    direction: "UP",
    amount: "15",
    status: "lost",
    startPrice: "23.80",
  },
];

const History = () => {
  return (
    <div className="p-4 space-y-3 max-w-2xl mx-auto">
      <h2 className="text-blue-300 text-xs font-semibold uppercase tracking-wide">
        My Predictions
      </h2>

      {myPredictions.map((pred, idx) => (
        <SingleHistory pred={pred} idx={idx} key={idx} />
      ))}
    </div>
  );
};

export default History;
