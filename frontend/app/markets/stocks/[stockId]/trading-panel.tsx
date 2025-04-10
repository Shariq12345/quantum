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
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowDown,
  ArrowUp,
  BarChart3,
  ChevronDown,
  ChevronUp,
  DollarSign,
  Info,
  LineChart,
  Wallet,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

  const userFunds = getFundsByUserId?.amount ?? 0;

  const depositFunds = useMutation(api.funds.depositFunds);

  // BUY STOCKS
  const buyStocks = useMutation(api.stock.buyStock);

  const sellStocks = useMutation(api.stock.sellStock);

  // DEDUCT FUNDS
  const deductFunds = useMutation(api.funds.deductFunds);

  const purchasePrice = useQuery(api.stock.getPurchasePrice, {
    symbol: stockSymbol,
  });

  // RECORD TRANSACTIONS
  const recordTransaction = useMutation(api.transactions.recordTransaction);

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

        // Record the transaction
        await recordTransaction({
          userId: userId ?? "",
          stockSymbol: stockSymbol,
          quantity: quantity,
          price: price,
          transactionType: "buy",
        });

        toast({
          title: `Successfully bought ${quantity} shares of ${stockSymbol} at $${price.toFixed(2)}`,
          description: `Your new balance is $${(userFunds + totalCost).toFixed(2)}`,
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

        // Record the transaction
        await recordTransaction({
          userId: userId ?? "",
          stockSymbol: stockSymbol,
          quantity: quantity,
          price: price,
          transactionType: "sell",
        });

        toast({
          title: `Successfully sold ${quantity} shares of ${stockSymbol} at $${price.toFixed(2)}`,
          description: `Your new balance is $${(userFunds + totalCost).toFixed(2)}`,
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

  const priceChange = currentPrice - openPrice;
  const priceChangePercent = ((priceChange / openPrice) * 100).toFixed(2);
  const isPriceUp = priceChange >= 0;

  return (
    <TooltipProvider>
      <Card className="w-full max-w-md mx-auto border border-border/40 shadow-md bg-card">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2">
                <CardTitle className="text-2xl font-bold">
                  {stockSymbol}
                </CardTitle>
                <Badge variant="outline" className="font-mono text-xs">
                  NASDAQ
                </Badge>
              </div>
              <CardDescription className="mt-1 flex items-center gap-1.5">
                <Wallet className="h-3.5 w-3.5 text-muted-foreground" />
                <span>
                  Available: $
                  {userFunds.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </CardDescription>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">
                ${currentPrice.toFixed(2)}
              </div>
              <div
                className={`flex items-center justify-end gap-1 text-sm ${isPriceUp ? "text-emerald-500" : "text-rose-500"}`}
              >
                {isPriceUp ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
                <span>${Math.abs(priceChange).toFixed(2)}</span>
                <span>({priceChangePercent}%)</span>
              </div>
            </div>
          </div>
        </CardHeader>

        <Separator />

        <CardContent className="pt-4 pb-0">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-muted/40 rounded-lg p-3">
              <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                <BarChart3 className="h-3.5 w-3.5" />
                Open Price
              </div>
              <div className="font-medium">${openPrice.toFixed(2)}</div>
            </div>
            <div className="bg-muted/40 rounded-lg p-3">
              <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                <LineChart className="h-3.5 w-3.5" />
                Volume
              </div>
              <div className="font-medium">{volume.toLocaleString()}</div>
            </div>
          </div>

          <Tabs defaultValue="buy" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger
                value="buy"
                className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white"
              >
                <ArrowDown className="h-4 w-4 mr-1.5" />
                Buy
              </TabsTrigger>
              <TabsTrigger
                value="sell"
                className="data-[state=active]:bg-rose-500 data-[state=active]:text-white"
              >
                <ArrowUp className="h-4 w-4 mr-1.5" />
                Sell
              </TabsTrigger>
            </TabsList>

            <TabsContent value="buy">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label
                        htmlFor="buy-quantity"
                        className="text-sm font-medium"
                      >
                        Quantity
                      </label>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent side="top">
                          <p className="text-xs">Number of shares to buy</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <Input
                      id="buy-quantity"
                      type="number"
                      min="0"
                      step="1"
                      value={quantity}
                      onChange={handleQuantityChange}
                      className="h-9"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label
                        htmlFor="buy-order-type"
                        className="text-sm font-medium"
                      >
                        Order Type
                      </label>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent side="top">
                          <p className="text-xs">
                            Market: current price, Limit: specified price
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <Select
                      value={orderType}
                      onValueChange={(value) =>
                        setOrderType(value as "market" | "limit")
                      }
                    >
                      <SelectTrigger id="buy-order-type" className="h-9">
                        <SelectValue placeholder="Select order type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="market">Market</SelectItem>
                        <SelectItem value="limit">Limit</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {orderType === "limit" && (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label
                        htmlFor="buy-limit-price"
                        className="text-sm font-medium"
                      >
                        Limit Price
                      </label>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent side="top">
                          <p className="text-xs">
                            Maximum price you're willing to pay per share
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <Input
                      id="buy-limit-price"
                      type="number"
                      min="0"
                      step="0.01"
                      value={limitPrice || ""}
                      onChange={handleLimitPriceChange}
                      className="h-9"
                    />
                  </div>
                )}

                <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900 rounded-lg p-3">
                  <h4 className="text-sm font-medium text-emerald-800 dark:text-emerald-300 mb-2 flex items-center gap-1.5">
                    <DollarSign className="h-4 w-4" />
                    Order Summary
                  </h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between text-emerald-700 dark:text-emerald-400">
                      <span>Action:</span>
                      <span className="font-medium">Buy {stockSymbol}</span>
                    </div>
                    <div className="flex justify-between text-emerald-700 dark:text-emerald-400">
                      <span>Quantity:</span>
                      <span className="font-medium">{quantity} shares</span>
                    </div>
                    <div className="flex justify-between text-emerald-700 dark:text-emerald-400">
                      <span>Price:</span>
                      <span className="font-medium">
                        {orderType === "market"
                          ? `$${currentPrice.toFixed(2)} (Market)`
                          : `$${limitPrice?.toFixed(2) || 0} (Limit)`}
                      </span>
                    </div>
                    <Separator className="my-1.5 bg-emerald-100 dark:bg-emerald-800" />
                    <div className="flex justify-between font-medium text-emerald-800 dark:text-emerald-300">
                      <span>Estimated Cost:</span>
                      <span>${estimatedCost}</span>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="sell">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label
                        htmlFor="sell-quantity"
                        className="text-sm font-medium"
                      >
                        Quantity
                      </label>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent side="top">
                          <p className="text-xs">Number of shares to sell</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <Input
                      id="sell-quantity"
                      type="number"
                      min="0"
                      step="1"
                      value={quantity}
                      onChange={handleQuantityChange}
                      className="h-9"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label
                        htmlFor="sell-order-type"
                        className="text-sm font-medium"
                      >
                        Order Type
                      </label>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent side="top">
                          <p className="text-xs">
                            Market: current price, Limit: specified price
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <Select
                      value={orderType}
                      onValueChange={(value) =>
                        setOrderType(value as "market" | "limit")
                      }
                    >
                      <SelectTrigger id="sell-order-type" className="h-9">
                        <SelectValue placeholder="Select order type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="market">Market</SelectItem>
                        <SelectItem value="limit">Limit</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {orderType === "limit" && (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label
                        htmlFor="sell-limit-price"
                        className="text-sm font-medium"
                      >
                        Limit Price
                      </label>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent side="top">
                          <p className="text-xs">
                            Minimum price you're willing to accept per share
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <Input
                      id="sell-limit-price"
                      type="number"
                      min="0"
                      step="0.01"
                      value={limitPrice || ""}
                      onChange={handleLimitPriceChange}
                      className="h-9"
                    />
                  </div>
                )}

                <div className="bg-rose-50 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900 rounded-lg p-3">
                  <h4 className="text-sm font-medium text-rose-800 dark:text-rose-300 mb-2 flex items-center gap-1.5">
                    <DollarSign className="h-4 w-4" />
                    Order Summary
                  </h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between text-rose-700 dark:text-rose-400">
                      <span>Action:</span>
                      <span className="font-medium">Sell {stockSymbol}</span>
                    </div>
                    <div className="flex justify-between text-rose-700 dark:text-rose-400">
                      <span>Quantity:</span>
                      <span className="font-medium">{quantity} shares</span>
                    </div>
                    <div className="flex justify-between text-rose-700 dark:text-rose-400">
                      <span>Price:</span>
                      <span className="font-medium">
                        {orderType === "market"
                          ? `$${currentPrice.toFixed(2)} (Market)`
                          : `$${limitPrice?.toFixed(2) || 0} (Limit)`}
                      </span>
                    </div>
                    <Separator className="my-1.5 bg-rose-100 dark:bg-rose-800" />
                    <div className="flex justify-between font-medium text-rose-800 dark:text-rose-300">
                      <span>Estimated Proceeds:</span>
                      <span>${estimatedCost}</span>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>

        <CardFooter className="pt-4">
          {orderType === "market" ||
          (orderType === "limit" && limitPrice && limitPrice > 0) ? (
            <Tabs defaultValue="buy">
              <TabsContent value="buy">
                <Button
                  onClick={() => handleSubmit("buy")}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                  disabled={
                    quantity <= 0 ||
                    (orderType === "limit" &&
                      (!limitPrice || limitPrice <= 0)) ||
                    Number.parseFloat(estimatedCost) > userFunds
                  }
                >
                  <DollarSign className="h-4 w-4 mr-1.5" />
                  Place Buy Order
                </Button>
              </TabsContent>
              <TabsContent value="sell">
                <Button
                  onClick={() => handleSubmit("sell")}
                  className="w-full bg-rose-600 hover:bg-rose-700 text-white"
                  disabled={
                    quantity <= 0 ||
                    (orderType === "limit" && (!limitPrice || limitPrice <= 0))
                  }
                >
                  <DollarSign className="h-4 w-4 mr-1.5" />
                  Place Sell Order
                </Button>
              </TabsContent>
            </Tabs>
          ) : null}
        </CardFooter>
      </Card>
    </TooltipProvider>
  );
}
