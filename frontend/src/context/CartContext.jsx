'use client';

import React, { createContext, useContext, useState, useMemo } from 'react';

const CartContext = createContext(null);

export const DEFAULT_INITIAL_ITEM = {
  id: 'gothic-black-wide',
  title: 'GOTHIC BLACK WIDE',
  size: '28',
  price: 1599,
  comparePrice: 1800,
  quantity: 1,
  image: '/images/products/core-blue-wide.jpg'
};

export const UPSELL_PRODUCTS = [
  {
    id: 'brick-dark-wide',
    title: 'BRICK DARK WIDE',
    size: '30',
    price: 1499,
    comparePrice: 1700,
    image: '/images/products/brick-dark-wide.jpg'
  },
  {
    id: 'artic-blue-wide',
    title: 'ARTIC BLUE WIDE',
    size: '30',
    price: 1899,
    comparePrice: 2100,
    image: '/images/products/artic-blue-wide.jpg'
  },
  {
    id: 'cloud-blue-wide',
    title: 'CLOUD BLUE WIDE',
    size: '32',
    price: 1699,
    comparePrice: 1999,
    image: '/images/products/cloud-blue-wide.jpg'
  }
];

export function CartProvider({ children }) {
  // Start with 1 item matching user screenshot so active cart state is immediately visible
  const [cartItems, setCartItems] = useState([DEFAULT_INITIAL_ITEM]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [whatsappNumber, setWhatsappNumber] = useState('919876543210'); // Customizable WhatsApp number

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);
  const toggleCart = () => setIsCartOpen((prev) => !prev);

  const addItem = (item, quantity = 1) => {
    setCartItems((prevItems) => {
      const compositeId = item.id ? item.id : `${item.productId || 'item'}-${item.size || 'default'}`;
      const addQty = item.quantity || quantity || 1;
      const existingIndex = prevItems.findIndex((i) => i.id === compositeId);
      if (existingIndex > -1) {
        const updated = [...prevItems];
        updated[existingIndex].quantity += addQty;
        return updated;
      }
      return [...prevItems, { ...item, id: compositeId, quantity: addQty }];
    });
    setIsCartOpen(true);
  };

  const removeItem = (itemId) => {
    setCartItems((prevItems) => prevItems.filter((i) => i.id !== itemId));
  };

  const updateQuantity = (itemId, delta) => {
    setCartItems((prevItems) =>
      prevItems
        .map((item) => {
          if (item.id === itemId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const totalCount = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + item.quantity, 0);
  }, [cartItems]);

  const subtotal = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  }, [cartItems]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        isCartOpen,
        openCart,
        closeCart,
        toggleCart,
        addItem,
        removeItem,
        updateQuantity,
        totalCount,
        subtotal,
        whatsappNumber,
        setWhatsappNumber
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
