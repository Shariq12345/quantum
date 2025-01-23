import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const buyStock = mutation({
  args: {
    userId: v.string(),
    symbol: v.string(),
    price: v.number(),
    quantity: v.number(),
  },
  handler: async (ctx, { userId, symbol, price, quantity }) => {
    const existingStock = await ctx.db
      .query("stock")
      .withIndex("by_user_id", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("symbol"), symbol))
      .first();

    if (existingStock) {
      await ctx.db.patch(existingStock._id, {
        quantity: existingStock.quantity + quantity,
      });
      return existingStock._id;
    }

    const newStockId = await ctx.db.insert("stock", {
      userId,
      symbol,
      price,
      quantity,
    });
    return newStockId;
  },
});
