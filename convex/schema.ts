import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

export default defineSchema({
  ...authTables,
  users: defineTable({
    name: v.optional(v.string()),
    image: v.optional(v.string()),
    email: v.optional(v.string()),
    emailVerificationTime: v.optional(v.number()),
    phone: v.optional(v.string()),
    phoneVerificationTime: v.optional(v.number()),
    isAnonymous: v.optional(v.boolean()),
    // ✅ optional — Convex Auth creates user first, then we patch role in
    role: v.optional(
      v.union(
        v.literal("admin"),
        v.literal("staff"),
        v.literal("user"),
        v.literal("customer"),
      )
    ),
    // Additional fields for user management
    createdAt: v.optional(v.number()),
    updatedAt: v.optional(v.number()),
    lastLoginAt: v.optional(v.number()),
    isActive: v.optional(v.boolean()),
  }).index("email", ["email"])
   .index("by_role", ["role"])
   .index("by_created_at", ["createdAt"]),


  categories: defineTable({
    name: v.string(),
    slug: v.string(),
    description: v.string(),
    // Additional fields for category management
    createdAt: v.optional(v.number()),
    updatedAt: v.optional(v.number()),
    isActive: v.optional(v.boolean()),
    image: v.optional(v.string()),
  }).index("by_slug", ["slug"])
   .index("by_active", ["isActive"]),

  products: defineTable({
    name: v.string(),
    slug: v.string(),
    summary: v.string(),
    categoryId: v.id("categories"), // Correctly links to the categories table reference
    categorySlug: v.string(),
    brand: v.string(),

    // FIX: Pair each color variant with its own specific images
    colors: v.array(
      v.object({
        name: v.string(),               // e.g., "Crimson Red"
        hex: v.string(),                // e.g., "#DC2626" (useful for color circle swatches)
        images: v.array(v.string()),    // Images specific to THIS color variant only
      })
    ),

    sizes: v.array(v.number()),
    gender: v.union(v.literal("Men"), v.literal("Women"), v.literal("Unisex")),
    description: v.string(),

    mainImage: v.string(),              // Overall fallback/thumbnail image for listings
    gallery: v.array(v.string()),       // General fallback product pictures if needed

    price: v.number(),
    quantity: v.number(),
    compareAtPrice: v.optional(v.number()), // Original price for sale items
    sku: v.optional(v.string()),        // Stock Keeping Unit
    barcode: v.optional(v.string()),     // Product barcode/ISBN
    weight: v.optional(v.number()),      // Product weight in kg
    material: v.optional(v.string()),    // e.g., "Leather", "Canvas", "Mesh"
    season: v.optional(v.string()),      // e.g., "Spring/Summer", "Fall/Winter"
    
    // SEO fields
    metaTitle: v.optional(v.string()),  // SEO title
    metaDescription: v.optional(v.string()), // SEO description
    metaKeywords: v.optional(v.array(v.string())), // SEO keywords
    
    // Google Merchant Center fields
    googleProductCategory: v.optional(v.string()), // Google taxonomy ID
    condition: v.optional(v.union(v.literal("new"), v.literal("refurbished"), v.literal("used"))),
    availability: v.optional(v.union(v.literal("in_stock"), v.literal("out_of_stock"), v.literal("preorder"))),
    shippingWeight: v.optional(v.number()), // Weight for shipping
    shippingLabel: v.optional(v.string()), // e.g., "large", "heavy"
    
    // Additional fields for product management
    createdAt: v.optional(v.number()),
    updatedAt: v.optional(v.number()),
    isActive: v.optional(v.boolean()),
    featured: v.optional(v.boolean()),
  }).index("by_slug", ["slug"])
   .index("by_category", ["categoryId"])
   .index("by_active", ["isActive"])
   .index("by_featured", ["featured"]),

  cartItems: defineTable({
    sessionId: v.string(),
    productId: v.id("products"),
    quantity: v.number(),
    color: v.string(),
    size: v.number(),
    price: v.number(),
    originalPrice: v.optional(v.number()),
    createdAt: v.optional(v.number()),
    updatedAt: v.optional(v.number()),
  }).index("by_session", ["sessionId"])
   .index("by_product", ["productId"]),

  orders: defineTable({
    userId: v.optional(v.id("users")),
    sessionId: v.string(),
    status: v.union(
      v.literal("pending"),
      v.literal("processing"),
      v.literal("shipped"),
      v.literal("delivered"),
      v.literal("cancelled")
    ),
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
    createdAt: v.optional(v.number()),
    updatedAt: v.optional(v.number()),
  }).index("by_user", ["userId"])
   .index("by_session", ["sessionId"])
   .index("by_status", ["status"])
   .index("by_payment", ["paymentId"]),

  payments: defineTable({
    userId: v.optional(v.id("users")),
    orderId: v.optional(v.id("orders")),
    sessionId: v.string(),
    amount: v.number(),
    phoneNumber: v.string(),
    mpesaReceiptNumber: v.optional(v.string()),
    transactionDate: v.optional(v.string()),
    checkoutRequestId: v.optional(v.string()),
    merchantRequestId: v.optional(v.string()),
    resultCode: v.optional(v.string()),
    resultDesc: v.optional(v.string()),
    status: v.union(
      v.literal("pending"),
      v.literal("completed"),
      v.literal("failed"),
      v.literal("cancelled")
    ),
    callbackReceived: v.optional(v.boolean()),
    callbackData: v.optional(v.any()),
    createdAt: v.optional(v.number()),
    updatedAt: v.optional(v.number()),
  }).index("by_user", ["userId"])
   .index("by_order", ["orderId"])
   .index("by_session", ["sessionId"])
   .index("by_status", ["status"])
   .index("by_checkout_request", ["checkoutRequestId"]),

});