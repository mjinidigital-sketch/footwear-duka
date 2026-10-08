import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Heart, Star, SlidersHorizontal, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getProducts, getCategories } from '@/app/actions';

interface Product {
  _id: string;
  name: string;
  categorySlug: string;
  price: number;
  quantity: number;
  rating?: number;
  reviews?: number;
  colors: { name: string; hex: string; images: string[]; }[];
  sizes: number[];
  gender: 'Men' | 'Women' | 'Unisex';
  description: string;
  mainImage: string;
}

interface Filter {
  search: string;
  category: string;
  priceRange: [number, number];
  minRating: number;
  features: string[];
}

export default function FilterList() {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<Filter>({
    search: '',
    category: 'all',
    priceRange: [0, 20000],
    minRating: 0,
    features: [],
  });

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>(['all']);

  useEffect(() => {
    async function fetchData() {
      const [productsData, categoriesData] = await Promise.all([
        getProducts(),
        getCategories()
      ]);
      setProducts(productsData);
      setCategories(['all', ...categoriesData.map(cat => cat.name)]);
    }
    fetchData();
  }, []);

  const features = [
    'Water Resistant',
    'Breathable',
    'Lightweight',
    'Cushioned Sole',
    'Durable',
    'Comfortable',
  ];

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(filters.search.toLowerCase());
    const matchesCategory =
      filters.category === 'all' || product.categorySlug === filters.category.toLowerCase().replace(/\s+/g, '-');
    const matchesPrice =
      product.price >= filters.priceRange[0] &&
      product.price <= filters.priceRange[1];
    const matchesRating = (product.rating || 0) >= filters.minRating;
    const matchesFeatures =
      filters.features.length === 0 ||
      filters.features.every((f) => product.description.toLowerCase().includes(f.toLowerCase()));

    return (
      matchesSearch &&
      matchesCategory &&
      matchesPrice &&
      matchesRating &&
      matchesFeatures
    );
  });

  return (
    <div className="mx-auto w-full max-w-7xl p-6">
      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Filters Sidebar */}
        <div
          className={`shrink-0 space-y-6 lg:w-64 ${
            showFilters
              ? 'bg-background fixed inset-0 z-50 p-6 lg:static lg:p-0'
              : 'hidden lg:block'
          }`}
        >
          <div className="flex items-center justify-between lg:hidden">
            <h2 className="font-semibold">Filters</h2>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setShowFilters(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Search</label>
              <Input
                placeholder="Search products..."
                value={filters.search}
                onChange={(e) =>
                  setFilters({ ...filters, search: e.target.value })
                }
                className="mt-1"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Category</label>
              <div className="mt-1 grid grid-cols-2 gap-2">
                {categories.map((category) => (
                  <Button
                    key={category}
                    size="sm"
                    variant={
                      filters.category === category ? 'default' : 'outline'
                    }
                    onClick={() =>
                      setFilters({ ...filters, category: category })
                    }
                    className="capitalize"
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Price Range (KES)</label>
              <div className="mt-4">
                <Slider
                  value={filters.priceRange}
                  min={0}
                  max={20000}
                  step={500}
                  onValueChange={(value: [number, number]) =>
                    setFilters({ ...filters, priceRange: value })
                  }
                />
                <div className="text-muted-foreground mt-2 flex items-center justify-between text-sm">
                  <span>KES {filters.priceRange[0].toLocaleString()}</span>
                  <span>KES {filters.priceRange[1].toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Minimum Rating</label>
              <div className="mt-4">
                <Slider
                  value={[filters.minRating]}
                  min={0}
                  max={5}
                  step={0.5}
                  onValueChange={(value) =>
                    setFilters({ ...filters, minRating: value[0]! })
                  }
                />
                <div className="mt-2 flex items-center gap-1">
                  <Star className="fill-primary text-primary h-4 w-4" />
                  <span className="text-sm">{filters.minRating}</span>
                </div>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Features</label>
              <div className="mt-1 grid grid-cols-1 gap-2">
                {features.map((feature) => (
                  <Button
                    key={feature}
                    size="sm"
                    variant={
                      filters.features.includes(feature) ? 'default' : 'outline'
                    }
                    onClick={() =>
                      setFilters({
                        ...filters,
                        features: filters.features.includes(feature)
                          ? filters.features.filter((f) => f !== feature)
                          : [...filters.features, feature],
                      })
                    }
                  >
                    {feature}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="flex-1">
          <div className="mb-6 flex items-center justify-between">
            <div className="text-muted-foreground">
              {filteredProducts.length} products found
            </div>
            <Button
              variant="outline"
              className="lg:hidden"
              onClick={() => setShowFilters(true)}
            >
              <SlidersHorizontal className="mr-2 h-4 w-4" />
              Filters
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProducts.map((product) => (
              <div
                key={product._id}
                className="group bg-card flex flex-col overflow-hidden rounded-xl border shadow-sm transition-shadow duration-300 hover:shadow-lg"
              >
                <div className="bg-muted relative aspect-square">
                  <img
                    src={product.mainImage}
                    alt={product.name}
                    className="object-cover transition-transform group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
                  />
                  <Button
                    size="icon"
                    variant="ghost"
                    className="bg-background/80 absolute top-2 right-2 h-8 w-8 rounded-full opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100"
                  >
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-1 flex-col p-4">
                  <div className="flex-1 space-y-2">
                    <div className="min-w-0">
                      <h3 className="font-medium">{product.name}</h3>
                      <span className="bg-secondary text-secondary-foreground mt-1 inline-block rounded-md px-2 py-1 text-xs font-medium capitalize">
                        {product.gender}
                      </span>
                      <div className="mt-2 flex items-center gap-1">
                        <Star className="fill-primary text-primary h-3.5 w-3.5" />
                        <span className="text-sm">{product.rating || 4.5}</span>
                        <span className="text-muted-foreground text-sm">
                          ({product.reviews || 0})
                        </span>
                      </div>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <div className="font-medium">KES {product.price.toLocaleString()}</div>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {product.colors.slice(0, 2).map((color) => (
                        <span
                          key={color.name}
                          className="bg-accent text-accent-foreground inline-block rounded-md px-2 py-1 text-xs font-medium"
                        >
                          {color.name}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="mt-4">
                    <Button size="sm" className="w-full">
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
