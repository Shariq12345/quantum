"use client";

import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowDown,
  ArrowUp,
  TrendingUp,
  TrendingDown,
  Search,
  Download,
  Clock,
  Info,
} from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export default function TransactionsPage() {
  const { user } = useUser();
  const userId = user?.id;
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const transactions = useQuery(api.transactions.getTransactionsByUserId, {
    userId: userId || "",
  });

  // Filter transactions based on type and search query
  const filteredTransactions = transactions?.filter((txn) => {
    const matchesFilter = filter === "all" || txn.transactionType === filter;
    const matchesSearch =
      searchQuery === "" ||
      (txn.stockSymbol &&
        txn.stockSymbol.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (txn.bank && txn.bank.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  // Calculate summary statistics
  const totalDeposits =
    transactions
      ?.filter((t) => t.transactionType === "deposit")
      .reduce((sum, t) => sum + (t.amount || 0), 0) || 0;

  const totalWithdrawals =
    transactions
      ?.filter((t) => t.transactionType === "withdrawal")
      .reduce((sum, t) => sum + (t.amount || 0), 0) || 0;

  const totalTrades =
    transactions?.filter(
      (t) => t.transactionType === "buy" || t.transactionType === "sell"
    ).length || 0;

  // Transaction type badge styling
interface Transaction {
    _id: string;
    transactionType: "buy" | "sell" | "deposit" | "withdrawal";
    stockSymbol?: string;
    bank?: string;
    amount?: number;
    quantity?: number;
    price?: number;
    timestamp: string;
}

const getBadgeStyles = (type: Transaction["transactionType"]): string => {
    switch (type) {
        case "buy":
            return "bg-green-100 text-green-800 hover:bg-green-200";
        case "sell":
            return "bg-red-100 text-red-800 hover:bg-red-200";
        case "deposit":
            return "bg-blue-100 text-blue-800 hover:bg-blue-200";
        case "withdrawal":
            return "bg-orange-100 text-orange-800 hover:bg-orange-200";
        default:
            return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
};

  // Loading state
  if (!transactions) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 pt-[120px]">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">
            Transaction History
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-32 rounded-xl" />
            ))}
          </div>
          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-full max-w-md" />
            </CardHeader>
            <CardContent>
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex justify-between py-4 border-b">
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="h-6 w-32" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-6 pt-[110px]">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Transaction History
            </h1>
            <p className="text-gray-500 mt-1">
              Track all your financial activities
            </p>
          </div>

          <div className="flex gap-2 mt-4 md:mt-0">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                >
                  <Download className="h-4 w-4" />
                  <span>Export</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>Export as CSV</DropdownMenuItem>
                <DropdownMenuItem>Export as PDF</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </motion.div>

        {/* Summary Cards */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
        >
          <Card className="bg-blue-50 border-blue-100">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-blue-700">
                Total Deposits
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold text-blue-800">
                  ${totalDeposits.toFixed(2)}
                </div>
                <div className="p-2 bg-blue-100 rounded-full">
                  <ArrowDown className="h-5 w-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-orange-50 border-orange-100">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-orange-700">
                Total Withdrawals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold text-orange-800">
                  ${totalWithdrawals.toFixed(2)}
                </div>
                <div className="p-2 bg-orange-100 rounded-full">
                  <ArrowUp className="h-5 w-5 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-green-50 border-green-100">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-green-700">
                Total Trades
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold text-green-800">
                  {totalTrades}
                </div>
                <div className="p-2 bg-green-100 rounded-full">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Filters and Search */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="flex flex-col md:flex-row gap-4 mb-6"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search transactions..."
              className="pl-9 bg-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-full md:w-[180px] bg-white">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Transactions</SelectItem>
              <SelectItem value="buy">Buy Orders</SelectItem>
              <SelectItem value="sell">Sell Orders</SelectItem>
              <SelectItem value="deposit">Deposits</SelectItem>
              <SelectItem value="withdrawal">Withdrawals</SelectItem>
            </SelectContent>
          </Select>
        </motion.div>

        {/* Transactions List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {filteredTransactions?.length === 0 ? (
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="bg-gray-100 p-3 rounded-full mb-4">
                  <Info className="h-6 w-6 text-gray-500" />
                </div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">
                  No transactions found
                </h3>
                <p className="text-gray-500 text-center max-w-md">
                  {filter !== "all"
                    ? `You don't have any ${filter} transactions yet.`
                    : searchQuery
                      ? "No transactions match your search criteria."
                      : "Start investing or deposit funds to see your transaction history."}
                </p>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-white border border-gray-200 shadow-sm overflow-hidden">
              <CardHeader className="bg-gray-50 py-4">
                <CardTitle className="text-lg font-medium">
                  Recent Transactions
                </CardTitle>
                <CardDescription>
                  Showing {filteredTransactions?.length} of {transactions.length}{" "}
                  transactions
                </CardDescription>
              </CardHeader>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b text-left text-gray-600 bg-gray-50">
                      <th className="p-4 font-medium">Type</th>
                      <th className="p-4 font-medium">Details</th>
                      <th className="p-4 font-medium">Amount</th>
                      <th className="p-4 font-medium">Date & Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    <AnimatePresence>
                      {filteredTransactions?.map((txn, index) => (
                        <motion.tr
                          key={txn._id}
                          className="border-b hover:bg-gray-50 transition-colors"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2, delay: index * 0.05 }}
                        >
                          {/* Transaction Type with Icon */}
                          <td className="p-4">
                            <Badge
                              variant="outline"
                              className={`flex items-center gap-1.5 font-medium px-2.5 py-1 ${getBadgeStyles(txn.transactionType)}`}
                            >
                              {txn.transactionType === "buy" && (
                                <TrendingUp className="h-3.5 w-3.5" />
                              )}
                              {txn.transactionType === "sell" && (
                                <TrendingDown className="h-3.5 w-3.5" />
                              )}
                              {txn.transactionType === "deposit" && (
                                <ArrowDown className="h-3.5 w-3.5" />
                              )}
                              {txn.transactionType === "withdrawal" && (
                                <ArrowUp className="h-3.5 w-3.5" />
                              )}
                              <span className="capitalize">
                                {txn.transactionType}
                              </span>
                            </Badge>
                          </td>

                          {/* Details */}
                          <td className="p-4 text-gray-800">
                            {txn.transactionType === "buy" ||
                            txn.transactionType === "sell" ? (
                              <div>
                                <div className="font-medium">
                                  {txn.quantity} shares of {txn.stockSymbol}
                                </div>
                                <div className="text-sm text-gray-500">
                                  Price: ${txn.price?.toFixed(2)} per share
                                </div>
                              </div>
                            ) : txn.transactionType === "deposit" ? (
                              <div>
                                <div className="font-medium">
                                  Funds added to balance
                                </div>
                                <div className="text-sm text-gray-500">
                                  Payment method: Credit Card
                                </div>
                              </div>
                            ) : txn.transactionType === "withdrawal" ? (
                              <div>
                                <div className="font-medium">
                                  Transferred to {txn.bank || "bank account"}
                                </div>
                                <div className="text-sm text-gray-500">
                                  Processing time: 1-3 business days
                                </div>
                              </div>
                            ) : null}
                          </td>

                          {/* Amount */}
                          <td className="p-4">
                            <div
                              className={`font-semibold ${
                                txn.transactionType === "buy" ||
                                txn.transactionType === "withdrawal"
                                  ? "text-red-600"
                                  : "text-green-600"
                              }`}
                            >
                              {txn.transactionType === "buy" ||
                              txn.transactionType === "withdrawal"
                                ? "-"
                                : "+"}
                              $
                              {txn.transactionType === "buy" ||
                              txn.transactionType === "sell"
                                ? (
                                    (txn.quantity ?? 0) * (txn.price ?? 0)
                                  ).toFixed(2)
                                : txn.amount?.toFixed(2)}
                            </div>
                          </td>

                          {/* Date */}
                          <td className="p-4">
                            <div className="font-medium">
                              {new Date(txn.timestamp).toLocaleDateString(
                                undefined,
                                {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                }
                              )}
                            </div>
                            <div className="text-sm text-gray-500">
                              {new Date(txn.timestamp).toLocaleTimeString(
                                undefined,
                                {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )}
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>

              <CardFooter className="flex justify-between items-center py-4 bg-gray-50 border-t">
                <div className="text-sm text-gray-500 flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  Updated just now
                </div>
                <Button variant="outline" size="sm" className="text-sm">
                  View All
                </Button>
              </CardFooter>
            </Card>
          )}
        </motion.div>
      </div>
    </div>
  );
}
