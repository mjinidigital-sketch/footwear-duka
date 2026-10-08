import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useEffect, useState } from 'react';
import { getProducts } from '@/app/actions';

export default function FullWidthLargeContentPromo() {
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
    <div className="bg-background relative overflow-hidden">
      <div className="absolute inset-0">
        {featuredProduct && (
          <img
            src={featuredProduct.mainImage}
            alt={featuredProduct.name}
            className="h-full w-full object-cover object-center"
          />
        )}
        <div
          className="bg-primary/60 dark:bg-primary-foreground/60 absolute inset-0 mix-blend-multiply"
          aria-hidden="true"
        />
      </div>
      <div className="relative mx-auto max-w-4xl px-4 py-24 text-center sm:px-6 sm:py-32 lg:px-8">
        <Badge className="bg-primary-foreground dark:bg-primary text-primary dark:text-primary-foreground mb-4">
          New Arrival
        </Badge>
        <h1 className="text-primary-foreground dark:text-primary text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
          Premium Footwear Collection
        </h1>
        <p className="text-primary-foreground/80 dark:text-primary/80 mx-auto mt-6 max-w-xl text-xl">
          Experience unparalleled comfort and style. Shop now and receive exclusive early access benefits.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button variant="secondary" size="lg" className="w-full sm:w-auto">
            Shop Now
          </Button>
          <Button variant="outline" size="lg" className="border-primary-foreground/30 dark:border-primary/30 text-primary-foreground dark:text-primary hover:bg-primary-foreground/10 dark:hover:bg-primary/10 hover:text-primary-foreground dark:hover:text-primary w-full bg-transparent sm:w-auto">
            Explore Categories
          </Button>
        </div>
        <p className="text-primary-foreground/60 dark:text-primary/60 mt-8 text-xs">
          Free shipping on orders over KES 10,000. Terms and conditions apply.
        </p>
      </div>
    </div>
  );
}
