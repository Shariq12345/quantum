"use client";
import React, { useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
  BarChartIcon as ChartBar,
  Brain,
  Zap,
  TrendingUp,
  BarChart3,
  Lock,
  ExternalLink,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CardBody, CardContainer, CardItem } from "./ui/3d-card";
import Image from "next/image";

const features = [
  {
    icon: ChartBar,
    title: "Advanced Analytics",
    description:
      "Gain deep insights with our cutting-edge analytical tools and visualizations.",
    stats: { value: "99.9%", label: "Accuracy" },
  },
  {
    icon: Brain,
    title: "AI-Powered Predictions",
    description:
      "Harness the power of machine learning for accurate stock market forecasts.",
    stats: { value: "<2ms", label: "Response Time" },
  },
  {
    icon: Zap,
    title: "Real-Time Data",
    description:
      "Access up-to-the-minute market data for informed decision-making.",
    stats: { value: "500k+", label: "Daily Predictions" },
  },
  {
    icon: TrendingUp,
    title: "Trend Analysis",
    description:
      "Identify and capitalize on market trends with our advanced algorithms.",
    stats: { value: "94%", label: "Success Rate" },
  },
  {
    icon: BarChart3,
    title: "Portfolio Optimization",
    description:
      "Maximize returns and minimize risks with AI-driven portfolio recommendations.",
    stats: { value: "2.4x", label: "Avg. Returns" },
  },
  {
    icon: Lock,
    title: "Secure Platform",
    description:
      "Trade with confidence on our highly secure and encrypted platform.",
    stats: { value: "256-bit", label: "Encryption" },
  },
];

export function FeaturesSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section className="py-24 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 text-emerald-400 text-sm mb-6">
            <Brain size={16} className="animate-pulse" />
            Powered by Advanced AI
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Powerful Features for{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-500">
              Smart Investing
            </span>
          </h2>

          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Our AI-powered platform offers a comprehensive suite of advanced
            tools to give you the competitive edge in stock market analysis and
            prediction.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <CardContainer className="inter-var">
                <CardBody className="relative bg-slate-800/50 backdrop-blur-sm border-slate-700 hover:shadow-2xl hover:shadow-emerald-500/[0.1] w-full h-full rounded-xl p-6 border group">
                  <CardItem
                    translateZ="50"
                    className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center mb-4"
                  >
                    <feature.icon className="w-6 h-6 text-emerald-500" />
                  </CardItem>

                  <CardItem
                    translateZ="60"
                    className="text-xl font-semibold text-white flex items-center gap-2"
                  >
                    {feature.title}
                    <ExternalLink
                      size={16}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400"
                    />
                  </CardItem>

                  <CardItem
                    as="p"
                    translateZ="80"
                    className="text-gray-400 mt-4"
                  >
                    {feature.description}
                  </CardItem>

                  <CardItem
                    translateZ="100"
                    className="pt-4 mt-4 border-t border-slate-700"
                  >
                    <div className="text-2xl font-bold text-white">
                      {feature.stats.value}
                    </div>
                    <div className="text-sm text-gray-400">
                      {feature.stats.label}
                    </div>
                  </CardItem>
                </CardBody>
              </CardContainer>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
