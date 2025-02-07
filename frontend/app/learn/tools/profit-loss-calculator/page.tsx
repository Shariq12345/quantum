"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Info, DollarSign, Percent } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const PNLCalculator = () => {
  const [entryPrice, setEntryPrice] = useState("");
  const [exitPrice, setExitPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [profitLoss, setProfitLoss] = useState<number | null>(null);
  const [percentageReturn, setPercentageReturn] = useState<number | null>(null);
  const [totalInvestment, setTotalInvestment] = useState<number | null>(null);

  const calculatePNL = () => {
    const entry = parseFloat(entryPrice);
    const exit = parseFloat(exitPrice);
    const qty = parseFloat(quantity);

    const investment = entry * qty;
    const finalValue = exit * qty;
    const pnl = finalValue - investment;
    const pctReturn = ((exit - entry) / entry) * 100;

    setTotalInvestment(investment);
    setProfitLoss(isNaN(pnl) || !isFinite(pnl) ? 0 : pnl);
    setPercentageReturn(
      isNaN(pctReturn) || !isFinite(pctReturn) ? 0 : pctReturn
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 pt-16 pb-8 px-4 mt-[50px]">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card className="shadow-xl border-t-4 border-t-green-500">
          <CardHeader className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="bg-green-500/10 p-3 rounded-full">
                <TrendingUp className="h-8 w-8 text-green-500" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-500 to-emerald-500">
              Profit & Loss Calculator
            </CardTitle>
            <p className="text-gray-600 dark:text-gray-400 max-w-lg mx-auto">
              Calculate your potential profit or loss and return on investment
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Entry Price ($)
                  </label>
                  <Input
                    type="number"
                    placeholder="100.00"
                    value={entryPrice}
                    onChange={(e) => setEntryPrice(e.target.value)}
                    className="text-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Exit Price ($)
                  </label>
                  <Input
                    type="number"
                    placeholder="150.00"
                    value={exitPrice}
                    onChange={(e) => setExitPrice(e.target.value)}
                    className="text-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Quantity (Units)
                  </label>
                  <Input
                    type="number"
                    placeholder="10"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="text-lg"
                  />
                </div>
                <Button
                  className="w-full text-lg py-6"
                  onClick={calculatePNL}
                  disabled={!entryPrice || !exitPrice || !quantity}
                >
                  Calculate P&L
                </Button>
              </div>

              <div className="space-y-6">
                {profitLoss !== null && (
                  <Card
                    className={`border-2 ${profitLoss >= 0 ? "border-green-500/20 bg-green-50/50 dark:bg-green-950/20" : "border-red-500/20 bg-red-50/50 dark:bg-red-950/20"}`}
                  >
                    <CardContent className="pt-6 space-y-4">
                      <h3 className="text-xl font-semibold mb-2">Results:</h3>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            Total Investment: ${totalInvestment?.toFixed(2)}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Percent className="h-4 w-4" />
                          <span
                            className={`text-sm ${percentageReturn && percentageReturn >= 0 ? "text-green-600" : "text-red-600"}`}
                          >
                            Return: {percentageReturn?.toFixed(2)}%
                          </span>
                        </div>

                        <p
                          className={`text-2xl font-bold ${profitLoss >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
                        >
                          {profitLoss >= 0 ? "Profit" : "Loss"}: $
                          {Math.abs(profitLoss).toFixed(2)}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertTitle>Example Calculation</AlertTitle>
                  <AlertDescription className="mt-2">
                    <p className="mb-2">For a trade with:</p>
                    <ul className="list-disc pl-4 space-y-1">
                      <li>Entry price: $100</li>
                      <li>Exit price: $150</li>
                      <li>Quantity: 10 units</li>
                    </ul>
                    <p className="mt-2 font-medium">
                      Results in:
                      <br />
                      - Investment: $1,000
                      <br />
                      - Profit: $500
                      <br />- Return: 50%
                    </p>
                  </AlertDescription>
                </Alert>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PNLCalculator;
