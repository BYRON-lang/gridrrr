import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import ClientLayout from './client-layout';

export const metadata: Metadata = {
  title: {
    default: 'Gridrr - Curated Design Inspirations',
    template: '%s | Gridrr',
  },
  description: 'Discover and share the best design inspirations. Transform your ideas into stunning visual stories with our curated collection of designs and websites.',
};

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
