import type { Metadata } from "next";
import { Inter, Roboto, Rozha_One } from "next/font/google";
// import "./globals.css"; // REMOVED: Render-blocking CSS moved to deferred loading
import ZeroCSSBlocking, { ultraCriticalCSS } from '../components/ZeroCSSBlocking';
import { ThemeProvider } from "../context/ThemeContext";
import { LightboxProvider } from "../context/LightboxContext";
import { CartProvider } from "../context/CartContext";
import { LanguageProvider } from "../context/LanguageContext";
import I18nProvider from "../components/I18nProvider";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Breadcrumbs from "../components/Breadcrumbs";
import dynamic from 'next/dynamic';

// Only dynamically import client-side components
const ClientProviders = dynamic(() => import("../components/ClientProviders"), {
  loading: () => null,
});

const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
  preload: true,
});

const roboto = Roboto({ 
  weight: ['400', '500', '700'],
  subsets: ["latin"],
  display: 'swap',
  preload: true,
});

const rozhaOne = Rozha_One({ 
  weight: '400',
  subsets: ["latin"],
  display: 'block',
  preload: true,
  variable: '--font-rozha-one',
});


export const metadata: Metadata = {
  metadataBase: new URL('https://eastatwest.com'),
  title: {
    default: "East @ West — Authentic Lebanese Restaurant in Brussels | Mediterranean Cuisine",
    template: "%s | East @ West — Lebanese Restaurant Brussels"
  },
  description: "Discover authentic Lebanese cuisine at East @ West in Brussels. Fresh Mediterranean dishes, traditional mezze, and warm hospitality. Reserve your table for an unforgettable dining experience.",
  keywords: [
    "Lebanese restaurant Brussels",
    "Mediterranean cuisine Brussels", 
    "Middle Eastern food Brussels",
    "authentic Lebanese food",
    "Brussels restaurant",
    "mezze Brussels",
    "Lebanese catering Brussels",
    "Restaurant Guru recommended",
    "halal restaurant Brussels",
    "vegetarian Mediterranean food",
    "Lebanese takeaway Brussels",
    "Brussels dining",
    "East at West restaurant"
  ],
  authors: [{ name: "East @ West Restaurant" }],
  creator: "East @ West Lebanese Restaurant",
  publisher: "East @ West",
  category: "Restaurant",
  classification: "Lebanese Mediterranean Restaurant",
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: ["fr_BE", "nl_BE"],
    url: "https://eastatwest.com",
    siteName: "East @ West Lebanese Restaurant",
    title: "East @ West — Authentic Lebanese Restaurant in Brussels",
    description: "Experience authentic Lebanese cuisine in the heart of Brussels. Fresh Mediterranean dishes, traditional recipes, and warm hospitality await you.",
    images: [
      {
        url: "/images/banner.webp",
        width: 1200,
        height: 630,
        alt: "East @ West Lebanese Restaurant interior in Brussels",
        type: "image/webp",
      },
      {
        url: "/images/gallery/mezze-selection.webp",
        width: 800,
        height: 600,
        alt: "Traditional Lebanese mezze selection at East @ West",
        type: "image/webp",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@eastatwest",
    creator: "@eastatwest",
    title: "East @ West — Authentic Lebanese Restaurant in Brussels",
    description: "Experience authentic Lebanese cuisine in Brussels. Fresh Mediterranean dishes, traditional recipes, warm hospitality. Book your table today!",
    images: [
      {
        url: "/images/banner.webp",
        alt: "East @ West Lebanese Restaurant Brussels",
      }
    ],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: "verification_token_here", // TODO: Add actual verification token
    // yandex: "verification_token",
    // yahoo: "verification_token",
  },
  alternates: {
    canonical: "https://eastatwest.com",
    languages: {
      'en': 'https://eastatwest.com',
      'fr': 'https://eastatwest.com/fr',
      'nl': 'https://eastatwest.com/nl',
    },
  },
  other: {
    'geo.region': 'BE-BRU',
    'geo.placename': 'Brussels',
    'geo.position': '50.8503;4.3517', // Brussels coordinates
    'ICBM': '50.8503, 4.3517',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Resource hints for critical performance */}
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        
        {/* Critical fonts are now loaded via Next.js font optimization */}
        {/* LCP element uses system fonts to avoid render blocking */}
        
        {/* Hreflang and canonical URLs for international SEO */}
        <link rel="canonical" href="https://eastatwest.com" />
        <link rel="alternate" hrefLang="en" href="https://eastatwest.com" />
        <link rel="alternate" hrefLang="fr" href="https://eastatwest.com/fr" />
        <link rel="alternate" hrefLang="nl" href="https://eastatwest.com/nl" />
        <link rel="alternate" hrefLang="x-default" href="https://eastatwest.com" />
        
        {/* PWA Manifest for mobile optimization */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#F5F1E6" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="East @ West" />

        {/* Restaurant Guru CSS - inlined to prevent render blocking */}
        <style dangerouslySetInnerHTML={{
          __html: `
            /* Restaurant Guru Award Badge Styles */
            #rest_circ5 a{border: none;}
            #rest_circ5 {cursor: pointer;display: flex;align-self: center;width: 150px !important;height: 150px !important;font: 400 14px/normal 'Helvetica Neue', 'Arial', sans-serif;color: #fff;border: 4px solid rgba(255,255,255,.9);overflow: hidden;letter-spacing: normal;padding: 0;border-radius: 100%;box-sizing: border-box;}
            .elementor-widget-container #rest_circ5 {margin: 0 auto;}
            #rest_circ5 .circ_cont{display: flex;flex-direction: column;justify-content: center;align-items: center;height: 100%;width: 100%;padding: 5px 0 10px;margin: 0;background-color: rgba(255,255,255,.9);border: 4px solid #b71c1c;border-radius: 100%;box-sizing: border-box;}
            #rest_circ5 .circ_cont a:before {display: none;}
            #rest_circ5 .circ_img {display: block;margin: 0 auto;width: 36px;height: 36px;background-repeat: no-repeat;font-size: 0;}
            #rest_circ5 .circ_top_title, #rest_circ5 a.circ_top_title, #rest_circ5 a.circ_top_title:visited {text-decoration: none;font-size: 13px;color: #000 !important;text-align: center;display: block;margin: 0 auto;box-shadow: none;letter-spacing: normal;text-transform: none;}
            #rest_circ5 span:first-of-type{text-transform: uppercase;background-color: #b71c1c;margin: 2px auto 4px;width: 100%;display: flex;min-height: 32px;align-items: center;justify-content: center;line-height: 13px;padding: 6px 1px;box-sizing: border-box;text-align: center;text-shadow: none;color: #fff !important;text-decoration: none;border: none;letter-spacing: normal;}
            #rest_circ5 a > span:first-of-type {background-color: transparent;color: #000;width: auto;}
            #rest_circ5 .circ_bot_title, #rest_circ5 a.circ_bot_title, #rest_circ5 a.circ_bot_title:visited {text-decoration: none;font-size: 13px;color: #000 !important;display: inline-flex;align-items: center;min-height: 24px;max-width: 65%;margin: 0 auto;line-height: 12px;text-align: center !important;white-space: initial;box-shadow: none;letter-spacing: normal;text-transform: none;}
            #rest_circ5 a, #rest_circ5 span {font: 400 14px/normal 'Helvetica Neue', 'Arial', sans-serif !important;}
            #rest_circ5 span.f13 {font-size: 13px !important;}
            #rest_circ5 span.f12 {font-size: 12px !important;}
            #rest_circ5 div {width: 100%;}
            #rest_circ5 span {line-height: 1 !important;}
            #rest_circ5 a.circ_bot_title {line-height: 12px !important;padding-left: 1px;padding-right: 1px;}
            #rest_circ5 a {font-size: 13px !important;color: #000;text-decoration: none !important;text-shadow: none;}
            #rest_circ5 p {margin: 0 !important;width: 100%;text-align: center;text-indent: 0;}
            #rest_circ5 p::before, #rest_circ5 p::after {display: none;}
            #rest_circ5 span {color: #000000;}
            #rest_circ5 br {display: none;}
            #rest_circ5 a.circ_bot_title.circ11 {font-size: 11px !important;}
            #rest_circ5 a.circ_bot_title.circ10 {font-size: 10px !important;line-height: 1.1 !important;}
            #rest_circ5 a.circ_bot_title.circ9 {font-size: 9px !important;line-height: 1.1 !important;}
          `
        }} />

        {/* Preload critical images - removed banner.webp as it's not used on all pages */}
        
        {/* Inline ultra-critical CSS for immediate first paint */}
        <style dangerouslySetInnerHTML={{ __html: ultraCriticalCSS }} />
        <script dangerouslySetInnerHTML={{
          __html: `
            (function() {
              try {
                var theme = localStorage.getItem('theme') || 'light';
                if (theme === 'dark') {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch(e) {}
            })();
          `
        }} />
      </head>
      <body className={`${inter.className} ${roboto.className} ${rozhaOne.className}`}>
        <I18nProvider>
          <LanguageProvider>
            <ThemeProvider>
              <CartProvider>
                <LightboxProvider>
                  <ZeroCSSBlocking />
                  <div className="min-h-screen flex flex-col">
                    <Header />
                    <Breadcrumbs />
                    <main className="flex-1">
              {children}
                    </main>
                    <Footer />
                  </div>
                  <ClientProviders />
                </LightboxProvider>
              </CartProvider>
            </ThemeProvider>
          </LanguageProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
