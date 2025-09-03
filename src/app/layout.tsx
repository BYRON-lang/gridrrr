import type { Metadata } from "next";
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Gridrr - Curated Design Inspirations',
    template: '%s | Gridrr',
  },
  description: 'Discover and share the best design inspirations. Transform your ideas into stunning visual stories with our curated collection of designs and websites.',
  keywords: ['design', 'inspiration', 'UI/UX', 'web design', 'graphic design', 'design portfolio', 'design showcase'],
  authors: [{ name: 'Gridrr Team' }],
  creator: 'Gridrr',
  publisher: 'Gridrr',
  metadataBase: new URL('https://gridrr.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Gridrr - Curated Design Inspirations',
    description: 'Discover and share the best design inspirations. Transform your ideas into stunning visual stories.',
    url: 'https://gridrr.com',
    siteName: 'Gridrr',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Gridrr - Curated Design Inspirations',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Gridrr - Curated Design Inspirations',
    description: 'Discover and share the best design inspirations. Transform your ideas into stunning visual stories.',
    images: ['/twitter-image.jpg'],
    creator: '@gridrr',
  },
  manifest: '/manifest.json',
  themeColor: '#000000',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Gridrr',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased" style={{ fontFamily: 'var(--font-sans)' }}>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
