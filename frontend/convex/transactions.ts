import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const recordTransaction = mutation({
  args: {
    userId: v.string(),
    transactionType: v.union(
      v.literal("buy"),
      v.literal("sell"),
      v.literal("deposit"),
      v.literal("withdrawal")
    ),
    amount: v.optional(v.number()), // For deposits/withdrawals
    stockSymbol: v.optional(v.string()), // For stock transactions
    quantity: v.optional(v.number()), // For stock transactions
    price: v.optional(v.number()), // For stock transactions
    bank: v.optional(v.string()), // For withdrawals
  },
  handler: async (ctx, args) => {
    const transactionData = {
      ...args,
      price: args.price ?? 0,
      quantity: args.quantity ?? 0,
      amount: args.amount ?? 0,
      stockSymbol: args.stockSymbol ?? "",
      bank: args.bank ?? "",
      timestamp: Date.now(),
    };

    await ctx.db.insert("transactions", transactionData);
  },
});

export const getTransactionsByUserId = query({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    return await ctx.db
      .query("transactions")
      .filter((q) => q.eq(q.field("userId"), userId))
      .order("desc") // Get the most recent transactions first
      .collect();
  },
});
