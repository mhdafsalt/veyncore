import './globals.css';
import { CartProvider } from '@/context/CartContext';
import CartDrawer from '@/components/CartDrawer/CartDrawer';

export const metadata = {
  title: 'BLURG SELECTS – BLURGVILLAGE',
  description: 'Official header, navigation and cart drawer of BLURGVILLAGE',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Dosis:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <CartProvider>
          {children}
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
