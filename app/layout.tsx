import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { BoltBadge } from '@/components/bolt-badge';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'PGP Key Anatomy Visualizer',
  description: 'Analyze and visualize the structure of PGP keys with detailed breakdowns of fingerprints, key IDs, UIDs, subkeys, and usage flags.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <BoltBadge />
      </body>
    </html>
  );
}