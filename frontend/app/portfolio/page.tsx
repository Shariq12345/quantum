"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button"; // Assuming you have a styled button component
import Link from "next/link";

interface Stock {
  _id: Id<"stock">;
  _creationTime: number;
  symbol: string;
  price: number;
  userId: string;
  quantity: number;
  change: number;
  sector?: string;
}

export default function PortfolioPage() {
  const [totalValue, setTotalValue] = useState(0);
  const { user } = useUser();
  const userId = user?.id;

  const getStocks = useQuery(api.stock.getStocksByUserId, {
    userId: userId || "",
  });

  useEffect(() => {
    if (getStocks && getStocks.length > 0) {
      const total = getStocks.reduce(
        (sum, stock) => sum + stock.quantity * stock.price,
        0
      );
      setTotalValue(total);
    }
  }, [getStocks]);

  if (!getStocks) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 sm:p-6 md:p-8">
      <div className="max-w-6xl mx-auto pt-20">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-slate-800">Your Portfolio</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card className="bg-white shadow-md border-none">
            <CardHeader>
              <CardTitle className="text-slate-500 text-sm">
                Total Portfolio Value
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mt-[-10px]">
                <p className="text-3xl font-bold text-slate-800">
                  $
                  {totalValue.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Show a professional message if no stocks exist */}
        {getStocks.length === 0 ? (
          <motion.div
            className="flex flex-col items-center justify-center text-center mt-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* <img
              src="/images/empty-portfolio.svg" // Placeholder image
              alt="Empty Portfolio"
              className="w-64 h-64 mb-6"
            /> */}
            <h2 className="text-2xl font-semibold text-slate-700">
              Your portfolio is currently empty.
            </h2>
            <p className="text-slate-500 mt-2">
              Start investing today and build your financial future.
            </p>
            <Link href="/markets/stocks">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mt-6"
              >
                <Button className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition">
                  Explore Stocks
                </Button>
              </motion.div>
            </Link>
          </motion.div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {getStocks.map((stock) => (
              <motion.div
                key={stock._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="bg-white shadow-md border-none hover:shadow-lg transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-slate-600 flex items-center">
                      <img
                        src={`https://eodhd.com/img/logos/US/${stock.symbol}.png`}
                        width={32}
                        height={32}
                        className="mr-2"
                      />
                      <span className="text-xl">{stock.symbol}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-slate-800 mb-2">
                      ${stock.price.toFixed(2)}
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-xs text-slate-500">
                        Quantity: {stock.quantity}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
