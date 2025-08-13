'use client'

// Import React hooks for state management and effects
import { useState, useEffect, useRef } from 'react'
// Import translation hook for internationalization
import { useTranslation } from 'react-i18next'
// Import theme context for dark/light mode
import { useTheme } from '../context/ThemeContext'
// Import Framer Motion for animations
import { motion, easeInOut } from 'framer-motion'
// Import Next.js components for routing and images
import Link from 'next/link'
import Image from 'next/image'
// Import award images

export default function HomePage() {
  // Translation hook for multi-language support
  const { t } = useTranslation('common')
  // Theme context for dark/light mode switching
  const { theme } = useTheme()

  // Video reference for hero section autoplay
  const videoRef = useRef<HTMLVideoElement>(null)



  // Smart video loading based on connection and user interaction
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    video.muted = true

    // Check connection quality and device capabilities
    const getConnectionInfo = () => {
      // @ts-ignore - Navigator connection is experimental
      const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection
      const isSlowConnection = connection?.effectiveType === 'slow-2g' || connection?.effectiveType === '2g'
      const isSaveData = connection?.saveData === true
      const isLowMemory = 'deviceMemory' in navigator && (navigator as any).deviceMemory < 4
      
      return { isSlowConnection, isSaveData, isLowMemory }
    }

    const { isSlowConnection, isSaveData, isLowMemory } = getConnectionInfo()
    
    // Skip video loading for poor connections or data saver mode
    if (isSlowConnection || isSaveData || isLowMemory) {
      console.log('Skipping video load due to connection/device constraints')
      return
    }

    const loadVideo = () => {
      // Load video sources progressively
      const mp4Src = video.getAttribute('data-src-mp4')
      const webmSrc = video.getAttribute('data-src-webm')
      
      if (mp4Src && webmSrc) {
        // Prefer WebM for smaller size, fallback to MP4
        const sourceWebm = document.createElement('source')
        sourceWebm.src = webmSrc
        sourceWebm.type = 'video/webm'
        video.appendChild(sourceWebm)
        
        const sourceMp4 = document.createElement('source')
        sourceMp4.src = mp4Src
        sourceMp4.type = 'video/mp4'
        video.appendChild(sourceMp4)
        
        video.load()
      }
    }

    const playVideo = async () => {
      try {
        await video.play()
        console.log('Video playing successfully')
      } catch (error) {
        console.log('Video autoplay failed:', error)
      }
    }

    // Progressive loading strategy
    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !video.hasAttribute('data-loaded')) {
          video.setAttribute('data-loaded', 'true')
          loadVideo()
          
          // Play when ready
          video.addEventListener('canplaythrough', playVideo, { once: true })
        }
      })
    }

    // Load video when hero section is visible
    const observer = new IntersectionObserver(handleIntersection, {
      threshold: 0.25 // Load when 25% visible
    })
    
    observer.observe(video)

    // Also load on user interaction (click, scroll, touch)
    const loadOnInteraction = () => {
      if (!video.hasAttribute('data-loaded')) {
        video.setAttribute('data-loaded', 'true')
        loadVideo()
        video.addEventListener('canplaythrough', playVideo, { once: true })
      }
    }

    const events = ['click', 'scroll', 'touchstart', 'keydown']
    events.forEach(event => {
      document.addEventListener(event, loadOnInteraction, { once: true, passive: true })
    })

    return () => {
      observer.disconnect()
      events.forEach(event => {
        document.removeEventListener(event, loadOnInteraction)
      })
      video.removeEventListener('canplaythrough', playVideo)
    }
  }, [])

  // ===== MOCK DATA SECTION =====
  // Upcoming Events data for the events section
  const [upcomingEvents] = useState([
    {
      id: 1,
      titleKey: "upcomingEvents.wineTasting.title",
      dateKey: "upcomingEvents.wineTasting.date",
      timeKey: "upcomingEvents.wineTasting.time",
      descriptionKey: "upcomingEvents.wineTasting.description",
      icon: "🍷"
    },
    {
      id: 2,
      titleKey: "upcomingEvents.chefTable.title",
      dateKey: "upcomingEvents.chefTable.date",
      timeKey: "upcomingEvents.chefTable.time",
      descriptionKey: "upcomingEvents.chefTable.description",
      icon: "👨‍🍳"
    },
    {
      id: 3,
      titleKey: "upcomingEvents.cookingClass.title",
      dateKey: "upcomingEvents.cookingClass.date",
      timeKey: "upcomingEvents.cookingClass.time",
      descriptionKey: "upcomingEvents.cookingClass.description",
      icon: "🥘"
    }
  ])

  // Note: Seasonal promotions feature is available but not currently displayed

  // ===== ANIMATION VARIANTS SECTION =====
  // Container animation variants for staggered animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  }

  // Individual item animation variants
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6
      }
    }
  }

  // Floating animation variants for background elements
  const floatingVariants = {
    float: {
      y: [-10, 10, -10],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: easeInOut
      }
    }
  }

  // ===== SEO SCHEMA SECTION =====
  // Comprehensive JSON-LD Schema for Restaurant SEO optimization
  const schema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "@id": "https://eastatwest.com/#restaurant",
    "name": "East @ West",
    "alternateName": ["East at West", "EastAtWest"],
    "description": "Authentic Lebanese restaurant in Brussels offering traditional Mediterranean cuisine, fresh mezze, and warm hospitality in the heart of Belgium's capital.",
    "url": "https://eastatwest.com",
    "logo": "https://eastatwest.com/images/logo.webp",
    "image": [
      "https://eastatwest.com/images/banner.webp",
      "https://eastatwest.com/images/gallery/falafel.webp",
      "https://eastatwest.com/images/gallery/kebbe.webp",
      "https://eastatwest.com/images/about-us.webp"
    ],
    "servesCuisine": ["Lebanese", "Mediterranean", "Middle Eastern", "Arab", "Levantine"],
    "priceRange": "€€",
    "currenciesAccepted": "EUR",
    "paymentAccepted": ["Cash", "Credit Card", "Debit Card", "Bancontact"],
    "hasMenu": {
      "@type": "Menu",
      "url": "https://eastatwest.com/menu",
      "inLanguage": ["en", "fr", "nl"]
    },
    "menu": "https://eastatwest.com/pdfs/menus.pdf",
    "acceptsReservations": true,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Restaurant Address", // TODO: Add actual address
      "addressLocality": "Brussels",
      "addressRegion": "Brussels-Capital Region",
      "postalCode": "1000", // TODO: Add actual postal code
      "addressCountry": "BE"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 50.8503,
      "longitude": 4.3517
    },
    "telephone": "+32-XXX-XXX-XXX", // TODO: Add actual phone
    "email": "contact@eastatwest.com", // TODO: Add actual email
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        "opens": "12:00",
        "closes": "22:00",
        "validFrom": "2024-01-01"
      }
    ],
    "specialOpeningHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": "Monday",
        "opens": null,
        "closes": null,
        "description": "Closed on Mondays"
      }
    ],
    "sameAs": [
      "https://www.facebook.com/eastatwest", // TODO: Add actual social media
      "https://www.instagram.com/eastatwest",
      "https://www.tripadvisor.com/eastatwest"
    ],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.5",
      "reviewCount": "150",
      "bestRating": "5",
      "worstRating": "1"
    },
    "award": ["Restaurant Guru Recommended 2023", "Restaurant Guru Recommended 2024"],
    "amenityFeature": [
      {
        "@type": "LocationFeatureSpecification",
        "name": "Takeaway Available",
        "value": true
      },
      {
        "@type": "LocationFeatureSpecification", 
        "name": "Catering Services",
        "value": true
      },
      {
        "@type": "LocationFeatureSpecification",
        "name": "Vegetarian Options",
        "value": true
      },
      {
        "@type": "LocationFeatureSpecification",
        "name": "Halal Options",
        "value": true
      }
    ],
    "potentialAction": [
      {
        "@type": "ReserveAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": "https://eastatwest.com/reservations",
          "inLanguage": ["en", "fr", "nl"],
          "actionPlatform": [
            "http://schema.org/DesktopWebPlatform",
            "http://schema.org/MobileWebPlatform"
          ]
        },
        "result": {
          "@type": "Reservation",
          "name": "Dining Reservation"
        }
      }
    ],
    "makesOffer": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Dine-in Service",
          "description": "Traditional Lebanese dining experience"
        }
      },
      {
        "@type": "Offer", 
        "itemOffered": {
          "@type": "Service",
          "name": "Takeaway Service",
          "description": "Lebanese food for takeaway"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service", 
          "name": "Catering Service",
          "description": "Lebanese catering for events"
        }
      }
    ]
  });

  return (
    <>
      {/* ===== SEO SCHEMA SCRIPT ===== */}
      {/* JSON-LD Schema for Restaurant SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: schema }}
      />
      {/* ===== MAIN PAGE CONTAINER ===== */}
      {/* Main page wrapper with theme-based styling */}
      <div className={`min-h-screen transition-colors duration-300 ${theme === 'dark' ? 'bg-[rgb(26,26,26)] text-[rgb(245,240,230)]' : 'bg-[rgb(245,240,230)] text-[rgb(26,26,26)]'
        }`} itemScope itemType="https://schema.org/Restaurant">

        {/* ===== HERO VIDEO SECTION ===== */}
        {/* Enhanced Hero Video Section with Background Video */}
        <header className="relative h-screen w-full overflow-hidden" role="banner" aria-label="East @ West Restaurant Hero Section">
          {/* ===== FLOATING BACKGROUND ELEMENTS ===== */}
          {/* Floating Background Elements for Visual Interest */}
          <div className="absolute inset-0 overflow-hidden z-5">
            {/* First Floating Element - Top Left */}
            <motion.div
                              className={`absolute top-20 left-10 w-32 h-32 rounded-full opacity-20 ${theme === 'dark' ? 'bg-gradient-to-r from-[rgb(26,26,26)] to-[rgb(26,26,26)]' : 'bg-gradient-to-r from-[rgb(168,213,186)] to-[rgb(168,213,186)]'
                  }`}
              variants={floatingVariants}
              animate="float"
            />
            {/* Second Floating Element - Top Right */}
            <motion.div
                              className="absolute top-40 right-20 w-48 h-48 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full opacity-20"
              variants={floatingVariants}
              animate="float"
              transition={{ delay: 1 }}
            />
            {/* Third Floating Element - Bottom Left */}
            <motion.div
                              className="absolute bottom-32 left-1/4 w-40 h-40 bg-gradient-to-r from-green-400 to-teal-400 rounded-full opacity-20"
              variants={floatingVariants}
              animate="float"
              transition={{ delay: 2 }}
            />
          </div>

          {/* ===== VIDEO BACKGROUND SECTION ===== */}
          {/* Video Background Container */}
          <div className="absolute inset-0 w-full h-full">
            {/* Hero Background Video */}
            <video
              ref={videoRef}
              className="absolute inset-0 w-full h-full object-cover z-10"
              autoPlay
              loop
              muted={true}
              playsInline
              preload="none"
              poster="/images/banner.webp"
              data-src-mp4="/videos/hero-video.mp4"
              data-src-webm="/videos/hero-video.webm"
            >
              {/* Video sources will be loaded dynamically */}
              Your browser does not support the video tag.
            </video>

            {/* ===== GRADIENT OVERLAY SECTION ===== */}
            {/* Enhanced Gradient Overlay for Text Readability */}
            <div className={`absolute inset-0 z-15 ${theme === 'dark'
              ? 'bg-gradient-to-br from-black/60 via-[rgb(26,26,26)]/30 to-[rgb(26,26,26)]/40'
              : 'bg-gradient-to-br from-black/60 via-[rgb(26,26,26)]/30 to-[rgb(26,26,26)]/40'
              }`}></div>
          </div>

          {/* ===== HERO CONTENT OVERLAY SECTION ===== */}
          {/* Enhanced Hero Content Overlay with Text and Buttons */}
          <div className="absolute inset-0 flex items-center justify-center z-20">
            {/* Hero Content Container */}
            <div className="text-center px-4 sm:px-6 lg:px-8 max-w-6xl">
              {/* Hero Emoji Icon */}
              <div className="mb-8">
                <div className="text-3xl xs:text-4xl sm:text-6xl sm-mt-8 md:text-8xl mb-2  sm:mb-4">🍽️</div>
              </div>

              {/* ===== HERO TITLE SECTION ===== */}
              {/* Main Hero Title with Animation */}
              <motion.h1
                className={`font-zcool text-4xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-7xl xl:text-7xl 2xl:text-8xl font-black mb-4 sm:mb-6 sm:bg-transparent bg-black/40 ${theme === 'dark' ? 'text-white' : 'text-[rgb(255,255,255)]'
                  }`}
                style={{ backgroundColor: 'rgba(46, 42, 42, 0.23)' }}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                {/* Hero Title Text with Styling */}
                <span
                  className="font-black text-transparent bg-clip-text italic sm:bg-white bg-[rgba(246,242,236,1)]"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 1)',
                    fontFamily: 'Rozha One, serif',
                    filter: 'drop-shadow(rgba(0, 0, 0, 0.15) 0px 25px 25px)'
                  }}
                >
                  {t("hero.headline")}
                </span>
              </motion.h1>

              {/* ===== HERO DESCRIPTION SECTION ===== */}
              {/* Hero Subtitle/Description Text - LCP Optimized */}
              <p
                className="lcp-text text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl text-[rgb(255,255,255)]/90 mb-6 sm:mb-8 md:mb-10 max-w-3xl mx-auto"
                style={{ backgroundColor: 'rgba(42, 37, 37, 0.24)' }}
              >
                {t("hero.description")}
              </p>

              {/* ===== HERO BUTTONS SECTION ===== */}
              {/* Hero Call-to-Action Buttons Container */}
              <motion.div
                className="flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-6 justify-center items-center"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                {/* ===== RESERVATIONS BUTTON ===== */}
                {/* First CTA Button - Reservations */}
                <Link
                  href="/reservations"
                  className={`group relative inline-block text-[rgb(255,255,255)] px-4 py-2 sm:px-6 md:px-8 lg:px-10 sm:py-3 md:py-4 lg:py-5 rounded-xl sm:rounded-2xl text-sm sm:text-base md:text-lg lg:text-xl font-bold transition-all duration-300 transform hover:scale-105 focus:scale-105 shadow-2xl focus:outline-none focus:ring-4 ${theme === 'dark'
                    ? 'focus:ring-[rgb(26,26,26)]/50'
                    : 'bg-[rgb(168,213,186)] focus:ring-[rgb(168,213,186)]/50'
                    }`}
                  aria-label="Reserve your table at East @ West"
                  style={{ backgroundColor: 'rgb(48,46,46)' }}
                >
                  {/* Reservations Button Text */}
                  <span className="relative z-10">{t("hero.cta")}</span>
                  {/* Reservations Button Hover Effect */}
                  <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-300 ${theme === 'dark'
                    ? 'bg-gradient-to-r from-[rgb(26,26,26)] to-[rgb(255,255,255)] text-[rgb(26,26,26)]'
                    : 'bg-gradient-to-r from-[rgb(168,213,186)] to-[rgb(26,26,26)]'
                    }`}></div>
                </Link>

                {/* ===== MENU BUTTON ===== */}
                {/* Second CTA Button - Menu */}
                <Link
                  href="/pdfs/menus.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  prefetch={false}
                  className={`group relative inline-block text-[rgb(255,255,255)] px-4 py-2 sm:px-6 md:px-8 lg:px-10 sm:py-3 md:py-4 lg:py-5 rounded-xl sm:rounded-2xl text-sm sm:text-base md:text-lg lg:text-xl font-bold transition-all duration-300 transform hover:scale-105 focus:scale-105 shadow-2xl focus:outline-none focus:ring-4 ${theme === 'dark'
                    ? 'focus:ring-[rgb(26,26,26)]/50'
                    : 'bg-[rgb(168,213,186)] focus:ring-[rgb(168,213,186)]/50'
                    }`}
                  aria-label="View our restaurant menu"
                  style={{ backgroundColor: 'rgb(48,46,46)' }}
                >
                  {/* Menu Button Text */}
                  <span className="relative z-10">{t("hero.viewMenu")}</span>
                  {/* Menu Button Hover Effect */}
                  <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-300 ${theme === 'dark'
                    ? 'bg-gradient-to-r from-[rgb(26,26,26)] to-[rgb(255,255,255)] text-[rgb(26,26,26)]'
                    : 'bg-gradient-to-r from-[rgb(168,213,186)] to-[rgb(26,26,26)]'
                    }`}></div>
                </Link>

                {/* ===== TAKE-AWAY-ONLY BUTTON ===== */}
                <Link
                  href="/pdfs/take-away-only.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  prefetch={false}
                  className={`group relative inline-block text-[rgb(255,255,255)] px-4 py-2 sm:px-6 md:px-8 lg:px-10 sm:py-3 md:py-4 lg:py-5 rounded-xl sm:rounded-2xl text-sm sm:text-base md:text-lg lg:text-xl font-bold transition-all duration-300 transform hover:scale-105 focus:scale-105 shadow-2xl focus:outline-none focus:ring-4 ${theme === 'dark'
                    ? 'focus:ring-[rgb(26,26,26)]/50'
                    : 'bg-[rgb(168,213,186)] focus:ring-[rgb(168,213,186)]/50'
                    }`}
                  aria-label="View our take-away-only menu"
                  style={{ backgroundColor: 'rgb(48,46,46)' }}
                >
                  <span className="relative z-10">Take-Away-Only</span>
                  <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-300 ${theme === 'dark'
                    ? 'bg-gradient-to-r from-[rgb(26,26,26)] to-[rgb(255,255,255)] text-[rgb(26,26,26)]'
                    : 'bg-gradient-to-r from-[rgb(168,213,186)] to-[rgb(26,26,26)]'
                    }`}></div>
                </Link>

                {/* ===== GALLERY BUTTON ===== */}
                {/* Third CTA Button - Gallery */}
                <Link
                  href="/gallery"
                  className={`group relative inline-block text-[rgb(255,255,255)] px-4 py-2 sm:px-6 md:px-8 lg:px-10 sm:py-3 md:py-4 lg:py-5 rounded-xl sm:rounded-2xl text-sm sm:text-base md:text-lg lg:text-xl font-bold transition-all duration-300 transform hover:scale-105 focus:scale-105 shadow-2xl focus:outline-none focus:ring-4 ${theme === 'dark'
                    ? 'focus:ring-[rgb(26,26,26)]/50'
                    : 'bg-[rgb(168,213,186)] focus:ring-[rgb(168,213,186)]/50'
                    }`}
                  aria-label="View our restaurant gallery"
                  style={{ backgroundColor: 'rgb(48,46,46)' }}
                >
                  {/* Gallery Button Text */}
                  <span className="relative z-10">{t("hero.viewGallery")}</span>
                  {/* Gallery Button Hover Effect */}
                  <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-300 ${theme === 'dark'
                    ? 'bg-gradient-to-r from-[rgb(26,26,26)] to-[rgb(255,255,255)] text-[rgb(26,26,26)]'
                    : 'bg-gradient-to-r from-[rgb(168,213,186)] to-[rgb(26,26,26)]'
                    }`}></div>
                </Link>
              </motion.div>
            </div>
          </div>

          {/* Minimal Loading Overlay - removed to improve LCP */}
        </header>

        {/* ===== MAIN CONTENT SECTION ===== */}
        {/* Main Content Container with Background Styling */}
        <main
          className={`relative py-24 px-4 sm:px-6 lg:px-8 ${theme === 'dark' ? 'bg-gradient-to-br from-[rgb(26,26,26)] via-[rgb(26,26,26)]/20 to-[rgb(26,26,26)]' : 'bg-gradient-to-br from-[rgb(245,240,230)] via-[rgb(168,213,186)]/30 to-[rgb(245,240,230)]'
            }`}
          role="main"
          aria-label="Restaurant content and sections"
        >
          {/* ===== FLOATING BACKGROUND ELEMENTS ===== */}
          {/* Floating Background Elements for Main Content */}
          <div className="absolute inset-0 overflow-hidden">
            {/* First Floating Element - Top Right */}
            <motion.div
                              className={`absolute top-32 right-10 w-96 h-96 rounded-full ${theme === 'dark'
                ? 'bg-gradient-to-r from-[rgb(26,26,26)]/20 to-[rgb(26,26,26)]/10'
                : 'bg-gradient-to-r from-[rgb(168,213,186)]/20 to-[rgb(168,213,186)]/10'
                }`}
              variants={floatingVariants}
              animate="float"
            />
            {/* Second Floating Element - Bottom Left */}
            <motion.div
                              className={`absolute bottom-32 left-10 w-80 h-80 rounded-full ${theme === 'dark'
                ? 'bg-gradient-to-r from-[rgb(26,26,26)]/20 to-[rgb(26,26,26)]/20'
                : 'bg-gradient-to-r from-[rgb(168,213,186)]/20 to-[rgb(26,26,26)]/20'
                }`}
              variants={floatingVariants}
              animate="float"
              transition={{ delay: 1.5 }}
            />
          </div>

          {/* ===== MAIN CONTENT CONTAINER ===== */}
          {/* Main Content Wrapper */}
          <div className="max-w-7xl mx-auto relative z-10">
            {/* ===== TODAY'S SPECIALS SECTION ===== */}
            {/* Modern Today's Specials Section with SEO Optimization */}
            <motion.section
              className="mb-12 sm:mb-16 md:mb-20"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              aria-labelledby="todays-specials-heading"
              role="region"
              itemScope
              itemType="https://schema.org/Restaurant"
            >
              {/* ===== SPECIALS SECTION HEADER ===== */}
              {/* Specials Section Title and Description */}
              <motion.div className="text-center mb-8 sm:mb-12 md:mb-16" variants={itemVariants}>
                {/* Specials Section Emoji Icon */}
                <div className="text-3xl xs:text-4xl sm:text-6xl mb-2 sm:mb-4">🌟</div>
                {/* Specials Section Main Title */}
                <h2
                  id="todays-specials-heading"
                  className={`text-4xl xs:text-5xl sm:text-6xl md:text-7xl font-black mb-4 sm:mb-6 ${theme === 'dark' ? 'text-white' : 'text-[rgb(26,26,26)]'
                    }`}
                  style={{ fontFamily: 'Rozha One, serif' }}
                >
                  {/* Specials Title Text with Theme Styling */}
                  <span className={`font-black ${theme === 'dark' ? 'text-white' : 'bg-clip-text text-transparent bg-black'
                    }`}>
                    {t('specials.title')}
                  </span>
                </h2>
                {/* Specials Section Subtitle */}
                <p className={`text-lg xs:text-xl sm:text-2xl font-semibold mb-3 ${theme === 'dark' ? 'text-[rgb(168,213,186)]' : 'text-[rgb(168,213,186)]'
                  }`} style={{ fontFamily: 'Times New Roman, serif' }}>
                  {t('specials.subtitle')}
                </p>
                {/* Specials Section Divider Line */}
                <div className={`w-32 h-1.5 mx-auto rounded-full mb-4 ${theme === 'dark'
                  ? 'bg-gradient-to-r from-[rgb(168,213,186)] to-[rgb(168,213,186)]'
                  : 'bg-gradient-to-r from-[rgb(168,213,186)] to-[rgb(168,213,186)]'
                  }`}></div>
                {/* Specials Section Description */}
                <p className={`text-sm xs:text-base sm:text-lg mt-4 sm:mt-6 max-w-3xl mx-auto ${theme === 'dark' ? 'text-white/90' : 'text-[rgb(26,26,26)]/80'
                  }`}>
                  {t('specials.description')}
                </p>
              </motion.div>

              {/* ===== SPECIALS CARDS GRID ===== */}
              {/* Specials Cards Container */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                {/* ===== HUMUS SPECIAL CARD ===== */}
                <motion.article
                  className={`group relative rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 ${theme === 'dark' ? 'bg-gradient-to-br from-[rgb(51, 61, 42] to-[rgb(245,240,230)]' : 'bg-gradient-to-br from-[rgb(223, 211, 211)] to-[rgb(255,255,255)]'
                    }`}
                  variants={itemVariants}
                  whileHover={{ y: -8 }}
                  itemScope
                  itemType="https://schema.org/MenuItem"
                >
                  {/* ===== CARD IMAGE SECTION ===== */}
                  <div className="relative h-48 sm:h-56 overflow-hidden">
                    <Image
                      src="/images/gallery/houmos.webp"
                      alt={t('specials.items.hummus.description')}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 25vw, 20vw"
                      loading="lazy"
                      quality={70}
                    />
                    {/* ===== IMAGE OVERLAY ===== */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                    {/* ===== PRICE BADGE ===== */}
                    <div className={`absolute top-3 right-3 text-white px-3 py-1 rounded-full font-bold text-sm shadow-lg ${theme === 'dark'
                      ? 'bg-gradient-to-r from-[rgb(168,213,186)] to-[rgb(168,213,186)] text-[rgb(26,26,26)]'
                      : 'bg-gradient-to-r from-[rgb(168,213,186)] to-[rgb(168,213,186)] text-[rgb(26,26,26)]'
                      }`}>
                      {t('specials.items.hummus.price')}
                    </div>
                    {/* ===== SPECIAL BADGE ===== */}
                    <div className="absolute top-3 left-3 text-white">
                      <div className="text-2xl">⭐</div>
                    </div>
                  </div>
                  {/* ===== CARD CONTENT ===== */}
                  <div className="p-4 sm:p-6">
                    <h3 className={`text-lg sm:text-xl font-bold mb-2 ${theme === 'dark' ? 'text-[rgb(26,26,26)]' : 'text-[rgb(26,26,26)]'
                      }`} style={{ fontFamily: 'Times New Roman, serif' }} itemProp="name">
                      {t('specials.items.hummus.title')}
                    </h3>
                    <p className={`text-sm sm:text-base leading-relaxed ${theme === 'dark' ? 'text-[rgb(26,26,26)]/80' : 'text-[rgb(26,26,26)]/70'
                      }`} itemProp="description">
                      {t('specials.items.hummus.description')}
                    </p>
                  </div>
                </motion.article>

                {/* ===== FALAFEL SPECIAL CARD ===== */}
                <motion.article
                  className={`group relative rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 ${theme === 'dark' ? 'bg-gradient-to-br from-[rgb(51, 61, 42)] to-[rgb(245,240,230)]' : 'bg-gradient-to-br from-[rgb(51, 61, 42)] to-[rgb(255,255,255)]'
                    }`}
                  variants={itemVariants}
                  whileHover={{ y: -8 }}
                  itemScope
                  itemType="https://schema.org/MenuItem"
                >
                  {/* ===== CARD IMAGE SECTION ===== */}
                  <div className="relative h-48 sm:h-56 overflow-hidden">
                    <Image
                      src="/images/gallery/falafel.webp"
                      alt={t('specials.items.falafel.description')}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      sizes="(max-width: 640px) 320px, (max-width: 768px) 280px, (max-width: 1024px) 240px, 200px"
                      loading="lazy"
                      quality={55}
                    />
                    {/* ===== IMAGE OVERLAY ===== */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                    {/* ===== PRICE BADGE ===== */}
                    <div className={`absolute top-3 right-3 text-white px-3 py-1 rounded-full font-bold text-sm shadow-lg ${theme === 'dark'
                      ? 'bg-gradient-to-r from-[rgb(168,213,186)] to-[rgb(168,213,186)] text-[rgb(26,26,26)]'
                      : 'bg-gradient-to-r from-[rgb(168,213,186)] to-[rgb(168,213,186)] text-[rgb(26,26,26)]'
                      }`}>
                      {t('specials.items.falafel.price')}
                    </div>
                    {/* ===== SPECIAL BADGE ===== */}
                    <div className="absolute top-3 left-3 text-white">
                      <div className="text-2xl">⭐</div>
                    </div>
                  </div>
                  {/* ===== CARD CONTENT ===== */}
                  <div className="p-4 sm:p-6">
                    <h3 className={`text-lg sm:text-xl font-bold mb-2 ${theme === 'dark' ? 'text-[rgb(26,26,26)]' : 'text-[rgb(26,26,26)]'
                      }`} style={{ fontFamily: 'Times New Roman, serif' }} itemProp="name">
                      {t('specials.items.falafel.title')}
                    </h3>
                    <p className={`text-sm sm:text-base leading-relaxed ${theme === 'dark' ? 'text-[rgb(26,26,26)]/80' : 'text-[rgb(26,26,26)]/70'
                      }`} itemProp="description">
                      {t('specials.items.falafel.description')}
                    </p>
                  </div>
                </motion.article>

                {/* ===== KEBBE SPECIAL CARD ===== */}
                <motion.article
                  className={`group relative rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 ${theme === 'dark' ? 'bg-gradient-to-br from-[rgb(51, 61, 42)] to-[rgb(245,240,230)]' : 'bg-gradient-to-br from-[rgb(51, 61, 42)] to-[rgb(255,255,255)]'
                    }`}
                  variants={itemVariants}
                  whileHover={{ y: -8 }}
                  itemScope
                  itemType="https://schema.org/MenuItem"
                >
                  {/* ===== CARD IMAGE SECTION ===== */}
                  <div className="relative h-48 sm:h-56 overflow-hidden">
                    <Image
                      src="/images/gallery/kebbe.webp"
                      alt={t('specials.items.kebbe.description')}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 25vw, 20vw"
                      loading="lazy"
                      quality={70}
                    />
                    {/* ===== IMAGE OVERLAY ===== */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                    {/* ===== PRICE BADGE ===== */}
                    <div className={`absolute top-3 right-3 text-white px-3 py-1 rounded-full font-bold text-sm shadow-lg ${theme === 'dark'
                      ? 'bg-gradient-to-r from-[rgb(168,213,186)] to-[rgb(168,213,186)] text-[rgb(26,26,26)]'
                      : 'bg-gradient-to-r from-[rgb(168,213,186)] to-[rgb(168,213,186)] text-[rgb(26,26,26)]'
                      }`}>
                      {t('specials.items.kebbe.price')}
                    </div>
                    {/* ===== SPECIAL BADGE ===== */}
                    <div className="absolute top-3 left-3 text-white">
                      <div className="text-2xl">⭐</div>
                    </div>
                  </div>
                  {/* ===== CARD CONTENT ===== */}
                  <div className="p-4 sm:p-6">
                    <h3 className={`text-lg sm:text-xl font-bold mb-2 ${theme === 'dark' ? 'text-[rgb(26,26,26)]' : 'text-[rgb(26,26,26)]'
                      }`} style={{ fontFamily: 'Times New Roman, serif' }} itemProp="name">
                      {t('specials.items.kebbe.title')}
                    </h3>
                    <p className={`text-sm sm:text-base leading-relaxed ${theme === 'dark' ? 'text-[rgb(26,26,26)]/80' : 'text-[rgb(26,26,26)]/70'
                      }`} itemProp="description">
                      {t('specials.items.kebbe.description')}
                    </p>
                  </div>
                </motion.article>

                {/* ===== AISH EL SARAYA SPECIAL CARD ===== */}
                <motion.article
                  className={`group relative rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 ${theme === 'dark' ? 'bg-gradient-to-br from-[rgb(51, 61, 42)] to-[rgb(245,240,230)]' : 'bg-gradient-to-br from-[rgb(51, 61, 42)] to-[rgb(255,255,255)]'
                    }`}
                  variants={itemVariants}
                  whileHover={{ y: -8 }}
                  itemScope
                  itemType="https://schema.org/MenuItem"
                >
                  {/* ===== CARD IMAGE SECTION ===== */}
                  <div className="relative h-48 sm:h-56 overflow-hidden">
                    <Image
                      src="/images/gallery/aish el saraya.webp"
                      alt={t('specials.items.aishElSaraya.description')}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      sizes="(max-width: 640px) 320px, (max-width: 768px) 280px, (max-width: 1024px) 240px, 200px"
                      loading="lazy"
                      quality={55}
                    />
                    {/* ===== IMAGE OVERLAY ===== */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                    {/* ===== PRICE BADGE ===== */}
                    <div className={`absolute top-3 right-3 text-white px-3 py-1 rounded-full font-bold text-sm shadow-lg ${theme === 'dark'
                      ? 'bg-gradient-to-r from-[rgb(168,213,186)] to-[rgb(168,213,186)] text-[rgb(26,26,26)]'
                      : 'bg-gradient-to-r from-[rgb(168,213,186)] to-[rgb(168,213,186)] text-[rgb(26,26,26)]'
                      }`}>
                      {t('specials.items.aishElSaraya.price')}
                    </div>
                    {/* ===== SPECIAL BADGE ===== */}
                    <div className="absolute top-3 left-3 text-white">
                      <div className="text-2xl">⭐</div>
                    </div>
                  </div>
                  {/* ===== CARD CONTENT ===== */}
                  <div className="p-4 sm:p-6">
                    <h3 className={`text-lg sm:text-xl font-bold mb-2 ${theme === 'dark' ? 'text-[rgb(26,26,26)]' : 'text-[rgb(26,26,26)]'
                      }`} style={{ fontFamily: 'Times New Roman, serif' }} itemProp="name">
                      {t('specials.items.aishElSaraya.title')}
                    </h3>
                    <p className={`text-sm sm:text-base leading-relaxed ${theme === 'dark' ? 'text-[rgb(26,26,26)]/80' : 'text-[rgb(26,26,26)]/70'
                      }`} itemProp="description">
                      {t('specials.items.aishElSaraya.description')}
                    </p>
                  </div>
                </motion.article>
              </div>

              {/* ===== CTA BUTTON SECTION ===== */}
              <motion.div className="text-center mt-8 sm:mt-12" variants={itemVariants}>
                <Link
                  href="/pdfs/allmenus.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  prefetch={false}
                  className={`group relative inline-block text-white px-6 py-3 sm:px-8 sm:py-4 rounded-xl text-base sm:text-lg font-bold transition-all duration-300 transform hover:scale-105 focus:scale-105 shadow-xl focus:outline-none focus:ring-4 ${theme === 'dark'
                    ? 'bg-gradient-to-r from-[rgb(168,213,186)] to-[rgb(168,213,186)] focus:ring-[rgb(168,213,186)]/50'
                    : 'bg-gradient-to-r from-[rgb(168,213,186)] to-[rgb(168,213,186)] focus:ring-[rgb(168,213,186)]/50'
                    }`}
                  aria-label={t('specials.seeFullMenu')}
                >
                  <span className="relative z-10">{t('specials.seeFullMenu')}</span>
                  <div className={`absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-300 ${theme === 'dark'
                    ? 'bg-gradient-to-r from-[rgb(26,26,26)] to-[rgb(26,26,26)]'
                    : 'bg-gradient-to-r from-[rgb(26,26,26)] to-[rgb(26,26,26)]'
                    }`}></div>
                </Link>
              </motion.div>
            </motion.section>

            {/* ===== UPCOMING EVENTS SECTION ===== */}
            {/* Enhanced Upcoming Events Section with Animation */}
            <motion.section
              className="mb-12 sm:mb-16 md:mb-20"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              aria-labelledby="events-heading"
              role="region"
            >
              {/* ===== EVENTS SECTION HEADER ===== */}
              {/* Events Section Title and Description */}
              <motion.div className="text-center mb-8 sm:mb-12 md:mb-16" variants={itemVariants}>
                {/* Events Section Emoji Icon */}
                <div className="text-3xl xs:text-4xl sm:text-6xl mb-2 sm:mb-4">🎉</div>
                {/* Events Section Main Title with Link */}
                <Link href="/events-catering" aria-label="Learn more about our events and catering services">
                  <div className="relative inline-block">
                    {/* Events Section Title */}
                    <h2
                      id="events-heading"
                      className={`text-5xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black mb-4 sm:mb-6 cursor-pointer hover:scale-105 focus:scale-105 transition-transform duration-300 ${theme === 'dark' ? 'text-white hover:text-[rgb(168,213,186)] focus:text-[rgb(168,213,186)]' : 'text-[rgb(26,26,26)] hover:text-[rgb(168,213,186)] focus:text-[rgb(168,213,186)]'
                        }`}
                      style={{ fontFamily: 'Rozha One, serif' }}
                    >
                      {/* Events Title Text with Theme Styling */}
                      <span className={`font-black ${theme === 'dark' ? 'text-white' : 'bg-clip-text text-transparent bg-black'
                        }`}>
                        {t('realtime.reserveEvents')}
                      </span>
                    </h2>
                    {/* ===== ANIMATED HAND POINTER ===== */}
                    {/* Desktop Animated Hand Pointer */}
                    <motion.div
                      className="absolute -right-16 top-1/2 transform -translate-y-1/2 hidden sm:block"
                      animate={{
                        x: [0, 10, 0],
                        rotate: [0, 15, 0]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      {/* Desktop Hand Pointer SVG */}
                      <svg
                        className={`w-12 h-12 ${theme === 'dark' ? 'text-[rgb(168,213,186)]' : 'text-[rgb(168,213,186)]'
                          }`}
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M10.5 14.5L16 9M16 9H11M16 9V14M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          fill="none"
                        />
                      </svg>
                    </motion.div>
                    {/* ===== MOBILE HAND POINTER ===== */}
                    {/* Mobile Animated Hand Pointer */}
                    <motion.div
                      className="block sm:hidden mt-2"
                      animate={{
                        y: [0, -5, 0],
                        scale: [1, 1.1, 1]
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      {/* Mobile Hand Pointer SVG */}
                      <svg
                        className={`w-8 h-8 mx-auto ${theme === 'dark' ? 'text-[rgb(168,213,186)]' : 'text-[rgb(168,213,186)]'
                          }`}
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <path d="M9 5L16 12L9 19"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </motion.div>
                  </div>
                </Link>
                {/* ===== EVENTS SECTION DIVIDER ===== */}
                {/* Events Section Divider Line */}
                <div className={`w-32 h-1.5 mx-auto rounded-full ${theme === 'dark'
                  ? 'bg-gradient-to-r from-[rgb(26,26,26)] to-[rgb(26,26,26)]'
                  : 'bg-gradient-to-r from-[rgb(168,213,186)] to-[rgb(168,213,186)]'
                  }`}></div>
                {/* ===== EVENTS SECTION DESCRIPTION ===== */}
                {/* Events Section Description Text */}
                <p className={`text-sm xs:text-base sm:text-lg mt-4 sm:mt-6 ${theme === 'dark' ? 'text-[rgb(245,240,230)]' : 'text-[rgb(26,26,26)]'}`}>
                  {t('realtime.upcomingEventsDescription')}
                </p>
              </motion.div>

              {/* ===== EVENTS CARDS GRID ===== */}
              {/* Events Cards Container */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* ===== EVENTS CARD LOOP ===== */}
                {/* Map through upcoming events to create cards */}
                {upcomingEvents.map((event) => (
                  <motion.div
                    key={event.id}
                    className={`group relative p-8 rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-105 ${theme === 'dark' ? 'bg-gradient-to-br from-[rgb(26,26,26)]/80 to-[rgb(168,213,186)]/80 border border-[rgb(168,213,186)]' : 'bg-gradient-to-br from-[rgb(255,255,255)]/80 to-[rgb(81,87,83)]/50 border border-[rgb(81,87,83)]'
                      }`}
                    variants={itemVariants}
                    whileHover={{ y: -10 }}
                  >
                    {/* ===== EVENT CARD HEADER ===== */}
                    {/* Event Card Header with Icon and Title */}
                    <div className="flex items-center mb-6">
                      {/* ===== EVENT CARD ICON ===== */}
                      {/* Event Card Icon Container */}
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mr-6 text-3xl shadow-xl ${theme === 'dark'
                        ? 'bg-gradient-to-r from-[rgb(26,26,26)] to-[rgb(26,26,26)]'
                        : 'bg-gradient-to-r from-[rgb(168,213,186)] to-[rgb(168,213,186)]'
                        }`}>
                        {event.icon}
                      </div>
                      {/* ===== EVENT CARD TITLE ===== */}
                      {/* Event Card Title Text */}
                      <div className={`${theme === 'dark' ? 'text-[rgb(245,240,230)]' : 'text-[rgb(26,26,26)]'}`} style={{ fontFamily: 'Times New Roman, serif', fontSize: '20px', lineHeight: '28px' }}>
                        {t(event.titleKey)}
                      </div>
                    </div>
                    {/* ===== EVENT CARD DESCRIPTION ===== */}
                    {/* Event Card Description Text */}
                    <p className={`text-base leading-relaxed ${theme === 'dark' ? 'text-[rgb(245,240,230)]' : 'text-[rgb(26,26,26)]'}`}>
                      {t(event.descriptionKey)}
                    </p>

                    {/* ===== EVENT CARD HOVER EFFECT ===== */}
                    {/* Hover Effect Overlay for Event Cards */}
                    <div className={`absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${theme === 'dark'
                      ? 'bg-gradient-to-r from-[rgb(26,26,26)]/10 to-[rgb(26,26,26)]/10'
                      : 'bg-gradient-to-r from-[rgb(168,213,186)]/10 to-[rgb(168,213,186)]/10'
                      }`}></div>
                  </motion.div>
                ))}
              </div>
            </motion.section>

            {/* ===== PARALLAX SECTION ===== */}
            {/* Parallax Section with Background Image */}
            <motion.section
              className="relative h-[35vh] sm:h-[40vh] md:h-[50vh] w-full overflow-hidden mb-12 sm:mb-16 md:mb-20"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              aria-labelledby="parallax-heading"
              role="region"
            >
              {/* ===== PARALLAX BACKGROUND SECTION ===== */}
              {/* Parallax Background Image Container */}
              <div className="absolute inset-0 w-full h-full">
                {/* ===== OPTIMIZED PARALLAX BACKGROUND ===== */}
                {/* Next.js Image with lazy loading and optimization */}
                <div
                  className="absolute inset-0 w-full h-full bg-cover bg-center bg-fixed hidden md:block"
                  style={{
                    backgroundImage: `url('/images/parallax-image.webp')`
                  }}
                />
                {/* ===== MOBILE PARALLAX BACKGROUND ===== */}
                {/* Static background for mobile devices */}
                <div
                  className="absolute inset-0 w-full h-full bg-cover bg-center block md:hidden"
                  style={{
                    backgroundImage: `url('/images/parallax-image.webp')`
                  }}
                />

                {/* ===== PARALLAX OVERLAY ===== */}
                {/* Translucent Overlay for Text Readability */}
                <div className="absolute inset-0 bg-black/50"></div>
              </div>

              {/* ===== PARALLAX CONTENT SECTION ===== */}
              {/* Parallax Content Container */}
              <div className="relative z-10 flex items-center justify-center h-full">
                {/* ===== PARALLAX TEXT CONTENT ===== */}
                {/* Parallax Text Content Container */}
                <div className="text-center mt-4 px-4 sm:px-6 lg:px-8 max-w-4xl">
                  {/* ===== PARALLAX TITLE ===== */}
                  {/* Parallax Section Main Title */}
                  <motion.h2
                    id="parallax-heading"
                    className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black mb-4 sm:mb-6 text-white italic"
                    style={{ fontFamily: 'Rozha One, serif' }}
                    variants={itemVariants}
                  >
                    {t('parallax.title')}
                  </motion.h2>

                  {/* ===== PARALLAX SUBTITLE ===== */}
                  {/* Parallax Section Subtitle */}
                  <motion.p
                    className="text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl text-white/90 font-light mb-6 sm:mb-8 italic"
                    style={{ fontFamily: 'Times New Roman, serif' }}
                    variants={itemVariants}
                  >
                    {t('parallax.subtitle')}
                  </motion.p>

                  {/* ===== PARALLAX BUTTONS ===== */}
                  {/* Parallax Section Call-to-Action Buttons */}
                  <motion.div
                    variants={itemVariants}
                    className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4"
                  >
                    {/* ===== PARALLAX RESERVATIONS BUTTON ===== */}
                    {/* First Parallax CTA Button - Reservations */}
                    <Link
                      href="/reservations"
                      className="group relative inline-block border-3 border-[rgb(255,255,255)] text-[rgb(255,255,255)] hover:bg-[rgb(255,255,255)] hover:text-[rgb(43,242,12)] focus:bg-[rgb(255,255,255)] focus:text-[rgb(26,26,26)] px-1 py-2 sm:px-2 md:px-3 lg:px-4 sm:py-3 md:py-4 lg:py-5 rounded-xl sm:rounded-2xl text-sm sm:text-base md:text-lg lg:text-xl font-bold transition-all duration-300 transform hover:scale-105 focus:scale-105 shadow-2xl bg-transparent focus:outline-none focus:ring-4 focus:ring-white/50"
                      aria-label="Book your table - Reserve now at East @ West"
                      style={{ backgroundColor: 'rgb(56, 42, 42)' }}
                    >
                      {/* Parallax Reservations Button Text */}
                      <span className="relative z-10">{t('parallax.cta')}</span>
                    </Link>

                    {/* ===== PARALLAX MENU BUTTON ===== */}
                    {/* Second Parallax CTA Button - Menu */}
                    <Link
                      href="/pdfs/menus.pdf"
                      className="group relative inline-block border-3 border-[rgb(255,255,255)] text-[rgb(255,255,255)] hover:bg-[rgb(255,255,255)] hover:text-[rgb(43,242,12)] focus:bg-[rgb(255,255,255)] focus:text-[rgb(26,26,26)] px-1 py-2 sm:px-2 md:px-3 lg:px-4 sm:py-3 md:py-4 lg:py-5 rounded-xl sm:rounded-2xl text-sm sm:text-base md:text-lg lg:text-xl font-bold transition-all duration-300 transform hover:scale-105 focus:scale-105 shadow-2xl bg-transparent focus:outline-none focus:ring-4 focus:ring-white/50"
                      aria-label="View our restaurant menu"
                      style={{ backgroundColor: 'rgb(56, 42, 42)' }}
                    >
                      {/* Parallax Menu Button Text */}
                      <span className="relative z-10">VIEW THE MENU</span>
                    </Link>
                  </motion.div>
                </div>
              </div>
            </motion.section>

            {/* ===== RESTAURANT GURU AWARDS SECTION ===== */}
            {/* Restaurant Guru Awards Section - SEO Optimized */}
            <motion.section
              className="mb-12 sm:mb-16 md:mb-20 text-center"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              itemScope
              itemType="https://schema.org/Organization"
            >
              {/* ===== AWARDS SECTION HEADER ===== */}
              {/* Awards Section Header with Title and Description */}
              <motion.div className="mb-8 sm:mb-10 md:mb-12" variants={itemVariants}>
                {/* ===== AWARDS SECTION TITLE ===== */}
                {/* Awards Section Main Title */}
                <h2 className={`text-5xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black mb-3 sm:mb-4 ${theme === 'dark' ? 'text-white' : 'text-[rgb(26,26,26)]'
                  }`} style={{ fontFamily: 'Rozha One, serif' }}>
                  {/* Awards Title Text with Theme Styling */}
                  <span className={`font-black ${theme === 'dark' ? 'text-white' : 'bg-clip-text text-transparent bg-black'
                    }`}>
                    {t('awards.title')}
                  </span>
                </h2>
                {/* ===== AWARDS SECTION DIVIDER ===== */}
                {/* Awards Section Divider Line */}
                <div className="w-32 h-1.5 bg-gradient-to-r from-[rgb(168,213,186)] to-[rgb(168,213,186)] mx-auto rounded-full mb-4"></div>
                {/* ===== AWARDS SECTION SUBTITLE ===== */}
                {/* Awards Section Subtitle Text */}
                <p className={`text-sm xs:text-base sm:text-lg md:text-xl ${theme === 'dark' ? 'text-[rgb(245,240,230)]' : 'text-[rgb(26,26,26)]'
                  }`} style={{ fontFamily: 'Rozha One, serif' }}>
                  {t('awards.subtitle')}
                </p>
              </motion.div>

              {/* ===== AWARDS ROW SECTION ===== */}
              {/* Awards Row Container */}
              <motion.div
                className="flex flex-col sm:flex-row gap-8 lg:gap-12 justify-center items-center px-4"
                variants={itemVariants}
                role="list"
                aria-label="Restaurant Guru Awards"
              >
                {/* ===== RESTAURANT GURU 2021 BADGE ===== */}
                {/* First Award - Restaurant Guru 2021 Badge */}
                <article className="flex-shrink-0 flex justify-center" role="listitem">
                  <figure className="text-center hover:scale-105 transition-transform duration-300">
                    {/* ===== 2021 AWARD BADGE ===== */}
                    {/* Interactive Restaurant Guru 2021 Badge */}
                    <div
                      id="rest_circ5"
                      onClick={(e) => {
                        const target = e.target as Element;
                        if (target.nodeName.toLowerCase() !== 'a') {
                          const link = e.currentTarget.querySelector('.circ_top_title') as HTMLAnchorElement;
                          if (link) window.open(link.href);
                          return false;
                        }
                      }}
                      style={{ cursor: 'pointer' }}
                      role="img"
                      aria-label="Restaurant Guru Recommended 2021 – East @ West Brussels"
                    >
                      {/* ===== 2021 BADGE CONTAINER ===== */}
                      {/* 2021 Badge Container */}
                      <div className="circ_cont">
                        {/* ===== 2021 BADGE IMAGE ===== */}
                        {/* 2021 Badge Background Image */}
                        <div
                          className="circ_img"
                          style={{ background: "url('/assets/restaurant-guru/star_red.svg') no-repeat center" }}
                          role="img"
                          aria-hidden="true"
                        >
                          &nbsp;
                        </div>
                        {/* ===== 2021 BADGE TOP TITLE ===== */}
                        {/* 2021 Badge Top Title Link */}
                        <a
                          href="https://restaurantguru.com"
                          target="_blank"
                          className="circ_top_title"
                          rel="noopener noreferrer"
                          aria-label="Visit Restaurant Guru website"
                        >
                          Restaurant Guru 2021
                        </a>
                        {/* ===== 2021 BADGE STATUS ===== */}
                        {/* 2021 Badge Status Text */}
                        <span>Recommended</span>
                        {/* ===== 2021 BADGE BOTTOM TITLE ===== */}
                        {/* 2021 Badge Bottom Title Link */}
                        <a
                          href="https://restaurantguru.com/East-and-West-Eatery-Brussels"
                          className="circ_bot_title"
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="View East @ West on Restaurant Guru"
                        >
                          East @ West
                        </a>
                      </div>
                    </div>

                  </figure>
                </article>

                {/* ===== RESTAURANT GURU 2023 ===== */}
                {/* Second Award - Restaurant Guru 2023 */}
                <article className="flex-shrink-0 flex justify-center" role="listitem">
                  <figure className="text-center hover:scale-105 transition-transform duration-300">
                    {/* ===== 2023 AWARD LINK ===== */}
                    {/* Restaurant Guru 2023 Award Link */}
                    <a
                      href="https://restaurantguru.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ cursor: 'pointer' }}
                      aria-label="Restaurant Guru Award 2023 – East @ West Brussels"
                    >
                      {/* ===== 2023 AWARD IMAGE CONTAINER ===== */}
                      {/* 2023 Award Image Container */}
                      <div className="h-48 w-auto">
                        {/* ===== 2023 AWARD IMAGE ===== */}
                        {/* Restaurant Guru 2023 Award Image */}
                        <Image
                          src="/images/guru2023.webp"
                          alt="Restaurant Guru Award 2023 – East @ West Brussels"
                          width={200}
                          height={200}
                          className="h-full w-auto object-contain rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                          priority={false}
                        />
                      </div>
                    </a>

                  </figure>
                </article>

                {/* ===== RESTAURANT GURU 2024 ===== */}
                {/* Third Award - Restaurant Guru 2024 */}
                <article className="flex-shrink-0 flex justify-center" role="listitem">
                  <figure className="text-center hover:scale-105 transition-transform duration-300">
                    {/* ===== 2024 AWARD LINK ===== */}
                    {/* Restaurant Guru 2024 Award Link */}
                    <a
                      href="https://restaurantguru.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ cursor: 'pointer' }}
                      aria-label="Restaurant Guru Award 2024 – East @ West Brussels"
                    >
                      {/* ===== 2024 AWARD IMAGE CONTAINER ===== */}
                      {/* 2024 Award Image Container */}
                      <div className="h-48 w-auto">
                        {/* ===== 2024 AWARD IMAGE ===== */}
                        {/* Restaurant Guru 2024 Award Image */}
                        <Image
                          src="/images/guru2024.webp"
                          alt="Restaurant Guru Award 2024 – East @ West Brussels"
                          width={200}
                          height={200}
                          className="h-full w-auto object-contain rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                          priority={false}
                        />
                      </div>
                    </a>

                  </figure>
                </article>
              </motion.div>

              {/* ===== AWARDS JSON-LD SCHEMA ===== */}
              {/* JSON-LD Schema for Rich Snippets */}
              <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                  __html: JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "Organization",
                    "name": "East @ West",
                    "description": "Mediterranean Restaurant in Brussels",
                    "url": "https://eastatwest.com",
                    "awards": [
                      {
                        "@type": "Award",
                        "name": "Restaurant Guru Recommended 2021",
                        "awarder": {
                          "@type": "Organization",
                          "name": "Restaurant Guru"
                        },
                        "dateAwarded": "2021"
                      },
                      {
                        "@type": "Award",
                        "name": "Restaurant Guru Award 2023",
                        "awarder": {
                          "@type": "Organization",
                          "name": "Restaurant Guru"
                        },
                        "dateAwarded": "2023"
                      },
                      {
                        "@type": "Award",
                        "name": "Restaurant Guru Award 2024",
                        "awarder": {
                          "@type": "Organization",
                          "name": "Restaurant Guru"
                        },
                        "dateAwarded": "2024"
                      }
                    ]
                  })
                }}
              />
            </motion.section>

            {/* ===== CONTACT SECTION ===== */}
            {/* Contact Section with Contact Information and Restaurant Image */}
            <motion.section
              id="contact"
              className={`py-20 px-4 sm:px-6 lg:px-8 relative ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
                }`}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={containerVariants}
            >
              {/* ===== CONTACT BACKGROUND GRADIENT ===== */}
              {/* Background Gradient for Contact Section */}
              <div className={`absolute inset-0 pointer-events-none ${theme === 'dark'
                ? 'bg-gray-900'
                : 'bg-white'
                }`} />

              {/* ===== CONTACT CONTENT CONTAINER ===== */}
              {/* Contact Content Wrapper */}
              <div className="max-w-7xl mx-auto relative">
                {/* ===== CONTACT SECTION HEADER ===== */}
                {/* Contact Section Header with Title */}
                <motion.div className="mb-12 text-center" variants={itemVariants}>
                  {/* ===== CONTACT SECTION TITLE ===== */}
                  {/* Contact Section Main Title */}
                  <h2 className={`text-5xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black mb-3 sm:mb-4 ${theme === 'dark' ? 'text-white' : 'text-[rgb(26,26,26)]'
                    }`} style={{ fontFamily: 'Rozha One, serif' }}>
                    {/* Contact Title Text with Theme Styling */}
                    <span className={`font-black ${theme === 'dark' ? 'text-white' : 'bg-clip-text text-transparent bg-black'
                      }`}>
                      {t('contact.contactUs')}
                    </span>
                  </h2>
                  {/* ===== CONTACT SECTION DIVIDER ===== */}
                  {/* Contact Section Divider Line */}
                  <div className="w-32 h-1.5 bg-gradient-to-r from-[rgb(168,213,186)] to-[rgb(168,213,186)] mx-auto rounded-full mb-4"></div>
                </motion.div>

                {/* ===== CONTACT GRID SECTION ===== */}
                {/* Contact Information Grid Container */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                  {/* ===== CONTACT DETAILS SECTION ===== */}
                  {/* Contact Details Card */}
                  <motion.div
                    className={`p-8 rounded-xl shadow-2xl border-2 transform hover:scale-105 transition-all duration-300  ${theme === 'dark'
                      ? 'bg-gray-900/80 border-gray-600 shadow-gray-500/20'
                      : 'bg-white/80 border-gray-600 shadow-gray-500/20'
                      }`}
                    variants={itemVariants}
                    whileHover={{ y: -5 }}
                  >
                    {/* ===== CONTACT DETAILS LIST ===== */}
                    {/* Contact Details List Container */}
                    <div className="space-y-6">
                      {/* ===== PHONE CONTACT ===== */}
                      {/* Phone Contact Information */}
                      <div className="flex items-center">
                        {/* ===== PHONE ICON LINK ===== */}
                        {/* Phone Icon with Link */}
                        <a
                          href="tel:+32465206024"
                          title={t('contact.contactTooltips.phone')}
                          className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 cursor-pointer hover:scale-110 transition-transform duration-300 ${theme === 'dark' ? 'bg-gray-500 hover:bg-green-500' : 'bg-gray-900 hover:bg-green-600'
                            }`}
                        >
                          {/* Phone Icon SVG */}
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                        </a>
                        {/* ===== PHONE TEXT INFO ===== */}
                        {/* Phone Text Information */}
                        <div>
                          {/* Phone Label */}
                          <h3 className="text-lg font-semibold">{t('contact.phone')}</h3>
                          {/* Phone Number */}
                          <p className={`${theme === 'dark' ? 'text-white' : 'text-gray-600'}`}>{t('footer.phone')}</p>
                        </div>
                      </div>

                      {/* ===== EMAIL CONTACT ===== */}
                      {/* Email Contact Information */}
                      <div className="flex items-center">
                        {/* ===== EMAIL ICON LINK ===== */}
                        {/* Email Icon with Link */}
                        <a
                          href="mailto:contact@eastatwest.com"
                          title={t('contact.contactTooltips.email')}
                          className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 cursor-pointer hover:scale-110 transition-transform duration-300 ${theme === 'dark' ? 'bg-gray-500 hover:bg-green-500' : 'bg-gray-900 hover:bg-green-600'
                            }`}
                        >
                          {/* Email Icon SVG */}
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </a>
                        {/* ===== EMAIL TEXT INFO ===== */}
                        {/* Email Text Information */}
                        <div>
                          {/* Email Label */}
                          <h3 className="text-lg font-semibold">{t('contact.email')}</h3>
                          {/* Email Address */}
                          <p className={`${theme === 'dark' ? 'text-white' : 'text-gray-600'}`}>{t('footer.email')}</p>
                        </div>
                      </div>

                      {/* ===== ADDRESS CONTACT ===== */}
                      {/* Address Contact Information */}
                      <div className="flex items-start">
                        {/* ===== ADDRESS ICON LINK ===== */}
                        {/* Address Icon with Google Maps Link */}
                        <a
                          href="https://maps.google.com/?q=Bld+de+l'Empereur+26+1000+Brussels+Belgium"
                          target="_blank"
                          rel="noopener noreferrer"
                          title={t('contact.contactTooltips.address')}
                          className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 mt-1 cursor-pointer hover:scale-110 transition-transform duration-300 ${theme === 'dark' ? 'bg-gray-500 hover:bg-green-500' : 'bg-gray-900 hover:bg-green-600'
                            }`}
                        >
                          {/* Address Icon SVG */}
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </a>
                        {/* ===== ADDRESS TEXT INFO ===== */}
                        {/* Address Text Information */}
                        <div>
                          {/* Address Label */}
                          <h3 className="text-lg font-semibold">{t('contact.address')}</h3>
                          {/* Address Text */}
                          <p className={`whitespace-pre-line ${theme === 'dark' ? 'text-white' : 'text-gray-600'}`}>{t('footer.address')}</p>
                        </div>
                      </div>

                      {/* ===== HOURS CONTACT ===== */}
                      {/* Opening Hours Contact Information */}
                      <div className="flex items-start">
                        {/* ===== HOURS ICON LINK ===== */}
                        {/* Hours Icon with Reservations Link */}
                        <a
                          href="/reservations"
                          className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 mt-1 cursor-pointer hover:scale-110 transition-transform duration-300 ${theme === 'dark' ? 'bg-gray-500 hover:bg-green-500' : 'bg-gray-900 hover:bg-green-600'
                            }`}
                        >
                          {/* Hours Icon SVG */}
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </a>
                        {/* ===== HOURS TEXT INFO ===== */}
                        {/* Hours Text Information */}
                        <div>
                          {/* Hours Label */}
                          <h3 className="text-lg font-semibold">{t('contact.openingHours')}</h3>
                          {/* Hours Details */}
                          <div className={`${theme === 'dark' ? 'text-white' : 'text-gray-600'}`}>
                            {/* Monday to Friday Hours */}
                            <p>{t('contact.mondayFriday')}</p>
                            {/* Saturday Hours */}
                            <p>{t('contact.saturday')}</p>
                            {/* Sunday Closed */}
                            <p>{t('contact.sundayClosed')}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* ===== RESTAURANT IMAGE SECTION ===== */}
                  {/* Restaurant Image Card */}
                  <motion.div className="relative" variants={itemVariants}>
                    {/* ===== RESTAURANT IMAGE CONTAINER ===== */}
                    {/* Restaurant Image Container */}
                    <div className="rounded-xl overflow-hidden shadow-lg h-full min-h-[400px] relative">
                      {/* ===== RESTAURANT IMAGE ===== */}
                      {/* Restaurant Banner Image */}
                      <Image
                        src="/images/banner.webp"
                        alt="East at West Restaurant"
                        fill
                        className="object-cover"
                        priority
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 40vw"
                        quality={75}
                      />
                      {/* ===== RESTAURANT IMAGE OVERLAY ===== */}
                      {/* Image Gradient Overlay for Text Readability */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                      {/* ===== RESTAURANT IMAGE TEXT ===== */}
                      {/* Restaurant Image Text Overlay */}
                      <div className="absolute top-20 left-8 right-8 text-white text-center">
                        {/* ===== RESTAURANT IMAGE TITLE ===== */}
                        {/* Restaurant Image Title */}
                        <h3 className={`text-4xl font-bold mb-2 italic   ${theme === 'dark' ? 'text-white' : 'text-white'
                          }`} style={{ fontFamily: 'Rozha One, serif' }}>
                          {t('contact.restaurantImageAlt')}
                        </h3>
                        {/* ===== RESTAURANT IMAGE DESCRIPTION ===== */}
                        {/* Restaurant Image Description */}
                        <p className="text-lg italic" style={{ fontFamily: 'Rozha One, serif' }}>
                          {t('contact.restaurantDescription')}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.section>

          </div>
        </main>

      </div>
    </>
  )
}
