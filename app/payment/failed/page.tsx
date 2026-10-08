"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { XCircle, AlertCircle, ArrowRight, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

export default function PaymentFailedPage() {
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
          router.push("/cart");
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

  const getFailureIcon = () => {
    if (payment.status === "cancelled") {
      return <AlertCircle className="h-8 w-8 text-yellow-600" />;
    }
    return <XCircle className="h-8 w-8 text-red-600" />;
  };

  const getFailureTitle = () => {
    if (payment.status === "cancelled") {
      return "Payment Cancelled";
    }
    return "Payment Failed";
  };

  const getFailureDescription = () => {
    if (payment.status === "cancelled") {
      return "You cancelled the payment request on your phone";
    }
    return payment.resultDesc || "The payment could not be processed";
  };

  const getBgColor = () => {
    if (payment.status === "cancelled") {
      return "bg-yellow-100";
    }
    return "bg-red-100";
  };

  const getIconColor = () => {
    if (payment.status === "cancelled") {
      return "text-yellow-600";
    }
    return "text-red-600";
  };

  const getTitleColor = () => {
    if (payment.status === "cancelled") {
      return "text-yellow-600";
    }
    return "text-red-600";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full ${getBgColor()}`}>
            {getFailureIcon()}
          </div>
          <CardTitle className={`text-2xl ${getTitleColor()}`}>{getFailureTitle()}</CardTitle>
          <CardDescription>{getFailureDescription()}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg bg-muted p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Payment ID:</span>
              <span className="font-mono text-xs">{payment._id.slice(0, 8)}...</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Amount:</span>
              <span className="font-semibold">KES {payment.amount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Phone:</span>
              <span className="font-semibold">{payment.phoneNumber}</span>
            </div>
            {payment.resultCode && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Error Code:</span>
                <span className="font-semibold">{payment.resultCode}</span>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Button
              onClick={() => router.push("/cart")}
              className="w-full"
              size="lg"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
            <Button
              onClick={() => router.push("/")}
              variant="outline"
              className="w-full"
            >
              Continue Shopping
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          <p className="text-center text-sm text-muted-foreground">
            Redirecting to cart in {countdown} seconds...
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
