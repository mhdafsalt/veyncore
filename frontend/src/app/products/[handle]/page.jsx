import React, { cache } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import StoreHeader from '@/components/StoreHeader/StoreHeader';
import Footer from '@/components/Footer/Footer';
import ProductDetail from '@/components/ProductDetail/ProductDetail';
import { API_BASE_URL } from '@/lib/constants';

export const dynamic = 'force-dynamic';
export const dynamicParams = true;

/**
 * Helper to resolve product from backend MongoDB API with retry and exact status discrimination.
 * Wrapped in React cache to prevent duplicate requests between generateMetadata and ProductDetailPage.
 */
const resolveProduct = cache(async (handle) => {
  if (!handle) return { product: null, isNotFound: true, status: 400 };

  const rawHandle = String(handle).trim();
  const maxAttempts = 3;
  const delays = [600, 1500, 2500];

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const res = await fetch(`${API_BASE_URL}/api/products/${encodeURIComponent(rawHandle)}`, {
        cache: 'no-store',
      });

      if (res.status === 404) {
        // Genuine 404: product does not exist in database
        return { product: null, isNotFound: true, status: 404 };
      }

      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          return { product: json.data, isNotFound: false, status: 200 };
        }
      }

      // If status is 503 (database cold start) or temporary server delay, wait and retry
      if (attempt < maxAttempts) {
        await new Promise((r) => setTimeout(r, delays[attempt - 1]));
      }
    } catch (e) {
      if (attempt < maxAttempts) {
        await new Promise((r) => setTimeout(r, delays[attempt - 1]));
      }
    }
  }

  // All retries failed due to temporary server/network delay, NOT a 404
  return { product: null, isNotFound: false, isServerError: true, status: 503 };
});

/**
 * Helper to resolve active launch sale from backend with retry and request caching
 */
const resolveActiveLaunchSale = cache(async (handleOrId) => {
  if (!handleOrId) return null;
  const maxAttempts = 2;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const res = await fetch(`${API_BASE_URL}/api/launch-sales/product/${encodeURIComponent(handleOrId)}`, {
        cache: 'no-store',
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.hasActiveSale && json.data) {
          return json.data;
        }
        return null;
      }
      if (attempt < maxAttempts) {
        await new Promise((r) => setTimeout(r, 600));
      }
    } catch (e) {
      if (attempt < maxAttempts) {
        await new Promise((r) => setTimeout(r, 600));
      }
    }
  }
  return null;
});

/**
 * Generate Static Params for Next.js prerendering (Dynamic resolution on demand)
 */
export async function generateStaticParams() {
  return [];
}

/**
 * Dynamic SEO & OpenGraph Metadata
 */
export async function generateMetadata({ params }) {
  const resolvedParams = await Promise.resolve(params);
  const handle = resolvedParams?.handle;
  const { product } = await resolveProduct(handle);

  if (!product) {
    return {
      title: 'Product Details | VEYNCORE',
      description: 'Exclusive streetwear denim and utilitarian artifacts.',
    };
  }

  const isObject = product?.isObject || product?.category === 'VEYN-OBJECTS';

  return {
    title: `${product.title} | VEYNCORE`,
    description: isObject
      ? `${product.title} — ${product.subCategory || 'HARDWARE & UTILITY'}. Engineered tactical brutalist artifacts by VEYNCORE Objects Lab. Free nationwide delivery.`
      : `${product.title} — ${product.fit || 'Baggy Fit'}. Exclusive streetwear denim handpicked for VEYNCORE. Free nationwide delivery & no-cost EMI available.`,
    openGraph: {
      title: `${product.title} | VEYNCORE`,
      description: `${product.title} — ${product.salePrice || `Rs. ${product.price}.00`}. Official VEYNCORE store.`,
      images: [
        {
          url: product.images?.[0] || product.thumbnail || '/images/products/artic-blue-wide.jpg',
          width: 800,
          height: 1067,
          alt: product.title,
        },
      ],
    },
  };
}

/**
 * Product Details Page Route
 */
export default async function ProductDetailPage({ params }) {
  const resolvedParams = await Promise.resolve(params);
  const handle = resolvedParams?.handle;
  const { product, isNotFound, isServerError } = await resolveProduct(handle);

  if (isNotFound) {
    notFound();
  }

  if (isServerError || !product) {
    return (
      <main className="product-page-wrapper">
        <StoreHeader initialCategory="VEYN-SELECTS" />
        <div
          className="product-error-recovery"
          style={{
            minHeight: '60vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '60px 24px',
            textAlign: 'center',
          }}
        >
          <span
            style={{
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '0.1em',
              color: '#64748b',
              textTransform: 'uppercase',
              marginBottom: '12px',
            }}
          >
            TEMPORARY CONNECTION DELAY
          </span>
          <h1
            style={{
              fontSize: 'clamp(20px, 3vw, 26px)',
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: '#0f172a',
              marginBottom: '14px',
              maxWidth: '600px',
            }}
          >
            COULD NOT LOAD PRODUCT DETAILS
          </h1>
          <p
            style={{
              color: '#64748b',
              fontSize: '14px',
              maxWidth: '480px',
              marginBottom: '28px',
              lineHeight: 1.6,
            }}
          >
            We encountered a temporary connection delay while retrieving this piece. Please refresh or try again.
          </p>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <a
              href={`/products/${encodeURIComponent(handle || '')}`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '12px 24px',
                backgroundColor: '#0f172a',
                color: '#ffffff',
                fontSize: '11.5px',
                fontWeight: 600,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                borderRadius: '4px',
                textDecoration: 'none',
              }}
            >
              RELOAD PRODUCT
            </a>
            <Link
              href="/collections/all-drops"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '12px 24px',
                backgroundColor: 'transparent',
                border: '1.5px solid #e2e8f0',
                color: '#0f172a',
                fontSize: '11.5px',
                fontWeight: 600,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                borderRadius: '4px',
                textDecoration: 'none',
              }}
            >
              BROWSE ALL DROPS
            </Link>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  const activeLaunchSale = await resolveActiveLaunchSale(product._id || handle);

  const initialCat =
    product?.isObject || product?.category === 'VEYN-OBJECTS'
      ? 'VEYN-OBJECTS'
      : 'VEYN-SELECTS';

  const priceValue = activeLaunchSale?.salePrice || product.price || 0;
  const inStock = (product.stockQuantity ?? 10) > 0;
  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    image: product.images?.length
      ? product.images
      : [product.thumbnail || '/images/products/artic-blue-wide.jpg'],
    description: product.description || `${product.title} by VEYNCORE`,
    sku: product.sku || String(product._id || ''),
    brand: {
      '@type': 'Brand',
      name: 'VEYNCORE',
    },
    offers: {
      '@type': 'Offer',
      url: `https://veyncore.in/products/${encodeURIComponent(product.handle || handle)}`,
      priceCurrency: 'INR',
      price: priceValue,
      itemCondition: 'https://schema.org/NewCondition',
      availability: inStock
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: 'VEYNCORE',
      },
    },
  };

  return (
    <main className="product-page-wrapper">
      {/* Schema.org Product Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />

      {/* 1. Header with AnnouncementBar, Navbar, MainCategories & SubCategories */}
      <StoreHeader initialCategory={initialCat} />

      {/* 2. Product Details Component */}
      <ProductDetail product={product} activeLaunchSale={activeLaunchSale} />

      {/* 3. Modern VEYNCORE Footer */}
      <Footer />
    </main>
  );
}
