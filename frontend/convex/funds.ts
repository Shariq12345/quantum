import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { roundToTwoDecimals } from "@/lib/utils";

export const depositFunds = mutation({
  args: {
    userId: v.string(),
    amount: v.number(),
  },
  handler: async (ctx, { userId, amount }) => {
    // Ensure the amount being deposited is rounded to two decimals
    const roundedAmount = roundToTwoDecimals(amount);

    const existingFunds = await ctx.db
      .query("funds")
      .withIndex("by_user_id", (q) => q.eq("userId", userId))
      .first();

    if (existingFunds) {
      // Add the rounded amount to the existing amount and round it as well
      const updatedAmount = roundToTwoDecimals(
        existingFunds.amount + roundedAmount
      );

      await ctx.db.patch(existingFunds._id, {
        amount: updatedAmount,
      });
      return existingFunds._id;
    }

    // Insert a new record with the rounded amount
    const newFundsId = await ctx.db.insert("funds", {
      userId,
      amount: roundedAmount,
    });

    return newFundsId;
  },
});

export const getFundsByUserId = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, { userId }) => {
    const funds = await ctx.db
      .query("funds")
      .withIndex("by_user_id", (q) => q.eq("userId", userId))
      .first();
    return funds;
  },
});

export const deductFunds = mutation({
  args: {
    userId: v.string(),
    amount: v.number(),
  },
  handler: async (ctx, { userId, amount }) => {
    const existingFunds = await ctx.db
      .query("funds")
      .withIndex("by_user_id", (q) => q.eq("userId", userId))
      .first();
    if (!existingFunds) {
      throw new Error("Funds not found for the user");
    }
    if (existingFunds.amount < amount) {
      throw new Error("Insufficient funds");
    }

    await ctx.db.patch(existingFunds._id, {
      amount: existingFunds.amount - amount,
    });
    return existingFunds._id;
  },
});
