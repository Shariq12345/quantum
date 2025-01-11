"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { BarData, createChart } from "lightweight-charts";

interface StockIdPageProps {
  params: { stockId: string };
}

const StockIdPage = ({ params }: StockIdPageProps) => {
  const [chartData, setChartData] = useState<any[]>([]);
  const [timeFrame, setTimeFrame] = useState("5Min"); // Default timeframe
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const crosshairInfoRef = useRef<HTMLDivElement>(null); // To display the crosshair info
  const router = useRouter();
  //@ts-ignore
  const { stockId } = React.use(params); // Get the stockId from the URL

  // Fetch stock data based on symbol and timeframe
  const fetchStockData = async (symbol: string, timeFrame: string) => {
    try {
      const options = {
        method: "GET",
        url: `https://data.alpaca.markets/v2/stocks/bars?symbols=${symbol}&timeframe=1D&start=2024-08-01T00%3A00%3A00Z&end=2025-01-11T00%3A00%3A00Z&limit=1000&adjustment=raw&feed=sip&sort=asc`,
        headers: {
          accept: "application/json",
          "APCA-API-KEY-ID": "PK37Y096H88LC39XDCGT",
          "APCA-API-SECRET-KEY": "WFNKWsozTcdBeRfL3xbHUo4o8nmTkEgqCnP9aIIV",
        },
      };

      const response = await axios.request(options);
      const stockBars = response.data.bars[symbol];

      const formattedData = stockBars.map((bar: any) => ({
        time: new Date(bar.t).getTime() / 1000, // Convert to UNIX timestamp
        open: bar.o,
        high: bar.h,
        low: bar.l,
        close: bar.c,
        volume: bar.v,
      }));

      setChartData(formattedData);
    } catch (error) {
      console.error("Error fetching stock data:", error);
    }
  };

  // Initialize the chart only once and update data when it changes
  useEffect(() => {
    if (chartContainerRef.current && stockId) {
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

      // Fetch the stock data only once when the component mounts
      fetchStockData(stockId as string, timeFrame);

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
  }, [stockId, timeFrame, chartData]); // Re-run only if stockId or timeFrame changes

  // Handle time frame change
  const handleTimeFrameChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedTimeFrame = e.target.value;
    setTimeFrame(selectedTimeFrame);
    fetchStockData(stockId as string, selectedTimeFrame);
  };

  return (
    <div className="min-h-screen text-black p-6 pt-[100px]">
      <div className="max-w-7xl mx-auto space-y-4">
        <h1 className="text-3xl font-extrabold">Stock Chart: {stockId}</h1>

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

export default StockIdPage;
