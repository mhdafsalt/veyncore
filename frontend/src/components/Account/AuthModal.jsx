'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import './AuthModal.css';

export default function AuthModal() {
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
    requestPasswordReset,
    isAuthModalOpen,
    authModalMode,
    setAuthModalMode,
    closeAuthModal
  } = useAuth();

  // Internal states
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Register fields
  const [fullName, setFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [subscribeNewsletter, setSubscribeNewsletter] = useState(false);

  // Forgot password
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState('');

  // Mobile OTP
  const [otpPhone, setOtpPhone] = useState('');
  const [otpCode, setOtpCode] = useState(['', '', '', '']);
  const [otpSent, setOtpSent] = useState(false);
  const [otpCountdown, setOtpCountdown] = useState(30);

  // Status
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const modalRef = useRef(null);

  // Lock body scroll and handle ESC key
  useEffect(() => {
    if (!isAuthModalOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        closeAuthModal();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isAuthModalOpen, closeAuthModal]);

  // Reset errors when mode changes
  useEffect(() => {
    setError('');
    setFieldErrors({});
    setForgotSuccess('');
  }, [authModalMode]);

  // OTP Countdown timer
  useEffect(() => {
    if (!otpSent || otpCountdown <= 0) return;
    const timer = setInterval(() => {
      setOtpCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [otpSent, otpCountdown]);

  if (!isAuthModalOpen) return null;

  // Handle Backdrop Click
  const handleBackdropClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      closeAuthModal();
    }
  };

  // Submit Login
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const errors = {};
    if (!loginEmail.trim()) {
      errors.loginEmail = 'Email Address is required';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(loginEmail.trim())) {
        errors.loginEmail = 'Please enter a valid email address';
      }
    }

    if (!loginPassword) {
      errors.loginPassword = 'Password is required';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});
    setSubmitting(true);
    try {
      const res = await login(loginEmail.trim(), loginPassword);
      setLoginEmail('');
      setLoginPassword('');
      setShowLoginPassword(false);
      closeAuthModal();

      // Role-Based Navigation
      if (res?.user?.role === 'admin') {
        router.push('/admin');
      } else {
        if (typeof window !== 'undefined' && window.location.pathname.startsWith('/admin')) {
          router.push('/');
        }
      }
    } catch (err) {
      setError(err?.message || 'Login failed. Please check your credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  // 1-Click Demo Login
  const handleDemoLogin = async () => {
    setError('');
    setSubmitting(true);
    try {
      const res = await loginDemo();
      closeAuthModal();
      if (res?.user?.role === 'admin') {
        router.push('/admin');
      }
    } catch (err) {
      setError('Demo login failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Submit Register
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const errors = {};

    if (!fullName.trim()) {
      errors.fullName = 'Full Name is required';
    }

    if (!regEmail.trim()) {
      errors.regEmail = 'Email Address is required';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(regEmail.trim())) {
        errors.regEmail = 'Please provide a valid email address';
      }
    }

    if (!regPassword) {
      errors.regPassword = 'Password is required';
    } else if (regPassword.length < 6) {
      errors.regPassword = 'Password must be at least 6 characters';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});
    setSubmitting(true);
    try {
      const res = await register({
        name: fullName.trim(),
        email: regEmail.trim(),
        mobileNumber: regPhone.trim(),
        password: regPassword,
        vipNotifications: subscribeNewsletter
      });

      // Clear all registration input boxes immediately
      setFullName('');
      setRegEmail('');
      setRegPhone('');
      setRegPassword('');
      setShowRegPassword(false);
      setSubscribeNewsletter(false);

      closeAuthModal();

      // Role-Based Navigation: regular user stays/redirects to homepage
      if (res?.user?.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/');
      }
    } catch (err) {
      setError(err?.message || 'Failed to create account. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Submit Forgot Password
  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const errors = {};
    if (!forgotEmail.trim()) {
      errors.forgotEmail = 'Registered Email is required';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(forgotEmail.trim())) {
        errors.forgotEmail = 'Please provide a valid email address';
      }
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});
    setSubmitting(true);
    try {
      const res = await requestPasswordReset(forgotEmail.trim());
      setForgotSuccess(res?.message || 'Password reset link sent to your email.');
    } catch (err) {
      setError('Could not process reset request. Please check email address.');
    } finally {
      setSubmitting(false);
    }
  };

  // Send OTP
  const handleSendOtp = (e) => {
    e.preventDefault();
    setError('');
    if (!otpPhone || otpPhone.replace(/\D/g, '').length < 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }
    setOtpSent(true);
    setOtpCountdown(30);
  };

  // OTP digit change
  const handleOtpChange = (value, index) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otpCode];
    newOtp[index] = value.slice(-1);
    setOtpCode(newOtp);

    if (value && index < 3) {
      const nextInput = document.getElementById(`auth-modal-otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  // Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    const fullCode = otpCode.join('');
    if (fullCode.length !== 4) {
      setError('Please enter the 4-digit verification code.');
      return;
    }
    setSubmitting(true);
    try {
      await loginWithOtp(otpPhone, fullCode);
      closeAuthModal();
    } catch (err) {
      setError('Invalid code. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // If already authenticated and in 'account' mode
  const isAccountView = isAuthenticated && user && authModalMode === 'account';

  return (
    <div
      className="auth-modal__overlay"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
    >
      <div className="auth-modal__container" ref={modalRef}>
        {/* Mobile top pull handle matching Image 2 */}
        <div className="auth-modal__handle" />

        {/* Close Button */}
        <button
          type="button"
          className="auth-modal__close"
          onClick={closeAuthModal}
          aria-label="Close authentication modal"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Modal Brand Header */}
        <div className="auth-modal__header">
          <img
            src="/images/veyncoreLogo_black.svg"
            alt="VEYNCORE"
            className="auth-modal__logo"
            width="168"
            height="22"
          />
          {/* <span className="auth-modal__tagline">MEMBER SYNDICATE</span> */}
        </div>

        {/* Error Notification */}
        {error && (
          <div className="auth-modal__alert auth-modal__alert--error" role="alert">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {/* Success Notification */}
        {forgotSuccess && (
          <div className="auth-modal__alert auth-modal__alert--success" role="alert">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
            </svg>
            <span>{forgotSuccess}</span>
          </div>
        )}

        {/* ================================================================
            VIEW A: AUTHENTICATED ACCOUNT PROFILE
            ================================================================ */}
        {isAccountView ? (
          <div className="auth-modal__account-view">
            <div className="auth-modal__user-card">
              <div className="auth-modal__avatar">
                {user.name?.trim()?.[0]?.toUpperCase() || user.firstName?.trim()?.[0]?.toUpperCase() || user.email?.trim()?.[0]?.toUpperCase() || 'V'}
              </div>
              <div className="auth-modal__user-meta">
                <h3 className="auth-modal__greeting">WELCOME, {(user.name || 'MEMBER').toUpperCase()}</h3>
                <p className="auth-modal__user-email">{user.email}</p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="auth-modal__stats-row">
              <div className="auth-modal__stat-box">
                <span className="auth-modal__stat-label">TOTAL ORDERS</span>
                <span className="auth-modal__stat-val">{orders.length}</span>
              </div>
              <div className="auth-modal__stat-box">
                <span className="auth-modal__stat-label">SAVED ADDRESS</span>
                <span className="auth-modal__stat-val">{addresses.length}</span>
              </div>
              <div
                className="auth-modal__stat-box auth-modal__stat-box--clickable"
                onClick={() => {
                  closeAuthModal();
                  openCart();
                }}
                role="button"
                tabIndex={0}
                title="View cart items"
              >
                <span className="auth-modal__stat-label">CART ITEMS</span>
                <span className="auth-modal__stat-val">{totalCount}</span>
              </div>
            </div>

            {/* Recent Orders Preview */}
            <div className="auth-modal__orders-preview">
              <h4 className="auth-modal__section-heading">RECENT ACTIVITY</h4>
              {orders.slice(0, 2).map((ord) => (
                <div key={ord.id} className="auth-modal__order-item">
                  <div className="auth-modal__order-info">
                    <span className="auth-modal__order-id">{ord.id}</span>
                    <span className="auth-modal__order-date">{ord.date}</span>
                  </div>
                  <div className="auth-modal__order-right">
                    <span className="auth-modal__order-status">{ord.status}</span>
                    <span className="auth-modal__order-price">Rs. {ord.total.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Account Actions */}
            <div className="auth-modal__account-actions">
              {user.role === 'admin' && (
                <button
                  type="button"
                  className="auth-modal__btn auth-modal__btn--primary"
                  onClick={() => {
                    closeAuthModal();
                    router.push('/admin');
                  }}
                >
                  ACCESS ADMIN PANEL →
                </button>
              )}
              <button
                type="button"
                className="auth-modal__btn auth-modal__btn--secondary"
                onClick={closeAuthModal}
              >
                CONTINUE SHOPPING
              </button>
              <button
                type="button"
                className="auth-modal__btn auth-modal__btn--danger"
                onClick={() => {
                  logout();
                  setAuthModalMode('login');
                }}
              >
                SIGN OUT
              </button>
            </div>
          </div>
        ) : (
          /* ================================================================
              VIEW B: UNAUTHENTICATED FORMS (Login, Register, Forgot, OTP)
              ================================================================ */
          <div className="auth-modal__auth-views">
            {/* Main Tabs (Sign In vs Create Account) */}
            {(authModalMode === 'login' || authModalMode === 'register') && (
              <div className="auth-modal__tabs">
                <button
                  type="button"
                  className={`auth-modal__tab ${authModalMode === 'login' ? 'auth-modal__tab--active' : ''}`}
                  onClick={() => setAuthModalMode('login')}
                >
                  SIGN IN
                </button>
                <button
                  type="button"
                  className={`auth-modal__tab ${authModalMode === 'register' ? 'auth-modal__tab--active' : ''}`}
                  onClick={() => setAuthModalMode('register')}
                >
                  CREATE ACCOUNT
                </button>
              </div>
            )}

            {/* 1. SIGN IN FORM */}
            {authModalMode === 'login' && (
              <div className="auth-modal__form-body">
                <form noValidate onSubmit={handleLoginSubmit} className="auth-modal__form">
                  <div className={`auth-modal__floating-field ${fieldErrors.loginEmail ? 'auth-modal__floating-field--error' : ''}`}>
                    <input
                      id="modal-login-email"
                      type="email"
                      className="auth-modal__floating-input"
                      placeholder=" "
                      value={loginEmail}
                      onChange={(e) => {
                        setLoginEmail(e.target.value);
                        if (fieldErrors.loginEmail) {
                          setFieldErrors((prev) => ({ ...prev, loginEmail: '' }));
                        }
                      }}
                    />
                    <label className="auth-modal__floating-label" htmlFor="modal-login-email">
                      Email Address
                    </label>
                    {fieldErrors.loginEmail && (
                      <span className="auth-modal__field-error">{fieldErrors.loginEmail}</span>
                    )}
                  </div>

                  <div className={`auth-modal__floating-field ${fieldErrors.loginPassword ? 'auth-modal__floating-field--error' : ''}`}>
                    <input
                      id="modal-login-password"
                      type={showLoginPassword ? 'text' : 'password'}
                      className="auth-modal__floating-input auth-modal__floating-input--with-eye"
                      placeholder=" "
                      value={loginPassword}
                      onChange={(e) => {
                        setLoginPassword(e.target.value);
                        if (fieldErrors.loginPassword) {
                          setFieldErrors((prev) => ({ ...prev, loginPassword: '' }));
                        }
                      }}
                    />
                    <label className="auth-modal__floating-label" htmlFor="modal-login-password">
                      Password
                    </label>
                    <button
                      type="button"
                      className="auth-modal__eye-btn"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                      aria-label={showLoginPassword ? 'Hide password' : 'Show password'}
                    >
                      {showLoginPassword ? (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                          <line x1="1" y1="1" x2="23" y2="23" />
                        </svg>
                      ) : (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      )}
                    </button>
                    {fieldErrors.loginPassword && (
                      <span className="auth-modal__field-error">{fieldErrors.loginPassword}</span>
                    )}
                  </div>

                  <div className="auth-modal__options-row">
                    <label className="auth-modal__checkbox-label">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                      />
                      <span>Keep me signed in</span>
                    </label>
                    <button
                      type="button"
                      className="auth-modal__text-link"
                      onClick={() => setAuthModalMode('forgot')}
                    >
                      Forgot password?
                    </button>
                  </div>

                  <button
                    type="submit"
                    className="auth-modal__btn auth-modal__btn--primary"
                    disabled={submitting}
                  >
                    {submitting ? 'SIGNING IN...' : 'SIGN IN'}
                  </button>

                  <div className="auth-modal__footer-toggle">
                    <span>Don't have an account? </span>
                    <button
                      type="button"
                      className="auth-modal__link-bold"
                      onClick={() => setAuthModalMode('register')}
                    >
                      Create Account
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* 2. CREATE ACCOUNT (SIGNUP) FORM */}
            {authModalMode === 'register' && (
              <div className="auth-modal__form-body">
                <form noValidate onSubmit={handleRegisterSubmit} className="auth-modal__form">
                  <div className={`auth-modal__floating-field ${fieldErrors.fullName ? 'auth-modal__floating-field--error' : ''}`}>
                    <input
                      id="modal-reg-fullname"
                      type="text"
                      className="auth-modal__floating-input"
                      placeholder=" "
                      value={fullName}
                      onChange={(e) => {
                        setFullName(e.target.value);
                        if (fieldErrors.fullName) {
                          setFieldErrors((prev) => ({ ...prev, fullName: '' }));
                        }
                      }}
                    />
                    <label className="auth-modal__floating-label" htmlFor="modal-reg-fullname">
                      Full Name
                    </label>
                    {fieldErrors.fullName && (
                      <span className="auth-modal__field-error">{fieldErrors.fullName}</span>
                    )}
                  </div>

                  <div className={`auth-modal__floating-field ${fieldErrors.regEmail ? 'auth-modal__floating-field--error' : ''}`}>
                    <input
                      id="modal-reg-email"
                      type="email"
                      className="auth-modal__floating-input"
                      placeholder=" "
                      value={regEmail}
                      onChange={(e) => {
                        setRegEmail(e.target.value);
                        if (fieldErrors.regEmail) {
                          setFieldErrors((prev) => ({ ...prev, regEmail: '' }));
                        }
                      }}
                    />
                    <label className="auth-modal__floating-label" htmlFor="modal-reg-email">
                      Email Address *
                    </label>
                    {fieldErrors.regEmail && (
                      <span className="auth-modal__field-error">{fieldErrors.regEmail}</span>
                    )}
                  </div>

                  <div className="auth-modal__floating-field">
                    <input
                      id="modal-reg-phone"
                      type="tel"
                      className="auth-modal__floating-input"
                      placeholder=" "
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                    />
                    <label className="auth-modal__floating-label" htmlFor="modal-reg-phone">
                      Mobile Number
                    </label>
                  </div>

                  <div className={`auth-modal__floating-field ${fieldErrors.regPassword ? 'auth-modal__floating-field--error' : ''}`}>
                    <input
                      id="modal-reg-password"
                      type={showRegPassword ? 'text' : 'password'}
                      className="auth-modal__floating-input auth-modal__floating-input--with-eye"
                      placeholder=" "
                      value={regPassword}
                      onChange={(e) => {
                        setRegPassword(e.target.value);
                        if (fieldErrors.regPassword) {
                          setFieldErrors((prev) => ({ ...prev, regPassword: '' }));
                        }
                      }}
                    />
                    <label className="auth-modal__floating-label" htmlFor="modal-reg-password">
                      Password (min. 6 characters) *
                    </label>
                    <button
                      type="button"
                      className="auth-modal__eye-btn"
                      onClick={() => setShowRegPassword(!showRegPassword)}
                      aria-label={showRegPassword ? 'Hide password' : 'Show password'}
                    >
                      {showRegPassword ? (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                          <line x1="1" y1="1" x2="23" y2="23" />
                        </svg>
                      ) : (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      )}
                    </button>
                    {fieldErrors.regPassword && (
                      <span className="auth-modal__field-error">{fieldErrors.regPassword}</span>
                    )}
                  </div>

                  <div className="auth-modal__options-row">
                    <label className="auth-modal__checkbox-label">
                      <input
                        type="checkbox"
                        checked={subscribeNewsletter}
                        onChange={(e) => setSubscribeNewsletter(e.target.checked)}
                      />
                      <span>Get exclusive access to new drops, special offers</span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="auth-modal__btn auth-modal__btn--primary"
                    disabled={submitting}
                  >
                    {submitting ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}
                  </button>

                  <div className="auth-modal__footer-toggle">
                    <span>Already have an account? </span>
                    <button
                      type="button"
                      className="auth-modal__link-bold"
                      onClick={() => setAuthModalMode('login')}
                    >
                      Sign In
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* 3. FORGOT PASSWORD VIEW */}
            {authModalMode === 'forgot' && (
              <div className="auth-modal__form-body">
                <div className="auth-modal__sub-header">
                  <h3 className="auth-modal__title">RESET PASSWORD</h3>
                  <p className="auth-modal__subtext">
                    Enter your registered email and we will send you instructions to reset your password.
                  </p>
                </div>

                <form noValidate onSubmit={handleForgotSubmit} className="auth-modal__form">
                  <div className={`auth-modal__floating-field ${fieldErrors.forgotEmail ? 'auth-modal__floating-field--error' : ''}`}>
                    <input
                      id="modal-forgot-email"
                      type="email"
                      className="auth-modal__floating-input"
                      placeholder=" "
                      value={forgotEmail}
                      onChange={(e) => {
                        setForgotEmail(e.target.value);
                        if (fieldErrors.forgotEmail) {
                          setFieldErrors((prev) => ({ ...prev, forgotEmail: '' }));
                        }
                      }}
                    />
                    <label className="auth-modal__floating-label" htmlFor="modal-forgot-email">
                      Registered Email
                    </label>
                    {fieldErrors.forgotEmail && (
                      <span className="auth-modal__field-error">{fieldErrors.forgotEmail}</span>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="auth-modal__btn auth-modal__btn--primary"
                    disabled={submitting}
                  >
                    {submitting ? 'SENDING...' : 'SEND RESET LINK'}
                  </button>

                  <div className="auth-modal__back-link">
                    <button
                      type="button"
                      className="auth-modal__text-link"
                      onClick={() => setAuthModalMode('login')}
                    >
                      ← Back to Sign In
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* 4. MOBILE OTP LOGIN VIEW */}
            {authModalMode === 'otp' && (
              <div className="auth-modal__form-body">
                <div className="auth-modal__sub-header">
                  <h3 className="auth-modal__title">MOBILE OTP LOGIN</h3>
                  <p className="auth-modal__subtext">
                    {otpSent
                      ? `Enter the 4-digit verification code sent to +91 ${otpPhone}`
                      : 'Enter your 10-digit mobile number to receive a secure login code.'}
                  </p>
                </div>

                {!otpSent ? (
                  <form onSubmit={handleSendOtp} className="auth-modal__form">
                    <div className="auth-modal__field">
                      <label className="auth-modal__label" htmlFor="modal-otp-phone">
                        MOBILE NUMBER
                      </label>
                      <div className="auth-modal__phone-input-wrap">
                        <span className="auth-modal__phone-prefix">+91</span>
                        <input
                          id="modal-otp-phone"
                          type="tel"
                          className="auth-modal__input auth-modal__input--phone"
                          placeholder="98765 43210"
                          value={otpPhone}
                          onChange={(e) => setOtpPhone(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="auth-modal__btn auth-modal__btn--primary"
                    >
                      SEND VERIFICATION CODE
                    </button>

                    <div className="auth-modal__back-link">
                      <button
                        type="button"
                        className="auth-modal__text-link"
                        onClick={() => setAuthModalMode('login')}
                      >
                        ← Back to Email Sign In
                      </button>
                    </div>
                  </form>
                ) : (
                  <form onSubmit={handleVerifyOtp} className="auth-modal__form">
                    <div className="auth-modal__otp-grid">
                      {otpCode.map((digit, i) => (
                        <input
                          key={i}
                          id={`auth-modal-otp-${i}`}
                          type="text"
                          maxLength={1}
                          className="auth-modal__otp-box"
                          value={digit}
                          onChange={(e) => handleOtpChange(e.target.value, i)}
                          autoFocus={i === 0}
                        />
                      ))}
                    </div>

                    <div className="auth-modal__otp-resend">
                      {otpCountdown > 0 ? (
                        <span>Resend code in {otpCountdown}s</span>
                      ) : (
                        <button
                          type="button"
                          className="auth-modal__link-bold"
                          onClick={() => {
                            setOtpCountdown(30);
                            setOtpCode(['', '', '', '']);
                          }}
                        >
                          Resend Code Now
                        </button>
                      )}
                    </div>

                    <button
                      type="submit"
                      className="auth-modal__btn auth-modal__btn--primary"
                      disabled={submitting}
                    >
                      {submitting ? 'VERIFYING...' : 'VERIFY & SIGN IN'}
                    </button>

                    <div className="auth-modal__back-link">
                      <button
                        type="button"
                        className="auth-modal__text-link"
                        onClick={() => {
                          setOtpSent(false);
                          setOtpCode(['', '', '', '']);
                        }}
                      >
                        ← Change Phone Number
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
