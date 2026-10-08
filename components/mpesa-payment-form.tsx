"use client";

import { useState } from "react";
import { Loader2, Smartphone } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api";

interface MpesaPaymentFormProps {
  amount: number;
  sessionId: string;
  userId?: string;
  onSuccess?: (paymentId: string) => void;
  onError?: (error: string) => void;
}

export function MpesaPaymentForm({
  amount,
  sessionId,
  userId,
  onSuccess,
  onError,
}: MpesaPaymentFormProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const initiateStkPush = useAction(api.mpesa.initiateStkPush);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!phoneNumber || phoneNumber.length < 10) {
      toast.error("Invalid phone number", {
        description: "Please enter a valid phone number (10-12 digits)",
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Get MPESA credentials from environment
      const consumerKey = (
        process.env.NEXT_PUBLIC_MPESA_CONSUMER_KEY ||
        process.env.NEXT_PUBLIC_CONSUMER_KEY ||
        ""
      ).trim();
      const consumerSecret = (
        process.env.NEXT_PUBLIC_MPESA_CONSUMER_SECRET ||
        process.env.NEXT_PUBLIC_CONSUMER_SECRET ||
        ""
      ).trim();
      const businessShortCode = (
        process.env.NEXT_PUBLIC_MPESA_BUSINESS_SHORTCODE ||
        process.env.NEXT_PUBLIC_BusinessShortCode ||
        "174379"
      ).trim();
      const passKey = (
        process.env.NEXT_PUBLIC_MPESA_PASSKEY ||
        process.env.NEXT_PUBLIC_PASSKEY ||
        ""
      ).trim();
      const callbackUrl = (
        process.env.NEXT_PUBLIC_MPESA_CALLBACK_URL ||
        (process.env.NEXT_PUBLIC_CONVEX_SITE_URL
          ? `${process.env.NEXT_PUBLIC_CONVEX_SITE_URL}/mpesa/callback`
          : `${typeof window !== "undefined" ? window.location.origin : ""}/mpesa/callback`)
      ).trim();
      const environment = (
        (process.env.NEXT_PUBLIC_MPESA_ENVIRONMENT as "sandbox" | "production") ||
        "sandbox"
      ).trim() as "sandbox" | "production";

      if (!consumerKey || !consumerSecret || !passKey) {
        throw new Error("MPESA credentials not configured. Please contact support.");
      }

      const result = await initiateStkPush({
        phoneNumber,
        amount,
        sessionId,
        userId: userId as any,
        consumerKey,
        consumerSecret,
        businessShortCode,
        passKey,
        callbackUrl,
        environment,
      });

      if (result.success) {
        toast.success("Payment initiated successfully. Please check your phone.", {
          description: "Enter your M-PESA PIN to complete the payment.",
        });

        if (onSuccess) {
          onSuccess(result.paymentId);
        }

        // Start polling for payment status
        startPaymentPolling(result.checkoutRequestId, result.paymentId);
      } else {
        toast.error("Payment initiation failed", {
          description: result.responseMessage || "Please try again.",
        });

        if (onError) {
          onError(result.responseMessage || "Payment initiation failed");
        }
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Payment error", {
        description: error instanceof Error ? error.message : "An unexpected error occurred.",
      });

      if (onError) {
        onError(error instanceof Error ? error.message : "An unexpected error occurred.");
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const startPaymentPolling = (checkoutRequestId: string, paymentId: string) => {
    const pollInterval = setInterval(async () => {
      try {
        // This would query the payment status
        // For now, we'll just show a success message
        // In production, you'd want to query the status and update UI accordingly
        console.log("Polling payment status for:", checkoutRequestId);
      } catch (error) {
        console.error("Polling error:", error);
        clearInterval(pollInterval);
      }
    }, 5000);

    // Stop polling after 2 minutes
    setTimeout(() => {
      clearInterval(pollInterval);
    }, 120000);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Smartphone className="h-5 w-5 text-green-600" />
          M-PESA Payment
        </CardTitle>
        <CardDescription>
          Enter your M-PESA phone number to complete the payment of KES {amount.toLocaleString()}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <Input
              id="phoneNumber"
              placeholder="0712345678"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              disabled={isProcessing}
              className="text-lg"
            />
          </div>

          <div className="bg-muted p-4 rounded-lg space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Amount:</span>
              <span className="font-semibold">KES {amount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Payment Method:</span>
              <span className="font-semibold">M-PESA STK Push</span>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700"
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Pay with M-PESA"
            )}
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            You will receive an M-PESA prompt on your phone. Enter your PIN to complete the payment.
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
