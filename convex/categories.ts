// convex/categories.ts
import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { auth } from "./auth";

// List all categories
export const list = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("categories").collect();
    },
});

// Get a single category by slug
export const getBySlug = query({
    args: {
        slug: v.string(),
    },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("categories")
            .withIndex("by_slug", (q) => q.eq("slug", args.slug))
            .unique();
    },
});

// ─── Mutations ────────────────────────────────────────────

// Create a new category (admin only)
export const createCategory = mutation({
    args: {
        name: v.string(),
        slug: v.string(),
        description: v.string(),
        image: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const userId = await auth.getUserId(ctx);
        if (!userId) throw new Error("Not authenticated.");

        const user = await ctx.db.get(userId);
        if (user?.role !== "admin") {
            throw new Error("Not authorized. Admin role required.");
        }

        const now = Date.now();
        return await ctx.db.insert("categories", {
            ...args,
            createdAt: now,
            updatedAt: now,
            isActive: true,
        });
    },
});

// Update an existing category (admin only)
export const updateCategory = mutation({
    args: {
        categoryId: v.id("categories"),
        name: v.optional(v.string()),
        slug: v.optional(v.string()),
        description: v.optional(v.string()),
        image: v.optional(v.string()),
        isActive: v.optional(v.boolean()),
    },
    handler: async (ctx, args) => {
        const userId = await auth.getUserId(ctx);
        if (!userId) throw new Error("Not authenticated.");

        const user = await ctx.db.get(userId);
        if (user?.role !== "admin") {
            throw new Error("Not authorized. Admin role required.");
        }

        const { categoryId, ...updates } = args;
        const category = await ctx.db.get(categoryId);
        if (!category) throw new Error("Category not found.");

        await ctx.db.patch(categoryId, {
            ...updates,
            updatedAt: Date.now(),
        });
    },
});

// Delete a category (admin only)
export const deleteCategory = mutation({
    args: {
        categoryId: v.id("categories"),
    },
    handler: async (ctx, { categoryId }) => {
        const userId = await auth.getUserId(ctx);
        if (!userId) throw new Error("Not authenticated.");

        const user = await ctx.db.get(userId);
        if (user?.role !== "admin") {
            throw new Error("Not authorized. Admin role required.");
        }

        // Check if category has products
        const products = await ctx.db
            .query("products")
            .withIndex("by_category", (q) => q.eq("categoryId", categoryId))
            .collect();

        if (products.length > 0) {
            throw new Error("Cannot delete category with existing products. Please reassign or delete products first.");
        }

        await ctx.db.delete(categoryId);
    },
});

// Toggle category active status (admin only)
export const toggleCategoryActive = mutation({
    args: {
        categoryId: v.id("categories"),
    },
    handler: async (ctx, { categoryId }) => {
        const userId = await auth.getUserId(ctx);
        if (!userId) throw new Error("Not authenticated.");

        const user = await ctx.db.get(userId);
        if (user?.role !== "admin") {
            throw new Error("Not authorized. Admin role required.");
        }

        const category = await ctx.db.get(categoryId);
        if (!category) throw new Error("Category not found.");

        await ctx.db.patch(categoryId, {
            isActive: !category.isActive,
            updatedAt: Date.now(),
        });
    },
});
