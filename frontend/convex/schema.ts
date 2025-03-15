import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  stock: defineTable({
    symbol: v.string(),
    price: v.number(),
    userId: v.string(),
    quantity: v.number(),
  })
    .index("by_user_id", ["userId"])
    .index("by_symbol", ["symbol"]),
  funds: defineTable({
    amount: v.number(),
    userId: v.string(),
  })
    .index("by_user_id", ["userId"])
    .index("by_amount", ["amount"]),
  users: defineTable({
    name: v.string(),
    email: v.string(),
    userId: v.string(),
  })
    .index("by_user_id", ["userId"])
    .index("by_email", ["email"]),
  transactions: defineTable({
    userId: v.string(),
    transactionType: v.union(
      v.literal("buy"),
      v.literal("sell"),
      v.literal("deposit"),
      v.literal("withdrawal")
    ), // Transaction type

    // Fields for stock transactions
    stockSymbol: v.optional(v.string()), // Only needed for buy/sell transactions
    quantity: v.optional(v.number()), // Only needed for buy/sell transactions
    price: v.optional(v.number()), // Only needed for buy/sell transactions

    // Fields for deposit/withdrawal transactions
    amount: v.optional(v.number()), // Only needed for deposit/withdrawal transactions
    bank: v.optional(v.string()), // Only needed for withdrawals

    timestamp: v.number(), // Unix timestamp
  })
    .index("by_user_id", ["userId"])
    .index("by_stock_symbol", ["stockSymbol"])
    .index("by_timestamp", ["timestamp"]), // For sorting transactions by date
});
