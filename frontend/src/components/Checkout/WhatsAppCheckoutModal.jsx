'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { trackWhatsAppClick } from '@/lib/trackWhatsApp';
import { parseNumericPrice, formatINR } from '@/lib/priceUtils';
import { WHATSAPP_NUMBER } from '@/lib/constants';
import './WhatsAppCheckoutModal.css';

/**
 * Self-contained SVG WhatsApp icon to prevent dynamic chunking issues
 */
const WhatsAppIcon = ({ size = 20, className = '' }) => (
  <svg
    viewBox="0 0 448 512"
    fill="currentColor"
    width={size}
    height={size}
    className={className}
    aria-hidden="true"
  >
    <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
  </svg>
);

/**
 * Clean any Indian phone string (+91, leading 0, spaces, dashes) to pure 10-digit number
 */
const cleanIndianMobileNumber = (phoneStr) => {
  if (!phoneStr) return '';
  const digitsOnly = String(phoneStr).replace(/\D/g, '');
  if (digitsOnly.length === 12 && digitsOnly.startsWith('91')) {
    return digitsOnly.slice(2);
  }
  if (digitsOnly.length === 11 && digitsOnly.startsWith('0')) {
    return digitsOnly.slice(1);
  }
  if (digitsOnly.length >= 10) {
    return digitsOnly.slice(-10);
  }
  return digitsOnly;
};

/**
 * Validate 6-digit Indian Pincode format (digits only, starting with 1-9)
 */
const isValidIndianPincode = (pincode) => {
  const cleaned = String(pincode || '').trim().replace(/\s/g, '');
  return /^[1-9][0-9]{5}$/.test(cleaned);
};

/**
 * Check if a 6-digit Indian Pincode belongs to Kerala (Prefixes 67, 68, 69)
 */
const isKeralaPincode = (pincode) => {
  const cleaned = String(pincode || '').trim().replace(/\s/g, '');
  if (!isValidIndianPincode(cleaned)) return false;
  return /^(67|68|69)/.test(cleaned);
};

/**
 * Calculate shipping details dynamically based on customer pincode:
 * - Uncalculated if incomplete or invalid pincode
 * - Kerala (Prefixes 67, 68, 69): ₹0 (FREE DELIVERY)
 * - Outside Kerala: ₹50
 */
const getShippingDetails = (pincode) => {
  if (!isValidIndianPincode(pincode)) {
    return {
      isCalculated: false,
      isKerala: false,
      charge: 0,
      label: 'Calculated at pincode',
      message: null,
    };
  }

  if (isKeralaPincode(pincode)) {
    return {
      isCalculated: true,
      isKerala: true,
      charge: 0,
      label: 'FREE (Kerala)',
      message: 'Congratulations! You get FREE delivery.',
    };
  }

  return {
    isCalculated: true,
    isKerala: false,
    charge: 50,
    label: '₹50 (Outside Kerala)',
    message: 'A delivery charge of ₹50 applies.',
  };
};

/**
 * Generate a clean, unique order reference ID (e.g. FS-20261123-8472)
 */
const generateOrderReference = () => {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `FS-${dateStr}-${randomSuffix}`;
};

export default function WhatsAppCheckoutModal() {
  const {
    isCheckoutOpen,
    checkoutItems,
    checkoutSource,
    closeCheckout,
  } = useCart();

  const { user, isAuthenticated, addresses } = useAuth();

  // Form Field States
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    pincode: '',
  });

  // Inline Validation Error State
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Submission / Loading / Fallback States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [popupBlockedUrl, setPopupBlockedUrl] = useState('');
  const [orderId, setOrderId] = useState('');

  const modalRef = useRef(null);
  const firstInputRef = useRef(null);

  // Generate / refresh order reference and prefill logged-in user data whenever checkout opens
  useEffect(() => {
    if (isCheckoutOpen) {
      setOrderId(generateOrderReference());
      setErrors({});
      setTouched({});
      setPopupBlockedUrl('');
      setIsSubmitting(false);

      // Pre-fill user data if logged in
      if (user) {
        const defaultAddr = addresses?.find((a) => a.isDefault) || addresses?.[0];
        const defaultName = (user.name || user.fullName || defaultAddr?.name || '').trim();
        const rawPhone = user.mobileNumber || user.phone || user.phoneNumber || defaultAddr?.phone || '';
        const cleanedPhone = cleanIndianMobileNumber(rawPhone);

        setFormData((prev) => ({
          name: prev.name ? prev.name : defaultName,
          phone: prev.phone ? prev.phone : cleanedPhone,
          address: prev.address
            ? prev.address
            : defaultAddr
            ? [defaultAddr.street, defaultAddr.city, defaultAddr.state].filter(Boolean).join(', ')
            : '',
          pincode: prev.pincode
            ? prev.pincode
            : defaultAddr?.postalCode
            ? String(defaultAddr.postalCode).replace(/\D/g, '').slice(0, 6)
            : '',
        }));
      }

      // Auto-focus the first empty field for frictionless checkout
      const timer = setTimeout(() => {
        const nameVal = (user?.name || user?.fullName || formData.name || '').trim();
        const rawPhone = user?.mobileNumber || user?.phone || user?.phoneNumber || formData.phone || '';
        const phoneVal = cleanIndianMobileNumber(rawPhone);
        const addrVal = (formData.address || '').trim();

        if (!nameVal && firstInputRef.current) {
          firstInputRef.current.focus();
        } else if (!phoneVal) {
          document.getElementById('checkout-phone')?.focus();
        } else if (!addrVal) {
          document.getElementById('checkout-address')?.focus();
        } else {
          document.getElementById('checkout-pincode')?.focus();
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isCheckoutOpen, user, addresses]);

  // Lock background scroll when checkout modal is active
  useEffect(() => {
    if (typeof document !== 'undefined') {
      if (isCheckoutOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [isCheckoutOpen]);

  // Escape key listener to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isCheckoutOpen) {
        closeCheckout();
      }
    };
    if (typeof window !== 'undefined') {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isCheckoutOpen, closeCheckout]);

  // Validate individual field or entire form
  const validateField = (field, value) => {
    const trimmed = (value || '').trim();

    switch (field) {
      case 'name':
        if (!trimmed) {
          return 'Full Name is required.';
        }
        if (trimmed.length < 2) {
          return 'Name must be at least 2 characters.';
        }
        return '';

      case 'phone': {
        if (!trimmed) {
          return 'Phone Number is required.';
        }
        // Normalize: strip leading +91, 91, 0, spaces, and dashes
        const cleaned = trimmed.replace(/^(\+91|91|0)/, '').replace(/[\s-]/g, '');
        // Validate strictly 10 digits starting with 6, 7, 8, or 9
        const indianPhoneRegex = /^[6-9]\d{9}$/;
        if (!indianPhoneRegex.test(cleaned)) {
          return 'Please enter a valid 10-digit Indian mobile number (e.g. 9876543210).';
        }
        return '';
      }

      case 'address':
        if (!trimmed) {
          return 'Delivery Address is required.';
        }
        if (trimmed.length < 10) {
          return 'Please enter a complete address (Flat/House, Street, Area, City, State).';
        }
        return '';

      case 'pincode': {
        if (!trimmed) {
          return 'Pincode is required.';
        }
        const cleaned = trimmed.replace(/\s/g, '');
        // Indian pincode: 6 digits, first digit 1-9
        const pincodeRegex = /^[1-9][0-9]{5}$/;
        if (!pincodeRegex.test(cleaned)) {
          return 'Please enter a valid 6-digit postal pincode (e.g. 560001).';
        }
        return '';
      }

      default:
        return '';
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (touched[field]) {
      const fieldError = validateField(field, value);
      setErrors((prev) => ({ ...prev, [field]: fieldError }));
    }
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const fieldError = validateField(field, formData[field]);
    setErrors((prev) => ({ ...prev, [field]: fieldError }));
  };

  // Safe items fallback
  const items = Array.isArray(checkoutItems) && checkoutItems.length > 0 ? checkoutItems : [];

  // Live Calculations
  const totalQuantity = items.reduce((sum, item) => sum + (Number(item.quantity) || 1), 0);
  const subtotal = items.reduce((sum, item) => {
    const numPrice = parseNumericPrice(item.price);
    return sum + numPrice * (Number(item.quantity) || 1);
  }, 0);

  // Dynamic Pincode-Based Shipping Calculation (Kerala = ₹0, Outside Kerala = ₹50)
  const shippingInfo = getShippingDetails(formData.pincode);
  const shippingCharge = shippingInfo.charge;
  const grandTotal = subtotal + shippingCharge;

  /**
   * Builds the formatted WhatsApp order text in the exact requested structure
   */
  const buildWhatsAppMessage = (currentRef) => {
    const lines = [
      '*Hello VEYNCORE!*',
      '',
      'I would like to place an order.',
      '',
      `*Order Reference:* ${currentRef}`,
      '*Order Source:* VEYNCORE Website',
      `*Total Products:* ${totalQuantity}`,
      ''
    ];

    // Repeat PRODUCT DETAILS for each product
    items.forEach((item) => {
      const numPrice = parseNumericPrice(item.price);
      const itemTotal = numPrice * (Number(item.quantity) || 1);
      const colour = item.variant || item.color || item.fit || 'Standard';

      lines.push('*PRODUCT DETAILS*');
      lines.push('');
      lines.push(`*Product:* ${item.title || 'Product'}`);
      lines.push(`*Colour:* ${colour}`);
      lines.push(`*Size:* ${item.size || 'ONE SIZE'}`);
      lines.push(`*Quantity:* ${item.quantity || 1}`);
      lines.push(`*Unit Price:* ₹${numPrice.toLocaleString('en-IN')}`);
      lines.push(`*Item Total:* ₹${itemTotal.toLocaleString('en-IN')}`);
      lines.push(`*Product Link:* ${item.url || ''}`);
      lines.push('');
    });

    // ORDER SUMMARY
    lines.push('*ORDER SUMMARY*');
    lines.push('');
    lines.push(`*Subtotal:* ₹${subtotal.toLocaleString('en-IN')}`);
    lines.push(`*Shipping Charges:* ₹${shippingCharge}`);
    lines.push(`*Grand Total:* ₹${grandTotal.toLocaleString('en-IN')}`);
    lines.push('');

    // CUSTOMER DETAILS
    const cleanedPhone = (formData.phone || '').trim().replace(/^(\+91|91|0)/, '').replace(/[\s-]/g, '');

    lines.push('*CUSTOMER DETAILS*');
    lines.push('');
    lines.push(`*Name:* ${(formData.name || '').trim()}`);
    lines.push(`*Delivery Address:* ${(formData.address || '').trim()}`);
    lines.push(`*Pincode:* ${(formData.pincode || '').trim()}`);
    lines.push(`*Phone Number:* ${cleanedPhone}`);
    lines.push('');
    lines.push('*Please confirm my order and share payment instructions!*');

    return lines.join('\n');
  };

  /**
   * Form submission handler
   */
  const handleSubmit = (e) => {
    e.preventDefault();

    // Mark all as touched
    const newTouched = {
      name: true,
      phone: true,
      address: true,
      pincode: true,
    };
    setTouched(newTouched);

    // Validate all fields
    const newErrors = {
      name: validateField('name', formData.name),
      phone: validateField('phone', formData.phone),
      address: validateField('address', formData.address),
      pincode: validateField('pincode', formData.pincode),
    };
    setErrors(newErrors);

    const hasErrors = Object.values(newErrors).some((err) => Boolean(err));
    if (hasErrors) {
      // Focus the first invalid field
      const firstInvalidKey = Object.keys(newErrors).find((k) => Boolean(newErrors[k]));
      const el = document.getElementById(`checkout-${firstInvalidKey}`);
      if (el) el.focus();
      return;
    }

    if (items.length === 0) {
      alert('Your checkout list is empty.');
      return;
    }

    setIsSubmitting(true);

    try {
      const currentRef = orderId || generateOrderReference();
      const message = buildWhatsAppMessage(currentRef);
      const WHATSAPP_NUMBER = '919446391166';
      const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

      // Analytics click track
      trackWhatsAppClick({
        productHandle: items.map((i) => i.handle || i.id || '').join(', '),
        productTitle: items.map((i) => i.title || '').join(', '),
        size: items.map((i) => i.size || '').join(', '),
        price: grandTotal,
        quantity: totalQuantity,
        source: checkoutSource || 'product_detail',
        userPhone: formData.phone,
      });

      // Open WhatsApp in new tab
      const win = window.open(whatsappUrl, '_blank');

      if (!win || win.closed || typeof win.closed === 'undefined') {
        // Popup was blocked by browser
        setPopupBlockedUrl(whatsappUrl);
        setIsSubmitting(false);
      } else {
        // Give short delay then close checkout modal
        setTimeout(() => {
          setIsSubmitting(false);
          closeCheckout();
        }, 800);
      }
    } catch (err) {
      console.error('[Checkout Error]', err);
      setIsSubmitting(false);
      alert('An error occurred while launching WhatsApp. Please try again.');
    }
  };

  if (!isCheckoutOpen) return null;

  return (
    <div
      className="wa-checkout-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="checkout-modal-title"
    >
      {/* Backdrop */}
      <div
        className="wa-checkout-modal__backdrop"
        onClick={closeCheckout}
        aria-hidden="true"
      />

      {/* Main Modal Card */}
      <div className="wa-checkout-modal__card" ref={modalRef}>
        {/* Top Header */}
        <header className="wa-checkout-modal__header">
          <h2 id="checkout-modal-title" className="wa-checkout-modal__title">
            DELIVERY DETAILS
          </h2>

          <button
            type="button"
            className="wa-checkout-modal__close-btn"
            onClick={closeCheckout}
            aria-label="Close checkout modal"
          >
            ✕
          </button>
        </header>

        {/* Scrollable Body */}
        <div className="wa-checkout-modal__body">
          {/* Order Items Preview Card */}
          <section className="wa-checkout-items">
            <div className="wa-checkout-items__header">
              <span className="wa-checkout-items__label">ORDER ITEMS</span>
              <span className="wa-checkout-items__count">
                {totalQuantity} {totalQuantity === 1 ? 'item' : 'items'}
              </span>
            </div>

            <div className="wa-checkout-items__list">
              {items.map((item, idx) => {
                const numPrice = parseNumericPrice(item.price);

                return (
                  <div key={`${item.handle || item.id || idx}-${item.size || 'default'}`} className="wa-checkout-item">
                    <div className="wa-checkout-item__thumb">
                      <img
                        src={item.image || '/images/hero/hero-card-3.jpg'}
                        alt={item.title || 'Product'}
                        loading="lazy"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/images/hero/hero-card-3.jpg';
                        }}
                      />
                    </div>
                    <div className="wa-checkout-item__meta">
                      <h4 className="wa-checkout-item__title">{item.title}</h4>
                      <div className="wa-checkout-item__specs">
                        {item.variant && item.variant !== 'Standard' && (
                          <span className="wa-checkout-item__pill">{item.variant}</span>
                        )}
                        <span className="wa-checkout-item__pill">Size: {item.size || 'ONE SIZE'}</span>
                        <span className="wa-checkout-item__pill">Qty: {item.quantity || 1}</span>
                      </div>
                      <div className="wa-checkout-item__price">
                        {formatINR(numPrice * (Number(item.quantity) || 1))}
                        {Number(item.quantity) > 1 && (
                          <span className="wa-checkout-item__unit-price">
                            ({formatINR(numPrice)} each)
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Delivery Form */}
          <form id="wa-delivery-form" onSubmit={handleSubmit} className="wa-delivery-form" noValidate>
            <div className="wa-delivery-form__intro">
              <div className="wa-delivery-form__intro-row">
                <h3 className="wa-delivery-form__heading">Delivery Details</h3>
               
              </div>
            </div>

            {/* Full Name Floating Field */}
            <div className={`wa-floating-field ${formData.name ? 'wa-floating-field--filled' : ''} ${touched.name && errors.name ? 'wa-floating-field--error' : ''}`}>
              <input
                ref={firstInputRef}
                id="checkout-name"
                type="text"
                className="wa-floating-input"
                placeholder="e.g. Rahul Sharma"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                onBlur={() => handleBlur('name')}
                autoComplete="name"
              />
              <label htmlFor="checkout-name" className="wa-floating-label">
                Full Name <span className="wa-field__required">*</span>
              </label>
              {touched.name && errors.name && (
                <span className="wa-field__error-msg" role="alert">
                  {errors.name}
                </span>
              )}
            </div>

            {/* Phone Number Floating Field */}
            <div className={`wa-floating-field ${formData.phone ? 'wa-floating-field--filled' : ''} ${touched.phone && errors.phone ? 'wa-floating-field--error' : ''}`}>
              <div className="wa-floating-phone-wrap">
                <span className="wa-floating-phone-prefix">+91</span>
                <div className="wa-floating-phone-input-box">
                  <input
                    id="checkout-phone"
                    type="tel"
                    className="wa-floating-input wa-floating-input--phone"
                    placeholder="10-digit mobile number"
                    maxLength={13}
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    onBlur={() => handleBlur('phone')}
                    autoComplete="tel"
                  />
                  <label htmlFor="checkout-phone" className="wa-floating-label">
                    Phone Number (WhatsApp) <span className="wa-field__required">*</span>
                  </label>
                </div>
              </div>
              {touched.phone && errors.phone && (
                <span className="wa-field__error-msg" role="alert">
                  {errors.phone}
                </span>
              )}
            </div>

            {/* Delivery Address Floating Field */}
            <div className={`wa-floating-field wa-floating-field--textarea ${formData.address ? 'wa-floating-field--filled' : ''} ${touched.address && errors.address ? 'wa-floating-field--error' : ''}`}>
              <textarea
                id="checkout-address"
                rows={3}
                className="wa-floating-textarea"
                placeholder="Flat / House No., Building, Street, Area, Landmark, City, State"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                onBlur={() => handleBlur('address')}
                autoComplete="street-address"
              />
              <label htmlFor="checkout-address" className="wa-floating-label">
                Delivery Address <span className="wa-field__required">*</span>
              </label>
              {touched.address && errors.address && (
                <span className="wa-field__error-msg" role="alert">
                  {errors.address}
                </span>
              )}
            </div>

            {/* Pincode Floating Field */}
            <div className={`wa-floating-field ${formData.pincode ? 'wa-floating-field--filled' : ''} ${touched.pincode && errors.pincode ? 'wa-floating-field--error' : ''}`}>
              <input
                id="checkout-pincode"
                type="text"
                inputMode="numeric"
                maxLength={6}
                className="wa-floating-input wa-floating-input--pincode"
                placeholder="6-digit Pincode"
                value={formData.pincode}
                onChange={(e) => {
                  const cleaned = e.target.value.replace(/[^0-9]/g, '');
                  handleInputChange('pincode', cleaned);
                }}
                onBlur={() => handleBlur('pincode')}
                autoComplete="postal-code"
              />
              <label htmlFor="checkout-pincode" className="wa-floating-label">
                Pincode <span className="wa-field__required">*</span>
              </label>
              {touched.pincode && errors.pincode && (
                <span className="wa-field__error-msg" role="alert">
                  {errors.pincode}
                </span>
              )}
            </div>

            {/* Order Summary Box */}
            <div className="wa-summary">
              <h4 className="wa-summary__title">ORDER SUMMARY</h4>
              <div className="wa-summary__rows">
                <div className="wa-summary__row">
                  <span>Subtotal</span>
                  <span>{formatINR(subtotal)}</span>
                </div>
                <div className="wa-summary__row">
                  <span>Delivery</span>
                  {shippingInfo.isCalculated ? (
                    shippingInfo.isKerala ? (
                      <span className="wa-summary__shipping-kerala">FREE (Kerala)</span>
                    ) : (
                      <span className="wa-summary__shipping-outside">₹50 (Outside Kerala)</span>
                    )
                  ) : (
                    <span className="wa-summary__shipping-pending">Enter 6-digit pincode</span>
                  )}
                </div>
                <div className="wa-summary__divider" />
                <div className="wa-summary__row wa-summary__row--total">
                  <span>Total</span>
                  <span>{formatINR(grandTotal)}</span>
                </div>
              </div>
            </div>

            {/* Pop-up Blocker Fallback Banner */}
            {popupBlockedUrl && (
              <div className="wa-checkout-blocked-alert">
                <p>Pop-up was blocked by your browser.</p>
                <a
                  href={popupBlockedUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="wa-checkout-blocked-btn"
                >
                  <WhatsAppIcon size={16} />
                  <span>Click here to open WhatsApp</span>
                </a>
              </div>
            )}

            {/* Action Buttons */}
            <div className="wa-delivery-form__actions">
              <button
                type="submit"
                className="wa-submit-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="wa-submit-btn__loading">
                    <span className="wa-submit-spinner" />
                    <span>Preparing WhatsApp Order...</span>
                  </span>
                ) : (
                  <div className="wa-submit-btn__content">
                    <WhatsAppIcon className="wa-submit-btn__icon" size={20} />
                    <span className="wa-submit-btn__label">
                      <span>Confirm Order on WhatsApp</span>
                      <span className="wa-submit-btn__divider">&bull;</span>
                      <span className="wa-submit-btn__price">{formatINR(grandTotal)}</span>
                    </span>
                  </div>
                )}
              </button>

              <div className="wa-checkout-guarantee">
                <span className="wa-checkout-guarantee__badge">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="wa-checkout-guarantee__icon" aria-hidden="true">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                  <span>Official Veyncore WhatsApp Business</span>
                </span>
                <span className="wa-checkout-guarantee__dot">&bull;</span>
                <span className="wa-checkout-guarantee__sub">Instant Confirmation</span>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
