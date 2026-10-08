import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useEffect, useState } from 'react';
import { getProducts } from '@/app/actions';

export default function FadingBackgroundTestimonialPromo() {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      const productsData = await getProducts();
      setProducts(productsData);
    }
    fetchData();
  }, []);

  const featuredProduct = products[0];

  return (
    <div className="bg-background relative">
      {/* Background with fading effect */}
      <div className="absolute inset-0 overflow-hidden">
        {featuredProduct && (
          <img
            src={featuredProduct.mainImage}
            alt={featuredProduct.name}
            className="h-full w-full object-cover object-center"
          />
        )}
        <div
          className="from-background via-background/80 absolute inset-0 bg-gradient-to-t to-transparent"
          aria-hidden="true"
        />
      </div>

      {/* Content */}
      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="grid grid-cols-1 gap-y-16 lg:grid-cols-2 lg:gap-x-16">
          {/* Promo Content */}
          <div className="flex flex-col justify-center">
            <h2 className="text-foreground text-3xl font-bold tracking-tight sm:text-4xl">
              Premium Footwear Collection
            </h2>
            <p className="text-muted-foreground mt-4 text-lg">
              Discover unmatched comfort and style with our latest range of premium footwear. Designed for athletes and everyday wear alike.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Button size="lg">Shop Collection</Button>
              <Button variant="outline" size="lg">Explore Categories</Button>
            </div>
            <div className="border-border/50 mt-10 border-t pt-10">
              <h3 className="text-primary text-sm font-medium">
                Featured Product
              </h3>
              <p className="text-muted-foreground mt-2 text-sm">
                {featuredProduct?.name || 'Loading...'}
              </p>
            </div>
          </div>

          {/* Testimonials */}
          <div className="space-y-8">
            <blockquote className="border-border/50 bg-card/50 rounded-lg border p-6 shadow-sm backdrop-blur-sm">
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarImage
                    src="https://github.com/shadcn.png"
                    alt="@shadcn"
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">Sarah Johnson</p>
                  <p className="text-muted-foreground text-xs">
                    Verified Buyer
                  </p>
                </div>
              </div>
              <p className="text-muted-foreground mt-4">
                &quot;These shoes are incredible! The comfort is top-notch, and they&apos;re so stylish I get compliments everywhere. Worth every penny.&quot;
              </p>
            </blockquote>

            <blockquote className="border-border/50 bg-card/50 rounded-lg border p-6 shadow-sm backdrop-blur-sm">
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarImage
                    src="https://randomuser.me/api/portraits/men/75.jpg"
                    alt="User 2"
                  />
                  <AvatarFallback>MJ</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">Michael Davis</p>
                  <p className="text-muted-foreground text-xs">
                    Marathon Runner
                  </p>
                </div>
              </div>
              <p className="text-muted-foreground mt-4">
                &quot;As a professional runner, I&apos;m picky about footwear. These shoes deliver unmatched performance and comfort that rivals much more expensive brands.&quot;
              </p>
            </blockquote>

            <blockquote className="border-border/50 bg-card/50 rounded-lg border p-6 shadow-sm backdrop-blur-sm">
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarImage
                    src="https://randomuser.me/api/portraits/women/44.jpg"
                    alt="User 3"
                  />
                  <AvatarFallback>LP</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">Linda Park</p>
                  <p className="text-muted-foreground text-xs">
                    Fitness Enthusiast
                  </p>
                </div>
              </div>
              <p className="text-muted-foreground mt-4">
                &quot;Perfect for my daily workouts! They provide excellent support and the cushioning is amazing. My new essential training companion.&quot;
              </p>
            </blockquote>
          </div>
        </div>
      </div>
    </div>
  );
}
