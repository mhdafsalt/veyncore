'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import './AuthPage.css';

export default function AuthPage() {
  const router = useRouter();
  const { totalCount, openCart } = useCart();
  const {
    user,
    isAuthenticated,
    orders,
    addresses,
    login,
    loginDemo,
    loginWithOtp,
    register,
    logout,
    requestPasswordReset
  } = useAuth();

  // Mode: 'login' | 'register' | 'forgot' | 'otp'
  const [mode, setMode] = useState('login');

  // Form states
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Register form states
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [subscribeNewsletter, setSubscribeNewsletter] = useState(true);

  // Forgot password
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState('');

  // Mobile OTP states
  const [otpPhone, setOtpPhone] = useState('');
  const [otpCode, setOtpCode] = useState(['', '', '', '']);
  const [otpSent, setOtpSent] = useState(false);
  const [otpCountdown, setOtpCountdown] = useState(30);

  // Dashboard active tab: 'orders' | 'addresses' | 'profile'
  const [dashboardTab, setDashboardTab] = useState('orders');

  // UI state
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Handle Login Submit
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!loginEmail || !loginPassword) {
      setError('Please fill in both your email address and password.');
      return;
    }
    setSubmitting(true);
    try {
      const res = await login(loginEmail, loginPassword);
      if (res?.user?.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/');
      }
    } catch (err) {
      setError(err?.message || 'Login failed. Please check your credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle Quick Demo Login
  const handleDemoLogin = async () => {
    setError('');
    setSubmitting(true);
    try {
      const res = await loginDemo();
      if (res?.user?.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/');
      }
    } catch (err) {
      setError('Demo login failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle Register Submit
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!regEmail || !regPassword) {
      setError('Please provide at least your email and a password.');
      return;
    }
    if (regPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    setSubmitting(true);
    try {
      const fullName = `${firstName || ''} ${lastName || ''}`.trim() || 'Veyn Member';
      const res = await register({
        name: fullName,
        email: regEmail,
        mobileNumber: regPhone,
        password: regPassword,
        vipNotifications: subscribeNewsletter
      });
      setFirstName('');
      setLastName('');
      setRegEmail('');
      setRegPhone('');
      setRegPassword('');
      setSubscribeNewsletter(false);
      if (res?.user?.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/');
      }
    } catch (err) {
      setError(err?.message || 'Failed to create your account.');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle Forgot Password Submit
  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!forgotEmail) {
      setError('Please enter your email address.');
      return;
    }
    setSubmitting(true);
    try {
      const res = await requestPasswordReset(forgotEmail);
      setForgotSuccess(res.message);
    } catch (err) {
      setError(err?.message || 'Error requesting reset link.');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle Send OTP
  const handleSendOtp = (e) => {
    e.preventDefault();
    setError('');
    if (!otpPhone || otpPhone.trim().length < 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }
    setOtpSent(true);
    setOtpCountdown(30);
  };

  // Handle OTP digit input
  const handleOtpDigitChange = (index, value) => {
    if (value.length > 1) {
      value = value.slice(-1);
    }
    const updated = [...otpCode];
    updated[index] = value;
    setOtpCode(updated);

    // Auto-focus next input
    if (value && index < 3) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  // Handle OTP Verify Submit
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    const fullOtp = otpCode.join('');
    if (fullOtp.length !== 4) {
      setError('Please enter the 4-digit verification code.');
      return;
    }
    setSubmitting(true);
    try {
      await loginWithOtp(otpPhone, fullOtp);
    } catch (err) {
      setError(err?.message || 'Invalid verification code.');
    } finally {
      setSubmitting(false);
    }
  };

  /* ========================================================================
     AUTHENTICATED CUSTOMER DASHBOARD
     ======================================================================== */
  if (isAuthenticated && user) {
    return (
      <div className="auth-page">
        <div className="auth-page__container">
          {/* Breadcrumb */}
          <nav className="auth-page__breadcrumb" aria-label="Breadcrumb">
            <Link href="/" className="auth-page__breadcrumb-link">HOME</Link>
            <span className="auth-page__breadcrumb-separator">/</span>
            <span className="auth-page__breadcrumb-current">ACCOUNT</span>
          </nav>

          {/* User Profile Header */}
          <div className="auth-dashboard__header">
            <div className="auth-dashboard__user-info">
              <div className="auth-dashboard__avatar">
                {user.name?.trim()?.[0]?.toUpperCase() || user.firstName?.trim()?.[0]?.toUpperCase() || user.email?.trim()?.[0]?.toUpperCase() || 'V'}
              </div>
              <div className="auth-dashboard__details">
                <h1 className="auth-dashboard__greeting">
                  WELCOME, {user.name.toUpperCase()}
                </h1>
                <p className="auth-dashboard__meta">
                  <span>{user.email}</span>
                  {user.phone && (
                    <>
                      <span className="auth-dashboard__meta-divider">•</span>
                      <span>{user.phone}</span>
                    </>
                  )}
                </p>
              </div>
            </div>

            <div className="auth-dashboard__header-actions">
              <Link href="/" className="auth-button auth-button--secondary">
                CONTINUE SHOPPING
              </Link>
              <button
                type="button"
                className="auth-button auth-button--outline"
                onClick={logout}
              >
                SIGN OUT
              </button>
            </div>
          </div>

          {/* Quick Stats Overview */}
          <div className="auth-dashboard__stats-grid">
            <div className="auth-dashboard__stat-card">
              <span className="auth-dashboard__stat-label">TOTAL ORDERS</span>
              <span className="auth-dashboard__stat-value">{orders.length}</span>
              <span className="auth-dashboard__stat-sub">Lifetime orders</span>
            </div>
            <div className="auth-dashboard__stat-card">
              <span className="auth-dashboard__stat-label">SAVED ADDRESSES</span>
              <span className="auth-dashboard__stat-value">{addresses.length}</span>
              <span className="auth-dashboard__stat-sub">Default in Mumbai</span>
            </div>
            <div
              className="auth-dashboard__stat-card auth-dashboard__stat-card--clickable"
              onClick={() => openCart()}
              role="button"
              tabIndex={0}
              title="View cart items"
            >
              <span className="auth-dashboard__stat-label">CART ITEMS</span>
              <span className="auth-dashboard__stat-value">{totalCount}</span>
              <span className="auth-dashboard__stat-sub">In active shopping cart</span>
            </div>
          </div>

          {/* Dashboard Navigation Tabs */}
          <div className="auth-dashboard__tabs">
            <button
              type="button"
              className={`auth-dashboard__tab ${
                dashboardTab === 'orders' ? 'auth-dashboard__tab--active' : ''
              }`}
              onClick={() => setDashboardTab('orders')}
            >
              MY ORDERS ({orders.length})
            </button>
            <button
              type="button"
              className={`auth-dashboard__tab ${
                dashboardTab === 'addresses' ? 'auth-dashboard__tab--active' : ''
              }`}
              onClick={() => setDashboardTab('addresses')}
            >
              SAVED ADDRESSES ({addresses.length})
            </button>
            <button
              type="button"
              className={`auth-dashboard__tab ${
                dashboardTab === 'profile' ? 'auth-dashboard__tab--active' : ''
              }`}
              onClick={() => setDashboardTab('profile')}
            >
              ACCOUNT DETAILS
            </button>
          </div>

          {/* Tab 1: Orders Content */}
          {dashboardTab === 'orders' && (
            <div className="auth-dashboard__content">
              {orders.length === 0 ? (
                <div className="auth-dashboard__empty-orders">
                  <p>You have not placed any orders yet.</p>
                  <Link href="/" className="auth-button auth-button--primary">
                    EXPLORE NEW DROPS
                  </Link>
                </div>
              ) : (
                <div className="auth-dashboard__orders-list">
                  {orders.map((order) => (
                    <div key={order.id} className="auth-order-card">
                      <div className="auth-order-card__header">
                        <div className="auth-order-card__title-group">
                          <span className="auth-order-card__id">ORDER #{order.id}</span>
                          <span className="auth-order-card__date">{order.date}</span>
                        </div>
                        <div className="auth-order-card__status-group">
                          <span className={`auth-order-card__status ${order.statusClass}`}>
                            {order.status}
                          </span>
                          <span className="auth-order-card__price">
                            ₹{order.total.toLocaleString()}
                          </span>
                        </div>
                      </div>

                      <div className="auth-order-card__items">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="auth-order-item">
                            <img
                              src={item.image}
                              alt={item.title}
                              className="auth-order-item__image"
                            />
                            <div className="auth-order-item__details">
                              <h4 className="auth-order-item__title">{item.title}</h4>
                              <p className="auth-order-item__meta">
                                {item.fit} | Size: {item.size} | Qty: {item.qty}
                              </p>
                              <span className="auth-order-item__price">
                                ₹{item.price.toLocaleString()}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="auth-order-card__footer">
                        <div className="auth-order-card__courier">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="1" y="3" width="15" height="13" />
                            <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                            <circle cx="5.5" cy="18.5" r="2.5" />
                            <circle cx="18.5" cy="18.5" r="2.5" />
                          </svg>
                          <span>{order.courier} • Tracking: <strong>{order.trackingNumber}</strong></span>
                        </div>
                        <a
                          href="https://www.indiapost.gov.in/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="auth-order-card__track-btn"
                        >
                          TRACK SHIPMENT
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tab 2: Addresses Content */}
          {dashboardTab === 'addresses' && (
            <div className="auth-dashboard__content">
              <div className="auth-dashboard__addresses-grid">
                {addresses.map((addr) => (
                  <div key={addr.id} className="auth-address-card">
                    <div className="auth-address-card__header">
                      <span className="auth-address-card__tag">DEFAULT SHIPPING</span>
                    </div>
                    <h4 className="auth-address-card__name">{addr.name}</h4>
                    <p className="auth-address-card__lines">
                      {addr.street}<br />
                      {addr.city}, {addr.state} - {addr.postalCode}<br />
                      {addr.country}<br />
                      Phone: {addr.phone}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 3: Profile Content */}
          {dashboardTab === 'profile' && (
            <div className="auth-dashboard__content">
              <div className="auth-dashboard__profile-box">
                <div className="auth-dashboard__profile-row">
                  <span className="auth-dashboard__profile-key">Full Name</span>
                  <span className="auth-dashboard__profile-val">{user.name}</span>
                </div>
                <div className="auth-dashboard__profile-row">
                  <span className="auth-dashboard__profile-key">Email Address</span>
                  <span className="auth-dashboard__profile-val">{user.email}</span>
                </div>
                <div className="auth-dashboard__profile-row">
                  <span className="auth-dashboard__profile-key">Contact Phone</span>
                  <span className="auth-dashboard__profile-val">{user.phone || 'Not provided'}</span>
                </div>
                <div className="auth-dashboard__profile-row">
                  <span className="auth-dashboard__profile-key">Membership Status</span>
                  <span className="auth-dashboard__profile-val">{user.vipTier}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  /* ========================================================================
     UNAUTHENTICATED AUTH CARDS (Login, Register, Forgot, OTP)
     ======================================================================== */
  return (
    <div className="auth-page">
      <div className="auth-page__container">
        {/* Breadcrumb Navigation */}
        <nav className="auth-page__breadcrumb" aria-label="Breadcrumb">
          <Link href="/" className="auth-page__breadcrumb-link">HOME</Link>
          <span className="auth-page__breadcrumb-separator">/</span>
          <span className="auth-page__breadcrumb-current">
            {mode === 'login' && 'ACCOUNT LOGIN'}
            {mode === 'register' && 'CREATE ACCOUNT'}
            {mode === 'forgot' && 'RESET PASSWORD'}
            {mode === 'otp' && 'MOBILE OTP LOGIN'}
          </span>
        </nav>

        {/* Central Auth Container */}
        <div className="auth-card">
          {/* Brand Wordmark Header */}
          <div className="auth-card__logo-wrapper">
            <Link href="/" aria-label="Veyncore Home">
              <img
                src="/images/veyncoreLogo_black.svg"
                alt="VEYNCORE"
                className="auth-card__logo"
                width="150"
                height="22"
              />
            </Link>
          </div>

          {/* Quick Demo Login Pill */}
          <div className="auth-card__demo-banner">
            <div className="auth-card__demo-copy">
              <span className="auth-card__demo-badge">DEV DEMO</span>
              <span>Test with a pre-configured VIP Syndicate Account</span>
            </div>
            <button
              type="button"
              className="auth-card__demo-button"
              onClick={handleDemoLogin}
              disabled={submitting}
            >
              {submitting ? 'LOGGING IN...' : '⚡ 1-CLICK DEMO LOGIN'}
            </button>
          </div>

          {/* Mode Switcher Tabs (Sign In / Register) */}
          {(mode === 'login' || mode === 'register') && (
            <div className="auth-card__tabs">
              <button
                type="button"
                className={`auth-card__tab ${
                  mode === 'login' ? 'auth-card__tab--active' : ''
                }`}
                onClick={() => {
                  setMode('login');
                  setError('');
                }}
              >
                SIGN IN
              </button>
              <button
                type="button"
                className={`auth-card__tab ${
                  mode === 'register' ? 'auth-card__tab--active' : ''
                }`}
                onClick={() => {
                  setMode('register');
                  setError('');
                }}
              >
                CREATE ACCOUNT
              </button>
            </div>
          )}

          {/* Error Message Box */}
          {error && (
            <div className="auth-card__alert auth-card__alert--error" role="alert">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {/* ==============================================================
             MODE 1: LOGIN FORM
             ============================================================== */}
          {mode === 'login' && (
            <form noValidate className="auth-form" onSubmit={handleLoginSubmit}>
              <div className="auth-form__header">
                <h2 className="auth-form__title">SIGN IN TO YOUR ACCOUNT</h2>
                <p className="auth-form__subtitle">
                  Access your orders, saved addresses, and private drop invitations.
                </p>
              </div>

              <div className="auth-form__group">
                <label className="auth-form__label" htmlFor="login-email">
                  EMAIL ADDRESS <span className="auth-form__required">*</span>
                </label>
                <input
                  id="login-email"
                  type="email"
                  className="auth-form__input"
                  placeholder="name@domain.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>

              <div className="auth-form__group">
                <div className="auth-form__label-wrapper">
                  <label className="auth-form__label" htmlFor="login-password">
                    PASSWORD <span className="auth-form__required">*</span>
                  </label>
                  <button
                    type="button"
                    className="auth-form__link-btn"
                    onClick={() => {
                      setMode('forgot');
                      setError('');
                      setForgotSuccess('');
                    }}
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="auth-form__password-wrapper">
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    className="auth-form__input auth-form__input--password"
                    placeholder="Enter your password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="auth-form__password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div className="auth-form__checkbox-row">
                <label className="auth-form__checkbox-label">
                  <input
                    type="checkbox"
                    className="auth-form__checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span>Keep me signed in on this device</span>
                </label>
              </div>

              <button
                type="submit"
                className="auth-button auth-button--primary auth-button--full"
                disabled={submitting}
              >
                <span>{submitting ? 'AUTHENTICATING...' : 'SIGN IN'}</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </button>

              <div className="auth-form__switch-footer">
                <span>Don't have an account? </span>
                <button
                  type="button"
                  className="auth-form__link-btn auth-form__link-btn--bold"
                  onClick={() => {
                    setMode('register');
                    setError('');
                  }}
                >
                  Create one now
                </button>
              </div>
            </form>
          )}

          {/* ==============================================================
             MODE 2: REGISTER FORM
             ============================================================== */}
          {mode === 'register' && (
            <form noValidate className="auth-form" onSubmit={handleRegisterSubmit}>
              <div className="auth-form__header">
                <h2 className="auth-form__title">JOIN THE VEYNCORE SYNDICATE</h2>
                <p className="auth-form__subtitle">
                  Create an account for expedited checkout, order history, and exclusive denim drops.
                </p>
              </div>

              <div className="auth-form__row">
                <div className="auth-form__group">
                  <label className="auth-form__label" htmlFor="reg-first-name">
                    FIRST NAME
                  </label>
                  <input
                    id="reg-first-name"
                    type="text"
                    className="auth-form__input"
                    placeholder="First name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    autoComplete="given-name"
                  />
                </div>
                <div className="auth-form__group">
                  <label className="auth-form__label" htmlFor="reg-last-name">
                    LAST NAME
                  </label>
                  <input
                    id="reg-last-name"
                    type="text"
                    className="auth-form__input"
                    placeholder="Last name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    autoComplete="family-name"
                  />
                </div>
              </div>

              <div className="auth-form__group">
                <label className="auth-form__label" htmlFor="reg-email">
                  EMAIL ADDRESS <span className="auth-form__required">*</span>
                </label>
                <input
                  id="reg-email"
                  type="email"
                  className="auth-form__input"
                  placeholder="name@domain.com"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>

              <div className="auth-form__group">
                <label className="auth-form__label" htmlFor="reg-phone">
                  MOBILE NUMBER
                </label>
                <div className="auth-form__phone-wrapper">
                  <span className="auth-form__phone-prefix">+91</span>
                  <input
                    id="reg-phone"
                    type="tel"
                    className="auth-form__input auth-form__input--phone"
                    placeholder="98765 43210"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    autoComplete="tel"
                  />
                </div>
              </div>

              <div className="auth-form__group">
                <label className="auth-form__label" htmlFor="reg-password">
                  PASSWORD <span className="auth-form__required">*</span>
                </label>
                <input
                  id="reg-password"
                  type="password"
                  className="auth-form__input"
                  placeholder="Create a strong password (6+ chars)"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                />
              </div>

              <div className="auth-form__checkbox-row">
                <label className="auth-form__checkbox-label">
                  <input
                    type="checkbox"
                    className="auth-form__checkbox"
                    checked={subscribeNewsletter}
                    onChange={(e) => setSubscribeNewsletter(e.target.checked)}
                  />
                  <span>Get exclusive access to new drops, special offers</span>
                </label>
              </div>

              <button
                type="submit"
                className="auth-button auth-button--primary auth-button--full"
                disabled={submitting}
              >
                <span>{submitting ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </button>

              <div className="auth-form__switch-footer">
                <span>Already have an account? </span>
                <button
                  type="button"
                  className="auth-form__link-btn auth-form__link-btn--bold"
                  onClick={() => {
                    setMode('login');
                    setError('');
                  }}
                >
                  Sign in
                </button>
              </div>
            </form>
          )}

          {/* ==============================================================
             MODE 3: FORGOT PASSWORD
             ============================================================== */}
          {mode === 'forgot' && (
            <form noValidate className="auth-form" onSubmit={handleForgotSubmit}>
              <div className="auth-form__header">
                <h2 className="auth-form__title">RESET YOUR PASSWORD</h2>
                <p className="auth-form__subtitle">
                  We will send you a secure link to your email to reset your account password.
                </p>
              </div>

              {forgotSuccess ? (
                <div className="auth-card__alert auth-card__alert--success">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>{forgotSuccess}</span>
                </div>
              ) : (
                <>
                  <div className="auth-form__group">
                    <label className="auth-form__label" htmlFor="forgot-email">
                      EMAIL ADDRESS <span className="auth-form__required">*</span>
                    </label>
                    <input
                      id="forgot-email"
                      type="email"
                      className="auth-form__input"
                      placeholder="Enter registered email"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="auth-button auth-button--primary auth-button--full"
                    disabled={submitting}
                  >
                    <span>{submitting ? 'SENDING...' : 'SEND RESET LINK'}</span>
                  </button>
                </>
              )}

              <div className="auth-form__switch-footer">
                <button
                  type="button"
                  className="auth-form__link-btn auth-form__link-btn--bold"
                  onClick={() => {
                    setMode('login');
                    setError('');
                    setForgotSuccess('');
                  }}
                >
                  ← Return to Sign In
                </button>
              </div>
            </form>
          )}

          {/* ==============================================================
             MODE 4: MOBILE OTP SIGN IN
             ============================================================== */}
          {mode === 'otp' && (
            <form
              className="auth-form"
              onSubmit={otpSent ? handleVerifyOtp : handleSendOtp}
            >
              <div className="auth-form__header">
                <h2 className="auth-form__title">SIGN IN WITH OTP</h2>
                <p className="auth-form__subtitle">
                  {otpSent
                    ? `Enter the 4-digit verification code sent to +91 ${otpPhone}.`
                    : 'Enter your 10-digit mobile number to receive a secure login code.'}
                </p>
              </div>

              {!otpSent ? (
                <>
                  <div className="auth-form__group">
                    <label className="auth-form__label" htmlFor="otp-phone">
                      MOBILE NUMBER <span className="auth-form__required">*</span>
                    </label>
                    <div className="auth-form__phone-wrapper">
                      <span className="auth-form__phone-prefix">+91</span>
                      <input
                        id="otp-phone"
                        type="tel"
                        className="auth-form__input auth-form__input--phone"
                        placeholder="98765 43210"
                        value={otpPhone}
                        onChange={(e) => setOtpPhone(e.target.value)}
                        required
                        autoFocus
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="auth-button auth-button--primary auth-button--full"
                  >
                    <span>GET VERIFICATION CODE</span>
                  </button>
                </>
              ) : (
                <>
                  <div className="auth-form__group">
                    <label className="auth-form__label">
                      4-DIGIT CODE <span className="auth-form__required">*</span>
                    </label>
                    <div className="auth-form__otp-row">
                      {[0, 1, 2, 3].map((idx) => (
                        <input
                          key={idx}
                          id={`otp-input-${idx}`}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          className="auth-form__otp-digit"
                          value={otpCode[idx]}
                          onChange={(e) => handleOtpDigitChange(idx, e.target.value)}
                          autoFocus={idx === 0}
                        />
                      ))}
                    </div>
                    <span className="auth-form__hint">
                      Demo Code: Enter <strong>1234</strong> or any 4 digits.
                    </span>
                  </div>

                  <button
                    type="submit"
                    className="auth-button auth-button--primary auth-button--full"
                    disabled={submitting}
                  >
                    <span>{submitting ? 'VERIFYING...' : 'VERIFY & SIGN IN'}</span>
                  </button>
                </>
              )}

              <div className="auth-form__switch-footer">
                <button
                  type="button"
                  className="auth-form__link-btn auth-form__link-btn--bold"
                  onClick={() => {
                    setMode('login');
                    setOtpSent(false);
                    setError('');
                  }}
                >
                  ← Return to Email Sign In
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}