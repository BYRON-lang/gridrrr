'use client';

import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import PerformanceMonitor from '@/components/PerformanceMonitor';
import { useEffect } from 'react';

// Store original console methods
const originalConsole = {
  log: console.log,
  warn: console.warn,
  error: console.error,
  info: console.info,
};

// Apply suppression immediately
if (process.env.NODE_ENV === 'production') {
  console.log = () => {};
  console.warn = () => {};
  console.error = () => {};
  console.info = () => {};
}

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // Show welcome message in development
    if (process.env.NODE_ENV !== 'production') {
      originalConsole.log(
        "%c🚀 Welcome to Gridrr (Development Mode)",
        "color: #4f46e5; font-size: 24px; font-weight: bold;"
      );
    }
  }, []);

  return (
    <>
      {children}
      <Analytics />
      <SpeedInsights />
      <PerformanceMonitor />
    </>
  );
}
