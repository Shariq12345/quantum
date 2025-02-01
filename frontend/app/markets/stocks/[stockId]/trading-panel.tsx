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
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { useToast } from "@/hooks/use-toast";

interface TradingPanelProps {
  stockSymbol: string;
  currentPrice: number;
  openPrice: number;
  volume: number;
}

export default function TradingPanel({
  stockSymbol,
  currentPrice,
  openPrice,
  volume,
}: TradingPanelProps) {
  const { user } = useUser();
  const userId = user?.id;
  const { toast } = useToast();
  const [quantity, setQuantity] = useState<number>(0);
  const [orderType, setOrderType] = useState<"market" | "limit">("market");
  const [limitPrice, setLimitPrice] = useState<number | null>(null);

  // Fetch user funds
  const getFundsByUserId = useQuery(api.funds.getFundsByUserId, {
    userId: userId ?? "",
  });

  let userFunds = getFundsByUserId?.amount ?? 0;

  const depositFunds = useMutation(api.funds.depositFunds);

  // BUY STOCKS
  const buyStocks = useMutation(api.stock.buyStock);

  const sellStocks = useMutation(api.stock.sellStock);

  // DEDUCT FUNDS
  const deductFunds = useMutation(api.funds.deductFunds);

  const purchasePrice = useQuery(api.stock.getPurchasePrice, {
    symbol: stockSymbol,
  });

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuantity(Number(e.target.value));
  };

  const handleLimitPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLimitPrice(Number(e.target.value));
  };

  const handleSubmit = async (action: "buy" | "sell") => {
    const price = orderType === "market" ? currentPrice : limitPrice || 0;
    const totalCost = price * quantity;

    if (action === "buy") {
      if (totalCost > userFunds) {
        toast({
          title: "Insufficient funds to complete the purchase.",
          description: "Please add more funds to your account.",
        });
        return;
      }

      try {
        // Call the buyStocks mutation
        await buyStocks({
          symbol: stockSymbol,
          price: price,
          userId: userId ?? "",
          quantity: quantity,
        });

        await deductFunds({
          userId: userId ?? "",
          amount: totalCost,
        });

        toast({
          title: `Successfully bought ${quantity} shares of ${stockSymbol} at $${price.toFixed(2)}`,
          description: `Your new balance is $${userFunds - totalCost}`,
        });
      } catch (error) {
        toast({
          title: "Failed to buy stocks.",
          description: "An error occurred while processing your order.",
        });
      }
    } else if (action === "sell") {
      try {
        if (!purchasePrice) {
          toast({
            title: "Failed to sell stocks.",
            description: "Could not find the purchase price for the stock.",
          });
          return;
        }

        // Calculate profit or loss
        const profitOrLoss = (price - purchasePrice) * quantity;

        await sellStocks({
          symbol: stockSymbol,
          quantity: quantity,
          userId: userId ?? "",
        });

        await depositFunds({
          userId: userId ?? "",
          amount: totalCost + profitOrLoss,
        });

        toast({
          title: `Successfully sold ${quantity} shares of ${stockSymbol} at $${price.toFixed(2)}`,
          description: `Your new balance is $${userFunds + totalCost}`,
        });
      } catch (error) {
        toast({
          title: "Failed to sell stocks.",
          description: "An error occurred while processing your order.",
        });
      }
    }

    // Reset form after submission
    setQuantity(0);
    setLimitPrice(null);
  };

  const estimatedCost = (
    (orderType === "market" ? currentPrice : limitPrice || 0) * quantity
  ).toFixed(2);

  return (
    <Card className="w-full max-w-3xl mx-auto bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 shadow-lg">
      <CardHeader className="space-y-2">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-2xl font-bold">{stockSymbol}</CardTitle>
            <CardDescription className="text-md">
              Available Funds: ${userFunds.toFixed(2)}
            </CardDescription>
          </div>
          <Badge variant="default" className="text-lg py-1 px-2">
            ${currentPrice.toFixed(2)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="block text-gray-500">Open</span>
            <span className="font-semibold">${openPrice?.toFixed(2)}</span>
          </div>
          <div>
            <span className="block text-gray-500">Volume</span>
            <span className="font-semibold">{volume?.toLocaleString()}</span>
          </div>
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
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-emerald-600 focus:border-emerald-600 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
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
                  Estimated Cost: ${estimatedCost}
                </p>
              </div>
              <Button
                onClick={() => handleSubmit("buy")}
                className="w-full"
                disabled={
                  quantity <= 0 ||
                  (orderType === "limit" && (!limitPrice || limitPrice <= 0)) ||
                  parseFloat(estimatedCost) > userFunds
                }
              >
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
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-emerald-600 focus:border-emerald-600 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
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
                  Estimated Proceeds: ${estimatedCost}
                </p>
              </div>
              <Button
                onClick={() => handleSubmit("sell")}
                className="w-full bg-red-500 hover:bg-red-600"
                disabled={
                  quantity <= 0 ||
                  (orderType === "limit" && (!limitPrice || limitPrice <= 0))
                }
              >
                Place Sell Order
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
