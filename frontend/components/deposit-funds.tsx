"use client";

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
  Info,
  Wallet,
} from "lucide-react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { useToast } from "@/hooks/use-toast";

export function DepositFundsDialog() {
  const [amount, setAmount] = useState("");
  const { toast } = useToast(); // Initialize the toast hook
  const userId = useUser().user?.id;
  const depositFunds = useMutation(api.funds.depositFunds);
  const getFundsByUserId = useQuery(api.funds.getFundsByUserId, {
    userId: userId ?? "",
  });

  const currentBalance = getFundsByUserId?.amount || 0;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!amount || isNaN(parseFloat(amount))) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount to add funds.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Add funds to the user's account
      await depositFunds({
        userId: userId ?? "", // Ensure userId is a string
        amount: parseFloat(amount),
      });

      // Show success toast
      toast({
        title: "Funds Added Successfully",
        description: `$${amount} has been added to your account.`,
      });

      // Reset the form
      setAmount("");
    } catch (error) {
      // Show error toast
      toast({
        title: "Error",
        description: "Failed to add funds. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white border-none hover:from-emerald-700 hover:to-emerald-800 transition-all duration-300 ease-in-out shadow-md hover:shadow-lg hover:text-white"
        >
          {/* <DollarSign className="mr-2 h-4 w-4" />  */}
          Add Funds
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white text-gray-800 rounded-lg shadow-2xl border border-gray-200">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-emerald-600">
            Add Funds to Your Account
          </DialogTitle>
          <DialogDescription className="text-gray-600 mt-2">
            Instantly add funds to your trading account.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 py-6">
          {/* Current Balance */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <Wallet className="h-6 w-6 text-emerald-500" />
              <div>
                <p className="text-sm text-gray-500">Current Balance</p>
                <p className="text-xl font-semibold text-gray-800">
                  ${currentBalance.toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          {/* Amount Input Field */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="amount" className="text-gray-700 font-medium">
              Amount to Add
            </Label>
            <div className="relative">
              <CircleDollarSign className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 ease-in-out"
              />
            </div>
          </div>

          {/* Info Section */}
          <div className="flex items-start gap-3 text-sm text-gray-600">
            <Info className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
            <p>
              You can start trading immediately with instant deposit up to
              $1,000.
            </p>
          </div>
          <Button
            type="submit"
            className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white hover:from-emerald-700 hover:to-emerald-800 transition-all duration-300 ease-in-out shadow-md hover:shadow-lg w-full"
          >
            <CreditCard className="mr-2 h-4 w-4" /> Add Funds
          </Button>
        </form>
        <DialogFooter className="flex flex-col gap-4">
          <p className="text-xs text-gray-500 text-center">
            By adding funds, you agree to our{" "}
            <a href="#" className="text-emerald-600 hover:underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-emerald-600 hover:underline">
              Privacy Policy
            </a>
            .
          </p>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
