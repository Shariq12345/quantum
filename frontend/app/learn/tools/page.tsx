"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calculator, BarChart, TrendingDown, Scale } from "lucide-react";

const tools = [
  {
    title: "Position Size Calculator",
    description:
      "Helps with risk management by calculating the optimal position size.",
    icon: <Calculator className="h-10 w-10 text-blue-500" />,
    href: "tools/position-size-calculator",
  },
  {
    title: "Profit/Loss Calculator",
    description:
      "Estimates potential trade outcomes based on entry, exit, and position size.",
    icon: <BarChart className="h-10 w-10 text-green-500" />,
    href: "tools/profit-loss-calculator",
  },
  {
    title: "Risk-Reward Ratio Calculator",
    description:
      "Assists in making informed decisions by calculating risk-reward ratios.",
    icon: <Scale className="h-10 w-10 text-red-500" />,
    href: "tools/risk-reward-calculator",
  },
];

const Tools = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary pt-[120px] pb-8 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-12">
          Tools & Calculators
        </h1>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool, index) => (
            <Card
              key={index}
              className="transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer"
              onClick={() => (window.location.href = tool.href)}
            >
              <CardHeader className="flex items-center space-x-4">
                {tool.icon}
                <CardTitle>{tool.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm text-center">
                  {tool.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Tools;
