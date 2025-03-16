"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  CircleDollarSign,
  CreditCard,
  DollarSign,
  Wallet,
  PiggyBank,
  Loader2,
  Shield,
  ChevronRight,
} from "lucide-react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function MyFundsDialog() {
  const [amount, setAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [selectedBank, setSelectedBank] = useState("");
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const { toast } = useToast();
  const userId = useUser().user?.id;

  // API Calls
  const depositFunds = useMutation(api.funds.depositFunds);
  const withdrawFunds = useMutation(api.funds.withdrawFunds);
  const getFundsByUserId = useQuery(api.funds.getFundsByUserId, {
    userId: userId ?? "",
  });

  const recordTransaction = useMutation(api.transactions.recordTransaction);

  const currentBalance = getFundsByUserId?.amount || 0;

  // Handle Deposit
  const handleDeposit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!amount || isNaN(Number.parseFloat(amount))) {
      toast({
        title: "Invalid Amount",
        description: "Enter a valid amount.",
        variant: "destructive",
      });
      return;
    }

    try {
      await depositFunds({
        userId: userId ?? "",
        amount: Number.parseFloat(amount),
      });

      // Log the deposit transaction
      await recordTransaction({
        userId: userId ?? "",
        transactionType: "deposit",
        amount: Number.parseFloat(amount),
      });

      toast({
        title: "Funds Added",
        description: `$${amount} added to your account.`,
      });
      setAmount("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add funds.",
        variant: "destructive",
      });
    }
  };

  // Handle Withdrawal
  const handleWithdraw = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (
      !withdrawAmount ||
      isNaN(Number.parseFloat(withdrawAmount)) ||
      Number.parseFloat(withdrawAmount) <= 0
    ) {
      toast({
        title: "Invalid Amount",
        description: "Enter a valid withdrawal amount.",
        variant: "destructive",
      });
      return;
    }
    if (!selectedBank) {
      toast({
        title: "Select a Bank",
        description: "Choose a bank for withdrawal.",
        variant: "destructive",
      });
      return;
    }
    if (Number.parseFloat(withdrawAmount) > currentBalance) {
      toast({
        title: "Insufficient Funds",
        description: "You don't have enough balance.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsWithdrawing(true);
      await withdrawFunds({
        userId: userId ?? "",
        amount: Number.parseFloat(withdrawAmount),
      });

      // Log the withdrawal transaction
      await recordTransaction({
        userId: userId ?? "",
        transactionType: "withdrawal",
        amount: Number.parseFloat(withdrawAmount),
        bank: selectedBank, // Include the bank information
      });

      toast({
        title: "Withdrawal Successful",
        description: `$${withdrawAmount} sent to ${selectedBank}.`,
      });
      setWithdrawAmount("");
      setSelectedBank("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Withdrawal failed. Try again.",
        variant: "destructive",
      });
    } finally {
      setIsWithdrawing(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white border-none hover:from-emerald-700 hover:to-emerald-800 transition-all duration-300 ease-in-out shadow-md hover:shadow-lg hover:text-white w-full sm:w-auto"
        >
          <Wallet className="mr-2 h-4 w-4" /> My Funds
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px] p-0 overflow-hidden bg-white rounded-2xl shadow-2xl border-0">
        <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 p-6 text-white">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-2xl font-bold tracking-tight">
              My Funds
            </DialogTitle>
            <DialogDescription className="text-emerald-100 mt-1 opacity-90">
              Securely manage your account balance
            </DialogDescription>
          </DialogHeader>

          {/* Current Balance Card */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 shadow-inner">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-lg">
                  <CircleDollarSign className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-emerald-100">Available Balance</p>
                  <p className="text-3xl font-bold">
                    ${currentBalance.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Tabs defaultValue="deposit" className="px-6 pt-4 pb-6">
          <TabsList className="grid grid-cols-2 mb-6">
            <TabsTrigger value="deposit">Deposit</TabsTrigger>
            <TabsTrigger value="withdraw">Withdraw</TabsTrigger>
          </TabsList>

          {/* Deposit Tab */}
          <TabsContent value="deposit">
            <form onSubmit={handleDeposit} className="space-y-6">
              <div className="space-y-2">
                <Label
                  htmlFor="deposit-amount"
                  className="text-gray-700 font-medium"
                >
                  Amount to Deposit
                </Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    id="deposit-amount"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="pl-10 h-12 text-lg font-medium border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Funds will be available immediately after deposit
                </p>
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-xl hover:from-emerald-700 hover:to-emerald-800 transition-all"
              >
                <CreditCard className="mr-2 h-4 w-4" /> Add Funds
              </Button>

              <div className="flex items-center justify-center gap-2 mt-4 text-xs text-gray-500">
                <Shield className="h-3 w-3" /> Secured with Bank-Grade
                Encryption
              </div>
            </form>
          </TabsContent>

          {/* Withdraw Tab */}
          <TabsContent value="withdraw">
            <form onSubmit={handleWithdraw} className="space-y-6">
              <div className="space-y-2">
                <Label
                  htmlFor="withdraw-amount"
                  className="text-gray-700 font-medium"
                >
                  Amount to Withdraw
                </Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    id="withdraw-amount"
                    type="number"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    placeholder="0.00"
                    className="pl-10 h-12 text-lg font-medium border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bank" className="text-gray-700 font-medium">
                  Select Destination
                </Label>
                <Select value={selectedBank} onValueChange={setSelectedBank}>
                  <SelectTrigger className="h-12 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500">
                    <SelectValue placeholder="Choose a bank" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Chase">Chase Bank</SelectItem>
                    <SelectItem value="Bank of America">
                      Bank of America
                    </SelectItem>
                    <SelectItem value="Wells Fargo">Wells Fargo</SelectItem>
                    <SelectItem value="CitiBank">CitiBank</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500 mt-1">
                  Funds typically arrive within 1-3 business days
                </p>
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all"
                disabled={isWithdrawing}
              >
                {isWithdrawing ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <PiggyBank className="mr-2 h-4 w-4" />
                )}
                {isWithdrawing ? "Processing..." : "Withdraw Funds"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        <DialogFooter className="px-6 py-4 bg-gray-50 border-t border-gray-100">
          <div className="w-full flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center">
              <Shield className="h-3 w-3 mr-1 text-emerald-600" />
              <span>Bank-level security</span>
            </div>
            <a
              href="/terms"
              className="flex items-center text-emerald-600 hover:underline"
            >
              Terms & Privacy <ChevronRight className="h-3 w-3 ml-1" />
            </a>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
