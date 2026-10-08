import { Button } from '@/components/ui/button';
import { Badge, badgeVariants } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import type { VariantProps } from 'class-variance-authority';
import { useEffect, useState } from 'react';
import { getCategories } from '@/app/actions';

interface PromoCardItem {
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  linkHref: string;
  linkLabel: string;
  badge?: string;
  badgeVariant?: VariantProps<typeof badgeVariants>['variant'];
}

export default function MultiColumnCardPromo() {
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      const categoriesData = await getCategories();
      setCategories(categoriesData);
    }
    fetchData();
  }, []);
  
  const promoItems: PromoCardItem[] = categories.slice(0, 3).map((category, index) => ({
    title: category.name,
    description: category.description,
    imageSrc: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop',
    imageAlt: category.name,
    linkHref: `/categories/${category.slug}`,
    linkLabel: 'View Collection',
    badge: index === 0 ? 'Featured' : undefined,
    badgeVariant: index === 0 ? 'secondary' : undefined,
  }));

  return (
    <div className="bg-background py-12 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center lg:max-w-4xl">
          <h2 className="text-foreground text-3xl font-bold tracking-tight sm:text-4xl">
            Discover What&apos;s New & Trending
          </h2>
          <p className="text-muted-foreground mt-4 text-lg">
            Explore our latest collections, special offers, and featured items.
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-lg grid-cols-1 gap-8 sm:max-w-none lg:grid-cols-3">
          {promoItems.map((item) => (
            <Card
              key={item.title}
              className="flex flex-col gap-0 overflow-hidden p-0 transition-shadow hover:shadow-lg"
            >
              <CardHeader className="relative p-0">
                {item.badge && (
                  <Badge
                    variant={item.badgeVariant}
                    className="absolute top-3 right-3 z-10"
                  >
                    {item.badge}
                  </Badge>
                )}
                <div className="aspect-h-9 aspect-w-16 h-60">
                  <img
                    src={item.imageSrc}
                    alt={item.imageAlt}
                    className="object-cover"
                  />
                </div>
              </CardHeader>
              <CardContent className="flex flex-grow flex-col p-6">
                <CardTitle className="text-lg font-semibold">
                  {item.title}
                </CardTitle>
                <p className="text-muted-foreground mt-2 flex-grow text-sm">
                  {item.description}
                </p>
              </CardContent>
              <CardFooter className="bg-muted/30 p-4">
                <Button variant="ghost" size="sm" className="w-full justify-start">
                  {item.linkLabel}<ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
