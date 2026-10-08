import { Truck, RotateCcw, Headphones } from "lucide-react";

export default function TrustGuaranteeThreePillars() {
  const trustPillars = [
    {
      icon: Truck,
      title: "Fast Shipping",
      description:
        "Free shipping on orders over $50. Most orders ship within 24 hours.",
    },
    {
      icon: RotateCcw,
      title: "No-Risk Returns",
      description:
        "30-day hassle-free returns. Love it or your money back, guaranteed.",
    },
    {
      icon: Headphones,
      title: "Top-Rated Support",
      description:
        "Award-winning customer service. We're here to help 7 days a week.",
    },
  ];

  return (
    <section className="w-full px-4 py-8 md:py-12">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-6">
          {trustPillars.map((pillar, index) => {
            const IconComponent = pillar.icon;
            return (
              <div
                key={index}
                className="flex flex-col items-center space-y-4 text-center"
              >
                <div className="bg-primary/10 flex h-16 w-16 items-center justify-center rounded-full">
                  <IconComponent className="text-primary h-8 w-8" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-foreground text-lg font-semibold">
                    {pillar.title}
                  </h3>
                  <p className="text-muted-foreground max-w-xs text-sm leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
