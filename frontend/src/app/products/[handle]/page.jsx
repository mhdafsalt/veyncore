import React from 'react';
import { notFound } from 'next/navigation';
import StoreHeader from '@/components/StoreHeader/StoreHeader';
import Footer from '@/components/Footer/Footer';
import ProductDetail from '@/components/ProductDetail/ProductDetail';
import { getProductByHandle, getAllProductHandles } from '@/data/productsData';
import { API_BASE_URL } from '@/lib/constants';

/**
 * Helper to resolve product from local dataset or backend API
 */
async function resolveProduct(handle) {
  let product = getProductByHandle(handle);
  if (!product && handle) {
    try {
      const res = await fetch(`${API_BASE_URL}/api/products/${encodeURIComponent(handle)}`, {
        cache: 'no-store',
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          product = json.data;
        }
      }
    } catch (e) {
      // Ignore network errors during static build
    }
  }
  return product;
}

/**
 * Generate Static Params for Next.js prerendering
 */
export async function generateStaticParams() {
  const handles = getAllProductHandles();
  return handles.map((handle) => ({
    handle: handle
  }));
}

/**
 * Dynamic SEO & OpenGraph Metadata
 */
export async function generateMetadata({ params }) {
  const resolvedParams = await Promise.resolve(params);
  const handle = resolvedParams?.handle;
  const product = await resolveProduct(handle);

  if (!product) {
    return {
      title: 'Product Not Found | VEYNCORE',
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
          alt: product.title
        }
      ]
    }
  };
}

/**
 * Product Details Page Route
 */
export default async function ProductDetailPage({ params }) {
  const resolvedParams = await Promise.resolve(params);
  const handle = resolvedParams?.handle;
  const product = await resolveProduct(handle);

  if (!product) {
    notFound();
  }

  const initialCat =
    product?.isObject || product?.category === 'VEYN-OBJECTS'
      ? 'VEYN-OBJECTS'
      : 'VEYN-SELECTS';

  return (
    <main className="product-page-wrapper">
      {/* 1. Header with AnnouncementBar, Navbar, MainCategories & SubCategories */}
      <StoreHeader initialCategory={initialCat} />

      {/* 2. Product Details Component */}
      <ProductDetail product={product} />

      {/* 3. Modern VEYNCORE Footer */}
      <Footer />
    </main>
  );
}
