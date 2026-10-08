"use client";

import Logo from "@/assets/logo/logo";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, FileText, PackageCheck, Truck } from "lucide-react";

export type ReceiptItem = {
  id: string;
  image: string;
  title: string;
  description: string;
  variant: string;
  price: number;
};

type ReciptProps = {
  orderNumber?: string;
  orderDate?: string;
  cardLast4?: string;
  email?: string;
  customerName?: string;
  shippingAddress?: string;
  billingAddress?: string;
  items: ReceiptItem[];
  shippingCost?: number;
  discountCode?: string;
  discountPercent?: number;
  taxPercent?: number;
  deliveryEstimate?: string;
};

const formatCurrency = (value: number) => `$${value.toFixed(2)}`;

const Recipt = ({
  orderNumber = "#HLD-2026-18042",
  orderDate = "May 18, 2026",
  cardLast4 = "9850",
  email = "jordan@example.com",
  customerName = "Jordan Reeves",
  shippingAddress = "180 Bedford Avenue Apt, 4F Brooklyn, NY 11211",
  billingAddress = "180 Bedford Avenue Apt, 4F Brooklyn, NY 11211",
  items,
  shippingCost = 0,
  discountCode = "WELCOME15",
  discountPercent = 0,
  taxPercent = 0,
  deliveryEstimate = "Arrives May 22, 2026 to May 25, 2026",
}: ReciptProps) => {
  const subtotal = items.reduce((sum, item) => sum + item.price, 0);
  const discountAmount = (subtotal * discountPercent) / 100;
  const tax = ((subtotal - discountAmount) * taxPercent) / 100;
  const total = subtotal - discountAmount + tax + shippingCost;

  return (
    <section className="w-full bg-background py-10 lg:py-16">
      <div className="mx-auto w-full max-w-190">
        <div className="overflow-hidden rounded-3xl border border-border bg-background">
          <div className="h-2.5 w-full shrink-0 bg-linear-to-r from-teal-400 via-sky-400 to-blue-500 sm:h-4" />

          <div className="flex flex-col gap-6 p-5 sm:gap-8 sm:p-10">
            {/* top row */}
            <div className="flex items-center justify-between">
              <Logo />
              <Badge
                variant="secondary"
                className="h-auto gap-1.5 rounded-full px-3 py-1 text-sm font-normal"
              >
                <CheckCircle2 />
                <span className="hidden sm:inline">Order Confirmed</span>
                <span className="sm:hidden">Confirmed</span>
              </Badge>
            </div>

            {/* title block */}
            <div className="flex flex-col gap-3">
              <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                Thanks For Your Order!
              </h2>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-lg bg-muted px-3 py-1 text-xs font-medium text-foreground">
                  Order: {orderNumber}
                </span>
                <span className="rounded-lg bg-muted px-3 py-1 text-xs font-medium text-foreground">
                  Date: {orderDate}
                </span>
                <span className="flex items-center gap-1.5 rounded-lg bg-muted px-3 py-1 text-xs font-medium text-foreground">
                  Paid Via
                  <img src="https://images.shadcnspace.com/assets/svgs/icon-visa-color.svg" alt="visa icon" width={33} height={16} />
                  {`xx${cardLast4}`}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                We sent a beautiful interactive login link to{" "}
                <span className="text-primary">{email}</span> to track live status.
              </p>
            </div>

            {/* items */}
            <div className="flex flex-col gap-3">
              <p className="text-xs font-medium text-muted-foreground">Your Items</p>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {items.map((item) => (
                  <Card
                    key={item.id}
                    className="gap-3 rounded-2xl border border-border bg-background p-3 ring-0"
                  >
                    <div className="h-32.5 w-full shrink-0 overflow-hidden rounded-lg">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="size-full object-cover object-top bg-top"
                      />
                    </div>
                    <CardContent className="flex flex-col gap-2 p-0">
                      <div className="flex items-start justify-between gap-2 text-sm text-foreground">
                        <div className="min-w-0 flex-1">
                          <p className="truncate">{item.title}</p>
                          <p className="truncate text-muted-foreground">{item.description}</p>
                        </div>
                        <p className="shrink-0 font-semibold">{formatCurrency(item.price)}</p>
                      </div>
                      <span className="w-fit rounded bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                        {item.variant}
                      </span>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* addresses */}
            <div className="flex flex-col gap-4 sm:flex-row">
              <Card className="flex-1 gap-3 rounded-2xl border border-border bg-card p-5 ring-0">
                <div className="flex items-center gap-2">
                  <Truck className="size-4 text-foreground" />
                  <p className="text-xs font-medium text-foreground">Delivery Address</p>
                </div>
                <div className="flex flex-col gap-0.5 text-sm">
                  <p className="font-semibold text-foreground">{customerName}</p>
                  <p className="text-muted-foreground">{shippingAddress}</p>
                </div>
              </Card>
              <Card className="flex-1 gap-3 rounded-2xl border border-border bg-card p-5 ring-0">
                <div className="flex items-center gap-2">
                  <FileText className="size-4 text-foreground" />
                  <p className="text-xs font-medium text-foreground">Billing Details</p>
                </div>
                <div className="flex flex-col gap-0.5 text-sm">
                  <p className="font-semibold text-foreground">{customerName}</p>
                  <p className="text-muted-foreground">{billingAddress}</p>
                </div>
              </Card>
            </div>

            {/* totals */}
            <Card className="gap-4 rounded-2xl border border-border bg-card p-5 ring-0 sm:p-6">
              <div className="flex flex-col gap-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="text-foreground">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Shipping &amp; Handling</span>
                  <span className="text-foreground">{formatCurrency(shippingCost)}</span>
                </div>
                {discountPercent > 0 && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="text-muted-foreground">Discount Applied</span>
                      <span className="rounded bg-orange-400/10 px-1.5 py-0.5 text-xs font-semibold text-orange-400">
                        {discountCode}
                      </span>
                    </div>
                    <span className="text-foreground">-{formatCurrency(discountAmount)}</span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Estimated Tax</span>
                  <span className="text-foreground">{formatCurrency(tax)}</span>
                </div>
              </div>

              <Separator />

              <div className="flex items-center justify-between text-foreground">
                <span className="text-lg font-semibold">Final Total</span>
                <span className="text-2xl font-semibold">{formatCurrency(total)}</span>
              </div>

              <div className="flex items-center gap-2 rounded-lg border border-border bg-muted p-3">
                <PackageCheck className="size-4 text-muted-foreground" />
                <p className="text-xs font-medium text-muted-foreground">{deliveryEstimate}</p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Recipt;