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
import CryptoSearch from "./crypto-search";
import CryptoHoldings from "./crypto-holding";
// import MarketOverview from "./market-overview";

interface Crypto {
  symbol: string;
  name?: string;
  price: string;
  change: string;
  isPositive: boolean;
  volume?: string;
  trade_count?: number;
  percent_change?: string;
}

const CryptoRow = ({ crypto }: { crypto: Crypto }) => {
  const router = useRouter();

  const handleClick = () => {
    const baseCurrency = crypto.symbol.split("/")[0];
    router.push(`/markets/crypto/${baseCurrency}`);
  };

  return (
    <div
      className="flex items-center justify-between p-4 hover:bg-slate-800/20 rounded-lg transition-all duration-300 ease-in-out cursor-pointer"
      // onClick={handleClick}
    >
      <div className="flex-1">
        <h3 className="font-semibold text-black text-lg">{crypto.symbol}</h3>
        {/* <p className="text-sm text-gray-400">{crypto.name || "N/A"}</p> */}
      </div>
      <div className="flex-1 text-center">
        <p className="font-semibold text-emerald-600 text-lg">
          ${crypto.price}
        </p>
        <p
          className={`text-sm flex items-center justify-center ${
            crypto.isPositive ? "text-emerald-400" : "text-red-400"
          }`}
        >
          {crypto.isPositive ? (
            <ArrowUpIcon className="w-4 h-4 mr-1" />
          ) : (
            <ArrowDownIcon className="w-4 h-4 mr-1" />
          )}
          {crypto.change}
        </p>
      </div>
      {crypto.percent_change && (
        <div className="flex-1 text-right">
          <p className="font-semibold text-black">{crypto.percent_change}%</p>
        </div>
      )}
    </div>
  );
};

const CryptoMarketPage = () => {
  const [trendingCryptos, setTrendingCryptos] = useState<Crypto[]>([]);
  const [activeStocks, setActiveStocks] = useState<Crypto[]>([]);
  const [topMovers, setTopMovers] = useState<Crypto[]>([]);
  const [lastUpdated, setLastUpdated] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const fetchAllData = async () => {
    setIsLoading(true);
    await Promise.all([fetchMarketData(), fetchTopMovers()]);
    setLastUpdated(new Date().toLocaleTimeString());
    setIsLoading(false);
  };

  const fetchMarketData = async () => {
    try {
      const options = {
        method: "GET",
        url: "https://data.alpaca.markets/v1beta3/crypto/us/latest/bars?symbols=BTC%2FUSD%2CETH%2FUSD%2CXRP%2FUSD%2CADA%2FUSD%2CSOL%2FUSD%2CDOT%2FUSD%2CDOGE%2FUSD%2CAVAX%2FUSD%2CLINK%2FUSD%2CMATIC%2FUSD",

        headers: {
          accept: "application/json",
        },
      };

      const response = await axios.request(options);
      const indicesData = response.data.bars;

      const fetchedStocks = Object.entries(indicesData).map(
        ([symbol, crypto]: [string, any]) => ({
          symbol,
          name: "crypto Name",
          price: crypto.c.toFixed(5),
          change: (((crypto.c - crypto.o) / crypto.o) * 100).toFixed(2) + "%",
          isPositive: crypto.c >= crypto.o,
          volume: crypto.v.toLocaleString(),
        })
      );

      setTrendingCryptos(fetchedStocks);
    } catch (error) {
      console.error("Error fetching market data:", error);
    }
  };

  const fetchTopMovers = async () => {
    try {
      const options = {
        method: "GET",
        url: "https://data.alpaca.markets/v1beta1/screener/crypto/movers?top=12",
        headers: {
          accept: "application/json",
          "APCA-API-KEY-ID": process.env.NEXT_PUBLIC_ALPACA_API_KEY,
          "APCA-API-SECRET-KEY": process.env.NEXT_PUBLIC_ALPACA_SECRET_KEY,
        },
      };

      const response = await axios.request(options);
      const moversData = response.data.gainers;

      const fetchedTopMovers = moversData.map((crypto: any) => ({
        symbol: crypto.symbol,
        price: crypto.price.toFixed(5),
        change: crypto.change.toFixed(2),
        percent_change: crypto.percent_change.toFixed(2),
        isPositive: crypto.change >= 0,
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
            <h1 className="text-4xl font-extrabold mb-1">US Crypto Market</h1>
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
              // onClick={fetchAllData}
              disabled={isLoading}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* <MarketOverview /> */}

        {/* <CryptoSearch /> */}

        <Tabs defaultValue="top-movers" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="top-movers">Top Movers</TabsTrigger>
            <TabsTrigger value="tech-stocks">Market Data</TabsTrigger>
            <TabsTrigger value="holdings">Holdings</TabsTrigger>
          </TabsList>
          <TabsContent value="top-movers">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ArrowUpIcon className="w-6 h-6 text-emerald-500" />
                  Top Movers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {topMovers.map((crypto) => (
                    <Card
                      key={crypto.symbol}
                      className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300"
                    >
                      <CardContent className="p-4">
                        <CryptoRow crypto={crypto} />
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
                  Market
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {trendingCryptos.map((crypto) => (
                    <Card
                      key={crypto.symbol}
                      className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300"
                    >
                      <CardContent className="p-4">
                        <CryptoRow crypto={crypto} />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="holdings">
            <CryptoHoldings />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CryptoMarketPage;
