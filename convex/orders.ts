import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

const orderStatusValidator = v.union(
  v.literal("pending"),
  v.literal("processing"),
  v.literal("shipped"),
  v.literal("delivered"),
  v.literal("cancelled")
);

const orderItemValidator = v.object({
  productId: v.id("products"),
  name: v.string(),
  quantity: v.number(),
  color: v.string(),
  size: v.number(),
  price: v.number(),
});

const shippingAddressValidator = v.object({
  fullName: v.string(),
  phone: v.string(),
  address: v.string(),
  city: v.string(),
  postalCode: v.string(),
});

// ==================== ORDER QUERIES ====================

/**
 * Get all orders (newest first)
 */
export const getAllOrders = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("orders").order("desc").collect();
  },
});

/**
 * Get order by ID
 */
export const getOrder = query({
  args: {
    orderId: v.id("orders"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.orderId);
  },
});

/**
 * Get orders by user ID
 */
export const getOrdersByUser = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("orders")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();
  },
});

/**
 * Get orders by session ID
 */
export const getOrdersBySession = query({
  args: {
    sessionId: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("orders")
      .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId))
      .order("desc")
      .collect();
  },
});

/**
 * Get orders by status
 */
export const getOrdersByStatus = query({
  args: {
    status: orderStatusValidator,
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("orders")
      .withIndex("by_status", (q) => q.eq("status", args.status))
      .order("desc")
      .collect();
  },
});

// ==================== ORDER MUTATIONS ====================

/**
 * Create a new order (admin or checkout)
 */
export const createOrder = mutation({
  args: {
    userId: v.optional(v.id("users")),
    sessionId: v.string(),
    status: v.optional(orderStatusValidator),
    totalAmount: v.number(),
    shippingAmount: v.number(),
    items: v.array(orderItemValidator),
    shippingAddress: shippingAddressValidator,
    paymentId: v.optional(v.id("payments")),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const orderId = await ctx.db.insert("orders", {
      userId: args.userId,
      sessionId: args.sessionId,
      status: args.status || "pending",
      totalAmount: args.totalAmount,
      shippingAmount: args.shippingAmount,
      items: args.items,
      shippingAddress: args.shippingAddress,
      paymentId: args.paymentId,
      notes: args.notes,
      createdAt: now,
      updatedAt: now,
    });

    // If paymentId was provided, attach orderId to that payment
    if (args.paymentId) {
      await ctx.db.patch(args.paymentId, {
        orderId,
        updatedAt: now,
      });
    }

    return orderId;
  },
});

/**
 * Update order status
 */
export const updateOrderStatus = mutation({
  args: {
    orderId: v.id("orders"),
    status: orderStatusValidator,
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.get(args.orderId);
    if (!existing) {
      throw new Error("Order not found");
    }

    await ctx.db.patch(args.orderId, {
      status: args.status,
      updatedAt: Date.now(),
    });

    return { success: true };
  },
});

/**
 * Update order shipping address
 */
export const updateOrderShipping = mutation({
  args: {
    orderId: v.id("orders"),
    shippingAddress: shippingAddressValidator,
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.get(args.orderId);
    if (!existing) {
      throw new Error("Order not found");
    }

    await ctx.db.patch(args.orderId, {
      shippingAddress: args.shippingAddress,
      updatedAt: Date.now(),
    });

    return { success: true };
  },
});

/**
 * Update order notes
 */
export const updateOrderNotes = mutation({
  args: {
    orderId: v.id("orders"),
    notes: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.get(args.orderId);
    if (!existing) {
      throw new Error("Order not found");
    }

    await ctx.db.patch(args.orderId, {
      notes: args.notes,
      updatedAt: Date.now(),
    });

    return { success: true };
  },
});

/**
 * Delete an order (admin only)
 */
export const deleteOrder = mutation({
  args: {
    orderId: v.id("orders"),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.get(args.orderId);
    if (!existing) {
      throw new Error("Order not found");
    }

    // If there's an associated payment, dissociate the orderId
    if (existing.paymentId) {
      const payment = await ctx.db.get(existing.paymentId);
      if (payment) {
        await ctx.db.patch(existing.paymentId, {
          orderId: undefined,
          updatedAt: Date.now(),
        });
      }
    }

    await ctx.db.delete(args.orderId);
    return { success: true };
  },
});
