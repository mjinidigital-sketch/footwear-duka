"use client";

import { cn } from "@/lib/utils";
import { useAuthActions } from "@convex-dev/auth/react";
import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
    showSuccessToast,
    showErrorToast,
    showLoadingToast,
    dismissToast,
    handleValidationError,
    handleAuthError
} from "@/lib/toast";
import { parseAuthError } from "@/lib/auth-errors";
export function LoginForm({
    className,
    ...props
}: React.ComponentProps<"div">) {
    const { signIn } = useAuthActions();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError(null);

        const formData = new FormData(e.currentTarget);
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        // Client-side validation
        if (!email || !email.includes("@")) {
            handleValidationError("Please enter a valid email address.");
            return;
        }

        if (!password || password.length < 1) {
            handleValidationError("Please enter your password.");
            return;
        }

        // Tell the Password provider this is a sign-in flow
        formData.set("flow", "signIn");

        // Show loading toast
        const toastId = showLoadingToast("Signing you in...");



        // Inside handleSubmit:
        startTransition(async () => {
            try {
                formData.set("flow", "signIn");
                await signIn("password", formData);

                dismissToast(toastId);
                showSuccessToast("Welcome back!");

                const redirectTo = searchParams.get("redirect") || "/";
                setTimeout(() => router.push(redirectTo), 1000);
            } catch (err: unknown) {
                dismissToast(toastId);

                // ✅ Parse to friendly message — never show raw server error
                const message = parseAuthError(err);
                
                // Special handling for Convex connection errors
                if (message.includes("fetch failed") || message.includes("ConnectTimeout") || message.includes("InvalidAccountId")) {
                    const connectionMessage = "Unable to connect to authentication service. Please check your internet connection and try again. The app will work in demo mode with sample data.";
                    setError(connectionMessage);
                    showErrorToast(connectionMessage);
                    
                    // Redirect to home page after delay since auth is unavailable
                    setTimeout(() => {
                        router.push("/");
                    }, 3000);
                } else {
                    setError(message);
                    showErrorToast(message);
                }
            }
        });
    }

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card className="overflow-hidden p-0">
                <CardContent className="grid p-0 md:grid-cols-2">
                    <form className="p-6 md:p-8" onSubmit={handleSubmit}>
                        <FieldGroup>
                            <div className="flex flex-col items-center gap-2 text-center">
                                <h1 className="text-2xl font-bold">Welcome back</h1>
                                <p className="text-sm text-balance text-muted-foreground">
                                    Sign in to your account
                                </p>
                            </div>

                            {/* Error message */}
                            {error && (
                                <div className="rounded-md bg-destructive/10 px-4 py-2 text-sm text-destructive">
                                    {error}
                                    {error.includes("authentication service") && (
                                        <div className="mt-2 text-xs">
                                            <p className="font-medium">Demo Mode Active:</p>
                                            <p className="text-muted-foreground">You can browse the site with sample data without authentication.</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            <Field>
                                <FieldLabel htmlFor="email">Email</FieldLabel>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="m@example.com"
                                    required
                                    disabled={isPending}
                                />
                            </Field>

                            <Field>
                                <div className="flex items-center justify-between">
                                    <FieldLabel htmlFor="password">Password</FieldLabel>
                                    <a
                                        href="/forgot-password"
                                        className="text-sm underline-offset-2 hover:underline"
                                    >
                                        Forgot your password?
                                    </a>
                                </div>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    disabled={isPending}
                                />
                            </Field>

                            <Field>
                                <Button type="submit" disabled={isPending} className="w-full">
                                    {isPending ? "Signing in..." : "Sign In"}
                                </Button>
                            </Field>

                            {/* OAuth providers — commented out until configured
              <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                Or continue with
              </FieldSeparator>
              <Field className="grid grid-cols-3 gap-4">
                <Button variant="outline" type="button" onClick={() => signIn("apple")}>
                  Apple
                </Button>
                <Button variant="outline" type="button" onClick={() => signIn("google")}>
                  Google
                </Button>
                <Button variant="outline" type="button" onClick={() => signIn("meta")}>
                  Meta
                </Button>
              </Field>
              */}

                            <FieldDescription className="text-center">
                                Don&apos;t have an account? <a href="/signup">Sign up</a>
                                <span className="mx-2">|</span>
                                <a href="/" className="underline">Continue to demo mode</a>
                            </FieldDescription>
                        </FieldGroup>
                    </form>

                    <div className="relative hidden bg-muted md:block">
                        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
                            <div className="text-center">
                                <div className="text-6xl mb-4">👟</div>
                                <p className="text-2xl font-bold">Footwear Duka</p>
                                <p className="text-muted-foreground">Your favorite footwear destination</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}