"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Scale, Info, Target, Banknote } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const RiskRewardCalculator = () => {
  const [entryPrice, setEntryPrice] = useState("");
  const [stopLoss, setStopLoss] = useState("");
  const [takeProfit, setTakeProfit] = useState("");
  const [positionSize, setPositionSize] = useState("");
  const [results, setResults] = useState<{
    riskRewardRatio: number;
    potentialLoss: number;
    potentialProfit: number;
    riskPercentage: number;
    rewardPercentage: number;
  } | null>(null);

  const calculateRiskReward = () => {
    const entry = parseFloat(entryPrice);
    const sl = parseFloat(stopLoss);
    const tp = parseFloat(takeProfit);
    const size = parseFloat(positionSize);

    const riskAmount = Math.abs(entry - sl);
    const rewardAmount = Math.abs(tp - entry);
    const riskRewardRatio = rewardAmount / riskAmount;

    const potentialLoss = riskAmount * size;
    const potentialProfit = rewardAmount * size;

    const riskPercentage = (riskAmount / entry) * 100;
    const rewardPercentage = (rewardAmount / entry) * 100;

    setResults({
      riskRewardRatio,
      potentialLoss,
      potentialProfit,
      riskPercentage,
      rewardPercentage,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 pt-16 pb-8 px-4 mt-[50px]">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card className="shadow-xl border-t-4 border-t-purple-500">
          <CardHeader className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="bg-purple-500/10 p-3 rounded-full">
                <Scale className="h-8 w-8 text-purple-500" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500">
              Risk/Reward Calculator
            </CardTitle>
            <p className="text-gray-600 dark:text-gray-400 max-w-lg mx-auto">
              Calculate your risk-reward ratio and potential trade outcomes
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
                    Stop Loss ($)
                  </label>
                  <Input
                    type="number"
                    placeholder="95.00"
                    value={stopLoss}
                    onChange={(e) => setStopLoss(e.target.value)}
                    className="text-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Take Profit ($)
                  </label>
                  <Input
                    type="number"
                    placeholder="110.00"
                    value={takeProfit}
                    onChange={(e) => setTakeProfit(e.target.value)}
                    className="text-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Position Size (Units)
                  </label>
                  <Input
                    type="number"
                    placeholder="100"
                    value={positionSize}
                    onChange={(e) => setPositionSize(e.target.value)}
                    className="text-lg"
                  />
                </div>
                <Button
                  className="w-full text-lg py-6"
                  onClick={calculateRiskReward}
                  disabled={
                    !entryPrice || !stopLoss || !takeProfit || !positionSize
                  }
                >
                  Calculate Risk/Reward
                </Button>
              </div>

              <div className="space-y-6">
                {results && (
                  <Card className="border-2 border-purple-500/20 bg-purple-50/50 dark:bg-purple-950/20">
                    <CardContent className="pt-6 space-y-4">
                      <h3 className="text-xl font-semibold mb-2">Results:</h3>

                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Scale className="h-4 w-4 text-purple-500" />
                          <span className="text-lg font-semibold text-purple-600 dark:text-purple-400">
                            Risk/Reward Ratio: 1:
                            {results.riskRewardRatio.toFixed(2)}
                          </span>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Target className="h-4 w-4" />
                            <span className="text-sm">
                              Risk: {results.riskPercentage.toFixed(2)}% ($
                              {results.potentialLoss.toFixed(2)})
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Target className="h-4 w-4" />
                            <span className="text-sm">
                              Reward: {results.rewardPercentage.toFixed(2)}% ($
                              {results.potentialProfit.toFixed(2)})
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Banknote className="h-4 w-4" />
                          <span className="text-sm font-medium">
                            Potential Outcomes:
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-3 bg-red-50 dark:bg-red-950/20 rounded-lg">
                            <p className="text-sm text-red-600 dark:text-red-400">
                              Max Loss:
                              <br />${results.potentialLoss.toFixed(2)}
                            </p>
                          </div>
                          <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                            <p className="text-sm text-green-600 dark:text-green-400">
                              Max Profit:
                              <br />${results.potentialProfit.toFixed(2)}
                            </p>
                          </div>
                        </div>
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
                      <li>Entry: $100.00</li>
                      <li>Stop Loss: $95.00</li>
                      <li>Take Profit: $110.00</li>
                      <li>Position: 100 units</li>
                    </ul>
                    <p className="mt-2 font-medium">
                      Results in:
                      <br />
                      - Risk/Reward: 1:2
                      <br />
                      - Max Loss: $500
                      <br />- Max Profit: $1,000
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

export default RiskRewardCalculator;
