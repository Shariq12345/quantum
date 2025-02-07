"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calculator, Info } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const PositionSizeCalculator = () => {
  const [accountSize, setAccountSize] = useState("");
  const [riskPercentage, setRiskPercentage] = useState("");
  const [stopLoss, setStopLoss] = useState("");
  const [positionSize, setPositionSize] = useState<number | null>(null);

  const calculatePositionSize = () => {
    const riskAmount =
      (parseFloat(accountSize) * parseFloat(riskPercentage)) / 100;
    const size = riskAmount / parseFloat(stopLoss);
    setPositionSize(isNaN(size) || !isFinite(size) ? 0 : size);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 pt-16 pb-8 px-4 mt-[50px]">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Main Calculator Card */}
        <Card className="shadow-xl border-t-4 border-t-blue-500">
          <CardHeader className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="bg-blue-500/10 p-3 rounded-full">
                <Calculator className="h-8 w-8 text-blue-500" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
              Position Size Calculator
            </CardTitle>
            <p className="text-gray-600 dark:text-gray-400 max-w-lg mx-auto">
              Calculate your optimal position size based on your risk management
              parameters
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Account Size ($)
                  </label>
                  <Input
                    type="number"
                    placeholder="10000"
                    value={accountSize}
                    onChange={(e) => setAccountSize(e.target.value)}
                    className="text-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Risk Percentage (%)
                  </label>
                  <Input
                    type="number"
                    placeholder="1"
                    value={riskPercentage}
                    onChange={(e) => setRiskPercentage(e.target.value)}
                    className="text-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Stop Loss ($)
                  </label>
                  <Input
                    type="number"
                    placeholder="0.50"
                    value={stopLoss}
                    onChange={(e) => setStopLoss(e.target.value)}
                    className="text-lg"
                  />
                </div>
                <Button
                  className="w-full text-sm py-4"
                  onClick={calculatePositionSize}
                  disabled={!accountSize || !riskPercentage || !stopLoss}
                >
                  Calculate Position Size
                </Button>
              </div>

              <div className="space-y-6">
                {positionSize !== null && (
                  <Card className="border-2 border-blue-500/20 bg-blue-50/50 dark:bg-blue-950/20">
                    <CardContent className="pt-6">
                      <h3 className="text-xl font-semibold mb-2">Result:</h3>
                      <div className="space-y-3">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Risk Amount: $
                          {(
                            (parseFloat(accountSize) *
                              parseFloat(riskPercentage)) /
                            100
                          ).toFixed(2)}
                        </p>
                        <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                          Position Size: {positionSize.toFixed(2)} units
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertTitle>Example Calculation</AlertTitle>
                  <AlertDescription className="mt-2">
                    <p className="mb-2">For an account with:</p>
                    <ul className="list-disc pl-4 space-y-1">
                      <li>$10,000 account size</li>
                      <li>1% risk ($100)</li>
                      <li>$0.50 stop loss</li>
                    </ul>
                    <p className="mt-2 font-medium">
                      Position size would be: 200 units ($100 ÷ $0.50)
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

export default PositionSizeCalculator;
