import './globals.css';
import { Inter, Dosis } from 'next/font/google';
import { CartProvider } from '@/context/CartContext';
import { AuthProvider } from '@/context/AuthContext';
import CartDrawer from '@/components/CartDrawer/CartDrawer';
import AuthModal from '@/components/Account/AuthModal';
import WhatsAppCheckoutModal from '@/components/Checkout/WhatsAppCheckoutModal';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  weight: ['400', '500', '600', '700'],
});

const dosis = Dosis({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-dosis',
  weight: ['400', '500', '600', '700', '800'],
});

export const metadata = {
  title: 'Veyncore',
  description: 'Official Veyncore Store',
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
    <html lang="en" className={`${inter.variable} ${dosis.variable}`}>
      <head>
        <link rel="icon" type="image/svg+xml" href="/icons/favicon.svg" />
        <link rel="shortcut icon" href="/icons/favicon.svg" />
        <link rel="apple-touch-icon" href="/icons/favicon.svg" />
        <link rel="preconnect" href="https://res.cloudinary.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        {/* Preload critical LCP Hero Image for immediate early discovery */}
        <link
          rel="preload"
          as="image"
          href="https://res.cloudinary.com/sod0mks1/image/upload/f_auto,q_auto,w_650,c_limit/v1795542507/veyncore_uploads/heroimg01-1795542507039-6510.jpg"
          fetchPriority="high"
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
