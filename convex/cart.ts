import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id, Doc } from "./_generated/dataModel";

// Add item to cart
export const addToCart = mutation({
  args: {
    sessionId: v.string(),
    productId: v.id("products"),
    quantity: v.number(),
    color: v.string(),
    size: v.number(),
    price: v.number(),
    originalPrice: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    // Check if item already exists in cart
    const existingItem = await ctx.db
      .query("cartItems")
      .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId))
      .filter((q) => 
        q.and(
          q.eq(q.field("productId"), args.productId),
          q.eq(q.field("color"), args.color),
          q.eq(q.field("size"), args.size)
        )
      )
      .first();

    if (existingItem) {
      // Update quantity if item exists
      await ctx.db.patch(existingItem._id, {
        quantity: existingItem.quantity + args.quantity,
        updatedAt: Date.now(),
      });
      return existingItem._id;
    }

    // Add new item to cart
    const cartItemId = await ctx.db.insert("cartItems", {
      sessionId: args.sessionId,
      productId: args.productId,
      quantity: args.quantity,
      color: args.color,
      size: args.size,
      price: args.price,
      originalPrice: args.originalPrice,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return cartItemId;
  },
});

// Remove item from cart
export const removeFromCart = mutation({
  args: {
    cartItemId: v.id("cartItems"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.cartItemId);
    return { success: true };
  },
});

// Update cart item quantity
export const updateCartItemQuantity = mutation({
  args: {
    cartItemId: v.id("cartItems"),
    quantity: v.number(),
  },
  handler: async (ctx, args) => {
    if (args.quantity < 1) {
      await ctx.db.delete(args.cartItemId);
      return { success: true, deleted: true };
    }

    await ctx.db.patch(args.cartItemId, {
      quantity: args.quantity,
      updatedAt: Date.now(),
    });

    return { success: true, deleted: false };
  },
});

// Get cart items for a session
export const getCartItems = query({
  args: {
    sessionId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    if (!args.sessionId) {
      return [];
    }

    const cartItems = await ctx.db
      .query("cartItems")
      .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId!))
      .collect();

    // Fetch product details for each cart item
    const itemsWithProducts = await Promise.all(
      cartItems.map(async (item) => {
        const product = await ctx.db.get(item.productId);
        return {
          ...item,
          product,
        };
      })
    );

    return itemsWithProducts;
  },
});

// Clear cart for a session
export const clearCart = mutation({
  args: {
    sessionId: v.string(),
  },
  handler: async (ctx, args) => {
    const cartItems = await ctx.db
      .query("cartItems")
      .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId))
      .collect();

    // Delete all cart items
    await Promise.all(cartItems.map((item) => ctx.db.delete(item._id)));

    return { success: true };
  },
});

// Get cart summary (totals)
export const getCartSummary = query({
  args: {
    sessionId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    if (!args.sessionId) {
      return {
        subtotal: 0,
        shipping: 0,
        total: 0,
        totalItems: 0,
        itemCount: 0,
        freeShippingThreshold: 10000,
        amountToFreeShipping: 10000,
        freeShippingProgress: 0,
      };
    }

    const cartItems: Doc<"cartItems">[] = await ctx.db
      .query("cartItems")
      .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId!))
      .collect();

    const subtotal = cartItems.reduce((sum, item) => {
      return sum + (item.price * item.quantity);
    }, 0);

    const totalItems = cartItems.reduce((sum, item) => {
      return sum + item.quantity;
    }, 0);

    // Free shipping threshold: KES 10,000
    const freeShippingThreshold = 10000;
    const shipping = subtotal >= freeShippingThreshold ? 0 : 500;
    const total = subtotal + shipping;

    const amountToFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
    const freeShippingProgress = Math.min(100, (subtotal / freeShippingThreshold) * 100);

    return {
      subtotal,
      shipping,
      total,
      totalItems,
      itemCount: cartItems.length,
      freeShippingThreshold,
      amountToFreeShipping,
      freeShippingProgress,
    };
  },
});
