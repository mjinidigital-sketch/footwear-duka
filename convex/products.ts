// convex/products.ts
import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { auth } from "./auth";

// List all products
export const listProducts = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("products").collect();
    },
});

// Get a single product by slug
export const getBySlug = query({
    args: {
        slug: v.string(),
    },

    handler: async (ctx, args) => {
        return await ctx.db
            .query("products")
            .withIndex("by_slug", (q) =>
                q.eq("slug", args.slug)
            )
            .unique();
    },
});


// Fetch all available category links for our filtering sidebar
export const getCategories = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("categories").collect();
    },
});

// Fetch filtered products based on category, gender, and price range
export const getFilteredProducts = query({
    args: {
        categorySlug: v.optional(v.string()),
        gender: v.optional(v.union(v.literal("Men"), v.literal("Women"), v.literal("Unisex"))),
        minPrice: v.optional(v.number()),
        maxPrice: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        let query = ctx.db.query("products");

        // Retrieve all matches to filter down in memory safely
        let products = await query.collect();

        // Apply filters based on what options are passed
        if (args.categorySlug) {
            products = products.filter((p) => p.categorySlug === args.categorySlug);
        }
        if (args.gender) {
            products = products.filter((p) => p.gender === args.gender);
        }
        if (args.minPrice !== undefined) {
            products = products.filter((p) => p.price >= args.minPrice!);
        }
        if (args.maxPrice !== undefined) {
            products = products.filter((p) => p.price <= args.maxPrice!);
        }

        return products;
    },
});

// ─── Mutations ────────────────────────────────────────────

// Create a new product (admin only)
export const createProduct = mutation({
    args: {
        name: v.string(),
        slug: v.string(),
        summary: v.string(),
        categoryId: v.id("categories"),
        categorySlug: v.string(),
        brand: v.string(),
        colors: v.array(
            v.object({
                name: v.string(),
                hex: v.string(),
                images: v.array(v.string()),
            })
        ),
        sizes: v.array(v.number()),
        gender: v.union(v.literal("Men"), v.literal("Women"), v.literal("Unisex")),
        description: v.string(),
        mainImage: v.string(),
        gallery: v.array(v.string()),
        price: v.number(),
        quantity: v.number(),
        compareAtPrice: v.optional(v.number()),
        sku: v.optional(v.string()),
        barcode: v.optional(v.string()),
        weight: v.optional(v.number()),
        material: v.optional(v.string()),
        season: v.optional(v.string()),
        metaTitle: v.optional(v.string()),
        metaDescription: v.optional(v.string()),
        metaKeywords: v.optional(v.array(v.string())),
        googleProductCategory: v.optional(v.string()),
        condition: v.optional(v.union(v.literal("new"), v.literal("refurbished"), v.literal("used"))),
        availability: v.optional(v.union(v.literal("in_stock"), v.literal("out_of_stock"), v.literal("preorder"))),
        shippingWeight: v.optional(v.number()),
        shippingLabel: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const userId = await auth.getUserId(ctx);
        if (!userId) throw new Error("Please log in to continue.");

        const user = await ctx.db.get(userId);
        if (user?.role !== "admin") {
            throw new Error("Only admins can create products.");
        }

        const now = Date.now();
        return await ctx.db.insert("products", {
            ...args,
            createdAt: now,
            updatedAt: now,
            isActive: true,
            featured: false,
        });
    },
});

// Update an existing product (admin only)
export const updateProduct = mutation({
    args: {
        productId: v.id("products"),
        name: v.optional(v.string()),
        slug: v.optional(v.string()),
        summary: v.optional(v.string()),
        categoryId: v.optional(v.id("categories")),
        categorySlug: v.optional(v.string()),
        brand: v.optional(v.string()),
        colors: v.optional(
            v.array(
                v.object({
                    name: v.string(),
                    hex: v.string(),
                    images: v.array(v.string()),
                })
            )
        ),
        sizes: v.optional(v.array(v.number())),
        gender: v.optional(v.union(v.literal("Men"), v.literal("Women"), v.literal("Unisex"))),
        description: v.optional(v.string()),
        mainImage: v.optional(v.string()),
        gallery: v.optional(v.array(v.string())),
        price: v.optional(v.number()),
        quantity: v.optional(v.number()),
        compareAtPrice: v.optional(v.number()),
        sku: v.optional(v.string()),
        barcode: v.optional(v.string()),
        weight: v.optional(v.number()),
        material: v.optional(v.string()),
        season: v.optional(v.string()),
        metaTitle: v.optional(v.string()),
        metaDescription: v.optional(v.string()),
        metaKeywords: v.optional(v.array(v.string())),
        googleProductCategory: v.optional(v.string()),
        condition: v.optional(v.union(v.literal("new"), v.literal("refurbished"), v.literal("used"))),
        availability: v.optional(v.union(v.literal("in_stock"), v.literal("out_of_stock"), v.literal("preorder"))),
        shippingWeight: v.optional(v.number()),
        shippingLabel: v.optional(v.string()),
        isActive: v.optional(v.boolean()),
        featured: v.optional(v.boolean()),
    },
    handler: async (ctx, args) => {
        const userId = await auth.getUserId(ctx);
        if (!userId) throw new Error("Please log in to continue.");

        const user = await ctx.db.get(userId);
        if (user?.role !== "admin") {
            throw new Error("Only admins can update products.");
        }

        const { productId, ...updates } = args;
        const product = await ctx.db.get(productId);
        if (!product) throw new Error("Product not found. Please refresh and try again.");

        await ctx.db.patch(productId, {
            ...updates,
            updatedAt: Date.now(),
        });
    },
});

// Delete a product (admin only)
export const deleteProduct = mutation({
    args: {
        productId: v.id("products"),
    },
    handler: async (ctx, { productId }) => {
        const userId = await auth.getUserId(ctx);
        if (!userId) throw new Error("Not authenticated.");

        const user = await ctx.db.get(userId);
        if (user?.role !== "admin") {
            throw new Error("Not authorized. Admin role required.");
        }

        await ctx.db.delete(productId);
    },
});

// Toggle product featured status (admin only)
export const toggleProductFeatured = mutation({
    args: {
        productId: v.id("products"),
    },
    handler: async (ctx, { productId }) => {
        const userId = await auth.getUserId(ctx);
        if (!userId) throw new Error("Not authenticated.");

        const user = await ctx.db.get(userId);
        if (user?.role !== "admin") {
            throw new Error("Not authorized. Admin role required.");
        }

        const product = await ctx.db.get(productId);
        if (!product) throw new Error("Product not found.");

        await ctx.db.patch(productId, {
            featured: !product.featured,
            updatedAt: Date.now(),
        });
    },
});

// Toggle product active status (admin only)
export const toggleProductActive = mutation({
    args: {
        productId: v.id("products"),
    },
    handler: async (ctx, { productId }) => {
        const userId = await auth.getUserId(ctx);
        if (!userId) throw new Error("Not authenticated.");

        const user = await ctx.db.get(userId);
        if (user?.role !== "admin") {
            throw new Error("Not authorized. Admin role required.");
        }

        const product = await ctx.db.get(productId);
        if (!product) throw new Error("Product not found.");

        await ctx.db.patch(productId, {
            isActive: !product.isActive,
            updatedAt: Date.now(),
        });
    },
});
