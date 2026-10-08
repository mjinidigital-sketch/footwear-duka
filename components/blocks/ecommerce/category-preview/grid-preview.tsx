import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getCategories, getProducts } from '@/app/actions';

interface Category {
  _id: string;
  name: string;
  slug: string;
  description: string;
}

export default function GridPreview() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      const [categoriesData, productsData] = await Promise.all([
        getCategories(),
        getProducts()
      ]);
      setCategories(categoriesData);
      setProducts(productsData);
    }
    fetchData();
  }, []);

  const categoriesWithMeta = categories.map((category, index) => {
    const categoryProducts = products.filter(p => p.categorySlug === category.slug);
    return {
      ...category,
      productCount: categoryProducts.length,
      featured: index === 0,
      trending: index === 0 || index === 4,
      new: index === 2,
    };
  });

  return (
    <div className="mx-auto w-full max-w-7xl p-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {categoriesWithMeta.map((category) => (
          <div
            key={category._id}
            className={`group relative overflow-hidden rounded-xl ${
              category.featured ? 'md:col-span-2 md:row-span-2' : ''
            }`}
          >
            {/* Background */}
            <div className="relative aspect-square bg-gradient-to-br from-primary/20 to-primary/5">
              <div className="from-background/90 via-background/50 to-background/20 absolute inset-0 bg-gradient-to-t" />
            </div>

            {/* Content */}
            <div className="absolute inset-0 flex flex-col p-6">
              <div className="flex-1">
                <div className="flex gap-2">
                  {category.trending && (
                    <Badge variant="secondary">Trending</Badge>
                  )}
                  {category.new && (
                    <Badge variant="secondary">New Arrival</Badge>
                  )}
                </div>
              </div>
              <div>
                <h3
                  className={`mb-2 font-semibold tracking-tight ${
                    category.featured ? 'text-2xl' : 'text-xl'
                  }`}
                >
                  {category.name}
                </h3>
                <div className="flex items-center justify-between">
                  <span className="text-accent-foreground/80 text-sm">
                    {category.productCount} products
                  </span>
                  <Button
                    variant="ghost"
                    className="-translate-x-2 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
                  >
                    Explore
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Hover Overlay */}
            <div className="bg-primary/5 pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          </div>
        ))}
      </div>
    </div>
  );
}
