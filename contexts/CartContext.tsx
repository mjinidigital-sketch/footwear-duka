"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { addToCart as addToCartAction, getCartItems, getCartSummary, updateCartItemQuantity, removeFromCart as removeFromCartAction } from '@/app/actions';

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

interface CartContextType {
  items: CartItem[];
  summary: any;
  addToCart: (item: any) => Promise<void>;
  removeFromCart: (id: string) => Promise<void>;
  updateQuantity: (id: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  loading: boolean;
  reloadCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [sessionId, setSessionId] = useState<string>('');

  useEffect(() => {
    // Get or create session ID
    let id = localStorage.getItem('cart_session_id');
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem('cart_session_id', id);
    }
    setSessionId(id);
  }, []);

  useEffect(() => {
    if (sessionId) {
      loadCart();
    }
  }, [sessionId]);

  const loadCart = async () => {
    if (!sessionId) return;
    
    try {
      const [cartItems, cartSummary] = await Promise.all([
        getCartItems(sessionId),
        getCartSummary(sessionId),
      ]);
      setItems(cartItems);
      setSummary(cartSummary);
      // Store in localStorage for navbar to access
      localStorage.setItem('cart_items', JSON.stringify(cartItems));
      // Emit custom event for navbar
      window.dispatchEvent(new Event('cart-updated'));
    } catch (error) {
      console.error('Error loading cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (item: any) => {
    try {
      await addToCartAction({
        sessionId,
        productId: item.productId,
        quantity: item.quantity,
        color: item.color,
        size: item.size,
        price: item.price,
        originalPrice: item.originalPrice,
      });
      await loadCart();
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const removeFromCart = async (id: string) => {
    try {
      await removeFromCartAction(id as any);
      await loadCart();
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };

  const updateQuantity = async (id: string, quantity: number) => {
    try {
      await updateCartItemQuantity(id as any, quantity);
      await loadCart();
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const clearCart = async () => {
    try {
      // Delete all items one by one
      await Promise.all(items.map(item => removeFromCartAction(item._id)));
      await loadCart();
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  return (
    <CartContext.Provider
      value={{
        items,
        summary,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        loading,
        reloadCart: loadCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
