import { v } from "convex/values";
import { mutation, query, internalMutation } from "./_generated/server";
import { internal } from "./_generated/api";
import { Id, Doc } from "./_generated/dataModel";

// ==================== PAYMENT MUTATIONS ====================

/**
 * Create a new payment record
 */
export const createPayment = mutation({
  args: {
    userId: v.optional(v.id("users")),
    sessionId: v.string(),
    amount: v.number(),
    phoneNumber: v.string(),
    status: v.union(
      v.literal("pending"),
      v.literal("completed"),
      v.literal("failed"),
      v.literal("cancelled")
    ),
  },
  handler: async (ctx, args) => {
    const paymentId = await ctx.db.insert("payments", {
      userId: args.userId,
      sessionId: args.sessionId,
      amount: args.amount,
      phoneNumber: args.phoneNumber,
      status: args.status,
      callbackReceived: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return paymentId;
  },
});

/**
 * Update payment status
 */
export const updatePaymentStatus = mutation({
  args: {
    paymentId: v.id("payments"),
    status: v.union(
      v.literal("pending"),
      v.literal("completed"),
      v.literal("failed"),
      v.literal("cancelled")
    ),
    resultCode: v.optional(v.string()),
    resultDesc: v.optional(v.string()),
    mpesaReceiptNumber: v.optional(v.string()),
    transactionDate: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { paymentId, ...updates } = args;

    await ctx.db.patch(paymentId, {
      ...updates,
      updatedAt: Date.now(),
    });

    return { success: true };
  },
});

/**
 * Update payment details (admin manual edit)
 */
export const updatePaymentDetails = mutation({
  args: {
    paymentId: v.id("payments"),
    amount: v.optional(v.number()),
    phoneNumber: v.optional(v.string()),
    status: v.optional(
      v.union(
        v.literal("pending"),
        v.literal("completed"),
        v.literal("failed"),
        v.literal("cancelled")
      )
    ),
    mpesaReceiptNumber: v.optional(v.string()),
    resultDesc: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { paymentId, ...updates } = args;
    await ctx.db.patch(paymentId, {
      ...updates,
      updatedAt: Date.now(),
    });
    return { success: true };
  },
});

/**
 * Update payment with checkout request IDs
 */
export const updatePaymentCheckoutRequest = mutation({
  args: {
    paymentId: v.id("payments"),
    checkoutRequestId: v.string(),
    merchantRequestId: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.paymentId, {
      checkoutRequestId: args.checkoutRequestId,
      merchantRequestId: args.merchantRequestId,
      updatedAt: Date.now(),
    });

    return { success: true };
  },
});

/**
 * Process MPESA callback - update payment with callback data
 */
export const processMpesaCallback = mutation({
  args: {
    checkoutRequestId: v.string(),
    callbackData: v.any(),
  },
  handler: async (ctx, args) => {
    // Find payment by checkout request ID
    const payment = await ctx.db
      .query("payments")
      .withIndex("by_checkout_request", (q) =>
        q.eq("checkoutRequestId", args.checkoutRequestId)
      )
      .first();

    if (!payment) {
      throw new Error("Payment not found for this checkout request");
    }

    // Extract callback data
    const result = args.callbackData.Body?.stkCallback;
    const resultCode = result.ResultCode;
    const resultDesc = result.ResultDesc;
    const metadata = result.CallbackMetadata?.Item || [];

    // Extract receipt number and transaction date from metadata
    let mpesaReceiptNumber: string | undefined;
    let transactionDate: string | undefined;

    for (const item of metadata) {
      if (item.Name === "MpesaReceiptNumber") {
        mpesaReceiptNumber = item.Value;
      }
      if (item.Name === "TransactionDate") {
        transactionDate = item.Value;
      }
    }

    // Update payment based on result code
    let status: "completed" | "failed" | "cancelled";
    if (resultCode === "0") {
      status = "completed";
    } else if (resultCode === "1032") {
      status = "cancelled";
    } else {
      status = "failed";
    }

    await ctx.db.patch(payment._id, {
      status,
      resultCode: resultCode.toString(),
      resultDesc,
      mpesaReceiptNumber,
      transactionDate,
      callbackReceived: true,
      callbackData: args.callbackData,
      updatedAt: Date.now(),
    });

    // If payment completed, process the order
    if (status === "completed") {
      await ctx.runMutation(internal.payments.createOrderFromPayment, {
        paymentId: payment._id,
      });
    }

    return { success: true, paymentId: payment._id };
  },
});

/**
 * Delete a payment (admin only)
 */
export const deletePayment = mutation({
  args: {
    paymentId: v.id("payments"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.paymentId);
    return { success: true };
  },
});

// ==================== ORDER MUTATIONS ====================

/**
 * Create an order from cart items
 */
export const createOrder = mutation({
  args: {
    userId: v.optional(v.id("users")),
    sessionId: v.string(),
    totalAmount: v.number(),
    shippingAmount: v.number(),
    items: v.array(
      v.object({
        productId: v.id("products"),
        name: v.string(),
        quantity: v.number(),
        color: v.string(),
        size: v.number(),
        price: v.number(),
      })
    ),
    shippingAddress: v.object({
      fullName: v.string(),
      phone: v.string(),
      address: v.string(),
      city: v.string(),
      postalCode: v.string(),
    }),
    paymentId: v.optional(v.id("payments")),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const orderId = await ctx.db.insert("orders", {
      userId: args.userId,
      sessionId: args.sessionId,
      status: "pending",
      totalAmount: args.totalAmount,
      shippingAmount: args.shippingAmount,
      items: args.items,
      shippingAddress: args.shippingAddress,
      paymentId: args.paymentId,
      notes: args.notes,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    // Update payment with order ID if provided
    if (args.paymentId) {
      await ctx.db.patch(args.paymentId, {
        orderId,
      });
    }

    return orderId;
  },
});

/**
 * Create order from completed payment
 * This processes cart items and reduces stock
 */
export const createOrderFromPayment = internalMutation({
  args: {
    paymentId: v.id("payments"),
  },
  handler: async (ctx, args) => {
    const payment = await ctx.db.get(args.paymentId);
    if (!payment) {
      throw new Error("Payment not found");
    }

    if (payment.status !== "completed") {
      throw new Error("Payment must be completed to create order");
    }

    // Get cart items for the session
    const cartItems = await ctx.db
      .query("cartItems")
      .withIndex("by_session", (q) => q.eq("sessionId", payment.sessionId))
      .collect();

    if (cartItems.length === 0) {
      throw new Error("No items in cart");
    }

    // Calculate totals and prepare order items
    let totalAmount = 0;
    const orderItems = await Promise.all(
      cartItems.map(async (cartItem) => {
        const product = await ctx.db.get(cartItem.productId);
        if (!product) {
          throw new Error(`Product not found: ${cartItem.productId}`);
        }

        totalAmount += cartItem.price * cartItem.quantity;

        // Reduce product stock
        await ctx.db.patch(cartItem.productId, {
          quantity: product.quantity - cartItem.quantity,
          updatedAt: Date.now(),
        });

        return {
          productId: cartItem.productId,
          name: product.name,
          quantity: cartItem.quantity,
          color: cartItem.color,
          size: cartItem.size,
          price: cartItem.price,
        };
      })
    );

    const shippingAmount = totalAmount >= 10000 ? 0 : 500;
    const finalTotal = totalAmount + shippingAmount;

    // Create order
    const orderId = await ctx.db.insert("orders", {
      userId: payment.userId,
      sessionId: payment.sessionId,
      status: "processing",
      totalAmount: finalTotal,
      shippingAmount,
      items: orderItems,
      shippingAddress: {
        fullName: "Customer", // Should be collected during checkout
        phone: payment.phoneNumber,
        address: "TBD", // Should be collected during checkout
        city: "TBD",
        postalCode: "TBD",
      },
      paymentId: args.paymentId,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    // Update payment with order ID
    await ctx.db.patch(args.paymentId, {
      orderId,
    });

    // Clear cart
    await Promise.all(cartItems.map((item) => ctx.db.delete(item._id)));

    return orderId;
  },
});

/**
 * Update order status
 */
export const updateOrderStatus = mutation({
  args: {
    orderId: v.id("orders"),
    status: v.union(
      v.literal("pending"),
      v.literal("processing"),
      v.literal("shipped"),
      v.literal("delivered"),
      v.literal("cancelled")
    ),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.orderId, {
      status: args.status,
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
    await ctx.db.delete(args.orderId);
    return { success: true };
  },
});

// ==================== PAYMENT QUERIES ====================

/**
 * Get payment by ID
 */
export const getPayment = query({
  args: {
    paymentId: v.id("payments"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.paymentId);
  },
});

/**
 * Get payments by user ID
 */
export const getPaymentsByUser = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("payments")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();
  },
});

/**
 * Get payments by session ID
 */
export const getPaymentsBySession = query({
  args: {
    sessionId: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("payments")
      .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId))
      .order("desc")
      .collect();
  },
});

/**
 * Get payments by status
 */
export const getPaymentsByStatus = query({
  args: {
    status: v.union(
      v.literal("pending"),
      v.literal("completed"),
      v.literal("failed"),
      v.literal("cancelled")
    ),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("payments")
      .withIndex("by_status", (q) => q.eq("status", args.status))
      .order("desc")
      .collect();
  },
});

/**
 * Get all payments (admin only)
 */
export const getAllPayments = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("payments").order("desc").collect();
  },
});

// ==================== ORDER QUERIES ====================

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
    status: v.union(
      v.literal("pending"),
      v.literal("processing"),
      v.literal("shipped"),
      v.literal("delivered"),
      v.literal("cancelled")
    ),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("orders")
      .withIndex("by_status", (q) => q.eq("status", args.status))
      .order("desc")
      .collect();
  },
});

/**
 * Get all orders (admin only)
 */
export const getAllOrders = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("orders").order("desc").collect();
  },
});
