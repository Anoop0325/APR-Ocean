'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Cart } from '@/types';
import { apiFetch } from '@/lib/api';
import { useAuth } from './AuthContext';

interface CartContextType {
  cart: Cart | null;
  fetchCart: () => Promise<void>;
  addToCart: (productId: number, quantity?: number) => Promise<void>;
  updateQuantity: (itemId: number, quantity: number) => Promise<void>;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const { user } = useAuth();

  const fetchCart = async () => {
    if (!user) return;
    try {
      const res = await apiFetch('/orders/cart/');
      if (res.ok) {
        setCart(await res.json());
      }
    } catch (e) {
      console.error(e);
    }
  };

  const addToCart = async (productId: number, quantity = 1) => {
    if (!user) return;
    try {
      await apiFetch('/orders/cart/', {
        method: 'POST',
        body: JSON.stringify({ product_id: productId, quantity }),
      });
      fetchCart();
    } catch (e) {
      console.error(e);
    }
  };

  const updateQuantity = async (itemId: number, quantity: number) => {
    try {
      await apiFetch(`/orders/cart/items/${itemId}/`, {
        method: 'PATCH',
        body: JSON.stringify({ quantity }),
      });
      fetchCart();
    } catch (e) {
      console.error(e);
    }
  };

  const clearCart = () => setCart(null);

  useEffect(() => {
    if (user) fetchCart();
    else clearCart();
  }, [user]);

  return (
    <CartContext.Provider value={{ cart, fetchCart, addToCart, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};
