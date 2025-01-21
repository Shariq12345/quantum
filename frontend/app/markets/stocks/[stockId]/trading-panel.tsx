"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowUpIcon, ArrowDownIcon, TrendingUpIcon } from "lucide-react";

interface TradingPanelProps {
  stockSymbol: string;
  currentPrice: number;
  // previousClose: number;
  openPrice: number;
  volume: number;
  // marketCap: number;
}

export default function TradingPanel({
  stockSymbol,
  currentPrice,
  // previousClose,
  openPrice,
  volume,
  // marketCap,
}: TradingPanelProps) {
  const [quantity, setQuantity] = useState<number>(0);
  const [orderType, setOrderType] = useState<"market" | "limit">("market");
  const [limitPrice, setLimitPrice] = useState<number | null>(null);

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuantity(Number(e.target.value));
  };

  const handleLimitPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLimitPrice(Number(e.target.value));
  };

  const handleSubmit = (action: "buy" | "sell") => {
    // Implement order submission logic here
    console.log(
      `${action.toUpperCase()} ${quantity} shares of ${stockSymbol} at ${
        orderType === "market" ? "market price" : `$${limitPrice}`
      }`
    );
  };

  // const priceChange = currentPrice - previousClose;
  // const priceChangePercentage = (priceChange / previousClose) * 100;

  return (
    <Card className="w-full max-w-3xl mx-auto bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 shadow-lg">
      <CardHeader className="space-y-2">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-3xl font-bold">{stockSymbol}</CardTitle>
            <CardDescription className="text-lg"></CardDescription>
          </div>
          <Badge variant={"default"} className="text-lg py-1 px-2">
            ${currentPrice.toFixed(2)}
          </Badge>
        </div>
        <div className="flex items-center space-x-2 text-sm">
          {/* <span
            className={`flex items-center ${priceChange >= 0 ? "text-green-600" : "text-red-600"}`}
          >
            {priceChange >= 0 ? (
              <ArrowUpIcon className="w-4 h-4 mr-1" />
            ) : (
              <ArrowDownIcon className="w-4 h-4 mr-1" />
            )}
            ${Math.abs(priceChange).toFixed(2)} (
            {priceChangePercentage.toFixed(2)}%)
          </span>
          <span className="text-gray-500">
            Previous Close: ${previousClose?.toFixed(2)}
          </span> */}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="block text-gray-500">Open</span>
            <span className="font-semibold">${openPrice?.toFixed(2)}</span>
          </div>
          {/* <div>
            <span className="block text-gray-500">Prev Close</span>
            <span className="font-semibold">${previousClose?.toFixed(2)}</span>
          </div> */}
          <div>
            <span className="block text-gray-500">Volume</span>
            <span className="font-semibold">{volume?.toLocaleString()}</span>
          </div>
          {/* <div>
            <span className="block text-gray-500">52W Range</span>
            <span className="font-semibold">$100.00 - $200.00</span>
          </div> */}
        </div>
        <Tabs defaultValue="buy" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="buy">Buy</TabsTrigger>
            <TabsTrigger value="sell">Sell</TabsTrigger>
          </TabsList>
          <TabsContent value="buy">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="buy-quantity"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Quantity
                  </label>
                  <Input
                    id="buy-quantity"
                    type="number"
                    min="0"
                    step="1"
                    value={quantity}
                    onChange={handleQuantityChange}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label
                    htmlFor="buy-order-type"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Order Type
                  </label>
                  <select
                    id="buy-order-type"
                    value={orderType}
                    onChange={(e) =>
                      setOrderType(e.target.value as "market" | "limit")
                    }
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    <option value="market">Market</option>
                    <option value="limit">Limit</option>
                  </select>
                </div>
              </div>
              {orderType === "limit" && (
                <div>
                  <label
                    htmlFor="buy-limit-price"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Limit Price
                  </label>
                  <Input
                    id="buy-limit-price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={limitPrice || ""}
                    onChange={handleLimitPriceChange}
                    className="mt-1"
                  />
                </div>
              )}
              <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-md">
                <h4 className="text-sm font-semibold text-blue-800 dark:text-blue-200 mb-2">
                  Order Summary
                </h4>
                <p className="text-sm text-blue-600 dark:text-blue-300">
                  Buy {quantity} shares of {stockSymbol} at{" "}
                  {orderType === "market" ? "market price" : `$${limitPrice}`}
                </p>
                <p className="text-sm text-blue-600 dark:text-blue-300">
                  Estimated Cost: $
                  {(
                    (orderType === "market" ? currentPrice : limitPrice || 0) *
                    quantity
                  ).toFixed(2)}
                </p>
              </div>
              <Button onClick={() => handleSubmit("buy")} className="w-full">
                Place Buy Order
              </Button>
            </div>
          </TabsContent>
          <TabsContent value="sell">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="sell-quantity"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Quantity
                  </label>
                  <Input
                    id="sell-quantity"
                    type="number"
                    min="0"
                    step="1"
                    value={quantity}
                    onChange={handleQuantityChange}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label
                    htmlFor="sell-order-type"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Order Type
                  </label>
                  <select
                    id="sell-order-type"
                    value={orderType}
                    onChange={(e) =>
                      setOrderType(e.target.value as "market" | "limit")
                    }
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    <option value="market">Market</option>
                    <option value="limit">Limit</option>
                  </select>
                </div>
              </div>
              {orderType === "limit" && (
                <div>
                  <label
                    htmlFor="sell-limit-price"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Limit Price
                  </label>
                  <Input
                    id="sell-limit-price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={limitPrice || ""}
                    onChange={handleLimitPriceChange}
                    className="mt-1"
                  />
                </div>
              )}
              <div className="bg-red-50 dark:bg-red-900 p-4 rounded-md">
                <h4 className="text-sm font-semibold text-red-800 dark:text-red-200 mb-2">
                  Order Summary
                </h4>
                <p className="text-sm text-red-600 dark:text-red-300">
                  Sell {quantity} shares of {stockSymbol} at{" "}
                  {orderType === "market" ? "market price" : `$${limitPrice}`}
                </p>
                <p className="text-sm text-red-600 dark:text-red-300">
                  Estimated Proceeds: $
                  {(
                    (orderType === "market" ? currentPrice : limitPrice || 0) *
                    quantity
                  ).toFixed(2)}
                </p>
              </div>
              <Button
                onClick={() => handleSubmit("sell")}
                className="w-full bg-red-500 hover:bg-red-600"
              >
                Place Sell Order
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between items-center text-sm text-gray-500">
        <span>Last updated: {new Date().toLocaleTimeString()}</span>
        <span className="flex items-center">
          <TrendingUpIcon className="w-4 h-4 mr-1" /> Real-time data
        </span>
      </CardFooter>
    </Card>
  );
}
