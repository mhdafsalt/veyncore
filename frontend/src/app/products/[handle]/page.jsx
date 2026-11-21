import React from 'react';
import StoreHeader from '@/components/StoreHeader/StoreHeader';
import Footer from '@/components/Footer/Footer';
import ProductDetail from '@/components/ProductDetail/ProductDetail';
import { getProductByHandle, getAllProductHandles } from '@/data/productsData';

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
  const product = getProductByHandle(handle);

  return {
    title: `${product.title} | VEYNCORE`,
    description: `${product.title} — ${product.fit || 'Baggy Fit'}. Exclusive streetwear denim handpicked for VEYNCORE. Free nationwide delivery & no-cost EMI available.`,
    openGraph: {
      title: `${product.title} | VEYNCORE`,
      description: `${product.title} — ${product.salePrice}. Official VEYNCORE store.`,
      images: [
        {
          url: product.images?.[0] || '/images/products/artic-blue-wide.jpg',
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
  const product = getProductByHandle(handle);

  return (
    <main className="product-page-wrapper">
      {/* 1. Header with AnnouncementBar, Navbar, MainCategories & SubCategories */}
      <StoreHeader initialCategory={product.category || 'VEYN-SELECTS'} />

      {/* 2. Product Details Component */}
      <ProductDetail product={product} />

      {/* 3. Modern VEYNCORE Footer */}
      <Footer />
    </main>
  );
}
