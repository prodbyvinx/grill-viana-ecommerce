"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { X, ChevronLeft, ChevronRight, ShoppingCart } from "lucide-react";

// -- Context and Hook ------------------------------------------------
interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartContextValue {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, qty: number) => void;
  total: () => number;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = (item: Omit<CartItem, "quantity">) => {
    setItems(prev => {
      const exists = prev.find(i => i.id === item.id);
      if (exists) {
        return prev.map(i =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeItem = (id: string) => setItems(prev => prev.filter(i => i.id !== id));
  const updateQuantity = (id: string, qty: number) =>
    setItems(prev => prev.map(i => (i.id === id ? { ...i, quantity: qty } : i)));
  const total = () => items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const clearCart = () => setItems([]);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, total, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};

// -- Shopping Cart Dropdown Component --------------------------------
export function ShoppingCartDropdown() {
  const { items, removeItem, updateQuantity, total, clearCart } = useCart();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="link" className="relative cursor-pointer w-auto hover:text-red-800">
          <ShoppingCart />
          {items.length > 0 && (
            <span className="absolute -top-1 -right-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-red-800 text-xs text-white">
              {items.length}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 bg-white rounded-lg shadow-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Carrinho ({items.length})</h3>
          <Button variant="ghost" size="sm" onClick={clearCart} className="cursor-pointer">
            Limpar
          </Button>
        </div>

        <ul className="max-h-72 overflow-y-auto divide-y divide-gray-200">
          {items.map(item => (
            <li key={item.id} className="flex items-center justify-between py-3">
              <div className="flex items-center space-x-3">
                <Image
                  src={item.image}
                  alt={item.name}
                  width={48}
                  height={48}
                  className="rounded"
                />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-700">{item.name}</p>
                  <p className="text-sm font-semibold text-red-800">R$ {item.price.toFixed(2)}</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  disabled={item.quantity <= 1}
                >
                  <ChevronLeft size={16} />
                </Button>
                <span className="px-2">{item.quantity}</span>
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                >
                  <ChevronRight size={16} />
                </Button>
              </div>

              <Button variant="ghost" size="icon" onClick={() => removeItem(item.id)}>
                <X size={16} />
              </Button>
            </li>
          ))}
        </ul>

        <div className="flex justify-end font-bold text-red-800 mt-4">
          Total: R$ {total().toFixed(2)}
        </div>

        <Button className="w-full mt-3 bg-red-800 text-white hover:bg-red-700 cursor-pointer">
          Finalizar compra
        </Button>
      </PopoverContent>
    </Popover>
  );
}