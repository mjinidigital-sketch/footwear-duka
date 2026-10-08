"use client";

import { Button } from '@/components/ui/button';
import {
  Trash2,
  Plus,
  Minus,
  CreditCard,
  Package,
  X,
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { useRouter } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import { cn } from '@/lib/utils';

interface SidebarCartProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function SidebarCart({
  isOpen = false,
  onClose = () => {},
}: SidebarCartProps) {
  const router = useRouter();
  const { items, summary, updateQuantity, removeFromCart, loading } = useCart();

  const subtotal = summary?.subtotal || 0;
  const shipping = summary?.shipping || 0;
  const total = summary?.total || 0;
  const totalItems = summary?.totalItems || 0;
  const amountToFreeShipping = summary?.amountToFreeShipping || 0;
  const freeShippingProgress = summary?.freeShippingProgress || 0;

  const formatPrice = (price: number) => `KES ${price.toLocaleString()}`;

  const handleUpdateQuantity = async (id: string, change: number) => {
    const item = items.find((i) => i._id === id);
    if (!item) return;

    const newQuantity = Math.max(1, item.quantity + change);
    await updateQuantity(id, newQuantity);
  };

  const handleCheckout = () => {
    onClose();
    router.push('/cart');
  };

  const handleContinueShopping = () => {
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-50 bg-black/50 transition-opacity duration-300",
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sidebar Cart Drawer */}
      <div
        className={cn(
          "bg-background fixed top-0 right-0 z-50 h-full w-full max-w-sm sm:max-w-md transform border-l shadow-2xl transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "translate-x-full pointer-events-none"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b p-4">
            <div>
              <h2 className="text-lg font-semibold">Shopping Cart</h2>
              <p className="text-muted-foreground text-sm">
                {totalItems} {totalItems === 1 ? 'item' : 'items'}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Free Shipping Progress */}
          <div className="bg-muted/30 px-4 py-3">
            {amountToFreeShipping > 0 ? (
              <div className="space-y-2">
                <div className="text-sm">
                  Add {formatPrice(amountToFreeShipping)} more for free
                  shipping
                </div>
                <Progress value={freeShippingProgress} className="h-2" />
              </div>
            ) : (
              <div className="text-primary flex items-center gap-2 text-sm">
                <Package className="h-4 w-4" />
                <span>You&apos;ve unlocked free shipping!</span>
              </div>
            )}
          </div>

          {/* Cart Items */}
          <div className="flex-1 space-y-4 overflow-y-auto p-4">
            {loading ? (
              <div className="py-12 text-center text-muted-foreground text-sm">
                Loading cart...
              </div>
            ) : items.length === 0 ? (
              <div className="py-12 text-center text-muted-foreground text-sm">
                Your cart is empty
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item._id}
                  className="flex gap-3 border-b pb-4 last:border-0"
                >
                  {/* Product Image */}
                  <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border bg-muted">
                    <img
                      src={item.product?.mainImage || item.product?.colors?.[0]?.images?.[0] || '/placeholder.jpg'}
                      alt={item.product?.name || 'Product'}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="min-w-0 flex-1">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="truncate pr-6 text-sm font-medium">
                          {item.product?.name || 'Product'}
                        </h3>
                        <p className="text-muted-foreground text-xs">
                          {item.color} • {item.size}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground hover:text-destructive"
                        onClick={() => removeFromCart(item._id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => handleUpdateQuantity(item._id, -1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-7 text-center text-sm font-medium">
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7"
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
            <div className="space-y-4 border-t p-4 bg-background">
              <div className="space-y-2">
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
                <div className="flex justify-between text-base font-semibold">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Button
                  className="w-full"
                  onClick={handleCheckout}
                >
                  <CreditCard className="mr-2 h-4 w-4" />
                  Checkout
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleContinueShopping}
                >
                  Continue Shopping
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
