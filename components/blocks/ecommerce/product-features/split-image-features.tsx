import { Button } from '@/components/ui/button';
import { ChevronRight, ArrowRight } from 'lucide-react';

export default function SplitImageFeatures() {
  const features = [
    {
      title: 'HandCrafted Italian Leather',
      description: "Premium full-grain leather from Italy's finest tanneries",
    },
    {
      title: 'Goodyear Welt Construction',
      description: 'Durable construction technique that allows for resoling',
    },
    {
      title: 'Cork Footbed',
      description: 'Molds to your foot for personalized comfort over time',
    },
    {
      title: 'Hand-Finished Patina',
      description: 'Unique coloration applied by master artisans',
    },
  ];

  return (
    <section className="bg-background w-full py-12 md:py-24 lg:py-32">
      <div className="container mx-auto px-4 md:px-6 2xl:max-w-[1400px]">
        <div className="grid items-center gap-6 lg:grid-cols-2 lg:gap-12">
          {/* Left side - Images */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="overflow-hidden rounded-lg">
                  <img
                    src="https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=2012&auto=format&fit=crop"
                    alt="Premium leather shoe craftsmanship"
                    width={500}
                    height={600}
                    className="aspect-[4/5] h-auto w-full object-cover"
                  />
                </div>
                <div className="overflow-hidden rounded-lg">
                  <img
                    src="https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=2080&auto=format&fit=crop"
                    alt="Shoe sole detail"
                    width={500}
                    height={400}
                    className="aspect-[4/3] h-auto w-full object-cover"
                  />
                </div>
              </div>
              <div className="mt-8 space-y-4">
                <div className="overflow-hidden rounded-lg">
                  <img
                    src="https://images.unsplash.com/photo-1605812860427-4024433a70fd?q=80&w=1935&auto=format&fit=crop"
                    alt="Leather texture detail"
                    width={500}
                    height={400}
                    className="aspect-[4/3] h-auto w-full object-cover"
                  />
                </div>
                <div className="overflow-hidden rounded-lg">
                  <img
                    src="https://images.unsplash.com/photo-1491553895911-0055eca6402d?q=80&w=2000&auto=format&fit=crop"
                    alt="Premium handcrafted footwear detail"
                    width={500}
                    height={600}
                    className="aspect-[4/5] h-auto w-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Design elements */}
            <div className="bg-primary/10 absolute -bottom-4 -left-4 -z-10 h-24 w-24 rounded-full blur-xl"></div>
            <div className="bg-primary/10 absolute -top-4 -right-4 -z-10 h-24 w-24 rounded-full blur-xl"></div>
          </div>

          {/* Right side - Content */}
          <div className="flex flex-col space-y-8">
            <div className="space-y-2">
              <div className="bg-primary/10 text-primary inline-block rounded-full px-3 py-1 text-sm">
                Master Craftsmanship
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Artisanal footwear, crafted with precision
              </h2>
              <p className="text-muted-foreground max-w-[600px] md:text-xl/relaxed">
                Each pair is handcrafted by our master artisans using
                traditional techniques passed down through generations.
              </p>
            </div>

            <div className="space-y-4">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="bg-card text-card-foreground hover:bg-muted/50 flex rounded-lg border p-4 transition-colors"
                >
                  <div className="bg-primary/10 text-primary mr-4 flex h-8 w-8 shrink-0 items-center justify-center rounded-full">
                    <ChevronRight className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-medium">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="bg-border h-px flex-1"></div>
                <span className="text-muted-foreground text-sm">
                  Handcrafted in Italy
                </span>
                <div className="bg-border h-px flex-1"></div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button size="lg" render={<a href="#" />} nativeButton={false}>Shop Collection
                                                  <ArrowRight className="ml-2 h-4 w-4" /></Button>
                <Button size="lg" variant="outline" render={<a href="#" />} nativeButton={false}>View Craftsmanship</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
