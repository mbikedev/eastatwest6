"use client";
import { useEffect, useState } from 'react';

const ScrollToTopButton = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button
      onClick={scrollToTop}
      aria-label="Scroll to top"
      className={`fixed z-50 bottom-2 right-1 md:bottom-6 md:right-8 p-3 rounded-full bg-gray-900/50 border-2 border-green-700 text-white shadow-lg transition-all duration-200
        ${visible ? 'opacity-100 pointer-events-auto scale-100' : 'opacity-0 pointer-events-none scale-90'}
        hover:shadow-2xl hover:scale-110 focus:outline-none`}
      style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.15)' }}
    >
      <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <path d="M5 15l7-7 7 7" />
      </svg>
    </button>
  );
};

export default ScrollToTopButton;
