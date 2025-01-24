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

export const sellStock = mutation({
  args: {
    userId: v.string(),
    symbol: v.string(),
    quantity: v.number(),
  },
  handler: async (ctx, { userId, symbol, quantity }) => {
    if (quantity <= 0) {
      throw new Error("Quantity must be greater than zero");
    }

    const stock = await ctx.db
      .query("stock")
      .withIndex("by_user_id", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("symbol"), symbol))
      .first();

    if (!stock) {
      throw new Error(`Stock with symbol "${symbol}" not found for user`);
    }

    if (stock.quantity < quantity) {
      throw new Error(
        `Insufficient quantity of "${symbol}" to sell. Available: ${stock.quantity}`
      );
    }

    if (stock.quantity === quantity) {
      // If the quantity sold matches the stock's quantity, delete the stock entry
      await ctx.db.delete(stock._id);
    } else {
      // Otherwise, update the stock with the new quantity
      await ctx.db.patch(stock._id, {
        quantity: stock.quantity - quantity,
      });
    }

    return stock._id;
  },
});

export const getPurchasePrice = query({
  args: {
    symbol: v.string(),
  },
  handler: async (ctx, { symbol }) => {
    const stock = await ctx.db
      .query("stock")
      .withIndex("by_symbol", (q) => q.eq("symbol", symbol))
      .first();
    return stock?.price ?? 0;
  },
});

export const getStocksByUserId = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, { userId }) => {
    // Fetch all stocks for the specified user
    const userStocks = await ctx.db
      .query("stock")
      .filter((q) => q.eq(q.field("userId"), userId))
      .collect();

    // Optional: Add error handling if no stocks are found
    if (userStocks.length === 0) {
      throw new Error("No stocks found for this user");
    }

    return userStocks;
  },
});
