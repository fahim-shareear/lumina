import '../globals.css';
import { AuthProvider } from '@/components/AuthProvider';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Toaster } from 'react-hot-toast';

export const metadata = {
  title: 'Lumina – Curated Luxury Marketplace',
  description: 'Discover and sell extraordinary products on Lumina, the curated luxury marketplace.',
};

export default async function RootLayout({ children }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <div className="noise" />
        <AuthProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
          <Toaster
            position="bottom-right"
            toastOptions={{
              className: 'toast-custom',
              style: {
                background: '#1e1e28',
                color: '#f0ede6',
                border: '1px solid #3a3a50',
                fontFamily: "'DM Sans', sans-serif",
              },
              success: {
                iconTheme: { primary: '#c9a84c', secondary: '#0a0a0f' },
              },
              error: {
                iconTheme: { primary: '#e05454', secondary: '#f0ede6' },
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
