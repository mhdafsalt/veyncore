'use client';

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { parseNumericPrice } from '@/lib/priceUtils';
import { WHATSAPP_NUMBER } from '@/lib/constants';

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
  // Start empty on SSR and load real persistent items from localStorage on client mount
  const [cartItems, setCartItems] = useState([]);
  const [isCartLoaded, setIsCartLoaded] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [whatsappNumber, setWhatsappNumber] = useState(WHATSAPP_NUMBER); // Official WhatsApp Business number: 919446391166

  // Dynamic Discount State
  const [appliedDiscount, setAppliedDiscount] = useState(null);

  // WhatsApp Checkout Modal State
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutItems, setCheckoutItems] = useState([]);
  const [checkoutSource, setCheckoutSource] = useState('product_detail');

  // Hydrate cart and discount from localStorage on client mount
  useEffect(() => {
    try {
      const storedCart = localStorage.getItem('veyncore_cart');
      if (storedCart) {
        const parsed = JSON.parse(storedCart);
        if (Array.isArray(parsed)) {
          setCartItems(parsed);
        }
      }
      const storedDiscount = localStorage.getItem('veyncore_discount');
      if (storedDiscount) {
        const parsedDiscount = JSON.parse(storedDiscount);
        if (parsedDiscount && parsedDiscount.code) {
          setAppliedDiscount(parsedDiscount);
        }
      }
    } catch (e) {
      console.warn('[CartContext] Failed to load cart from localStorage:', e);
    } finally {
      setIsCartLoaded(true);
    }
  }, []);

  // Persist cart to localStorage whenever it changes (only after initial load)
  useEffect(() => {
    if (!isCartLoaded) return;
    try {
      localStorage.setItem('veyncore_cart', JSON.stringify(cartItems));
    } catch (e) {
      console.warn('[CartContext] Failed to save cart to localStorage:', e);
    }
  }, [cartItems, isCartLoaded]);

  // Persist applied discount
  useEffect(() => {
    if (!isCartLoaded) return;
    try {
      if (appliedDiscount) {
        localStorage.setItem('veyncore_discount', JSON.stringify(appliedDiscount));
      } else {
        localStorage.removeItem('veyncore_discount');
      }
    } catch (e) {
      console.warn('[CartContext] Failed to save discount to localStorage:', e);
    }
  }, [appliedDiscount, isCartLoaded]);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);
  const toggleCart = () => setIsCartOpen((prev) => !prev);

  const clearCart = () => {
    setCartItems([]);
    setAppliedDiscount(null);
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem('veyncore_cart');
        localStorage.removeItem('veyncore_discount');
      } catch (e) {}
    }
  };

  const addItem = (item, quantity = 1) => {
    setCartItems((prevItems) => {
      const compositeId = item.id ? item.id : `${item.handle || item.productId || 'item'}-${item.size || 'default'}`;
      const addQty = item.quantity || quantity || 1;
      const cleanPrice = parseNumericPrice(item.price ?? item.salePrice, 1299);
      const cleanComparePrice = item.comparePrice || item.regularPrice ? parseNumericPrice(item.comparePrice || item.regularPrice, null) : null;
      const existingIndex = prevItems.findIndex((i) => i.id === compositeId);

      if (existingIndex > -1) {
        const updated = [...prevItems];
        updated[existingIndex].quantity += addQty;
        return updated;
      }
      return [
        ...prevItems,
        {
          ...item,
          id: compositeId,
          handle: item.handle || item.productId || item.id,
          productId: item.productId || item.id,
          price: cleanPrice,
          comparePrice: cleanComparePrice,
          quantity: addQty,
        },
      ];
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
    return cartItems.reduce((acc, item) => acc + parseNumericPrice(item.price, 0) * item.quantity, 0);
  }, [cartItems]);

  // Apply Coupon / Promo Code
  const applyDiscount = (code) => {
    if (!code || !code.trim()) {
      return { success: false, message: 'Please enter a valid discount code.' };
    }
    const cleanCode = code.trim().toUpperCase();

    // Standard high-converting discount rules
    const DISCOUNT_MAP = {
      'VEYN10': { code: 'VEYN10', percent: 10, label: '10% OFF' },
      'WELCOME10': { code: 'WELCOME10', percent: 10, label: '10% OFF' },
      'FIRST10': { code: 'FIRST10', percent: 10, label: '10% OFF' },
      'VEYN15': { code: 'VEYN15', percent: 15, label: '15% OFF' },
      'VEYN20': { code: 'VEYN20', percent: 20, label: '20% OFF' },
      'FLAT100': { code: 'FLAT100', flat: 100, label: '₹100 OFF' },
      'FREESHIP': { code: 'FREESHIP', flat: 50, label: 'FREE SHIPPING BONUS' },
    };

    const match = DISCOUNT_MAP[cleanCode];
    if (match) {
      setAppliedDiscount(match);
      return { success: true, message: `Coupon "${cleanCode}" applied!`, discount: match };
    }

    return { success: false, message: `Invalid code "${cleanCode}". Try VEYN10 for 10% off.` };
  };

  const removeDiscount = () => {
    setAppliedDiscount(null);
  };

  const discountAmount = useMemo(() => {
    if (!appliedDiscount || subtotal <= 0) return 0;
    if (appliedDiscount.percent) {
      return Math.round((subtotal * appliedDiscount.percent) / 100);
    }
    if (appliedDiscount.flat) {
      return Math.min(subtotal, appliedDiscount.flat);
    }
    return 0;
  }, [appliedDiscount, subtotal]);

  const finalTotal = useMemo(() => {
    return Math.max(0, subtotal - discountAmount);
  }, [subtotal, discountAmount]);

  const openCheckout = (items = [], source = 'product_detail') => {
    const rawItems = items && items.length > 0 ? items : cartItems;
    const sanitizedItems = rawItems.map((item) => ({
      ...item,
      price: parseNumericPrice(item.price ?? item.salePrice, 1299),
    }));
    setCheckoutItems(sanitizedItems);
    setCheckoutSource(source);
    setIsCheckoutOpen(true);
  };

  const closeCheckout = () => {
    setIsCheckoutOpen(false);
  };

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
        clearCart,
        totalCount,
        subtotal,
        appliedDiscount,
        discountAmount,
        finalTotal,
        applyDiscount,
        removeDiscount,
        whatsappNumber,
        setWhatsappNumber,
        isCheckoutOpen,
        checkoutItems,
        checkoutSource,
        openCheckout,
        closeCheckout,
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
