import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { auth } from "./auth";

// Role type matching schema
type Role = "admin" | "staff" | "user" | "customer";

// Ordered least to most privileged
const ROLE_HIERARCHY: Role[] = ["customer", "user", "staff", "admin"];

function hasRole(userRole: string | undefined, requiredRole: Role): boolean {
    if (!userRole) return false;
    const required = ROLE_HIERARCHY.indexOf(requiredRole);
    const actual = ROLE_HIERARCHY.indexOf(userRole as Role);
    return actual >= required;
}

// Helper to get current timestamp
function getCurrentTimestamp(): number {
    return Date.now();
}

// ─── Queries ─────────────────────────────────────────────

// Get current logged-in user
export const viewer = query({
    args: {},
    handler: async (ctx) => {
        const userId = await auth.getUserId(ctx);
        if (userId === null) return null;
        return await ctx.db.get(userId);
    },
});

// Get a single user by ID — admin only
export const getUserById = query({
    args: { userId: v.id("users") },
    handler: async (ctx, { userId }) => {
        const requesterId = await auth.getUserId(ctx);
        if (!requesterId) throw new Error("Not authenticated.");

        const requester = await ctx.db.get(requesterId);
        if (!hasRole(requester?.role, "admin")) {
            throw new Error("Not authorized. Admin role required.");
        }

        return await ctx.db.get(userId);
    },
});

// List all users — admin only
export const listUsers = query({
    args: {},
    handler: async (ctx) => {
        const requesterId = await auth.getUserId(ctx);
        if (!requesterId) throw new Error("Not authenticated.");

        const requester = await ctx.db.get(requesterId);
        if (!hasRole(requester?.role, "admin")) {
            throw new Error("Not authorized. Admin role required.");
        }

        return await ctx.db.query("users").collect();
    },
});

// List users by role — admin only
export const listUsersByRole = query({
    args: {
        role: v.union(
            v.literal("admin"),
            v.literal("staff"),
            v.literal("user"),
            v.literal("customer"),
        ),
    },
    handler: async (ctx, { role }) => {
        const requesterId = await auth.getUserId(ctx);
        if (!requesterId) throw new Error("Not authenticated.");

        const requester = await ctx.db.get(requesterId);
        if (!hasRole(requester?.role, "admin")) {
            throw new Error("Not authorized. Admin role required.");
        }

        const allUsers = await ctx.db.query("users").collect();
        return allUsers.filter((u) => u.role === role);
    },
});

// ─── Mutations ────────────────────────────────────────────

// Update any user's role — admin only
export const updateUserRole = mutation({
    args: {
        targetUserId: v.id("users"),
        role: v.union(
            v.literal("admin"),
            v.literal("staff"),
            v.literal("user"),
            v.literal("customer"),
        ),
    },
    handler: async (ctx, { targetUserId, role }) => {
        const requesterId = await auth.getUserId(ctx);
        if (!requesterId) throw new Error("Please log in to continue.");

        const requester = await ctx.db.get(requesterId);
        if (!hasRole(requester?.role, "admin")) {
            throw new Error("Only admins can update user roles.");
        }

        // Make sure target user exists
        const targetUser = await ctx.db.get(targetUserId);
        if (!targetUser) throw new Error("User not found. Please refresh and try again.");

        await ctx.db.patch(targetUserId, { role });
    },
});

// Update current user's own profile
export const updateProfile = mutation({
    args: {
        name: v.optional(v.string()),
        image: v.optional(v.string()),
        phone: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const userId = await auth.getUserId(ctx);
        if (!userId) throw new Error("Please log in to continue.");

        await ctx.db.patch(userId, args);
    },
});

// Update any user's profile — admin only
export const updateUserProfile = mutation({
    args: {
        targetUserId: v.id("users"),
        name: v.optional(v.string()),
        email: v.optional(v.string()),
        role: v.union(
            v.literal("admin"),
            v.literal("staff"),
            v.literal("user"),
            v.literal("customer"),
        ),
        phone: v.optional(v.string()),
        isActive: v.optional(v.boolean()),
    },
    handler: async (ctx, { targetUserId, name, email, role, phone, isActive }) => {
        const requesterId = await auth.getUserId(ctx);
        if (!requesterId) throw new Error("Please log in to continue.");

        const requester = await ctx.db.get(requesterId);
        if (!hasRole(requester?.role, "admin")) {
            throw new Error("Only admins can update user profiles.");
        }

        // Make sure target user exists
        const targetUser = await ctx.db.get(targetUserId);
        if (!targetUser) throw new Error("User not found. Please refresh and try again.");

        // Check if email is being changed and if it already exists
        if (email && email !== targetUser.email) {
            const existingUsers = await ctx.db.query("users").collect();
            const emailExists = existingUsers.some((u) => u.email === email && u._id !== targetUserId);
            if (emailExists) {
                throw new Error("A user with this email address already exists. Please use a different email.");
            }
        }

        const updateData: any = {
            updatedAt: getCurrentTimestamp(),
        };

        if (name !== undefined) updateData.name = name;
        if (email !== undefined) updateData.email = email;
        if (role !== undefined) updateData.role = role;
        if (phone !== undefined) updateData.phone = phone;
        if (isActive !== undefined) updateData.isActive = isActive;

        await ctx.db.patch(targetUserId, updateData);
    },
});

// Delete a user — admin only
export const deleteUser = mutation({
    args: { targetUserId: v.id("users") },
    handler: async (ctx, { targetUserId }) => {
        const requesterId = await auth.getUserId(ctx);
        if (!requesterId) throw new Error("Please log in to continue.");

        const requester = await ctx.db.get(requesterId);
        if (!hasRole(requester?.role, "admin")) {
            throw new Error("Only admins can delete users.");
        }

        // Prevent admin from deleting themselves
        if (requesterId === targetUserId) {
            throw new Error("You cannot delete your own account.");
        }

        await ctx.db.delete(targetUserId);
    },
});

// Create a new user — admin only
export const createUser = mutation({
    args: {
        email: v.string(),
        name: v.optional(v.string()),
        role: v.union(
            v.literal("admin"),
            v.literal("staff"),
            v.literal("user"),
            v.literal("customer"),
        ),
        phone: v.optional(v.string()),
    },
    handler: async (ctx, { email, name, role, phone }) => {
        const requesterId = await auth.getUserId(ctx);
        if (!requesterId) throw new Error("Please log in to continue.");

        const requester = await ctx.db.get(requesterId);
        if (!hasRole(requester?.role, "admin")) {
            throw new Error("Only admins can create new users.");
        }

        // Check if email already exists
        const existingUsers = await ctx.db.query("users").collect();
        const emailExists = existingUsers.some((u) => u.email === email);
        if (emailExists) {
            throw new Error("A user with this email address already exists. Please use a different email.");
        }

        const now = getCurrentTimestamp();

        await ctx.db.insert("users", {
            email,
            name,
            role,
            phone,
            createdAt: now,
            updatedAt: now,
            isActive: true,
        });
    },
});

// Clear all auth data (for migration purposes) — no auth required
export const clearAuthData = mutation({
    args: {},
    handler: async (ctx) => {
        // Delete all auth-related documents
        const authAccounts = await ctx.db.query("authAccounts").collect();
        for (const account of authAccounts) {
            await ctx.db.delete(account._id);
        }

        const authSessions = await ctx.db.query("authSessions").collect();
        for (const session of authSessions) {
            await ctx.db.delete(session._id);
        }

        const authRefreshTokens = await ctx.db.query("authRefreshTokens").collect();
        for (const token of authRefreshTokens) {
            await ctx.db.delete(token._id);
        }

        const authRateLimits = await ctx.db.query("authRateLimits").collect();
        for (const limit of authRateLimits) {
            await ctx.db.delete(limit._id);
        }

        return {
            authAccountsDeleted: authAccounts.length,
            authSessionsDeleted: authSessions.length,
            authRefreshTokensDeleted: authRefreshTokens.length,
            authRateLimitsDeleted: authRateLimits.length,
        };
    },
});