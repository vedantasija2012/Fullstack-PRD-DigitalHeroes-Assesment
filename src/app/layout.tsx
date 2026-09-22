import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Digital Heroes Platform',
  description: 'Golf performance tracking, prize draws, and charity impact.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-slate-900 text-slate-100 min-h-screen`}>
        {/* Pass 'admin' or 'subscriber' to view role-specific links in header */}
        <Navbar role="admin" />
        {children}
      </body>
    </html>
  );
}