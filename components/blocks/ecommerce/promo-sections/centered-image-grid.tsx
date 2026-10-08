import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useEffect, useState } from 'react';
import { getProducts } from '@/app/actions';

export default function CenteredImageGridPromo() {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      const productsData = await getProducts();
      setProducts(productsData);
    }
    fetchData();
  }, []);

  const featuredProducts = products.slice(0, 4);

  return (
    <div className="bg-background py-12 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center lg:max-w-4xl">
          <Badge variant="secondary" className="mb-4">
            Trending Now
          </Badge>
          <h2 className="text-foreground text-3xl font-bold tracking-tight sm:text-4xl">
            Featured Footwear Collection
          </h2>
          <p className="text-muted-foreground mt-4 text-lg">
            Discover our premium selection of running shoes, casual sneakers, and formal footwear.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 lg:gap-6">
          {featuredProducts.map((product, index) => (
            <div
              key={product._id}
              className={`group relative block overflow-hidden rounded-lg shadow-sm transition-shadow hover:shadow-md ${index === 2 ? 'hidden sm:block' : ''} ${index === 3 ? 'hidden lg:block' : ''}`}
            >
              <img
                src={product.mainImage}
                alt={product.name}
                width={400}
                height={500}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-0 left-0 p-4">
                <p className="text-sm font-medium text-white">
                  {product.name}
                </p>
                <p className="text-xs text-white/80">KES {product.price.toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button size="lg" variant="outline">
            Shop All Products
          </Button>
        </div>
      </div>
    </div>
  );
}
