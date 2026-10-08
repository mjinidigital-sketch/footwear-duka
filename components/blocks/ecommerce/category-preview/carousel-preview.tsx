"use client"

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ArrowRight, Star } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { getCategories, getProducts } from '@/app/actions';
import { Doc } from '@/convex/_generated/dataModel';

interface Category {
  _id: string;
  name: string;
  description: string;
  slug: string;
}

export default function CarouselPreview() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>(null);
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

  const categoriesWithProductCount = categories.map(category => {
    const categoryProducts = products.filter(p => p.categorySlug === category.slug);
    const productCount = categoryProducts.length;
    const minPrice = productCount > 0 ? Math.min(...categoryProducts.map(p => p.price)) : 0;
    const maxPrice = productCount > 0 ? Math.max(...categoryProducts.map(p => p.price)) : 0;
    
    return {
      ...category,
      productCount,
      featured: category.slug === 'running',
      rating: 4.8,
      reviewCount: Math.floor(Math.random() * 500) + 100,
      priceRange: productCount > 0 ? `KES ${minPrice.toLocaleString()} - KES ${maxPrice.toLocaleString()}` : 'KES 0 - KES 0',
      tags: ['Premium', 'Quality', 'Style'],
    };
  });

  const nextSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev + 1) % categoriesWithProductCount.length);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const prevSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex(
      (prev) => (prev - 1 + categoriesWithProductCount.length) % categoriesWithProductCount.length
    );
    setTimeout(() => setIsAnimating(false), 500);
  };

  useEffect(() => {
    timeoutRef.current = setInterval(nextSlide, 5000);
    return () => {
      if (timeoutRef.current) clearInterval(timeoutRef.current);
    };
  }, []);

  return (
    <div className="mx-auto w-full max-w-7xl p-6">
      <div className="bg-card relative overflow-hidden rounded-xl border">
        {/* Main Carousel */}
        <div className="relative aspect-[21/9]">
          {categoriesWithProductCount.map((category, index) => (
            <div
              key={category._id}
              className={`absolute inset-0 transition-transform duration-500 ease-out ${index === currentIndex
                  ? 'translate-x-0'
                  : index < currentIndex
                    ? '-translate-x-full'
                    : 'translate-x-full'
                }`}
            >
              {/* Background Image */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-background/90">
                <div className="from-background/90 via-background/60 absolute inset-0 bg-gradient-to-r to-transparent" />
              </div>

              {/* Content */}
              <div className="relative flex h-full items-center">
                <div className="w-full max-w-2xl space-y-6 p-8 lg:p-12">
                  {category.featured && (
                    <Badge
                      variant="secondary"
                      className="bg-primary/10 text-primary mb-4"
                    >
                      Featured Collection
                    </Badge>
                  )}

                  <h2 className="text-4xl font-semibold tracking-tight">
                    {category.name}
                  </h2>

                  <p className="text-accent-foreground/80 text-lg">
                    {category.description}
                  </p>

                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${i < Math.floor(category.rating)
                              ? 'fill-primary text-primary'
                              : 'fill-muted text-muted'
                            }`}
                        />
                      ))}
                      <span className="ml-2 font-medium">
                        {category.rating}
                      </span>
                      <span className="text-accent-foreground/80">
                        ({category.reviewCount})
                      </span>
                    </div>
                    <div className="text-accent-foreground/80">
                      {category.productCount} products
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {category.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="outline"
                        className="bg-background/50 backdrop-blur-sm"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="pt-4">
                    <Button size="lg" className="group">
                      Explore Collection
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation */}
        <div className="absolute right-6 bottom-6 flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={prevSlide}
            className="bg-background/50 hover:bg-background/80 backdrop-blur-sm"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={nextSlide}
            className="bg-background/50 hover:bg-background/80 backdrop-blur-sm"
          >
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Indicators */}
        <div className="absolute bottom-6 left-6 flex items-center gap-2">
          {categoriesWithProductCount.map((_, index) => (
            <button
              key={index}
              className={`h-2 w-2 rounded-full transition-all ${index === currentIndex
                  ? 'bg-primary w-6'
                  : 'bg-primary/30 hover:bg-primary/50'
                }`}
              onClick={() => {
                setIsAnimating(true);
                setCurrentIndex(index);
                setTimeout(() => setIsAnimating(false), 500);
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
