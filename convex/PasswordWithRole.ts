import { Password } from "@convex-dev/auth/providers/Password";
import { ConvexError } from "convex/values";
import { DataModel } from "./_generated/dataModel";

export default Password<DataModel>({
    profile(params) {
        return {
            email: params.email as string,
            name: params.name as string | undefined,
        };
    },

    // ✅ Throw specific ConvexError — not generic server errors
    validatePasswordRequirements: (password: string) => {
        if (password.length < 8) {
            throw new ConvexError("Password must be at least 8 characters long.");
        }
        if (!/[A-Z]/.test(password)) {
            throw new ConvexError("Password must contain at least one uppercase letter.");
        }
        if (!/[0-9]/.test(password)) {
            throw new ConvexError("Password must contain at least one number.");
        }
    },
});