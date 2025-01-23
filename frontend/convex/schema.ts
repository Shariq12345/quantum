import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  stock: defineTable({
    symbol: v.string(),
    price: v.number(),
    userId: v.string(),
    quantity: v.number(),
  }).index("by_user_id", ["userId"]),
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
});
