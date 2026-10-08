"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2, ArrowRight, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

export default function PaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const paymentId = searchParams.get("paymentId") as Id<"payments">;
  const [countdown, setCountdown] = useState(10);

  const payment = useQuery(
    api.payments.getPayment,
    paymentId ? { paymentId } : "skip"
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push("/");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  if (!payment) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <p>Loading payment details...</p>
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
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl text-green-600">Payment Successful!</CardTitle>
          <CardDescription>
            Your payment of KES {payment.amount.toLocaleString()} has been processed successfully
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg bg-muted p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Payment ID:</span>
              <span className="font-mono text-xs">{payment._id.slice(0, 8)}...</span>
            </div>
            {payment.mpesaReceiptNumber && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">M-PESA Receipt:</span>
                <span className="font-semibold">{payment.mpesaReceiptNumber}</span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Amount:</span>
              <span className="font-semibold">KES {payment.amount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Phone:</span>
              <span className="font-semibold">{payment.phoneNumber}</span>
            </div>
            {payment.transactionDate && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Transaction Date:</span>
                <span className="font-semibold">{payment.transactionDate}</span>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Button
              onClick={() => router.push("/")}
              className="w-full"
              size="lg"
            >
              <ShoppingBag className="mr-2 h-4 w-4" />
              Continue Shopping
            </Button>
            <Button
              onClick={() => router.push("/orders")}
              variant="outline"
              className="w-full"
            >
              View Order
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          <p className="text-center text-sm text-muted-foreground">
            Redirecting to home page in {countdown} seconds...
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
