"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowUpIcon,
  ArrowDownIcon,
  TrendingUp,
  Activity,
  RefreshCw,
} from "lucide-react";
import { useRouter } from "next/navigation";
import StockSearch from "./stock-search";
// import MarketOverview from "./market-overview";

interface Stock {
  symbol: string;
  name?: string;
  price: string;
  change: string;
  isPositive: boolean;
  volume?: string;
  trade_count?: number;
  percent_change?: string;
}

const StockRow = ({ stock }: { stock: Stock }) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/markets/stocks/${stock.symbol}`);
  };

  return (
    <div
      className="flex items-center justify-between p-4 hover:bg-slate-800/20 rounded-lg transition-all duration-300 ease-in-out cursor-pointer"
      onClick={handleClick}
    >
      <div className="flex-1">
        <h3 className="font-semibold text-black text-lg">{stock.symbol}</h3>
        {/* <p className="text-sm text-gray-400">{stock.name || "N/A"}</p> */}
      </div>
      <div className="flex-1 text-center">
        <p className="font-semibold text-emerald-600 text-lg">${stock.price}</p>
        <p
          className={`text-sm flex items-center justify-center ${
            stock.isPositive ? "text-emerald-400" : "text-red-400"
          }`}
        >
          {stock.isPositive ? (
            <ArrowUpIcon className="w-4 h-4 mr-1" />
          ) : (
            <ArrowDownIcon className="w-4 h-4 mr-1" />
          )}
          {stock.change}
        </p>
      </div>
      {stock.percent_change && (
        <div className="flex-1 text-right">
          <p className="font-semibold text-black">{stock.percent_change}%</p>
        </div>
      )}
    </div>
  );
};

const StockMarketPage = () => {
  const [trendingStocks, setTrendingStocks] = useState<Stock[]>([]);
  const [activeStocks, setActiveStocks] = useState<Stock[]>([]);
  const [topMovers, setTopMovers] = useState<Stock[]>([]);
  const [lastUpdated, setLastUpdated] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const fetchAllData = async () => {
    setIsLoading(true);
    await Promise.all([
      fetchMarketData(),
      fetchActiveStocks(),
      fetchTopMovers(),
    ]);
    setLastUpdated(new Date().toLocaleTimeString());
    setIsLoading(false);
  };

  const fetchMarketData = async () => {
    try {
      const options = {
        method: "GET",
        url: "https://data.alpaca.markets/v2/stocks/bars/latest?symbols=AAPL,MSFT,TSLA,NVDA",
        headers: {
          accept: "application/json",
          "APCA-API-KEY-ID": "PK37Y096H88LC39XDCGT",
          "APCA-API-SECRET-KEY": "WFNKWsozTcdBeRfL3xbHUo4o8nmTkEgqCnP9aIIV",
        },
      };

      const response = await axios.request(options);
      const indicesData = response.data.bars;

      const fetchedStocks = Object.entries(indicesData).map(
        ([symbol, stock]: [string, any]) => ({
          symbol,
          name: "Stock Name",
          price: stock.c.toFixed(2),
          change: (((stock.c - stock.o) / stock.o) * 100).toFixed(2) + "%",
          isPositive: stock.c >= stock.o,
          volume: stock.v.toLocaleString(),
        })
      );

      setTrendingStocks(fetchedStocks);
    } catch (error) {
      console.error("Error fetching market data:", error);
    }
  };

  const fetchActiveStocks = async () => {
    try {
      const options = {
        method: "GET",
        url: "https://data.alpaca.markets/v1beta1/screener/stocks/most-actives?by=volume&top=5",
        headers: {
          accept: "application/json",
          "APCA-API-KEY-ID": "PK37Y096H88LC39XDCGT",
          "APCA-API-SECRET-KEY": "WFNKWsozTcdBeRfL3xbHUo4o8nmTkEgqCnP9aIIV",
        },
      };

      const response = await axios.request(options);
      const activeStocksData = response.data.most_actives;

      const fetchedActiveStocks = activeStocksData.map((stock: any) => ({
        symbol: stock.symbol,
        volume: stock.volume,
        trade_count: stock.trade_count,
      }));

      setActiveStocks(fetchedActiveStocks);
    } catch (error) {
      console.error("Error fetching active stock data:", error);
    }
  };

  const fetchTopMovers = async () => {
    try {
      const options = {
        method: "GET",
        url: "https://data.alpaca.markets/v1beta1/screener/stocks/movers?top=10",
        headers: {
          accept: "application/json",
          "APCA-API-KEY-ID": "PK37Y096H88LC39XDCGT",
          "APCA-API-SECRET-KEY": "WFNKWsozTcdBeRfL3xbHUo4o8nmTkEgqCnP9aIIV",
        },
      };

      const response = await axios.request(options);
      const moversData = response.data.gainers;

      const fetchedTopMovers = moversData.map((stock: any) => ({
        symbol: stock.symbol,
        price: stock.price.toFixed(2),
        change: stock.change.toFixed(2),
        percent_change: stock.percent_change.toFixed(2),
        isPositive: stock.change >= 0,
      }));

      setTopMovers(fetchedTopMovers);
    } catch (error) {
      console.error("Error fetching top movers:", error);
    }
  };

  useEffect(() => {
    fetchAllData();
    const interval = setInterval(fetchAllData, 60000); // Fetch data every minute
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white p-6 pt-[7rem]">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-extrabold mb-1">US Stock Market</h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Real-time market data and analysis
            </p>
          </div>
          <div className="flex items-center gap-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Last updated: {lastUpdated}
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchAllData}
              disabled={isLoading}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* <MarketOverview /> */}

        <StockSearch />

        <Tabs defaultValue="top-movers" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="top-movers">Top Movers</TabsTrigger>
            <TabsTrigger value="tech-stocks">Tech Stocks</TabsTrigger>
            <TabsTrigger value="most-active">Most Active</TabsTrigger>
          </TabsList>
          <TabsContent value="top-movers">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ArrowUpIcon className="w-6 h-6 text-green-500" />
                  Top Movers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {topMovers.map((stock) => (
                    <Card
                      key={stock.symbol}
                      className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300"
                    >
                      <CardContent className="p-4">
                        <StockRow stock={stock} />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="tech-stocks">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-6 h-6 text-blue-500" />
                  Tech Stocks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {trendingStocks.map((stock) => (
                    <Card
                      key={stock.symbol}
                      className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300"
                    >
                      <CardContent className="p-4">
                        <StockRow stock={stock} />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="most-active">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-6 h-6 text-green-500" />
                  Most Active Stocks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activeStocks.map((stock) => (
                    <Card
                      key={stock.symbol}
                      className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300"
                    >
                      <CardContent className="p-4">
                        <StockRow stock={stock} />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default StockMarketPage;
