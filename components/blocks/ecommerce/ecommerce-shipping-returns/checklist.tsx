import { Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ChecklistItem {
  label: string;
  details?: string;
}

const shippingItems: ChecklistItem[] = [
  {
    label: "Free shipping on orders over $75",
    details: "Automatically applied at checkout",
  },
  {
    label: "Same-day processing",
    details: "Orders placed before 2 PM EST",
  },
  {
    label: "Multiple shipping options",
    details: "Standard, Express, and Overnight available",
  },
  {
    label: "Real-time tracking",
    details: "Track your package from dispatch to delivery",
  },
  {
    label: "Secure packaging",
    details: "Eco-friendly materials with protective padding",
  },
];

const returnsItems: ChecklistItem[] = [
  {
    label: "30-day return window",
    details: "From the date of delivery",
  },
  {
    label: "Free return shipping",
    details: "We provide prepaid return labels",
  },
  {
    label: "Easy return process",
    details: "Start your return online in just a few clicks",
  },
  {
    label: "Full refund guarantee",
    details: "Money back within 5-7 business days",
  },
  {
    label: "No restocking fees",
    details: "Return items in original condition",
  },
];

export default function ShippingReturnsChecklist() {
  return (
    <div className="px-4 py-8 md:py-12">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 text-center">
          <h2 className="mb-2 text-2xl font-bold md:text-3xl">
            Shipping & Returns
          </h2>
          <p className="text-muted-foreground">
            Everything you need to know about our policies
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Shipping Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-full">
                  <Check className="text-primary h-4 w-4" />
                </div>
                Shipping
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {shippingItems.map((item, index) => (
                  <div
                    key={index}
                    className="hover:bg-muted/50 flex gap-3 rounded-lg p-3 transition-colors"
                  >
                    <div className="mt-0.5 flex-shrink-0">
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                        <Check className="h-3 w-3 text-green-600 dark:text-green-400" />
                      </div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="mb-1 text-sm font-medium">
                        {item.label}
                      </div>
                      {item.details && (
                        <div className="text-muted-foreground text-xs">
                          {item.details}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Returns Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-full">
                  <Check className="text-primary h-4 w-4" />
                </div>
                Returns
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {returnsItems.map((item, index) => (
                  <div
                    key={index}
                    className="hover:bg-muted/50 flex gap-3 rounded-lg p-3 transition-colors"
                  >
                    <div className="mt-0.5 flex-shrink-0">
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                        <Check className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                      </div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="mb-1 text-sm font-medium">
                        {item.label}
                      </div>
                      {item.details && (
                        <div className="text-muted-foreground text-xs">
                          {item.details}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Info */}
        <div className="mt-8 text-center">
          <p className="text-muted-foreground text-sm">
            Questions about shipping or returns?{" "}
            <a href="#" className="text-primary font-medium hover:underline">
              Contact our support team
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
