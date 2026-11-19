import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { APP_METADATA } from '@/lib/constants';

export const metadata = {
  title: APP_METADATA.title,
  description: APP_METADATA.description,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="app-container">
          
        </div>
      </body>
    </html>
  );
}
