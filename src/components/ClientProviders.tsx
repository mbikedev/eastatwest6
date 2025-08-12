'use client'

import dynamic from 'next/dynamic';
import { Toaster } from 'react-hot-toast';

// Dynamically import heavy components for better performance
const LightboxWrapper = dynamic(() => import('./LightboxWrapper'), {
  ssr: false,
  loading: () => null
});

const ScrollToTopButton = dynamic(() => import('./ScrollToTopButton'), {
  ssr: false,
  loading: () => null
});

export default function ClientProviders() {
  return (
    <>
      <ScrollToTopButton />
      <LightboxWrapper />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            style: {
              background: '#10B981',
            },
          },
          error: {
            style: {
              background: '#EF4444',
            },
          },
        }}
      />
    </>
  );
} 