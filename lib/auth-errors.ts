import { ConvexError } from "convex/values";

// ✅ Maps server errors to user-friendly messages
export function parseAuthError(err: unknown): string {
    // ConvexError — thrown intentionally from backend
    if (err instanceof ConvexError) {
        const data = err.data;
        if (typeof data === "string") return data;
    }

    // Check error message string for known patterns
    if (err instanceof Error) {
        const msg = err.message.toLowerCase();

        // Signup errors
        if (msg.includes("already exists") || msg.includes("duplicate")) {
            return "An account with this email already exists. Please sign in instead.";
        }

        // Signin errors
        if (
            msg.includes("invalid password") ||
            msg.includes("invalid credentials") ||
            msg.includes("incorrect password") ||
            msg.includes("invalidsecret")
        ) {
            return "Incorrect email or password. Please try again.";
        }

        if (msg.includes("not found") || msg.includes("no account")) {
            return "No account found with this email. Please sign up first.";
        }

        if (msg.includes("too many") || msg.includes("rate limit")) {
            return "Too many attempts. Please wait a moment and try again.";
        }

        if (msg.includes("email") && msg.includes("verif")) {
            return "Please verify your email address before signing in.";
        }
    }

    // ✅ Fallback — never expose raw server error
    return "Something went wrong. Please try again.";
}