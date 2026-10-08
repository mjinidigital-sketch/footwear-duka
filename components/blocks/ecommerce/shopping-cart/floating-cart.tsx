"use client";
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  CreditCard,
  Package,
  X,
  ChevronRight,
} from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useRouter } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';

interface CartItem {
  _id: string;
  productId: string;
  quantity: number;
  color: string;
  size: number;
  price: number;
  originalPrice?: number;
  product?: any;
}

export default function FloatingCart() {
  const router = useRouter();
  const { items, summary, updateQuantity, removeFromCart, loading } = useCart();
  const [isOpen, setIsOpen] = useState(true);

  const subtotal = summary?.subtotal || 0;
  const freeShippingThreshold = 10000;
  const shipping = summary?.shipping || 0;
  const total = summary?.total || 0;
  const totalItems = summary?.totalItems || 0;

  const handleUpdateQuantity = async (id: string, change: number) => {
    const item = items.find((i) => i._id === id);
    if (!item) return;

    const newQuantity = Math.max(1, item.quantity + change);
    await updateQuantity(id, newQuantity);
  };

  const handleCheckout = () => {
    // Close drawer and navigate to cart page
    setIsOpen(false);
    router.push('/cart');
  };

  const handleViewCart = () => {
    // Close drawer and navigate to cart page
    setIsOpen(false);
    router.push('/cart');
  };

  const formatPrice = (price: number) => `KES ${price.toLocaleString()}`;

  if (loading) {
    return (
      <div className="relative h-[750px] p-6">
        <Button
          variant="outline"
          size="icon"
          className="fixed right-6 bottom-6 z-50 h-14 w-14 rounded-full shadow-lg"
          onClick={() => setIsOpen(!isOpen)}
        >
          <ShoppingCart className="h-6 w-6" />
        </Button>
      </div>
    );
  }

  return (
    <>
      {/* Height set for example purpose only */}
      <div className="relative h-[750px] p-6">
        {/* Cart Toggle Button */}
        <Button
          variant="outline"
          size="icon"
          className="fixed right-6 bottom-6 z-50 h-14 w-14 rounded-full shadow-lg"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <div className="relative">
              <ShoppingCart className="h-6 w-6" />
              {items.length > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-3 -right-3 flex h-5 w-5 items-center justify-center p-0"
                >
                  {totalItems}
                </Badge>
              )}
            </div>
          )}
        </Button>

        {/* Floating Cart Panel */}
        {isOpen && (
          <Card className="animate-in slide-in-from-bottom-5 fixed right-6 bottom-24 z-40 w-80 border-2 shadow-xl duration-300">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Your Cart</CardTitle>
                <Badge variant="outline" className="font-normal">
                  {totalItems} {totalItems === 1 ? 'item' : 'items'}
                </Badge>
              </div>
              <CardDescription>
                Review your items before checkout
              </CardDescription>
            </CardHeader>

            <CardContent className="p-0">
              {/* Cart Items */}
              <div className="max-h-[300px] overflow-y-auto px-6">
                {items.length === 0 ? (
                  <div className="py-8 text-center text-muted-foreground text-sm">
                    Your cart is empty
                  </div>
                ) : (
                  items.map((item) => (
                    <div
                      key={item._id}
                      className="flex gap-3 border-b py-3 last:border-0"
                    >
                      {/* Product Image */}
                      <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md">
                        <img
                          src={item.product?.mainImage || item.product?.colors?.[0]?.images?.[0] || '/placeholder.jpg'}
                          alt={item.product?.name || 'Product'}
                          className="object-cover"
                          sizes="64px"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="min-w-0 flex-1">
                        <div className="flex justify-between">
                          <div>
                            <h3 className="w-40 truncate text-sm font-medium">
                              {item.product?.name || 'Product'}
                            </h3>
                            <p className="text-muted-foreground text-xs">
                              {item.color} • {item.size}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute right-6 h-6 w-6"
                            onClick={() => removeFromCart(item._id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>

                        <div className="mt-2 flex items-center justify-between">
                          <div className="flex items-center rounded-md border">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 rounded-none"
                              onClick={() => handleUpdateQuantity(item._id, -1)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-6 text-center text-xs">
                              {item.quantity}
                            </span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 rounded-none"
                              onClick={() => handleUpdateQuantity(item._id, 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>

                          <div className="text-right">
                            <div className="text-sm font-medium">
                              {formatPrice(item.price * item.quantity)}
                            </div>
                            {item.originalPrice && (
                              <div className="text-muted-foreground text-xs line-through">
                                {formatPrice(item.originalPrice * item.quantity)}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Order Summary */}
              {items.length > 0 && (
                <div className="bg-muted/30 space-y-3 px-6 py-4">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Shipping</span>
                    <span>
                      {shipping === 0 ? 'Free' : formatPrice(shipping)}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-medium">
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>
              )}
            </CardContent>

            <CardFooter className="flex flex-col gap-2 pt-4 pb-6">
              <div className="text-muted-foreground mb-2 flex items-center gap-2 text-xs">
                <Package className="h-3 w-3" />
                <span>Free shipping on orders over KES 10,000</span>
              </div>

              <Button
                className="w-full"
                onClick={handleCheckout}
                disabled={items.length === 0}
              >
                <CreditCard className="mr-2 h-4 w-4" />
                Checkout
              </Button>

              <Button
                variant="outline"
                className="w-full"
                size="sm"
                onClick={handleViewCart}
              >
                <span>View Cart</span>
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </>
  );
}
