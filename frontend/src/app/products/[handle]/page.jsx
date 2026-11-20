import React from 'react';
import AnnouncementBar from '@/components/AnnouncementBar/AnnouncementBar';
import Navbar from '@/components/Navbar/Navbar';
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
      {/* 1. Announcement Bar */}
      <AnnouncementBar />

      {/* 2. Primary Navigation */}
      <Navbar activeMainCategory="VEYN-SELECTS" />

      {/* 3. Product Details Component */}
      <ProductDetail product={product} />

      {/* 4. Modern VEYNCORE Footer */}
      <Footer />
    </main>
  );
}
