import './globals.css';
import { CartProvider } from '@/context/CartContext';
import { AuthProvider } from '@/context/AuthContext';
import CartDrawer from '@/components/CartDrawer/CartDrawer';
import AuthModal from '@/components/Account/AuthModal';
import WhatsAppCheckoutModal from '@/components/Checkout/WhatsAppCheckoutModal';

export const metadata = {
  metadataBase: new URL('https://veyncore.in'),
  title: {
    default: 'VEYNCORE | Contemporary Luxury Denim & Utilitarian Streetwear',
    template: '%s | VEYNCORE',
  },
  description:
    'Official VEYNCORE Store. Contemporary tailored raw denim, structured silhouettes, baggy jeans, semi bootcut cuts, and premium utilitarian streetwear craftsmanship.',
  keywords: [
    'VEYNCORE',
    'raw denim',
    'selvedge denim',
    'baggy jeans',
    'bootcut denim',
    'streetwear india',
    'luxury streetwear',
    'utilitarian fashion',
    'kerala streetwear',
  ],
  authors: [{ name: 'VEYNCORE' }],
  creator: 'VEYNCORE',
  publisher: 'VEYNCORE',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: 'https://veyncore.in',
  },
  openGraph: {
    title: 'VEYNCORE | Contemporary Luxury Denim & Utilitarian Streetwear',
    description:
      'Official VEYNCORE Store. Handcrafted raw selvedge denim, structured silhouettes, and luxury utility artifacts.',
    url: 'https://veyncore.in',
    siteName: 'VEYNCORE',
    locale: 'en_IN',
    type: 'website',
    images: [
      {
        url: 'https://res.cloudinary.com/sod0mks1/image/upload/f_auto,q_auto,w_1200,c_limit/v1795542507/veyncore_uploads/heroimg01-1795542507039-6510.jpg',
        width: 1200,
        height: 630,
        alt: 'VEYNCORE Luxury Streetwear & Raw Denim',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VEYNCORE | Contemporary Luxury Denim & Streetwear',
    description:
      'Official VEYNCORE Store. Handcrafted raw selvedge denim and luxury utility artifacts.',
    images: [
      'https://res.cloudinary.com/sod0mks1/image/upload/f_auto,q_auto,w_1200,c_limit/v1795542507/veyncore_uploads/heroimg01-1795542507039-6510.jpg',
    ],
  },
  icons: {
    icon: [
      { url: '/icons/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/icons/favicon.svg',
    apple: '/icons/favicon.svg',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/svg+xml" href="/icons/favicon.svg" />
        <link rel="shortcut icon" href="/icons/favicon.svg" />
        <link rel="apple-touch-icon" href="/icons/favicon.svg" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://res.cloudinary.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        {/* Preload critical Veyncore Loader SVG Logo for instant Frame-0 intro */}
        <link
          rel="preload"
          as="image"
          type="image/svg+xml"
          href="/images/veyncoreLogo_black.svg"
          fetchPriority="high"
        />
        {/* Preload critical Inter Latin font file to eliminate font-swap layout shift */}
        <link
          rel="preload"
          href="https://fonts.gstatic.com/s/inter/v20/UcC73FwrK3iLTeHuS_nVMrMxCp50SjIa1ZL7W0Q5nw.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        {/* Preload critical LCP Hero Image for immediate early discovery */}
        <link
          rel="preload"
          as="image"
          href="https://res.cloudinary.com/sod0mks1/image/upload/f_auto,q_auto,w_650,c_limit/v1795542507/veyncore_uploads/heroimg01-1795542507039-6510.jpg"
          fetchPriority="high"
        />
        {/* Asynchronous Non-Render-Blocking Google Fonts */}
        <link
          rel="preload"
          as="style"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var l=document.createElement('link');l.rel='stylesheet';l.href='https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap';document.head.appendChild(l);})();`,
          }}
        />
        <noscript>
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"
          />
        </noscript>
        {/* Schema.org Organization and WebSite Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@graph': [
                {
                  '@type': 'Organization',
                  '@id': 'https://veyncore.in/#organization',
                  name: 'VEYNCORE',
                  url: 'https://veyncore.in',
                  logo: {
                    '@type': 'ImageObject',
                    url: 'https://veyncore.in/images/veyncoreLogo_black.svg',
                  },
                  sameAs: [
                    'https://www.instagram.com/veyncore.in',
                    'https://pin.it/1bxJr9Grd',
                  ],
                  contactPoint: {
                    '@type': 'ContactPoint',
                    telephone: '+91-8848419616',
                    contactType: 'customer service',
                    areaServed: 'IN',
                    availableLanguage: ['en', 'ml'],
                  },
                },
                {
                  '@type': 'WebSite',
                  '@id': 'https://veyncore.in/#website',
                  url: 'https://veyncore.in',
                  name: 'VEYNCORE',
                  publisher: {
                    '@id': 'https://veyncore.in/#organization',
                  },
                  potentialAction: {
                    '@type': 'SearchAction',
                    target: 'https://veyncore.in/collections/all-drops?search={search_term_string}',
                    'query-input': 'required name=search_term_string',
                  },
                },
              ],
            }),
          }}
        />
      </head>
      <body>
        <AuthProvider>
          <CartProvider>
            {children}
            <CartDrawer />
            <WhatsAppCheckoutModal />
            <AuthModal />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
