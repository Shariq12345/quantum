"use client";

import type React from "react";
import { motion } from "framer-motion";
import { Brain, Check, CircleDollarSign } from "lucide-react";

interface PlanFeature {
  text: string;
  included: boolean;
}

interface PricingPlan {
  tier: string;
  price: string;
  features: PlanFeature[];
  isPopular?: boolean;
}

const PricingCard: React.FC<PricingPlan> = ({
  tier,
  price,
  features,
  isPopular,
}) => {
  return (
    <motion.div
      whileHover={{ y: -10 }}
      className={`relative rounded-2xl overflow-hidden ${
        isPopular ? "border-2 border-emerald-600" : "border border-gray-200"
      }`}
    >
      {isPopular && (
        <div className="absolute top-0 right-0">
          <div className="text-xs font-semibold bg-emerald-600 text-white py-1 px-3 rounded-bl-lg">
            Most Popular
          </div>
        </div>
      )}
      <div className={`p-8 ${isPopular ? "bg-emerald-600/5" : "bg-white"}`}>
        <h3 className="text-2xl font-bold mb-2">{tier}</h3>
        <div className="mb-6">
          <span className="text-5xl font-extrabold">${price}</span>
          <span className="text-gray-500 ml-2">/month</span>
        </div>
        <ul className="space-y-4 mb-8">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-3">
              <div
                className={`mt-1 ${feature.included ? "text-emerald-600" : "text-gray-300"}`}
              >
                {feature.included ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <div className="w-5 h-5 border-2 border-gray-300 rounded-full" />
                )}
              </div>
              <span
                className={feature.included ? "text-gray-800" : "text-gray-400"}
              >
                {feature.text}
              </span>
            </li>
          ))}
        </ul>
        <button
          className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${
            isPopular
              ? "bg-emerald-600 text-white hover:bg-emerald-600/90"
              : "bg-gray-100 text-gray-800 hover:bg-gray-200"
          }`}
        >
          Get Started
        </button>
      </div>
    </motion.div>
  );
};

export const Pricing: React.FC = () => {
  const plans: PricingPlan[] = [
    {
      tier: "Basic",
      price: "10",
      features: [
        { text: "Basic Analytics Dashboard", included: true },
        { text: "Real-Time Market Data", included: true },
        { text: "Standard AI Predictions", included: true },
        { text: "Basic Portfolio Tracking", included: true },
        { text: "Community Support", included: true },
        { text: "Advanced AI Models", included: false },
        { text: "Custom Algorithms", included: false },
        { text: "Priority API Access", included: false },
      ],
    },
    {
      tier: "Pro",
      price: "25",
      isPopular: true,
      features: [
        { text: "Advanced Analytics Suite", included: true },
        { text: "Real-Time Data with <2ms Latency", included: true },
        { text: "AI-Powered Predictions (94% Accuracy)", included: true },
        { text: "Portfolio Optimization", included: true },
        { text: "Trend Analysis Tools", included: true },
        { text: "Priority Support", included: true },
        { text: "Custom Algorithms", included: true },
        { text: "API Access", included: false },
      ],
    },
    {
      tier: "Enterprise",
      price: "199",
      features: [
        { text: "Full Analytics Suite + Custom Reports", included: true },
        { text: "Dedicated Data Streams", included: true },
        { text: "Custom AI Model Training", included: true },
        { text: "Advanced Portfolio Optimization", included: true },
        { text: "Custom Integration Support", included: true },
        { text: "24/7 Dedicated Support", included: true },
        { text: "Unlimited API Access", included: true },
        { text: "On-Premises Deployment", included: true },
      ],
    },
  ];

  return (
    <section className="bg-gradient-to-b from-gray-50 to-white py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500 text-white text-sm mb-6">
            <CircleDollarSign size={18} className="animate-bounce" />
            For you
          </div>
          <h2 className="text-4xl font-bold mb-4">
            Pricing {""}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-500">
              Plans
            </span>
          </h2>
          <p className="text-base text-gray-600 max-w-3xl mx-auto">
            Choose the perfect plan for your quantum computing needs. Unlock the
            power of quantum with our flexible pricing options.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <PricingCard key={index} {...plan} />
          ))}
        </div>
        <div className="mt-16 text-center">
          <p className="text-gray-600 mb-4">
            Not sure which plan is right for you? Contact our sales team for a
            custom quote.
          </p>
          <button className="bg-gray-800 text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-700 transition-colors">
            Contact Sales
          </button>
        </div>
      </div>
    </section>
  );
};
