import { ThemeProvider } from 'next-themes';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/lib/AuthContext';
import '@/styles/globals.css';

export const metadata = {
  title: 'Scanly — Digital Health Records',
  description: 'Secure portable digital health records accessible via QR code',
  manifest: '/manifest.json',
  themeColor: '#0ea5e9',
  appleWebApp: { capable: true, statusBarStyle: 'default', title: 'Scanly' },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Scanly" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <script src="/register-sw.js" defer />
      </head>
      <body>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <AuthProvider>
            {children}
            <Toaster
              position="top-right"
              toastOptions={{
                style: {
                  background: 'var(--bg-secondary)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border)',
                  borderRadius: '12px',
                  fontSize: '14px',
                },
                success: { iconTheme: { primary: '#14b8a6', secondary: 'white' } },
                error: { iconTheme: { primary: '#ef4444', secondary: 'white' } },
              }}
            />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
