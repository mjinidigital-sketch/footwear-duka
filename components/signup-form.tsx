"use client";

import { cn } from "@/lib/utils";
import { useAuthActions } from "@convex-dev/auth/react";
import { useState, useTransition, Suspense } from "react";
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
  showLoadingToast,
  dismissToast,
  handleValidationError,
  handleAuthError,
  showErrorToast,
} from "@/lib/toast";
import { parseAuthError } from "@/lib/auth-errors"; // ✅ import parser


function SignupFormInner({
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

    const formData = new FormData(e.currentTarget);
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirm-password") as string;
    const email = formData.get("email") as string;

    // Client-side validation
    if (!email || !email.includes("@")) {
      handleValidationError("Please enter a valid email address.");
      return;
    }
    if (password.length < 8) {
      handleValidationError("Password must be at least 8 characters long.");
      return;
    }
    if (password !== confirmPassword) {
      handleValidationError("Passwords do not match.");
      return;
    }

    // ✅ Clean up before sending to Convex Auth
    formData.delete("confirm-password");
    formData.set("flow", "signUp");

    const toastId = showLoadingToast("Creating your account...");


    // Inside handleSubmit:
    startTransition(async () => {
      try {
        formData.delete("confirm-password");
        formData.set("flow", "signUp");

        await signIn("password", formData);

        dismissToast(toastId);
        showSuccessToast("Account created successfully! Welcome aboard.");

        const redirectTo = searchParams.get("redirect") || "/";
        setTimeout(() => router.push(redirectTo), 1000);
      } catch (err: unknown) {
        dismissToast(toastId);

        // ✅ Parse to friendly message — never show raw server error
        const message = parseAuthError(err);
        setError(message);
        showErrorToast(message);
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
                <h1 className="text-2xl font-bold">Create your account</h1>
                <p className="text-sm text-balance text-muted-foreground">
                  Enter your email below to create your account
                </p>
              </div>

              <Field>
                <FieldLabel htmlFor="name">Name</FieldLabel>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="John Doe"
                  required
                  disabled={isPending}
                />
                <FieldDescription>
                  This will be displayed on your profile.
                </FieldDescription>
              </Field>

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
                <FieldDescription>
                  We&apos;ll use this to contact you. We will not share your
                  email with anyone else.
                </FieldDescription>
              </Field>

              <Field>
                <Field className="grid grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      required
                      disabled={isPending}
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="confirm-password">
                      Confirm Password
                    </FieldLabel>
                    <Input
                      id="confirm-password"
                      name="confirm-password"
                      type="password"
                      required
                      disabled={isPending}
                    />
                  </Field>
                </Field>
                <FieldDescription>
                  Must be at least 8 characters long.
                </FieldDescription>
              </Field>

              <Field>
                <Button type="submit" disabled={isPending} className="w-full">
                  {isPending ? "Creating account..." : "Create Account"}
                </Button>
              </Field>

              {/* OAuth providers — commented out until configured
              <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                Or continue with
              </FieldSeparator>
              <Field className="grid grid-cols-3 gap-4">
                <Button variant="outline" type="button" onClick={() => signIn("apple")}>Apple</Button>
                <Button variant="outline" type="button" onClick={() => signIn("google")}>Google</Button>
                <Button variant="outline" type="button" onClick={() => signIn("meta")}>Meta</Button>
              </Field>
              */}

              <FieldDescription className="text-center">
                Already have an account?{" "}
                <a href="/login">Sign in</a>
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

      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our{" "}
        <a href="#">Terms of Service</a> and{" "}
        <a href="#">Privacy Policy</a>.
      </FieldDescription>
    </div>
  );
}

// ✅ Suspense required because of useSearchParams
export function SignupForm(props: React.ComponentProps<"div">) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignupFormInner {...props} />
    </Suspense>
  );
}