
"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { CartItem, Product } from '@/types';
import { useToast } from "@/hooks/use-toast";

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  addMultipleToCart: (products: Product[]) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: (suppressToast?: boolean) => void;
  cartCount: number;
  cartTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const { toast } = useToast();

  const addToCart = (product: Product, quantity: number = 1) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prevItems, { ...product, quantity }];
    });
    toast({
      title: "Added to cart!",
      description: `${quantity} x ${product.name} added to your cart.`,
      variant: 'default',
      duration: 2000,
    });
  };

  const addMultipleToCart = (products: Product[]) => {
    setCartItems(prevItems => {
      const newItems = [...prevItems];
      products.forEach(product => {
        const existingItemIndex = newItems.findIndex(item => item.id === product.id);
        if (existingItemIndex > -1) {
          newItems[existingItemIndex].quantity += 1;
        } else {
          newItems.push({ ...product, quantity: 1 });
        }
      });
      return newItems;
    });
    toast({
      title: "Combo added!",
      description: "The AI suggested combo has been added to your cart.",
      variant: 'default',
      duration: 2000,
    });
  };

  const removeFromCart = (productId: number) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
    toast({
        title: "Item removed",
        description: "The item has been removed from your cart.",
        variant: 'destructive',
        duration: 2000,
      });
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      setCartItems(prevItems =>
        prevItems.map(item =>
          item.id === productId ? { ...item, quantity } : item
        )
      );
    }
  };

  const clearCart = (suppressToast = false) => {
    setCartItems([]);
    if (!suppressToast && cartItems.length > 0) {
        toast({
            title: "Cart cleared",
            description: "All items have been removed from your cart.",
            variant: 'destructive',
            duration: 2000,
        });
    }
  };
  
  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);
  const cartTotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, addMultipleToCart, removeFromCart, updateQuantity, clearCart, cartCount, cartTotal }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
