"use client";

import { useQuery, useConvexAuth } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Package, ArrowLeft, CheckCircle2, Clock, Truck, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function OrdersPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: isAuthLoading } = useConvexAuth();
  const user = useQuery(api.users.viewer);
  const orders = useQuery(
    api.orders.getOrdersByUser,
    user?._id ? { userId: user._id } : "skip"
  );

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline"; icon: React.ReactNode }> = {
      pending: { label: "Pending", variant: "secondary", icon: <Clock className="h-4 w-4" /> },
      processing: { label: "Processing", variant: "default", icon: <Package className="h-4 w-4" /> },
      shipped: { label: "Shipped", variant: "outline", icon: <Truck className="h-4 w-4" /> },
      delivered: { label: "Delivered", variant: "default", icon: <CheckCircle2 className="h-4 w-4" /> },
      cancelled: { label: "Cancelled", variant: "destructive", icon: <XCircle className="h-4 w-4" /> },
    };

    const config = variants[status] || { label: status, variant: "secondary", icon: <Clock className="h-4 w-4" /> };
    return (
      <Badge variant={config.variant} className="gap-1">
        {config.icon}
        {config.label}
      </Badge>
    );
  };

  const formatAmount = (amount: number) => `KES ${amount.toLocaleString()}`;

  const formatDate = (timestamp?: number) => {
    if (!timestamp) return "N/A";
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (isAuthLoading || user === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="w-full max-w-md">
          <CardContent className="py-12 text-center">
            <Package className="mx-auto h-10 w-10 text-muted-foreground animate-pulse mb-3" />
            <p className="text-muted-foreground">Loading your orders...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="w-full max-w-md">
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">Please log in to view your orders</p>
            <Button onClick={() => router.push("/login")}>Log In</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <Button
            variant="ghost"
            className="mb-4"
            onClick={() => router.push("/")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Continue Shopping
          </Button>
          <h1 className="text-3xl font-bold">My Orders</h1>
          <p className="text-muted-foreground">Track and manage your orders</p>
        </div>

        {!orders || orders.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Package className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">You haven't placed any orders yet</p>
              <Button onClick={() => router.push("/")}>Start Shopping</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Card key={order._id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">Order #{order._id.slice(0, 8)}</CardTitle>
                      <CardDescription>Placed on {formatDate(order.createdAt)}</CardDescription>
                    </div>
                    {getStatusBadge(order.status)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex items-center justify-between py-2 border-b last:border-0">
                        <div className="flex-1">
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {item.color} • Size {item.size} • Qty {item.quantity}
                          </p>
                        </div>
                        <p className="font-medium">{formatAmount(item.price * item.quantity)}</p>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between pt-4 border-t">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatAmount(order.totalAmount - order.shippingAmount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>{order.shippingAmount === 0 ? "Free" : formatAmount(order.shippingAmount)}</span>
                  </div>
                  <div className="flex justify-between font-medium text-lg pt-2 border-t">
                    <span>Total</span>
                    <span>{formatAmount(order.totalAmount)}</span>
                  </div>

                  <div className="pt-4 border-t">
                    <p className="text-sm font-medium mb-2">Shipping Address</p>
                    <p className="text-sm text-muted-foreground">
                      {order.shippingAddress.fullName}<br />
                      {order.shippingAddress.phone}<br />
                      {order.shippingAddress.address}<br />
                      {order.shippingAddress.city}, {order.shippingAddress.postalCode}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
