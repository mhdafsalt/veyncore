'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { FaWhatsapp } from 'react-icons/fa';
import { useCart } from '@/context/CartContext';
import { trackWhatsAppClick } from '@/lib/trackWhatsApp';
import './MobileQuickBuyDrawer.css';

/**
 * Format price for clean display (e.g. Rs. 1,299.00)
 */
function formatPriceText(val) {
  if (val === null || val === undefined || val === '') return '';
  if (typeof val === 'number') {
    return `Rs. ${val.toLocaleString('en-IN')}.00`;
  }
  return String(val).replace(/Rs\.\s*/g, 'Rs.\u00A0');
}

/**
 * Extract numeric price value for cart calculations
 */
function extractNumericPrice(val) {
  if (typeof val === 'number') return val;
  if (!val) return 0;
  const cleaned = String(val).replace(/[^0-9.]/g, '');
  return parseFloat(cleaned) || 0;
}

export default function MobileQuickBuyDrawer({ isOpen, onClose, product }) {
  const { addItem, openCart, whatsappNumber } = useCart();
  const [mounted, setMounted] = useState(false);
  const [selectedSize, setSelectedSize] = useState('28');
  const [quantity, setQuantity] = useState(1);

  // SSR portal mount check
  useEffect(() => {
    setMounted(true);
  }, []);

  // Update default selected size and reset quantity whenever product changes or drawer opens
  useEffect(() => {
    if (product && isOpen) {
      const sizes = product.availableSizes || product.sizes || ['28', '30', '32', '34', '36'];
      setSelectedSize(sizes[0] || '28');
      setQuantity(1);
    }
  }, [product, isOpen]);

  // Lock body scroll while drawer is open
  useEffect(() => {
    if (isOpen) {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prevOverflow;
      };
    }
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!mounted || !isOpen || !product) return null;

  const images = product.images && product.images.length > 0
    ? product.images
    : [product.image || '/images/products/artic-blue-wide.jpg'];
  const thumbnail = images[0];
  const sizes = product.availableSizes || product.sizes || ['28', '30', '32', '34', '36'];

  const salePriceDisplay = formatPriceText(product.salePrice ?? product.price ?? 1299);
  const regularPriceDisplay = formatPriceText(product.regularPrice ?? product.comparePrice ?? product.compareAtPrice ?? null);

  const numSalePrice = extractNumericPrice(product.salePrice ?? product.price ?? 1299);
  const numRegularPrice = product.regularPrice || product.comparePrice || product.compareAtPrice
    ? extractNumericPrice(product.regularPrice || product.comparePrice || product.compareAtPrice)
    : null;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();

    addItem({
      id: `${product.handle || product.id || 'item'}-${selectedSize}`,
      productId: product.handle || product.id,
      title: product.title,
      size: selectedSize,
      price: numSalePrice,
      comparePrice: numRegularPrice,
      image: thumbnail,
      quantity: quantity
    });

    onClose();
    openCart();
  };

  // Build Direct WhatsApp Order Link
  const buildDirectWhatsAppLink = () => {
    const itemTotal = numSalePrice * quantity;
    const productUrl = typeof window !== 'undefined'
      ? `${window.location.origin}/products/${product.handle || product.id}`
      : '';

    const lines = [
      '*New Order Request - VEYNCORE*',
      '--------------------------------',
      '*Item Details:*',
      `• *${product?.title || 'Product'}*`,
      `  Size: ${selectedSize}`,
      `  Quantity: ${quantity}`,
      `  Price: Rs. ${numSalePrice.toLocaleString('en-IN')}.00 INR`,
      productUrl ? `  Product Link: ${productUrl}` : '',
      '--------------------------------',
      `*Total Amount:* Rs. ${itemTotal.toLocaleString('en-IN')}.00 INR`,
      '*Shipping:* Free Shipping All Over India',
      '--------------------------------',
      'Please confirm my order and share payment instructions. Thank you!'
    ].filter(Boolean);

    const message = lines.join('\n');
    const targetNumber = whatsappNumber || '919876543210';
    return `https://wa.me/${targetNumber}?text=${encodeURIComponent(message)}`;
  };

  const handleBuyNow = (e) => {
    e.preventDefault();
    e.stopPropagation();

    addItem({
      id: `${product.handle || product.id || 'item'}-${selectedSize}`,
      productId: product.handle || product.id,
      title: product.title,
      size: selectedSize,
      price: numSalePrice,
      comparePrice: numRegularPrice,
      image: thumbnail,
      quantity: quantity
    });

    onClose();
    openCart();
  };

  const content = (
    <div className="mobile-quick-buy" role="dialog" aria-modal="true" aria-label="Quick Buy">
      {/* Dimmed backdrop */}
      <div
        className="mobile-quick-buy__backdrop"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-up Bottom Sheet Drawer */}
      <div className="mobile-quick-buy__drawer" onClick={(e) => e.stopPropagation()}>
        {/* Drawer Pull Handle / Indicator */}
        <div className="mobile-quick-buy__handle" />

        {/* Header: Product Thumbnail + Title + Price + Close Button */}
        <div className="mobile-quick-buy__header">
          <div className="mobile-quick-buy__thumbnail-wrapper">
            <img
              src={thumbnail}
              alt={product.title}
              className="mobile-quick-buy__thumbnail"
            />
          </div>

          <div className="mobile-quick-buy__meta">
            <h3 className="mobile-quick-buy__title">{product.title}</h3>
            <div className="mobile-quick-buy__pricing">
              <span className="mobile-quick-buy__sale-price">{salePriceDisplay}</span>
              {regularPriceDisplay && (
                <span className="mobile-quick-buy__regular-price">{regularPriceDisplay}</span>
              )}
            </div>
          </div>

          <button
            type="button"
            className="mobile-quick-buy__close-btn"
            onClick={onClose}
            aria-label="Close"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Size Selection Section */}
        <div className="mobile-quick-buy__size-section">
          <label className="mobile-quick-buy__size-label">Size</label>
          <div className="mobile-quick-buy__size-list" role="radiogroup" aria-label="Select size">
            {sizes.map((size) => {
              const isSelected = selectedSize === size;
              return (
                <button
                  key={size}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  className={`mobile-quick-buy__size-pill ${
                    isSelected ? 'mobile-quick-buy__size-pill--selected' : ''
                  }`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </div>

        {/* Quantity Stepper + Add To Cart Row */}
        <div className="mobile-quick-buy__actions-row">
          <div className="mobile-quick-buy__quantity" aria-label="Quantity">
            <button
              type="button"
              className="mobile-quick-buy__qty-btn"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              aria-label="Decrease quantity"
            >
              −
            </button>
            <span className="mobile-quick-buy__qty-value">{quantity}</span>
            <button
              type="button"
              className="mobile-quick-buy__qty-btn"
              onClick={() => setQuantity((q) => q + 1)}
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>

          <button
            type="button"
            className="mobile-quick-buy__add-cart-btn"
            onClick={handleAddToCart}
          >
            <svg
              className="mobile-quick-buy__add-cart-icon"
              width="16"
              height="16"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M16.608 9.421V6.906H3.392v8.016c0 .567.224 1.112.624 1.513.4.402.941.627 1.506.627H8.63M8.818 3h2.333c.618 0 1.212.247 1.649.686a2.35 2.35 0 0 1 .683 1.658v1.562H6.486V5.344c0-.622.246-1.218.683-1.658A2.33 2.33 0 0 1 8.82 3"
              />
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="1.5"
                d="M14.608 12.563v5m2.5-2.5h-5"
              />
            </svg>
            <span>Add to cart</span>
          </button>
        </div>

        {/* Direct WhatsApp Order Button */}
        <a
          href={buildDirectWhatsAppLink()}
          target="_blank"
          rel="noopener noreferrer"
          className="mobile-quick-buy__whatsapp-btn"
          onClick={() => {
            const rawPrice = product?.salePrice ?? product?.price ?? 1299;
            trackWhatsAppClick({
              productHandle: product?.handle || '',
              productTitle: product?.title || 'Product',
              size: selectedSize || '',
              price: rawPrice,
              quantity: 1,
              source: 'quick_buy',
            });
            onClose();
          }}
          aria-label="Direct WhatsApp Order"
        >
          <FaWhatsapp className="mobile-quick-buy__whatsapp-icon" size={20} aria-hidden="true" />
          <span>Direct WhatsApp Order</span>
        </a>
      </div>
    </div>
  );

  return createPortal(content, document.body);
}
