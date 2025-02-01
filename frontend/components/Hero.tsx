"use client";

import React, { useState, useEffect } from "react";
import { LineChart, Line, ResponsiveContainer, Tooltip } from "recharts";
import {
  TrendingUp,
  BarChartIcon as ChartBar,
  Coins,
  TrendingUpIcon,
  ArrowRight,
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAnimatedCounter } from "./use-animated-counter";

const mockData = Array.from({ length: 100 }, (_, i) => ({
  value: 50 + Math.sin(i / 5) * 20 + Math.random() * 10,
}));

export default function Hero() {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const accuracy = useAnimatedCounter(94.2);
  const successRate = useAnimatedCounter(89.7);
  const profitRatio = useAnimatedCounter(2.4);

  return (
    <div className="bg-gradient-to-b from-slate-900 to-slate-800 min-h-screen">
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div className="absolute inset-x-0 top-28 -z-10 transform-gpu overflow-hidden blur-3xl">
          <svg
            className="relative left-[calc(50%-11rem)] -z-10 h-[21.1875rem] max-w-none -translate-x-1/2 rotate-[30deg] sm:left-[calc(50%-30rem)] sm:h-[42.375rem]"
            viewBox="0 0 1155 678"
          >
            <path
              fill="url(#45de2b6b-92d5-4d68-a6a0-9b9b2abad533)"
              fillOpacity=".3"
              d="M317.219 518.975L203.852 678 0 438.341l317.219 80.634 204.172-286.402c1.307 132.337 45.083 346.658 209.733 145.248C936.936 126.058 882.053-94.234 1031.02 41.331c119.18 108.451 130.68 295.337 121.53 375.223L855 299l21.173 362.054-558.954-142.079z"
            />
            <defs>
              <linearGradient
                id="45de2b6b-92d5-4d68-a6a0-9b9b2abad533"
                x1="1155.49"
                x2="-78.208"
                y1=".177"
                y2="474.645"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#10B981" />
                <stop offset={1} stopColor="#2563EB" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        <div className="mx-auto max-w-7xl py-24 sm:py-32">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex-1 space-y-8"
            >
              <Badge variant="secondary" className="px-4 py-2 text-sm">
                <ChartBar size={16} className="mr-2 animate-pulse" />
                Real-time market predictions
              </Badge>

              <h1 className="text-5xl font-bold tracking-tight text-white sm:text-6xl">
                AI-Powered Stock
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-500">
                  {" "}
                  Analytics
                </span>
              </h1>

              <p className="text-lg text-gray-400">
                Harness the power of advanced AI to predict market trends with
                unprecedented accuracy. Make data-driven decisions with our
                cutting-edge stock prediction platform.
              </p>

              <div className="flex items-center gap-6">
                <Button
                  size="lg"
                  className="group bg-emerald-600 hover:bg-emerald-700"
                >
                  Start Free Trial
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
                <Button variant="outline" size="lg">
                  View Demo
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex-1 w-full"
            >
              <Card className="relative overflow-hidden">
                <CardHeader className="pb-0">
                  <CardTitle className="text-2xl">Market Prediction</CardTitle>
                  <CardDescription>Real-time stock analysis</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="absolute top-4 right-4 p-3 bg-emerald-500 rounded-full shadow-lg">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>

                  <div className="h-64 mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={mockData}>
                        <Line
                          type="monotone"
                          dataKey="value"
                          stroke="url(#gradient)"
                          strokeWidth={2.5}
                          dot={false}
                          activeDot={{ r: 8 }}
                        />
                        <Tooltip
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              return (
                                <div className="bg-white p-2 rounded shadow">
                                  <p className="text-sm text-gray-700">
                                    Value:{" "}
                                    {typeof payload[0]?.value === "number"
                                      ? payload[0].value.toFixed(2)
                                      : payload[0]?.value}
                                  </p>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        <defs>
                          <linearGradient
                            id="gradient"
                            x1="0"
                            y1="0"
                            x2="1"
                            y2="0"
                          >
                            <stop offset="0%" stopColor="#10B981" />
                            <stop offset="100%" stopColor="#2563EB" />
                          </linearGradient>
                        </defs>
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mt-6">
                    {[
                      { icon: ChartBar, label: "Accuracy", value: accuracy },
                      {
                        icon: TrendingUpIcon,
                        label: "Success Rate",
                        value: successRate,
                      },
                      {
                        icon: Coins,
                        label: "Profit Ratio",
                        value: profitRatio,
                      },
                    ].map((stat, i) => (
                      <motion.div
                        key={i}
                        className="p-4 rounded-xl bg-gray-900 "
                        whileHover={{ scale: 1.05 }}
                        onHoverStart={() => setHoveredIndex(i)}
                        onHoverEnd={() => setHoveredIndex(null)}
                      >
                        <stat.icon className="w-5 h-5 text-emerald-400 mb-2" />
                        <p className="text-sm text-gray-400">{stat.label}</p>
                        <p className="text-lg font-semibold text-white">
                          {typeof stat.value === "number" &&
                          stat.label !== "Profit Ratio"
                            ? `${stat.value.toFixed(1)}%`
                            : stat.label === "Profit Ratio"
                              ? `${stat.value.toFixed(1)}x`
                              : stat.value}
                        </p>
                        {hoveredIndex === i && (
                          <motion.div
                            className="absolute inset-0 bg-emerald-500/10 rounded-xl"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                          />
                        )}
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
