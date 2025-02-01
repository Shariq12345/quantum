import { Metadata } from "next";
import React from "react";

interface StockMarketLayoutProps {
  children: React.ReactNode;
}

export const metadata: Metadata = {
  title: "US Stock Market - Quantum",
};

const StockMarketLayout = ({ children }: StockMarketLayoutProps) => {
  return <div>{children}</div>;
};

export default StockMarketLayout;
