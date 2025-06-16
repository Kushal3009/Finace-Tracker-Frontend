'use client';

import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from './components/Navbar';
import { usePathname } from 'next/navigation';
import { Toaster } from 'react-hot-toast';
import { CurrencyProvider } from './components/CurrencyContext';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const authRoutes = ['/login', '/signup'];
  const isAuthPage = authRoutes.includes(pathname);

  return (
    <html lang="en">
      <body className={inter.className}>
        <CurrencyProvider>
          {!isAuthPage && <Navbar />}
          {children}
          <Toaster
            position="top-center"
            toastOptions={{
              style: {
                background: '#18181b',
                color: '#fff',
                border: '1px solid #a78bfa',
                borderRadius: '0.75rem',
                fontSize: '1rem',
                padding: '1rem 1.5rem',
                boxShadow: '0 4px 32px 0 rgba(80,0,200,0.15)',
              },
              success: {
                style: { background: '#22c55e', color: '#fff' },
                iconTheme: { primary: '#fff', secondary: '#22c55e' },
              },
              error: {
                style: { background: '#ef4444', color: '#fff' },
                iconTheme: { primary: '#fff', secondary: '#ef4444' },
              },
            }}
          />
        </CurrencyProvider>
      </body>
    </html>
  );
}
