"use client";
import { useState, useEffect } from "react";
import {
  ArrowUpIcon,
  ArrowDownIcon,
  TrendingUpIcon,
  ActivityIcon,
} from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

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
  const [portfolioChange, setPortfolioChange] = useState(0);
  const { user } = useUser();
  const userId = user?.id;

  const getStocks = useQuery(api.stock.getStocksByUserId, {
    userId: userId || "",
  });

  useEffect(() => {
    if (getStocks) {
      const total = getStocks.reduce(
        (sum, stock) => sum + stock.quantity * stock.price,
        0
      );
    //   const overallChange = getStocks.reduce(
    //     (sum, stock) =>
    //       sum + (stock.change * (stock.quantity * stock.price)) / total,
    //     0
    //   );

      setTotalValue(total);
    //   setPortfolioChange(overallChange);
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
          {/* <Badge variant="secondary" className="text-sm">
            <ActivityIcon className="w-4 h-4 mr-2" />
            Real-time Tracking
          </Badge> */}
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
                      className="mr-2" // Add margin to separate the logo and text
                    />
                    <span className="text-xl">{stock.symbol}</span>
                  </CardTitle>
                  {/* <Badge
            variant={stock.change >= 0 ? "secondary" : "destructive"}
            className="text-xs"
          >
            {stock.sector}
          </Badge> */}
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-slate-800 mb-2">
                    ${stock.price.toFixed(2)}
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-xs text-slate-500">
                      Quantity: {stock.quantity}
                    </p>
                    {/* <div
              className={`text-xs font-semibold flex items-center ${stock.change >= 0 ? "text-green-600" : "text-red-600"}`}
            >
              {stock.change >= 0 ? (
                <ArrowUpIcon className="w-4 h-4 mr-1" />
              ) : (
                <ArrowDownIcon className="w-4 h-4 mr-1" />
              )}
              {Math.abs(stock.change)}%
            </div> */}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
