"use client";

import React from "react";
import TradingViewWidget from "./TradingViewWidget";

export default function TradingPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6 pt-[100px]">
      <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-4xl">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-4">
          Market Heatmap
        </h1>
        <TradingViewWidget />
      </div>
    </div>
  );
}
