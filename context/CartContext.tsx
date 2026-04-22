import React, { createContext, useContext, useState } from 'react';
import type { UiShopProduct } from '../utils/shopProductsApi';

interface CartEntry {
  product: UiShopProduct;
  quantity: number;
}

interface CartContextValue {
  items: Record<string, CartEntry>;
  cartItemsList: CartEntry[];
  cartCount: number;
  cartTotal: number;
  getQuantity: (productId: string) => number;
  updateCart: (product: UiShopProduct, delta: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue>({
  items: {},
  cartItemsList: [],
  cartCount: 0,
  cartTotal: 0,
  getQuantity: () => 0,
  updateCart: () => {},
  clearCart: () => {},
});

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<Record<string, CartEntry>>({});

  const updateCart = (product: UiShopProduct, delta: number) => {
    setItems((prev) => {
      const existing = prev[product.id];
      const nextQty = (existing?.quantity ?? 0) + delta;
      if (nextQty <= 0) {
        const { [product.id]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [product.id]: { product, quantity: nextQty } };
    });
  };

  const clearCart = () => setItems({});

  const cartItemsList = Object.values(items);
  const cartCount = cartItemsList.reduce((sum, e) => sum + e.quantity, 0);
  const cartTotal = cartItemsList.reduce((sum, e) => sum + e.product.price * e.quantity, 0);

  const getQuantity = (productId: string) => items[productId]?.quantity ?? 0;

  return (
    <CartContext.Provider value={{ items, cartItemsList, cartCount, cartTotal, getQuantity, updateCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
