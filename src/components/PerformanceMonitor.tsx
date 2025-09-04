'use client';

import { useEffect } from 'react';
import { onCLS, onFCP, onLCP, onTTFB, onINP, type Metric } from 'web-vitals';

function sendToAnalytics(metric: Metric) {
  // Send to your analytics service
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
    // Example: Send to Google Analytics, Vercel Analytics, etc.
    console.log('Web Vital:', metric);
    
    // If using Vercel Analytics
    if (window.va) {
      window.va('event', {
        name: 'web_vital',
        data: {
          name: metric.name,
          value: metric.value,
          rating: metric.rating,
        }
      });
    }
  }
}

export default function PerformanceMonitor() {
  useEffect(() => {
    // Track Core Web Vitals
    onCLS(sendToAnalytics);
    onFCP(sendToAnalytics);
    onLCP(sendToAnalytics);
    onTTFB(sendToAnalytics);
    onINP(sendToAnalytics);
  }, []);

  return null; // This component doesn't render anything
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    va?: (event: 'beforeSend' | 'event' | 'pageview', properties?: unknown) => void;
  }
}