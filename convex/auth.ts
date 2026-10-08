import { convexAuth } from "@convex-dev/auth/server";
import { Password } from "@convex-dev/auth/providers/Password";
import { ConvexError } from "convex/values";
import { MutationCtx } from "./_generated/server";

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [Password],
  callbacks: {
    async afterUserCreatedOrUpdated(ctx: MutationCtx, args) {
      const now = Date.now();
      if (args.existingUserId === null) {
        await ctx.db.patch(args.userId, {
          role: "user",
          createdAt: now,
          updatedAt: now,
          isActive: true,
        });
      } else {
        // Update lastLoginAt and updatedAt on sign in
        await ctx.db.patch(args.userId, {
          lastLoginAt: now,
          updatedAt: now,
        });
      }
    },
  },
});