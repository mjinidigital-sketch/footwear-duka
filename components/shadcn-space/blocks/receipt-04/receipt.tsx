"use client";

import Logo from "@/assets/logo/logo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  ArrowRight,
  ChevronRight,
  CircleCheck,
  CircleHelp,
  CornerUpLeft,
  CreditCard,
  Download,
  Mail,
  Package,
  PackageCheck,
  Printer,
  RotateCcw,
  ShoppingCart,
  Truck,
  type LucideIcon,
} from "lucide-react";

export type ReceiptItem = {
  id: string;
  image: string;
  title: string;
  variant: string;
  price: number;
};

export type JourneyStep = {
  label: string;
  date: string;
  icon: LucideIcon;
};

type Recipt04Props = {
  orderNumber?: string;
  orderDate?: string;
  email?: string;
  total?: number;
  cardLast4?: string;
  customerName?: string;
  shippingAddress?: string;
  billingAddress?: string;
  paymentExpiry?: string;
  paymentDate?: string;
  items: ReceiptItem[];
  shippingCost?: number;
  discountCode?: string;
  discountAmount?: number;
  taxAmount?: number;
  journeySteps?: JourneyStep[];
  activeStepIndex?: number;
};

const formatCurrency = (value: number) => `$${value.toFixed(2)}`;

const defaultJourneySteps: JourneyStep[] = [
  { label: "Order Placed", date: "May 18, 2026 · 9:42 AM", icon: ShoppingCart },
  { label: "Payment Authorized", date: "May 18, 2026 · 9:42 AM", icon: CreditCard },
  { label: "Shipped", date: "May 19, 2026 · 3:18 PM", icon: Package },
  { label: "In Transit", date: "Expected May 20 to 22", icon: Truck },
  { label: "Delivered", date: "Estimated May 22 to 25", icon: PackageCheck },
];

const actionRows = [
  { label: "Track Order", icon: Truck, iconClassName: "bg-blue-500/10 text-blue-500" },
  { label: "Reorder", icon: RotateCcw, iconClassName: "bg-teal-400/10 text-teal-400" },
  { label: "Return", icon: CornerUpLeft, iconClassName: "bg-orange-400/10 text-orange-400" },
  { label: "Get Help", icon: CircleHelp, iconClassName: "bg-sky-400/10 text-sky-400" },
];

const Recipt04 = ({
  orderNumber = "HLD-2026-18042",
  orderDate = "May 18, 2026",
  email = "jordan@example.com",
  total = 397.06,
  cardLast4 = "4242",
  customerName = "Jordan Reeves",
  shippingAddress = "180 Bedford Avenue Apt 4F Brooklyn, NY 11211 United States",
  billingAddress = "180 Bedford Avenue Apt 4F Brooklyn, NY 11211 United States",
  paymentExpiry = "Expires 04 / 28",
  paymentDate = "Charged May 18, 2026 at 9:42 AM",
  items,
  shippingCost = 8.5,
  discountCode = "WELCOME15",
  discountAmount = 40,
  taxAmount = 29.56,
  journeySteps = defaultJourneySteps,
  activeStepIndex = 2,
}: Recipt04Props) => {
  const subtotal = items.reduce((sum, item) => sum + item.price, 0);

  return (
    <section className="w-full bg-background py-10 lg:py-16">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 rounded-3xl bg-muted p-3 sm:p-5">
          {/* header */}
          <div className="flex items-center justify-between">
            <Logo />
            <div className="flex items-center gap-2">
              <Button type="button" variant="outline" size="sm">
                <Download />
                <span className="hidden sm:inline">Download</span>
              </Button>
              <Button type="button" variant="outline" size="sm">
                <Mail />
                <span className="hidden sm:inline">Email</span>
              </Button>
              <Button
                type="button"
                variant="outline"
                size="icon-sm"
                aria-label="Print receipt"
              >
                <Printer />
              </Button>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            {/* KPI banner */}
            <div className="flex flex-col items-start gap-4 rounded-2xl bg-card p-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-1 flex-col gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge className="gap-1.5 rounded-full bg-teal-400/10 px-2 py-0.5 text-xs font-normal text-teal-400 hover:bg-teal-400/10">
                    <CircleCheck className="size-3" />
                    Paid
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    Placed {orderDate}
                  </span>
                </div>
                <p className="text-2xl font-semibold text-foreground">
                  Order {orderNumber}
                </p>
                <p className="text-sm text-muted-foreground">
                  A receipt was sent to{" "}
                  <span className="font-medium text-foreground">{email}</span>
                </p>
              </div>
              <div className="flex flex-col items-start gap-1 sm:items-end">
                <p className="text-xs font-medium text-muted-foreground">
                  Total Paid
                </p>
                <p className="text-3xl font-semibold tracking-tight text-foreground">
                  {formatCurrency(total)}
                </p>
                <p className="text-sm text-muted-foreground">
                  Visa · {cardLast4}
                </p>
              </div>
            </div>

            {/* order journey */}
            <div className="flex flex-col gap-5 rounded-2xl bg-card p-5">
              <div className="flex items-center justify-between">
                <p className="text-base font-medium text-foreground">
                  Order Journey
                </p>
                <Button type="button" variant="outline" size="sm">
                  Track Shipment
                  <ArrowRight />
                </Button>
              </div>

              {/* horizontal timeline - md and up */}
              <div className="hidden items-start justify-between md:flex">
                {journeySteps.map((step, index) => {
                  const isDone = index <= activeStepIndex;
                  const leftActive = index > 0 && index <= activeStepIndex;
                  const rightActive =
                    index < journeySteps.length - 1 && index < activeStepIndex;
                  const Icon = step.icon;
                  return (
                    <div
                      key={step.label}
                      className="flex flex-1 flex-col items-center gap-3"
                    >
                      <div className="flex w-full items-center gap-3">
                        <div
                          className={`h-px flex-1 ${index === 0
                            ? "bg-transparent"
                            : leftActive
                              ? "bg-teal-400"
                              : "bg-border"
                            }`}
                        />
                        <div
                          className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${isDone
                            ? "bg-teal-400 text-white"
                            : "bg-secondary text-muted-foreground"
                            }`}
                        >
                          <Icon className="size-4" />
                        </div>
                        <div
                          className={`h-px flex-1 ${index === journeySteps.length - 1
                            ? "bg-transparent"
                            : rightActive
                              ? "bg-teal-400"
                              : "bg-border"
                            }`}
                        />
                      </div>
                      <div className="flex flex-col items-center gap-1 text-center">
                        <p className="text-sm font-medium text-foreground">
                          {step.label}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {step.date}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* vertical timeline - below md */}
              <div className="flex flex-col md:hidden">
                {journeySteps.map((step, index) => {
                  const isDone = index <= activeStepIndex;
                  const lineActive = index < activeStepIndex;
                  const Icon = step.icon;
                  const isLast = index === journeySteps.length - 1;
                  return (
                    <div key={step.label} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div
                          className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${isDone
                            ? "bg-teal-400 text-white"
                            : "bg-secondary text-muted-foreground"
                            }`}
                        >
                          <Icon className="size-4" />
                        </div>
                        {!isLast && (
                          <div
                            className={`my-1 w-px flex-1 ${lineActive ? "bg-teal-400" : "bg-border"
                              }`}
                          />
                        )}
                      </div>
                      <div className="flex flex-col gap-1 pb-6">
                        <p className="text-sm font-medium text-foreground">
                          {step.label}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {step.date}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* main content split */}
            <div className="flex flex-col gap-3 lg:flex-row lg:items-start">
              <div className="flex flex-1 flex-col gap-3">
                <div className="flex flex-col gap-3 sm:flex-row">
                  <div className="flex flex-1 flex-col gap-3 rounded-2xl bg-card p-5">
                    <p className="text-sm font-medium text-muted-foreground">
                      Ship To
                    </p>
                    <div className="flex flex-col gap-1.5">
                      <p className="text-sm font-medium text-foreground">
                        {customerName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {shippingAddress}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col gap-3 rounded-2xl bg-card p-5">
                    <p className="text-sm font-medium text-muted-foreground">
                      Bill To
                    </p>
                    <div className="flex flex-col gap-1.5">
                      <p className="text-sm font-medium text-foreground">
                        {customerName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {billingAddress}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-5 rounded-2xl bg-card p-5">
                  <div className="flex flex-col gap-0.5">
                    <p className="text-xs text-muted-foreground">
                      Order Details
                    </p>
                    <p className="text-sm font-medium text-foreground">
                      {items.length} items
                    </p>
                  </div>

                  <div className="flex flex-col gap-3">
                    {items.map((item) => (
                      <div key={item.id} className="flex items-center gap-4">
                        <div className="flex min-w-0 flex-1 items-center gap-3">
                          <div className="size-12 shrink-0 overflow-hidden rounded-md bg-muted">
                            <img
                              src={item.image}
                              alt={item.title}
                              className="size-full object-cover"
                            />
                          </div>
                          <div className="flex min-w-0 flex-col gap-0.5">
                            <p className="truncate text-sm font-medium text-foreground">
                              {item.title}
                            </p>
                            <p className="truncate text-xs text-muted-foreground">
                              {item.variant}
                            </p>
                          </div>
                        </div>
                        <p className="shrink-0 text-sm font-medium text-foreground">
                          {formatCurrency(item.price)}
                        </p>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-medium text-foreground">
                        {formatCurrency(subtotal)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Shipping</span>
                      <span className="font-medium text-foreground">
                        {formatCurrency(shippingCost)}
                      </span>
                    </div>
                    {discountAmount > 0 && (
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-1.5">
                          <span className="text-muted-foreground">Discount</span>
                          <span className="rounded bg-blue-500/10 px-1.5 py-0.5 text-xs font-semibold text-blue-500">
                            {discountCode}
                          </span>
                        </div>
                        <span className="font-medium text-blue-500">
                          -{formatCurrency(discountAmount)}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        Estimated Tax
                      </span>
                      <span className="font-medium text-foreground">
                        {formatCurrency(taxAmount)}
                      </span>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between text-foreground">
                    <span className="text-sm font-medium">Total</span>
                    <span className="text-lg font-semibold">
                      {formatCurrency(total)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3 lg:w-80 lg:shrink-0">
                <div className="flex flex-col gap-3 rounded-2xl bg-card p-5">
                  <p className="text-sm font-medium text-muted-foreground">
                    Payment
                  </p>
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-3">
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-border bg-background shadow-xs">
                        <CreditCard className="size-4 text-foreground" />
                      </div>
                      <div className="flex flex-col">
                        <p className="text-sm font-medium text-foreground">
                          Visa · {cardLast4}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {paymentExpiry}
                        </p>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {paymentDate}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  {actionRows.map((action) => {
                    const Icon = action.icon;
                    return (
                      <button
                        key={action.label}
                        type="button"
                        className="flex items-center justify-between rounded-xl bg-background p-4 text-left transition-colors hover:bg-background/80"
                      >
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`flex items-center justify-center rounded-lg p-2 ${action.iconClassName}`}
                          >
                            <Icon className="size-4" />
                          </div>
                          <span className="text-sm font-semibold text-foreground">
                            {action.label}
                          </span>
                        </div>
                        <ChevronRight className="size-4 text-muted-foreground" />
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* footer */}
          <div className="flex items-center justify-center py-2">
            <p className="text-center text-xs text-muted-foreground/50">
              Tracking updates will be sent to{" "}
              <span className="font-medium">{email}.</span> Visit your{" "}
              <a href="#" className="underline underline-offset-2">
                order history
              </a>{" "}
              to manage this order.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Recipt04;
