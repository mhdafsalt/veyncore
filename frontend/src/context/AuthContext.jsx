'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const DEMO_USER = {
  id: 'usr_veyncore_01',
  firstName: 'Alex',
  lastName: 'Veyn',
  name: 'Alex Veyn',
  email: 'vip@veyncore.com',
  phone: '+91 98765 43210',
  vipTier: 'VIP Syndicate',
  joinDate: 'November 2026',
  avatarUrl: null
};

const INITIAL_ORDERS = [
  {
    id: 'VC-90248',
    date: '20 Nov 2026',
    status: 'IN TRANSIT',
    statusClass: 'status--in-transit',
    trackingNumber: 'IP982341902IN',
    courier: 'India Post Speed Post',
    total: 3098,
    itemsCount: 2,
    items: [
      {
        title: 'Raw Selvedge Baggy Denim',
        fit: 'Baggy Cut',
        size: '32',
        qty: 1,
        price: 2499,
        image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=300&q=80'
      },
      {
        title: 'Veyncore Heavy Rib Beanie',
        fit: 'One Size',
        size: 'OS',
        qty: 1,
        price: 599,
        image: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=300&q=80'
      }
    ]
  },
  {
    id: 'VC-87109',
    date: '12 Nov 2026',
    status: 'DELIVERED',
    statusClass: 'status--delivered',
    trackingNumber: 'IP871092831IN',
    courier: 'Bluedart Air Express',
    total: 2799,
    itemsCount: 1,
    items: [
      {
        title: 'Washed Black Bootcut Jeans',
        fit: 'Bootcut Denim',
        size: '30',
        qty: 1,
        price: 2799,
        image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=300&q=80'
      }
    ]
  }
];

const INITIAL_ADDRESSES = [
  {
    id: 'addr_1',
    isDefault: true,
    name: 'Alex Veyn',
    street: 'Plot 42, Bandra West, Off Carter Road',
    city: 'Mumbai',
    state: 'Maharashtra',
    postalCode: '400050',
    country: 'India',
    phone: '+91 98765 43210'
  }
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [addresses, setAddresses] = useState(INITIAL_ADDRESSES);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize from localStorage if present
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('veyncore_user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (e) {
      console.warn('Could not read user from localStorage', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Standard Email / Password Login
  const login = async (email, password) => {
    // Simulated network delay
    await new Promise((resolve) => setTimeout(resolve, 600));

    const loggedUser = {
      ...DEMO_USER,
      email: email.trim(),
      name: email.split('@')[0].toUpperCase() || 'VIP MEMBER'
    };

    setUser(loggedUser);
    try {
      localStorage.setItem('veyncore_user', JSON.stringify(loggedUser));
    } catch (e) {
      console.warn('Could not save user to localStorage', e);
    }

    return { success: true, user: loggedUser };
  };

  // Instant Demo Quick Login
  const loginDemo = async () => {
    await new Promise((resolve) => setTimeout(resolve, 400));
    setUser(DEMO_USER);
    try {
      localStorage.setItem('veyncore_user', JSON.stringify(DEMO_USER));
    } catch (e) {
      console.warn('Could not save demo user', e);
    }
    return { success: true, user: DEMO_USER };
  };

  // Mobile OTP Login
  const loginWithOtp = async (phone, otp) => {
    await new Promise((resolve) => setTimeout(resolve, 600));
    const otpUser = {
      ...DEMO_USER,
      phone: phone,
      name: 'VERIFIED MEMBER'
    };
    setUser(otpUser);
    try {
      localStorage.setItem('veyncore_user', JSON.stringify(otpUser));
    } catch (e) {
      console.warn('Could not save user', e);
    }
    return { success: true, user: otpUser };
  };

  // Register New Account
  const register = async ({ firstName, lastName, email, phone, password }) => {
    await new Promise((resolve) => setTimeout(resolve, 700));

    const newUser = {
      id: `usr_${Date.now()}`,
      firstName: firstName || 'Veyn',
      lastName: lastName || 'Member',
      name: `${firstName || ''} ${lastName || ''}`.trim() || 'New Member',
      email: email.trim(),
      phone: phone.trim() || '+91 99999 99999',
      vipTier: 'VIP Member',
      joinDate: 'Just Now',
      avatarUrl: null
    };

    setUser(newUser);
    try {
      localStorage.setItem('veyncore_user', JSON.stringify(newUser));
    } catch (e) {
      console.warn('Could not save user', e);
    }

    return { success: true, user: newUser };
  };

  // Logout
  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem('veyncore_user');
    } catch (e) {
      console.warn('Could not remove user', e);
    }
  };

  // Forgot Password Reset
  const requestPasswordReset = async (email) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return { success: true, message: `Reset link has been sent to ${email}` };
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    orders,
    addresses,
    login,
    loginDemo,
    loginWithOtp,
    register,
    logout,
    requestPasswordReset
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}