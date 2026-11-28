import React from 'react';
import AboutPage from '@/components/AboutPage/AboutPage';

export const metadata = {
  title: 'About VEYNCORE | IDENTITY RUNS DEEP',
  description:
    'VEYNCORE is an independent online fashion store in India, bringing together contemporary streetwear, everyday essentials and carefully curated fashion pieces. Built around individuality, self-expression and modern aesthetics.',
  keywords: [
    'VEYNCORE',
    'IDENTITY RUNS DEEP',
    'VEYNCORE streetwear',
    'VEYNCORE clothing',
    'online streetwear store',
    'contemporary streetwear India',
    'oversized T-shirts',
    'baggy jeans',
    'relaxed-fit clothing',
    'denim streetwear',
    'lifestyle accessories',
    'curated fashion collections',
    'VEYN-SELECTS',
    'VEYN-OBJECTS',
    'streetwear India',
  ],
  alternates: {
    canonical: 'https://veyncore.in/pages/about',
  },
  openGraph: {
    title: 'About VEYNCORE | IDENTITY RUNS DEEP',
    description:
      'VEYNCORE is an independent online fashion store in India, bringing together contemporary streetwear, everyday essentials and carefully curated fashion pieces.',
    url: 'https://veyncore.in/pages/about',
    siteName: 'VEYNCORE',
    locale: 'en_IN',
    type: 'website',
    images: [
      {
        url: 'https://veyncore.in/images/veyncoreLogo_black.svg',
        width: 1200,
        height: 630,
        alt: 'About VEYNCORE - IDENTITY RUNS DEEP',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About VEYNCORE | IDENTITY RUNS DEEP',
    description:
      'VEYNCORE is an independent online fashion store in India, bringing together contemporary streetwear, everyday essentials and carefully curated fashion pieces.',
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
