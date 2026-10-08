"use client";

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import {
  Trash2,
  Plus,
  Minus,
  Package,
  CreditCard,
  Truck,
  Shield,
  Lock,
  ArrowLeft,
} from 'lucide-react';
import { useState } from 'react';
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

interface ShippingMethod {
  id: string;
  name: string;
  price: number;
  estimatedDays: string;
  description: string;
}

export default function ModernCart() {
  const router = useRouter();
  const { items, summary, updateQuantity, removeFromCart, loading } = useCart();
  const [shippingMethod, setShippingMethod] = useState<string>('standard');
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);

  // Shipping form state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');

  // Payment form state
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardName, setCardName] = useState('');

  const shippingMethods: ShippingMethod[] = [
    {
      id: 'standard',
      name: 'Standard Shipping',
      price: 500,
      estimatedDays: '3-5 days',
      description: 'Free shipping on orders over KES 10,000',
    },
    {
      id: 'express',
      name: 'Express Shipping',
      price: 1000,
      estimatedDays: '1-2 days',
      description: 'Priority delivery with tracking',
    },
  ];

  const subtotal = summary?.subtotal || 0;
  const baseShipping = shippingMethods.find((m) => m.id === shippingMethod)?.price || 0;
  const shipping = subtotal >= 10000 && shippingMethod === 'standard' ? 0 : baseShipping;
  const total = subtotal + shipping - discount;

  const formatPrice = (price: number) => `KES ${price.toLocaleString()}`;

  const handleUpdateQuantity = async (id: string, change: number) => {
    const item = items.find((i) => i._id === id);
    if (!item) return;

    const newQuantity = Math.max(1, item.quantity + change);
    await updateQuantity(id, newQuantity);
  };

  const applyPromoCode = () => {
    if (promoCode.toLowerCase() === 'save10') {
      setDiscount(subtotal * 0.1);
    } else if (promoCode.toLowerCase() === 'save20') {
      setDiscount(subtotal * 0.2);
    } else {
      setDiscount(0);
    }
  };

  const handlePlaceOrder = () => {
    // In production, this would process the payment
    alert('Order placed successfully! (Demo)');
    router.push('/');
  };

  const handleBackToCart = () => {
    router.push('/');
  };

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-7xl p-6">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto w-full max-w-7xl p-6">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">Your cart is empty</p>
            <Button onClick={handleBackToCart}>
              Continue Shopping
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl p-6">
      <Button
        variant="ghost"
        className="mb-6"
        onClick={handleBackToCart}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Continue Shopping
      </Button>

      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left Column: Cart Items + Forms */}
        <div className="space-y-6 lg:col-span-2">
          {/* Cart Items */}
          <Card>
            <CardHeader>
              <CardTitle>Your Items ({items.length})</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {items.map((item) => (
                <div key={item._id} className="flex gap-4 border-b pb-4 last:border-0">
                  <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md">
                    <img
                      src={item.product?.mainImage || item.product?.colors?.[0]?.images?.[0] || '/placeholder.jpg'}
                      alt={item.product?.name || 'Product'}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="font-medium">{item.product?.name || 'Product'}</h3>
                        <p className="text-muted-foreground text-sm">
                          {item.color} • {item.size}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFromCart(item._id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleUpdateQuantity(item._id, -1)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleUpdateQuantity(item._id, 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="font-medium">
                        {formatPrice(item.price * item.quantity)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Shipping Information */}
          <Card>
            <CardHeader>
              <CardTitle>Shipping Information</CardTitle>
              <CardDescription>Enter your shipping details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input 
                    id="firstName" 
                    placeholder="John"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input 
                    id="lastName" 
                    placeholder="Doe"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="john@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input 
                  id="phone" 
                  type="tel" 
                  placeholder="+254 700 000 000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input 
                  id="address" 
                  placeholder="123 Main Street"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input 
                    id="city" 
                    placeholder="Nairobi"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="postalCode">Postal Code</Label>
                  <Input 
                    id="postalCode" 
                    placeholder="00100"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Information */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Information</CardTitle>
              <CardDescription>Enter your payment details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cardNumber">Card Number</Label>
                <Input 
                  id="cardNumber" 
                  placeholder="1234 5678 9012 3456"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiry">Expiry Date</Label>
                  <Input 
                    id="expiry" 
                    placeholder="MM/YY"
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cvv">CVV</Label>
                  <Input 
                    id="cvv" 
                    placeholder="123"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="cardName">Name on Card</Label>
                <Input 
                  id="cardName" 
                  placeholder="John Doe"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Order Summary */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Shipping Method */}
              <div className="space-y-2">
                <Label>Shipping Method</Label>
                <Select
                  value={shippingMethod}
                  onValueChange={(value) => setShippingMethod(value || 'standard')}
                >
                  <SelectTrigger className="w-full max-w-none data-[size=default]:h-auto">
                    <SelectValue placeholder="Select shipping method" />
                  </SelectTrigger>
                  <SelectContent className="!h-auto">
                    {shippingMethods.map((method) => (
                      <SelectItem
                        key={method.id}
                        value={method.id}
                        className="!h-auto"
                      >
                        <div className="flex flex-col justify-between text-start">
                          <div className="font-medium">{method.name}</div>
                          <div className="text-muted-foreground text-sm">
                            {method.estimatedDays}
                          </div>
                          <div className="font-medium">
                            {formatPrice(method.price)}
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Promo Code */}
              <div className="space-y-2">
                <Label>Promo Code</Label>
                <div className="flex gap-2">
                  <Input 
                    placeholder="Enter promo code (try: SAVE10 or SAVE20)" 
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                  />
                  <Button variant="outline" onClick={applyPromoCode}>
                    Apply
                  </Button>
                </div>
                {discount > 0 && (
                  <p className="text-primary text-sm">
                    Promo code applied! You saved {formatPrice(discount)}
                  </p>
                )}
              </div>

              {/* Order Totals */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm text-primary">
                    <span>Discount</span>
                    <span>-{formatPrice(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>

              {/* Features */}
              <div className="space-y-4 border-t pt-4">
                <div className="flex items-center gap-2 text-sm">
                  <Package className="text-primary h-4 w-4" />
                  <span>Free returns within 30 days</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Shield className="text-primary h-4 w-4" />
                  <span>Secure payment</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Truck className="text-primary h-4 w-4" />
                  <span>Fast delivery</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Lock className="text-primary h-4 w-4" />
                  <span>SSL encrypted checkout</span>
                </div>
              </div>

              {/* Place Order Button */}
              <Button className="w-full" onClick={handlePlaceOrder}>
                <CreditCard className="mr-2 h-4 w-4" />
                Place Order
              </Button>

              <p className="text-muted-foreground text-xs text-center">
                By placing this order, you agree to our Terms of Service
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
