import React from 'react';
import AboutPage from '@/components/AboutPage/AboutPage';

export const metadata = {
  title: 'About VEYNCORE | Contemporary Streetwear & Curated Fashion',
  description:
    'Discover VEYNCORE, an online contemporary streetwear brand offering modern oversized T-shirts, baggy pants, denim, and curated fashion pieces through VEYN-SELECTS.',
  keywords: [
    'VEYNCORE',
    'VEYNCORE streetwear',
    'VEYNCORE clothing',
    'online streetwear store',
    'contemporary streetwear',
    'oversized T-shirts',
    'baggy pants',
    'denim streetwear',
    'modern streetwear fashion',
    'curated fashion collections',
    'VEYN-SELECTS',
    'VEYN-OBJECTS',
    'streetwear India',
  ],
  alternates: {
    canonical: 'https://veyncore.in/pages/about',
  },
  openGraph: {
    title: 'About VEYNCORE | Contemporary Streetwear & Curated Fashion',
    description:
      'Discover VEYNCORE, an online contemporary streetwear brand offering modern oversized T-shirts, baggy pants, denim, and curated fashion pieces through VEYN-SELECTS.',
    url: 'https://veyncore.in/pages/about',
    siteName: 'VEYNCORE',
    locale: 'en_IN',
    type: 'website',
    images: [
      {
        url: 'https://veyncore.in/images/veyncoreLogo_black.svg',
        width: 1200,
        height: 630,
        alt: 'About VEYNCORE - Contemporary Streetwear & Curated Fashion',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About VEYNCORE | Contemporary Streetwear & Curated Fashion',
    description:
      'Discover VEYNCORE, an online contemporary streetwear brand offering modern oversized T-shirts, baggy pants, denim, and curated fashion pieces through VEYN-SELECTS.',
    images: ['https://veyncore.in/images/veyncoreLogo_black.svg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function Page() {
  return <AboutPage />;
}
