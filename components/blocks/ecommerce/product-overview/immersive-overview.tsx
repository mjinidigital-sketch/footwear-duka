"use client";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, Share2, Star, Play, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { getProducts } from "@/app/actions";

export default function ImmersiveOverview() {
  const [product, setProduct] = useState<any>(null);

  useEffect(() => {
    async function fetchData() {
      const products = await getProducts();
      if (products.length > 0) {
        setProduct(products[0]);
      }
    }
    fetchData();
  }, []);

  if (!product) {
    return <div className="w-full flex items-center justify-center h-[70vh]">Loading...</div>;
  }

  return (
    <div className="w-full">
      {/* Hero Section */}
      <div className="relative h-[30vh] md:h-[50vh] lg:h-[70vh] bg-muted">
        <img
          src={product.mainImage}
          alt={product.name}
          className="object-cover w-full h-full"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent"></div>

        {/* Quick Actions */}
        <div className="absolute top-6 right-6 flex gap-2">
          <Button
            size="icon"
            variant="outline"
            className="rounded-full bg-background/80 backdrop-blur-sm"
          >
            <Share2 className="h-5 w-5" />
          </Button>
          <Button
            size="icon"
            variant="outline"
            className="rounded-full bg-background/80 backdrop-blur-sm"
          >
            <Heart className="h-5 w-5" />
          </Button>
        </div>

        {/* Video Preview */}
        <Button
          size="icon"
          variant="outline"
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-16 w-16 rounded-full bg-background/80 backdrop-blur-sm"
        >
          <Play className="h-8 w-8" />
        </Button>
      </div>

      {/* Product Info */}
      <div className="max-w-7xl mx-auto px-6 -mt-20 relative z-10">
        <div className="bg-background border rounded-2xl p-8 shadow-lg">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Info */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-4 mb-4">
                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                  Limited Edition
                </span>
                <div className="flex items-center gap-1">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-primary text-primary"
                      />
                    ))}
                  </div>
                  <span className="text-sm font-medium">4.9</span>
                  <span className="text-sm text-muted-foreground">(128)</span>
                </div>
              </div>

              <h1 className="text-4xl font-bold mb-4">{product.name}</h1>

              <div className="flex items-baseline gap-4 mb-6">
                <span className="text-3xl font-bold">KES {product.price.toLocaleString()}</span>
                <span className="text-sm font-medium text-green-600">
                  In Stock ({product.quantity})
                </span>
              </div>

              <Tabs defaultValue="overview" className="mb-8">
                <TabsList>
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="care">Care</TabsTrigger>
                </TabsList>
                <TabsContent value="overview" className="mt-4">
                  <div className="prose dark:prose-invert">
                    <p>{product.description}</p>
                    <ul>
                      <li>Premium materials for durability</li>
                      <li>Available in multiple colors: {product.colors.join(', ')}</li>
                      <li>Available sizes: {product.sizes.join(', ')}</li>
                      <li>Designed for {product.gender}</li>
                    </ul>
                  </div>
                </TabsContent>
                <TabsContent value="details" className="mt-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Case Material</span>
                      <p className="text-muted-foreground">
                        316L Stainless Steel
                      </p>
                    </div>
                    <div>
                      <span className="font-medium">Movement</span>
                      <p className="text-muted-foreground">Swiss Automatic</p>
                    </div>
                    <div>
                      <span className="font-medium">Crystal</span>
                      <p className="text-muted-foreground">Sapphire</p>
                    </div>
                    <div>
                      <span className="font-medium">Water Resistance</span>
                      <p className="text-muted-foreground">30 Meters</p>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="care" className="mt-4">
                  <div className="space-y-4 text-sm text-muted-foreground">
                    <p>
                      To ensure the longevity of your watch, follow these care
                      instructions:
                    </p>
                    <ul className="list-disc list-inside space-y-2">
                      <li>Clean regularly with a soft, dry cloth</li>
                      <li>Avoid exposure to extreme temperatures</li>
                      <li>Service every 3-5 years by a certified watchmaker</li>
                      <li>Store in a watch box when not in use</li>
                    </ul>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Purchase Options */}
            <div>
              <div className="bg-muted p-6 rounded-xl mb-6">
                <h3 className="font-medium mb-4">Select Options</h3>
                <div className="space-y-4">
                  <div>
                    <span className="text-sm font-medium">Color</span>
                    <div className="flex gap-2 mt-2">
                      {product.colors.map((color: string, index: number) => (
                        <button
                          key={color}
                          className={`w-8 h-8 rounded-full ${index === 0 ? 'ring-2 ring-offset-2 ring-black' : ''}`}
                          style={{ backgroundColor: color.toLowerCase().replace(/\s+/g, '-') }}
                        >
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Size</span>
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      {product.sizes.slice(0, 3).map((size: number) => (
                        <Button key={size} variant="outline" size="sm">
                          {size}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <Button className="w-full mb-3" size="lg">
                Add to Cart
              </Button>
              <Button variant="outline" className="w-full" size="lg">
                Buy Now
              </Button>

              <div className="mt-6 space-y-3">
                <Button variant="ghost" className="w-full justify-between">
                  Shipping Information
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button variant="ghost" className="w-full justify-between">
                  Return Policy
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button variant="ghost" className="w-full justify-between">
                  Size Guide
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Images */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {product.gallery.slice(0, 4).map((img: string, i: number) => (
            <div
              key={i}
              className="aspect-square bg-muted rounded-lg overflow-hidden"
            >
              <img
                src={img}
                alt={`Product view ${i}`}
                className="object-cover w-full h-full hover:scale-105 transition-transform"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
