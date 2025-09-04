'use client';

import type { Metadata } from "next";
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import PerformanceMonitor from '@/components/PerformanceMonitor';
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

import { useEffect } from 'react';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  useEffect(() => {
    // Suppress console logs in production
    if (process.env.NODE_ENV === 'production') {
      const originalConsoleLog = console.log;
      const originalConsoleWarn = console.warn;
      const originalConsoleError = console.error;
      
      console.log = function() {};
      console.warn = function() {};
      console.error = function() {};
      
      // Show welcome message
      console.log = function(...args) {
        if (args[0] && typeof args[0] === 'string' && args[0].includes('%c🚀 Welcome to Gridrr!')) {
          originalConsoleLog.apply(console, args);
        }
      };
      
      // Initial welcome message
      console.log(
        "%c🚀 Welcome to Gridrr!",
        "color: #4f46e5; font-size: 24px; font-weight: bold;"
      );
      
      // Restore original console methods after showing welcome message
      setTimeout(() => {
        console.log = process.env.NODE_ENV === 'development' ? originalConsoleLog : function() {};
        console.warn = process.env.NODE_ENV === 'development' ? originalConsoleWarn : function() {};
        console.error = process.env.NODE_ENV === 'development' ? originalConsoleError : function() {};
      }, 1000);
    } else {
      // Development mode - show welcome message but keep other logs
      console.log(
        "%c🚀 Welcome to Gridrr (Development Mode)",
        "color: #4f46e5; font-size: 24px; font-weight: bold;"
      );
    }
  }, []);
  return (
    <html lang="en">
      <body className="font-sans antialiased" style={{ fontFamily: 'var(--font-sans)' }}>
        {children}
        <Analytics />
        <SpeedInsights />
        <PerformanceMonitor />
      </body>
    </html>
  );
}
