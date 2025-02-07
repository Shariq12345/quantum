"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { type BarData, createChart } from "lightweight-charts";
import TradingPanel from "./trading-panel";
import { Fundamentals } from "./fundamentals";
import { OptionPanel } from "./option-panel";
import { NewsFeed } from "./news-feed";

interface StockIdPageProps {
  params: { stockId: string };
}

const StockIdPage = ({ params }: StockIdPageProps) => {
  const [chartData, setChartData] = useState<any[]>([]);
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const crosshairInfoRef = useRef<HTMLDivElement>(null); // To display the crosshair info
  const router = useRouter();
  //@ts-ignore
  const { stockId } = React.use(params); // Get the stockId from the URL
  const [currentPrice, setCurrentPrice] = useState<number>(0);
  const [openPrice, setOpenPrice] = useState<number>(0);
  const [previousClose, setPreviousClose] = useState<number>(0);
  const [volume, setVolume] = useState<number>(0);

  const [latestCurrentPrice, setLatestCurrentPrice] = useState<number>(0);
  const [latestOpenPrice, setLatestOpenPrice] = useState<number>(0);
  const [latestPreviousClose, setLatestPreviousClose] = useState<number>(0);
  const [latestVolume, setLatestVolume] = useState<number>(0);

  const [companyName, setCompanyName] = useState<string>("");

  // Helper function to get the current date at midnight in ISO format
  const getMidnightISODate = () => {
    const now = new Date(); // Get the current date and time
    now.setUTCHours(0, 0, 0, 0); // Set the time to midnight (00:00:00.000) in UTC
    now.setUTCDate(now.getUTCDate() - 1); // Subtract one day
    return now.toISOString(); // Convert to ISO string
  };

  // Fetch the company name
  const fetchCompanyName = async (symbol: string) => {
    try {
      const response = await axios.get(
        `https://ticker-2e1ica8b9.now.sh/keyword/${symbol}`
      );
      const data = response.data;

      if (data.length > 0) {
        setCompanyName(data[0].name);
      } else {
        setCompanyName(""); // Fallback to an empty string if no name is found
      }
    } catch (error) {
      console.error("Error fetching company name:", error);
      setCompanyName(""); // Fallback in case of error
    }
  };

  // Fetch stock data based on symbol and timeframe
  const fetchStockData = async (symbol: string) => {
    try {
      const endDate = getMidnightISODate(); // Get the current date at midnight in ISO format
      const options = {
        method: "GET",
        url: `https://data.alpaca.markets/v2/stocks/bars?symbols=${symbol}&timeframe=1D&start=2024-08-01T00%3A00%3A00Z&end=${encodeURIComponent(
          endDate
        )}&limit=1000&adjustment=raw&feed=sip&sort=asc`,
        headers: {
          accept: "application/json",
          "APCA-API-KEY-ID": process.env.NEXT_PUBLIC_ALPACA_API_KEY,
          "APCA-API-SECRET-KEY": process.env.NEXT_PUBLIC_ALPACA_SECRET_KEY,
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

      if (formattedData.length > 0) {
        const lastBar = formattedData[formattedData.length - 1];
        const prevBar =
          formattedData.length > 1
            ? formattedData[formattedData.length - 2]
            : lastBar;
        setCurrentPrice(lastBar.close);
        setOpenPrice(lastBar.open);
        setPreviousClose(prevBar.close); // Use the previous bar's close
        setVolume(lastBar.volume);
      }

      setChartData(formattedData);
    } catch (error) {
      console.error("Error fetching stock data:", error);
    }
  };

  const fetchLatestStockData = async (symbol: string) => {
    try {
      const options = {
        method: "GET",
        url: `https://data.alpaca.markets/v2/stocks/bars/latest?symbols=${symbol}`,
        headers: {
          accept: "application/json",
          "APCA-API-KEY-ID": process.env.NEXT_PUBLIC_ALPACA_API_KEY!,
          "APCA-API-SECRET-KEY": process.env.NEXT_PUBLIC_ALPACA_SECRET_KEY!,
        },
      };

      const response = await axios.request(options);
      const stockBar = response.data.bars[symbol]; // Get the single bar object

      // console.log("Latest Stock Data:", stockBar);

      if (stockBar) {
        // Update state with the latest bar data
        setLatestCurrentPrice(stockBar.c);
        setLatestOpenPrice(stockBar.o);
        setLatestPreviousClose(stockBar.c); // Assume the last close is the previous close
        setLatestVolume(stockBar.v);
      }
    } catch (error) {
      console.error("Error fetching latest stock data:", error);
    }
  };

  // Fetch initial stock data when the component mounts
  useEffect(() => {
    if (stockId) {
      fetchCompanyName(stockId as string);
      fetchStockData(stockId as string);
    }
  }, [stockId]);

  // Fetch latest stock data every minute
  useEffect(() => {
    if (stockId) {
      // Fetch immediately on mount
      fetchLatestStockData(stockId as string);

      // Set up interval to fetch every minute
      const intervalId = setInterval(() => {
        fetchLatestStockData(stockId as string);
      }, 60000); // 60,000 milliseconds = 1 minute

      // Clear interval on component unmount
      return () => clearInterval(intervalId);
    }
  }, [stockId]);

  // Initialize the chart only once and update data when it changes
  useEffect(() => {
    if (chartContainerRef.current && stockId) {
      const chart = createChart(chartContainerRef.current, {
        width: chartContainerRef.current.clientWidth,
        height: chartContainerRef.current.clientHeight,
        layout: {
          background: { color: "#212121" },
          textColor: "#D9D9D9",
        },
        grid: {
          vertLines: { color: "#404040" },
          horzLines: { color: "#404040" },
        },
        crosshair: { mode: 1 },
        rightPriceScale: { borderColor: "#485c7b" },
        timeScale: { borderColor: "#485c7b", visible: true },
      });

      const candlestickSeries = chart.addCandlestickSeries({
        upColor: "#4fff50",
        borderUpColor: "#4fff50",
        wickUpColor: "#4fff50",
        downColor: "#ff4976",
        borderDownColor: "#ff4976",
        wickDownColor: "#ff4976",
      });

      if (chartData.length > 0) {
        candlestickSeries.setData(chartData);
      }

      const handleResize = () => {
        chart.applyOptions({
          width: chartContainerRef.current?.clientWidth || 0,
          height: chartContainerRef.current?.clientHeight || 0,
        });
      };

      window.addEventListener("resize", handleResize);

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

      return () => {
        chart.remove();
        window.removeEventListener("resize", handleResize);
      };
    }
  }, [chartData]);

  return (
    <div className="min-h-screen text-black p-6 pt-[120px]">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">
          <div className="flex items-center justify-center">
            <img
              src={`https://financialmodelingprep.com/image-stock/${stockId}.png?apikey=${process.env.NEXT_PUBLIC_FMP_API_KEY}`}
              width={40}
              height={32}
              className="mr-2" // Add margin to separate the logo and text
            />
            {companyName || stockId}
          </div>
        </h1>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Chart Container */}
          <div className="flex-1">
            <div
              ref={crosshairInfoRef}
              className="mt-2 p-2 text-black text-sm flex space-x-2"
            ></div>
            <div ref={chartContainerRef} className="w-full h-[500px]"></div>
            {/* Crosshair Info Display */}
          </div>

          {/* Trading Panel */}
          <div className="lg:w-1/3 pt-10">
            <TradingPanel
              openPrice={latestOpenPrice}
              volume={latestVolume}
              stockSymbol={stockId as string}
              currentPrice={latestCurrentPrice}
            />
          </div>
        </div>
        <Fundamentals symbol={stockId as string} />

        <OptionPanel symbol={stockId as string} />

        <NewsFeed symbol={stockId as string} />
      </div>
    </div>
  );
};

export default StockIdPage;
