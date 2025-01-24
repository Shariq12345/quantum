"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { BarData, createChart } from "lightweight-charts";

interface CryptoIdPageProps {
  params: { cryptoId: string };
}

const CryptoIdPage = ({ params }: CryptoIdPageProps) => {
  const [chartData, setChartData] = useState<any[]>([]);
  const [timeFrame, setTimeFrame] = useState("5Min"); // Default timeframe
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const crosshairInfoRef = useRef<HTMLDivElement>(null); // To display the crosshair info
  const router = useRouter();
  //@ts-ignore
  const { cryptoId } = React.use(params); // Get the cryptoId from the URL

  // Fetch crypto data based on symbol and timeframe
  const fetchCryptoData = async (symbol: string, timeFrame: string) => {
    try {
      const formattedSymbol = `${symbol}/USD`; // Append USD suffix dynamically
      const encodedSymbol = encodeURIComponent(formattedSymbol);

      // console.log("Encoded Symbol:", encodedSymbol);
      const options = {
        method: "GET",
        url: `https://data.alpaca.markets/v1beta3/crypto/us/bars?symbols=${encodedSymbol}&timeframe=5Min&limit=1000&sort=asc`,
        headers: {
          accept: "application/json",
        },
      };

      const response = await axios.request(options);
      const cryptoBars = response.data.bars[symbol];

      const formattedData = cryptoBars.map((bar: any) => ({
        time: new Date(bar.t).getTime() / 1000, // Convert to UNIX timestamp
        open: bar.o,
        high: bar.h,
        low: bar.l,
        close: bar.c,
        volume: bar.v,
      }));

      setChartData(formattedData);
    } catch (error) {
      console.error("Error fetching crypto data:", error);
    }
  };

  // Initialize the chart only once and update data when it changes
  useEffect(() => {
    if (chartContainerRef.current && cryptoId) {
      // Initialize the chart
      const chart = createChart(chartContainerRef.current, {
        width: chartContainerRef.current.clientWidth,
        height: 500,
        layout: {
          background: { color: "#212121" }, // Background color
          textColor: "#D9D9D9", // Text color
        },
        grid: {
          vertLines: {
            color: "#404040",
          },
          horzLines: {
            color: "#404040",
          },
        },
        crosshair: {
          mode: 1, // Enable crosshair on the chart
        },
        rightPriceScale: {
          borderColor: "#485c7b",
        },
        timeScale: {
          borderColor: "#485c7b",
          visible: true, // Ensure the time scale is visible
        },
        // handleScroll: true,
        // handleScale: true,
      });

      //   chart.timeScale().fitContent();
      //   chart.applyOptions({
      //     handleScroll: {
      //       mouseWheel: true,
      //       pressedMouseMove: true,
      //       horzTouchDrag: true,
      //     },
      //     handleScale: {
      //       axisPressedMouseMove: {
      //         time: true,
      //         price: true,
      //       },
      //       mouseWheel: true,
      //       pinch: true,
      //     },
      //   });

      // Add a candlestick series to the chart
      const candlestickSeries = chart.addCandlestickSeries({
        upColor: "#4fff50",
        borderUpColor: "#4fff50",
        wickUpColor: "#4fff50",
        downColor: "#ff4976",
        borderDownColor: "#ff4976",
        wickDownColor: "#ff4976",
      });

      // Fetch the crypto data only once when the component mounts
      fetchCryptoData(cryptoId as string, timeFrame as string);

      // Update the chart with new data when chartData is available
      if (chartData.length > 0) {
        candlestickSeries.setData(chartData);
      }

      // Subscribe to crosshair move to display the open, high, low, close values
      chart.subscribeCrosshairMove((param) => {
        if (!param.time || param.seriesData === undefined) return;

        const price = param.seriesData.get(candlestickSeries);
        if (price) {
          const { open, high, low, close } = price as BarData;
          if (crosshairInfoRef.current) {
            crosshairInfoRef.current.innerHTML = `
              <div>Open: ${open.toFixed(2)}</div>
              <div>High: ${high.toFixed(2)}</div>
              <div>Low: ${low.toFixed(2)}</div>
              <div>Close: ${close.toFixed(2)}</div>
            `;
          }
        }
      });

      // Cleanup chart when component unmounts
      return () => {
        chart.remove();
      };
    }
  }, [cryptoId, timeFrame, chartData]); // Re-run only if cryptoId or timeFrame changes

  // Handle time frame change
  const handleTimeFrameChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedTimeFrame = e.target.value;
    setTimeFrame(selectedTimeFrame);
    fetchCryptoData(cryptoId as string, selectedTimeFrame);
  };

  return (
    <div className="min-h-screen text-black p-6 pt-[100px]">
      <div className="max-w-7xl mx-auto space-y-4">
        <h1 className="text-3xl font-extrabold">Crypto Chart: {cryptoId}</h1>

        {/* Time Frame Selector */}
        <div className="flex items-center gap-4">
          {/* <label htmlFor="timeframe" className="text-sm">
            Select Time Frame:
          </label>
          <select
            id="timeframe"
            value={timeFrame}
            onChange={handleTimeFrameChange}
            className="bg-gray-800 text-white p-2 rounded"
          >
            <option value="1Min">1 Min</option>
            <option value="5Min">5 Min</option>
            <option value="15Min">15 Min</option>
            <option value="1Hour">1 Hour</option>
            <option value="1Day">1 Day</option>
          </select> */}
        </div>

        {/* Crosshair Information */}
        <div
          ref={crosshairInfoRef}
          className="text-sm flex gap-x-2 text-black mt-4"
        ></div>

        {/* Chart Container */}
        <div
          ref={chartContainerRef}
          className="w-full h-[500px] bg-black rounded-lg"
        ></div>
      </div>
    </div>
  );
};

export default CryptoIdPage;
