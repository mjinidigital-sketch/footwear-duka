import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { getProducts } from '@/app/actions';
import Link from 'next/link';

export default function SimpleBannerPromo() {
  const [productCount, setProductCount] = useState(0);

  useEffect(() => {
    async function fetchData() {
      const products = await getProducts();
      setProductCount(products.length);
    }
    fetchData();
  }, []);

  return (
    <div className="bg-primary">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:flex lg:items-center lg:justify-between lg:px-8 lg:py-16">
        <h2 className="text-primary-foreground text-3xl font-bold tracking-tight sm:text-4xl">
          <span className="block">Ready to step up?</span>
          <span className="text-primary-foreground/80 block">
            Explore our premium footwear collection with {productCount}+ products today.
          </span>
        </h2>
        <div className="mt-8 flex lg:mt-0 lg:ml-4 lg:flex-shrink-0">
          <Link href="/products">
            <Button size="lg" variant="secondary">Shop Now</Button>
          </Link>
          <Link href="/categories" className="ml-3">
            <Button size="lg" variant="ghost" className="text-primary-foreground hover:bg-primary/80 hover:text-primary-foreground">Browse Categories</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
