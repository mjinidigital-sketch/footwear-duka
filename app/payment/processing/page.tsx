"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery, useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

export default function PaymentProcessingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const paymentId = searchParams.get("paymentId") as Id<"payments">;
  const [countdown, setCountdown] = useState(60);
  const [pollCount, setPollCount] = useState(0);

  const payment = useQuery(
    api.payments.getPayment,
    paymentId ? { paymentId } : "skip"
  );

  const queryTransactionStatus = useAction(api.mpesa.queryTransactionStatus);

  useEffect(() => {
    if (!payment) return;

    // If payment is already completed or failed, redirect accordingly
    if (payment.status === "completed") {
      router.push(`/payment/success?paymentId=${paymentId}`);
      return;
    }

    if (payment.status === "failed" || payment.status === "cancelled") {
      router.push(`/payment/failed?paymentId=${paymentId}`);
      return;
    }

    // Get MPESA credentials
    const consumerKey = process.env.NEXT_PUBLIC_MPESA_CONSUMER_KEY || "";
    const consumerSecret = process.env.NEXT_PUBLIC_MPESA_CONSUMER_SECRET || "";
    const businessShortCode = process.env.NEXT_PUBLIC_MPESA_BUSINESS_SHORTCODE || "174379";
    const passKey = process.env.NEXT_PUBLIC_MPESA_PASSKEY || "";
    const environment = (process.env.NEXT_PUBLIC_MPESA_ENVIRONMENT as "sandbox" | "production") || "sandbox";

    // Poll for payment status every 5 seconds
    const pollInterval = setInterval(async () => {
      if (payment.checkoutRequestId) {
        try {
          await queryTransactionStatus({
            checkoutRequestId: payment.checkoutRequestId,
            paymentId,
            consumerKey,
            consumerSecret,
            businessShortCode,
            passKey,
            environment,
          });
          setPollCount((prev) => prev + 1);
        } catch (error) {
          console.error("Polling error:", error);
        }
      }
    }, 5000);

    // Countdown timer
    const countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          clearInterval(pollInterval);
          router.push(`/payment/failed?paymentId=${paymentId}`);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(pollInterval);
      clearInterval(countdownInterval);
    };
  }, [payment, paymentId, router, queryTransactionStatus]);

  const handleCancel = () => {
    router.push("/cart");
  };

  if (!payment) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <Loader2 className="mx-auto h-8 w-8 animate-spin text-green-600" />
              <p className="mt-4">Loading payment details...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <Loader2 className="h-8 w-8 animate-spin text-green-600" />
          </div>
          <CardTitle className="text-2xl text-green-600">Processing Your Payment</CardTitle>
          <CardDescription>
            Please check your phone and enter your M-PESA PIN to confirm
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg bg-muted p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Amount:</span>
              <span className="font-semibold">KES {payment.amount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Phone:</span>
              <span className="font-semibold">{payment.phoneNumber}</span>
            </div>
          </div>

          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              Please do not refresh this page
            </p>
            <p className="text-lg font-semibold text-green-600">
              Payment expires in {countdown} seconds
            </p>
          </div>

          <Button
            onClick={handleCancel}
            variant="outline"
            className="w-full"
          >
            <X className="mr-2 h-4 w-4" />
            Cancel Payment
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
