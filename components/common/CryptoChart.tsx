"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
} from "chart.js";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip
);

const ranges = {
  "1H": 1 / 24,
  "6H": 6 / 24,
  "1D": 1,
  "1W": 7,
  "1M": 30,
};

type DataType = {
  time: number;
  price: number;
};

export default function CryptoChart({ currency }: { currency: string }) {
  const [data, setData] = useState<DataType[] | []>([]);
  const [range, setRange] = useState("1D");
  const [loading, setLoading] = useState(true);
  const [, setCurrentPrice] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Use CoinGecko free public API
      const res = await axios.get(
        `https://api.coingecko.com/api/v3/coins/${currency.toLowerCase()}/market_chart?vs_currency=usd&days=${
          ranges[range as "1H" | "6H" | "1D" | "1W" | "1M"]
        }`
      );

      const prices = res.data.prices.map((p) => ({
        time: new Date(p[0]).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        price: p[1],
      }));

      setData(prices);
      setCurrentPrice(prices[prices.length - 1].price);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching chart data:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [range, currency]);

  const chartData = {
    labels: data.map((d) => d.time),
    datasets: [
      {
        data: data.map((d) => d.price),
        borderColor: "#fff",
        borderWidth: 2,
        pointRadius: 0,
        tension: 0.3,
        fill: false,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      tooltip: {
        backgroundColor: "#FF5A1F",
        titleColor: "#fff",
        bodyColor: "#fff",
        displayColors: false,
        padding: 10,
        cornerRadius: 10,
        callbacks: {
          label: (ctx: { formattedValue: string }) => `$${ctx.formattedValue}`,
        },
      },
      legend: { display: true },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { display: false },
      },
      y: {
        grid: { display: false },
        ticks: { display: false },
      },
    },
  };

  return (
    <div className="w-full h-full mx-auto">
      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : (
        <Line data={chartData} options={chartOptions} height={150} />
      )}

      <div className="flex justify-center mt-2 space-x-2 absolute bottom-2 left-1/2 transform -translate-x-1/2">
        {Object.keys(ranges).map((r) => (
          <button
            key={r}
            onClick={() => setRange(r)}
            className={`px-3 py-1 rounded-full text-sm ${
              range === r
                ? "bg-primary text-white"
                : "bg-secondary/20 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {r}
          </button>
        ))}
      </div>
    </div>
  );
}
