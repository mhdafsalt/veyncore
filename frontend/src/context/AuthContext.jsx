'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { API_BASE_URL } from '@/lib/constants';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [orders, setOrders] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Auth Modal State
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login'); // 'login' | 'register' | 'forgot' | 'otp' | 'account'

  const openAuthModal = (mode) => {
    if (mode) {
      setAuthModalMode(mode);
    } else {
      setAuthModalMode(user ? 'account' : 'login');
    }
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  // Initialize and verify authentication state on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedToken = localStorage.getItem('veyncore_token');
        const storedUser = localStorage.getItem('veyncore_user');

        if (storedToken) {
          setToken(storedToken);
          if (storedUser) {
            try {
              setUser(JSON.parse(storedUser));
            } catch (parseErr) {}
          }

          // Fetch fresh verified user data from backend to ensure roles are not tampered
          try {
            const res = await fetch(`${API_BASE_URL}/api/auth/me`, {
              headers: {
                Authorization: `Bearer ${storedToken}`,
              },
            });
            const data = await res.json();
            if (res.ok && data.success && data.user) {
              setUser(data.user);
              localStorage.setItem('veyncore_user', JSON.stringify(data.user));
            } else if (res.status === 401) {
              // Token expired or invalid
              localStorage.removeItem('veyncore_token');
              localStorage.removeItem('veyncore_user');
              setToken(null);
              setUser(null);
            }
          } catch (apiErr) {
            // Keep cached user if network temporarily unreachable
            console.warn('[Auth] Live /api/auth/me check warning:', apiErr.message);
          }
        }
      } catch (e) {
        console.warn('Could not read user/token from localStorage', e);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Standard MongoDB Email / Password Login
  const login = async (email, password) => {
    const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email.trim(),
        password,
      }),
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Login failed. Please check your credentials.');
    }

    setToken(data.token);
    setUser(data.user);

    try {
      localStorage.setItem('veyncore_token', data.token);
      localStorage.setItem('veyncore_user', JSON.stringify(data.user));
    } catch (e) {
      console.warn('Could not save user to localStorage', e);
    }

    return data;
  };

  // Register New Account in MongoDB
  const register = async ({
    name,
    fullName,
    email,
    mobileNumber,
    phone,
    password,
    vipNotifications,
    subscribeNewsletter,
  }) => {
    const resolvedName = (name || fullName || '').trim();
    const resolvedMobile = (mobileNumber || phone || '').trim();
    const resolvedVip =
      typeof vipNotifications === 'boolean'
        ? vipNotifications
        : Boolean(subscribeNewsletter);

    const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: resolvedName,
        email: email.trim(),
        mobileNumber: resolvedMobile,
        password,
        vipNotifications: resolvedVip,
      }),
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Failed to create account. Please try again.');
    }

    setToken(data.token);
    setUser(data.user);

    try {
      localStorage.setItem('veyncore_token', data.token);
      localStorage.setItem('veyncore_user', JSON.stringify(data.user));
    } catch (e) {
      console.warn('Could not save user to localStorage', e);
    }

    return data;
  };

  // Demo login (Disabled in production - requires real backend authentication)
  const loginDemo = async () => {
    throw new Error(
      'Demo login is disabled. Please sign in using your registered email and password for a secure, verified session.'
    );
  };

  // Mobile OTP Login (Disabled until real SMS/OTP provider is integrated)
  const loginWithOtp = async (phone, otp) => {
    throw new Error(
      'Mobile OTP login is temporarily unavailable. Please sign in with your email and password.'
    );
  };

  // Logout
  const logout = () => {
    setUser(null);
    setToken(null);
    setAuthModalMode('login');
    try {
      localStorage.removeItem('veyncore_token');
      localStorage.removeItem('veyncore_user');
    } catch (e) {
      console.warn('Could not remove user from localStorage', e);
    }
  };

  // Password Reset (Disabled until transactional email service is configured)
  const requestPasswordReset = async (email) => {
    throw new Error(
      'Automated email password reset is temporarily unavailable. Please contact VEYNCORE Support via WhatsApp (+91 94463 91166) to verify your account and reset your password.'
    );
  };

  const value = {
    user,
    token,
    isAuthenticated: Boolean(user && token),
    isAdmin: Boolean(user && token && user?.role === 'admin'),
    isLoading,
    orders,
    addresses,
    login,
    loginDemo,
    loginWithOtp,
    register,
    logout,
    requestPasswordReset,
    isAuthModalOpen,
    authModalMode,
    setAuthModalMode,
    openAuthModal,
    closeAuthModal,
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
