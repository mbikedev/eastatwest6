'use client'

import { useTranslation } from 'react-i18next'
import { useTheme } from '../../context/ThemeContext'
import { useLightbox } from '../../context/LightboxContext'
import Image from 'next/image'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Head from 'next/head'

export default function EventsCateringPage() {
  const { t } = useTranslation('common')
  const { theme } = useTheme()
  const { openLightbox } = useLightbox()

  // All images on the page for lightbox navigation
  const allPageImages = [
    // Standalone section images
    {
      src: "/images/events-catering/mezze-libanais-restaurant.webp",
      alt: t('events.images.mezze')
    },
    {
      src: "/images/events-catering/plat-fattouche-libanais-restaurant.webp",
      alt: t('events.images.fattoush')
    },
    {
      src: "/images/events-catering/plat-libanais-restaurant-libanais.webp",
      alt: t('events.images.platter')
    },
    // Gallery images
    {
      src: "/images/gallery2/eastatwest-bruxelles.webp",
      alt: t('events.gallery.image1_alt')
    },
    {
      src: "/images/gallery2/eastatwest-traiteur.webp",
      alt: t('events.gallery.image2_alt')
    },
    {
      src: "/images/gallery2/mezze-libanais-restaurant-libanais.webp",
      alt: t('events.gallery.image3_alt')
    },
    {
      src: "/images/gallery2/restaurant-eastatwest-brussel.webp",
      alt: t('events.gallery.image4_alt')
    },
    {
      src: "/images/gallery2/restaurant-libanais.webp",
      alt: t('events.gallery.image5_alt')
    },
    {
      src: "/images/gallery2/traiteur-eastatwest-brussel.webp",
      alt: t('events.gallery.image6_alt')
    }
  ]

  // Handle image click for lightbox
  const handleImageClick = (imageIndex: number) => {
    const clickedImage = allPageImages[imageIndex]
    openLightbox(
      clickedImage.src,
      clickedImage.alt,
      allPageImages,
      imageIndex
    )
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  }

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

  const floatingVariants = {
    float: {
      y: [-10, 10, -10],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut" as const
      }
    }
  }

  // JSON-LD Structured Data for Events & Catering
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "East At West",
    "description": "Authentic Lebanese restaurant in Brussels offering events and catering services for private dining, business meetings, weddings and special occasions.",
    "url": "https://eastatwest.com/events-catering",
    "image": "https://eastatwest.com/images/events-catering/plat-libanais-restaurant-libanais-event.webp",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Brussels",
      "addressLocality": "Brussels",
      "addressCountry": "BE"
    },
    "telephone": "+32 465 20 60 24",
    "email": "contact@eastatwest.com",
    "servesCuisine": ["Lebanese", "Middle Eastern", "Mediterranean"],
    "priceRange": "$$",
    "openingHours": [
      "Tu-Su 12:00-14:00",
      "Tu-Su 18:00-22:00"
    ],
    "hasMenu": "https://eastatwest.com/menu",
    "acceptsReservations": true,
    "paymentAccepted": ["Cash", "Credit Card"],
    "currenciesAccepted": "EUR",
    "keywords": "Lebanese restaurant Brussels, events catering Brussels, private dining, business catering, wedding catering, authentic Lebanese cuisine"
  }

  return (
    <>
      <Head>
        <title>Events & Catering | East At West Lebanese Restaurant Brussels</title>
        <meta 
          name="description" 
          content="Host your events with authentic Lebanese cuisine in Brussels. Private dining, business catering, weddings and more at East At West. Professional catering services with traditional Lebanese flavors." 
        />
        <meta name="keywords" content="events catering Brussels, Lebanese restaurant events, private dining Brussels, business catering, wedding catering, authentic Lebanese cuisine, Mediterranean catering services" />
        <meta name="robots" content="index, follow" />
        <meta name="author" content="East At West" />
        <link rel="canonical" href="https://eastatwest.com/events-catering" />
        
        {/* Open Graph Meta Tags */}
        <meta property="og:title" content="Events & Catering | East At West Lebanese Restaurant Brussels" />
        <meta property="og:description" content="Host your events with authentic Lebanese cuisine in Brussels. Private dining, business catering, weddings and more at East At West." />
        <meta property="og:image" content="https://eastatwest.com/images/events-catering/plat-libanais-restaurant-libanais-event.webp" />
        <meta property="og:url" content="https://eastatwest.com/events-catering" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="East At West" />
        <meta property="og:locale" content="en_US" />
        
        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Events & Catering | East At West Lebanese Restaurant Brussels" />
        <meta name="twitter:description" content="Host your events with authentic Lebanese cuisine in Brussels. Private dining, business catering, weddings and more." />
        <meta name="twitter:image" content="https://eastatwest.com/images/events-catering/plat-libanais-restaurant-libanais-event.webp" />
        
        {/* Additional SEO Meta Tags */}
        <meta name="geo.region" content="BE-BRU" />
        <meta name="geo.placename" content="Brussels" />
        <meta name="geo.position" content="50.8476;4.3572" />
        <meta name="ICBM" content="50.8476, 4.3572" />
        
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData)
          }}
        />
      </Head>
      
      <div className={`min-h-screen pt-16 transition-colors duration-300 ${
        theme === 'dark' ? 'bg-[#1A1A1A] text-white' : 'bg-white text-black'
      }`}>
      {/* Hero Section */}
      <section 
        className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/images/events-catering/plat-libanais-restaurant-libanais-event.webp')"
        }}
      >
        {/* Background Overlay */}
        <div className={`absolute inset-0 ${
          theme === 'dark' 
            ? 'bg-black/60' 
            : 'bg-black/40'
        }`}></div>
        {/* Floating Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-r from-[#A8D5BA]/20 to-[#A8D5BA]/20 rounded-full "
            variants={floatingVariants}
            animate="float"
          />
          <motion.div
            className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-to-r from-[#A8D5BA]/20 to-[#1A1A1A]/20 rounded-full "
            variants={floatingVariants}
            animate="float"
            transition={{ delay: 1.5 }}
          />
        </div>

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <div className="text-8xl mb-6">🎉</div>
          </motion.div>

          <motion.h1
            className="text-5xl sm:text-6xl lg:text-7xl font-black mb-8 text-white drop-shadow-2xl"
            style={{ fontFamily: 'Times New Roman, serif' }}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            {t('events.hero.welcome')} - Events & Catering Brussels
          </motion.h1>

          <motion.div
            className="text-lg sm:text-xl mb-6 text-white/90 drop-shadow-lg"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
          >
            {t('events.hero.breadcrumb')}
          </motion.div>

          <motion.p
            className="text-xl sm:text-2xl max-w-4xl mx-auto font-light leading-relaxed text-white drop-shadow-lg"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.1 }}
          >
            {t('events.subtitle')}
          </motion.p>
        </div>
      </section>

      {/* For All Your Events Section */}
      <motion.section
        className={`relative py-20 px-4 sm:px-8 ${
          theme === 'dark' 
            ? 'bg-gradient-to-br from-[#1A1A1A]/90 to-orange-200' 
            : 'bg-gradient-to-br from-gray-100 to-gray-300'
        }`}
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div variants={itemVariants}>
              <div className="text-6xl mb-6">🍽️</div>
              <h2 className="text-4xl sm:text-5xl font-black mb-8">
                <span className="bg-gradient-to-r from-[#A8D5BA] to-[#A8D5BA] bg-clip-text text-transparent">
                  {t('events.forAllEvents.title')}
                </span>
              </h2>
              <div className="w-32 h-1.5 bg-gradient-to-r from-[#A8D5BA] to-[#A8D5BA] rounded-full mb-8"></div>
              <p className={`text-lg leading-relaxed ${
                theme === 'dark' ? 'text-white' : 'text-black'
              }`}>
                {t('events.forAllEvents.description')}
              </p>
            </motion.div>

            <motion.div
              className="relative cursor-pointer"
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
              onClick={() => handleImageClick(0)}
            >
              <div className="relative group">
                <Image
                  src="/images/events-catering/mezze-libanais-restaurant.webp"
                  alt={t('events.images.mezze')}
                  width={600}
                  height={400}
                  className="rounded-3xl shadow-2xl object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 60vw"
                  loading="lazy"
                  quality={70}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-3xl"></div>
                <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors duration-300 rounded-3xl flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/50 rounded-full p-3 ">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                    </svg>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Kibbeh Vegan Section */}
      <motion.section
        className={`relative py-20 px-4 sm:px-8 ${
          theme === 'dark' 
            ? 'bg-gradient-to-br from-[#1A1A1A] via-[#A8D5BA]/20 to-[#1A1A1A]' 
            : 'bg-gradient-to-br from-[#F5F0E6] via-[#A8D5BA]/30 to-[#F5F0E6]'
        }`}
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              className="relative order-2 lg:order-1 cursor-pointer"
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
              onClick={() => handleImageClick(1)}
            >
              <div className="relative group">
                <Image
                  src="/images/events-catering/plat-fattouche-libanais-restaurant.webp"
                  alt={t('events.images.fattoush')}
                  width={600}
                  height={400}
                  className="rounded-3xl shadow-2xl object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  loading="lazy"
                  quality={70}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-3xl"></div>
                <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors duration-300 rounded-3xl flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/50 rounded-full p-3 ">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                    </svg>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div className="order-1 lg:order-2" variants={itemVariants}>
              <div className="text-6xl mb-6">🌱</div>
              <h3 className={`text-2xl font-bold mb-4 ${
                theme === 'dark' ? 'text-white' : 'text-black'
              }`}>
                {t('events.kibbehVegan.subtitle')}
              </h3>
              <h2 className="text-4xl sm:text-5xl font-black mb-8">
                <span className="bg-gradient-to-r from-[#A8D5BA] to-[#1A1A1A] bg-clip-text text-transparent">
                  {t('events.kibbehVegan.title')}
                </span>
              </h2>
              <div className="w-32 h-1.5 bg-gradient-to-r from-[#A8D5BA] to-[#1A1A1A] rounded-full mb-8"></div>
              <p className={`text-lg leading-relaxed ${
                theme === 'dark' ? 'text-white' : 'text-black'
              }`}>
                {t('events.kibbehVegan.description')}
              </p>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Our Specialities Section */}
      <motion.section
        className={`relative py-20 px-4 sm:px-8 ${
          theme === 'dark' 
            ? 'bg-gradient-to-br from-[#1A1A1A]/90 to-orange-200' 
            : 'bg-gradient-to-br from-gray-100 to-gray-300'
        }`}
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div variants={itemVariants}>
              <div className="text-6xl mb-6">⭐</div>
              <h2 className="text-4xl sm:text-5xl font-black mb-8">
                <span className="bg-gradient-to-r from-[#A8D5BA] to-[#1A1A1A] bg-clip-text text-transparent">
                  {t('events.specialities.title')}
                </span>
              </h2>
              <div className="w-32 h-1.5 bg-gradient-to-r from-[#A8D5BA] to-[#1A1A1A] rounded-full mb-8"></div>
              <p className={`text-lg leading-relaxed ${
                theme === 'dark' ? 'text-white' : 'text-black'
              }`}>
                {t('events.specialities.description')}
              </p>
            </motion.div>

            <motion.div
              className="relative cursor-pointer"
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
              onClick={() => handleImageClick(2)}
            >
              <div className="relative group">
                <Image
                  src="/images/events-catering/plat-libanais-restaurant-libanais.webp"
                  alt={t('events.images.platter')}
                  width={600}
                  height={400}
                  className="rounded-3xl shadow-2xl object-cover"
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-3xl"></div>
                <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors duration-300 rounded-3xl flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/50 rounded-full p-3 ">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                    </svg>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Book Your Event Section */}
      <motion.section
        className="relative py-20 px-4 sm:px-8 bg-black text-white overflow-hidden"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        {/* Floating Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-r from-[#A8D5BA]/10 to-[#A8D5BA]/10 rounded-full "
            variants={floatingVariants}
            animate="float"
          />
          <motion.div
            className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-to-r from-[#A8D5BA]/10 to-[#1A1A1A]/10 rounded-full "
            variants={floatingVariants}
            animate="float"
            transition={{ delay: 1 }}
          />
        </div>

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div variants={itemVariants}>
            <div className="text-6xl mb-6">📅</div>
            <h2 className="text-4xl sm:text-5xl font-black mb-8">
              <span className="bg-gradient-to-r from-[#A8D5BA] to-[#A8D5BA] bg-clip-text text-transparent">
                {t('events.bookEvent.title')}
              </span>
            </h2>
            <div className="w-32 h-1.5 bg-gradient-to-r from-[#A8D5BA] to-[#A8D5BA] mx-auto rounded-full mb-8"></div>
            <p className="text-xl mb-12 max-w-3xl mx-auto">
              {t('events.bookEvent.description')}
            </p>

            <div className="flex flex-col sm:flex-row gap-8 justify-center items-center">
              <motion.a
                href={`mailto:${t('events.bookEvent.email')}`}
                className="group relative inline-flex items-center bg-gradient-to-r from-[#A8D5BA] to-[#A8D5BA] hover:from-[#A8D5BA] hover:to-[#1A1A1A] text-white px-10 py-5 rounded-2xl text-xl font-bold transition-all duration-300 transform hover:scale-105 shadow-2xl"
                whileHover={{ y: -5 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {t('events.bookEvent.emailLabel')}
              </motion.a>

              <motion.a
                href={`tel:${t('events.bookEvent.phone')}`}
                className="group relative inline-flex items-center border-3 border-white bg-white/10  text-white hover:bg-white hover:text-black px-10 py-5 rounded-2xl text-xl font-bold transition-all duration-300 transform hover:scale-105 shadow-2xl"
                whileHover={{ y: -5 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                {t('events.bookEvent.phoneLabel')}
              </motion.a>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Latest News Section */}
      <motion.section
        className={`relative py-20 px-4 sm:px-8 bg-gradient-to-br from-[#A8D5BA] via-[#A8D5BA] to-[#1A1A1A] text-white overflow-hidden`}
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }}></div>
        </div>

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div variants={itemVariants}>
            <div className="text-6xl mb-6">📰</div>
            <h2 className="text-4xl sm:text-5xl font-black mb-8 text-white">
              {t('events.latestNews.title')}
            </h2>
            <div className="w-32 h-1.5 bg-white mx-auto rounded-full mb-8"></div>
            <p className="text-xl mb-12 max-w-3xl mx-auto">
              {t('events.latestNews.description')}
            </p>

            <Link href="/blog">
              <motion.button
                className="group relative inline-block bg-white text-[#1A1A1A] hover:bg-gray-100 px-10 py-5 rounded-2xl text-xl font-bold transition-all duration-300 transform hover:scale-105 shadow-2xl cursor-pointer"
                whileHover={{ y: -5 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="relative z-10 flex items-center">
                  Visit our blog
                  <svg className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* Catering Gallery Section */}
      <motion.section
        className={`relative py-20 px-4 sm:px-8 ${
          theme === 'dark' 
            ? 'bg-gradient-to-br from-[#1A1A1A] via-[#A8D5BA]/20 to-[#1A1A1A]' 
            : 'bg-gradient-to-br from-[#F5F0E6] via-[#A8D5BA]/30 to-[#F5F0E6]'
        }`}
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        <div className="max-w-7xl mx-auto">
          <motion.div className="text-center mb-16" variants={itemVariants}>
            <div className="text-6xl mb-6">🖼️</div>
            <h2 className="text-4xl sm:text-5xl font-black mb-8">
              <span className="bg-gradient-to-r from-[#A8D5BA] to-[#A8D5BA] bg-clip-text text-transparent">
                {t('events.catering.title')}
              </span>
            </h2>
            <div className="w-32 h-1.5 bg-gradient-to-r from-[#A8D5BA] to-[#A8D5BA] mx-auto rounded-full mb-8"></div>
            <p className={`text-lg max-w-3xl mx-auto ${
              theme === 'dark' ? 'text-white' : 'text-black'
            }`}>
              {t('events.catering.description')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Gallery Images */}
            <motion.div
              className="relative overflow-hidden rounded-3xl shadow-2xl group cursor-pointer"
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
              onClick={() => handleImageClick(3)}
            >
              <Image
                src="/images/gallery2/eastatwest-bruxelles.webp"
                alt={t('events.gallery.image1_alt')}
                width={400}
                height={300}
                className="object-cover w-full h-64 transition-transform duration-500 group-hover:scale-110"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                loading="lazy"
                quality={70}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/50 rounded-full p-3 ">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                  </svg>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="relative overflow-hidden rounded-3xl shadow-2xl group cursor-pointer"
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
              onClick={() => handleImageClick(4)}
            >
              <Image
                src="/images/gallery2/eastatwest-traiteur.webp"
                alt={t('events.gallery.image2_alt')}
                width={400}
                height={300}
                className="object-cover w-full h-64 transition-transform duration-500 group-hover:scale-110"
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/50 rounded-full p-3 ">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                  </svg>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="relative overflow-hidden rounded-3xl shadow-2xl group cursor-pointer"
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
              onClick={() => handleImageClick(5)}
            >
              <Image
                src="/images/gallery2/mezze-libanais-restaurant-libanais.webp"
                alt={t('events.gallery.image3_alt')}
                width={400}
                height={300}
                className="object-cover w-full h-64 transition-transform duration-500 group-hover:scale-110"
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/50 rounded-full p-3 ">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                  </svg>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="relative overflow-hidden rounded-3xl shadow-2xl group cursor-pointer"
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
              onClick={() => handleImageClick(6)}
            >
              <Image
                src="/images/gallery2/restaurant-eastatwest-brussel.webp"
                alt={t('events.gallery.image4_alt')}
                width={400}
                height={300}
                className="object-cover w-full h-64 transition-transform duration-500 group-hover:scale-110"
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/50 rounded-full p-3 ">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                  </svg>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="relative overflow-hidden rounded-3xl shadow-2xl group cursor-pointer"
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
              onClick={() => handleImageClick(7)}
            >
              <Image
                src="/images/gallery2/restaurant-libanais.webp"
                alt={t('events.gallery.image5_alt')}
                width={400}
                height={300}
                className="object-cover w-full h-64 transition-transform duration-500 group-hover:scale-110"
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/50 rounded-full p-3 ">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                  </svg>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="relative overflow-hidden rounded-3xl shadow-2xl group cursor-pointer"
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
              onClick={() => handleImageClick(8)}
            >
              <Image
                src="/images/gallery2/traiteur-eastatwest-brussel.webp"
                alt={t('events.gallery.image6_alt')}
                width={400}
                height={300}
                className="object-cover w-full h-64 transition-transform duration-500 group-hover:scale-110"
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/50 rounded-full p-3 ">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                  </svg>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>
    </div>
    </>
  )
}
