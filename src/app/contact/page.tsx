'use client'

import { useTranslation } from 'react-i18next'
import { useTheme } from '../../context/ThemeContext'
import Image from 'next/image'
import { motion } from 'framer-motion'


export default function ContactPage() {
  const { t } = useTranslation('common')
  const { theme } = useTheme()

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

  return (
    <div className={`min-h-screen pt-16 transition-colors duration-300 relative overflow-hidden ${theme === 'dark' ? 'bg-black text-white' : 'bg-white text-gray-900'
      }`}>
      
      {/* Floating Background Elements */}
      <motion.div 
        className={`absolute top-20 left-10 w-32 h-32 rounded-full opacity-20  ${
          theme === 'dark' 
            ? 'bg-gradient-to-br from-orange-400 to-pink-500' 
            : 'bg-gradient-to-br from-gray-200 to-gray-300'
        }`}
        variants={floatingVariants}
        animate="float"
      />
      <motion.div 
        className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full opacity-20 "
        variants={floatingVariants}
        animate="float"
        transition={{ delay: 0.5 }}
      />
      <motion.div 
        className="absolute bottom-20 left-1/4 w-20 h-20 bg-gradient-to-br from-green-400 to-teal-500 rounded-full opacity-20 "
        variants={floatingVariants}
        animate="float"
        transition={{ delay: 1 }}
      />

      {/* Header */}
      <motion.section 
        className="py-20 px-4 sm:px-6 lg:px-8 relative"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="max-w-7xl mx-auto text-center">
          <motion.div variants={itemVariants}>
            <span className="inline-block text-6xl mb-4 animate-bounce">📞</span>
          </motion.div>
          <motion.h1 
            className={`text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 bg-clip-text text-transparent ${
              theme === 'dark' 
                ? 'bg-white' 
                : 'bg-black'
            }`}
            style={{ fontFamily: 'Times New Roman, serif' }}
            variants={itemVariants}
          >
            {t('contact.title')}
          </motion.h1>
          <motion.p 
            className={`text-xl max-w-3xl mx-auto font-light ${theme === 'dark' ? 'text-white' : 'text-gray-600'
            }`}
            variants={itemVariants}
          >
            {t('contact.subtitle')}
          </motion.p>
        </div>
      </motion.section>

      {/* Contact Information */}
      <motion.section 
        className={`py-20 px-4 sm:px-6 lg:px-8 relative ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
        }`}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        {/* Background Gradient */}
        <div className={`absolute inset-0 pointer-events-none ${
          theme === 'dark' 
            ? 'bg-gray-900' 
            : 'bg-white'
        }`} />
        
        <div className="max-w-7xl mx-auto relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Details */}
            <motion.div 
              className={`p-8 rounded-xl shadow-2xl  border-2 transform hover:scale-105 transition-all duration-300  ${
                theme === 'dark' 
                  ? 'bg-gray-900/80 border-gray-600 shadow-gray-500/20' 
                  : 'bg-white/80 border-gray-600 shadow-gray-500/20'
              }`}
              variants={itemVariants}
              whileHover={{ y: -5 }}
            >
              <h2 className={`text-3xl font-bold mb-8 bg-clip-text text-center text-transparent ${
                theme === 'dark' 
                  ? 'bg-white' 
                  : 'bg-black'
              }`} style={{ fontFamily: 'Times New Roman, serif' }}>
                {t('contact.contactInformation')}
              </h2>

              <div className="space-y-6">
                {/* Phone */}
                <div className="flex items-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 ${
                    theme === 'dark' ? 'bg-gray-500' : 'bg-gray-900'
                  }`}>
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{t('contact.phone')}</h3>
                    <p className={`${theme === 'dark' ? 'text-white' : 'text-gray-600'}`}>{t('footer.phone')}</p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 ${
                    theme === 'dark' ? 'bg-gray-500' : 'bg-gray-900'
                  }`}>
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{t('contact.email')}</h3>
                    <p className={`${theme === 'dark' ? 'text-white' : 'text-gray-600'}`}>{t('footer.email')}</p>
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-start">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 mt-1 ${
                    theme === 'dark' ? 'bg-gray-500' : 'bg-gray-900'
                  }`}>
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{t('contact.address')}</h3>
                    <p className={`whitespace-pre-line ${theme === 'dark' ? 'text-white' : 'text-gray-600'}`}>{t('footer.address')}</p>
                  </div>
                </div>

                {/* Hours */}
                <div className="flex items-start">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 mt-1 ${
                    theme === 'dark' ? 'bg-gray-500' : 'bg-gray-900'
                  }`}>
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{t('contact.openingHours')}</h3>
                    <div className={`${theme === 'dark' ? 'text-white' : 'text-gray-600'}`}>
                      <p>{t('contact.mondayFriday')}</p>
                      <p>{t('contact.saturday')}</p>
                      <p>{t('contact.sundayClosed')}</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Restaurant Image */}
            <motion.div className="relative" variants={itemVariants}>
              <div className="rounded-xl overflow-hidden shadow-lg h-full min-h-[400px] relative">
                <Image
                  src="/images/banner.webp"
                  alt="East at West Restaurant"
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 40vw"
                  quality={75}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                <div className="absolute bottom-8 left-8 right-8 text-white text-center lg:text-left">
                  <h3 className={`text-5xl font-bold mb-2 ${
                    theme === 'dark' ? 'text-gray-500' : 'text-gray-900'
                  }`} style={{ fontFamily: 'Times New Roman, serif' }}>
                    {t('contact.restaurantImageAlt')}
                  </h3>
                  <p className="text-lg">
                    {t('contact.restaurantDescription')}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>



      {/* Social Media */}
      <motion.section 
        className={`py-20 px-4 sm:px-6 lg:px-8 relative ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
        }`}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        {/* Background Elements */}
        <motion.div 
          className="absolute bottom-10 left-10 w-32 h-32 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full opacity-10 "
          variants={floatingVariants}
          animate="float"
        />
        
        <div className="max-w-4xl mx-auto text-center relative">
          <motion.div variants={itemVariants}>
            <span className="inline-block text-6xl mb-4 animate-spin" style={{ animationDuration: '3s' }}>🌟</span>
          </motion.div>
          <motion.h2 
            className={`text-3xl sm:text-4xl font-bold mb-8 bg-clip-text text-transparent ${
              theme === 'dark' 
                ? 'bg-white' 
                : 'bg-black'
            }`}
            style={{ fontFamily: 'Times New Roman, serif' }}
            variants={itemVariants}
          >
            {t('contact.followUs')}
          </motion.h2>
          <motion.p 
            className={`text-lg mb-8 ${theme === 'dark' ? 'text-white' : 'text-gray-600'}`}
            variants={itemVariants}
          >
            {t('contact.socialDescription')}
          </motion.p>

          <motion.div className="flex justify-center space-x-6" variants={itemVariants}>
            <a
              href="#"
              className={`w-12 h-12 rounded-full flex items-center justify-center text-white transition-colors duration-300 ${
                theme === 'dark' 
                  ? 'bg-gray-500 hover:bg-gray-600' 
                  : 'bg-gray-900 hover:bg-gray-700'
              }`}
              aria-label="Facebook"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>
            <a
              href="#"
              className={`w-12 h-12 rounded-full flex items-center justify-center text-white transition-colors duration-300 ${
                theme === 'dark' 
                  ? 'bg-gray-500 hover:bg-gray-600' 
                  : 'bg-gray-900 hover:bg-gray-700'
              }`}
              aria-label="Instagram"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.334 3.608 1.308.974.974 1.246 2.242 1.308 3.608.058 1.266.069 1.646.069 4.85s-.012 3.584-.07 4.85c-.062 1.366-.334 2.633-1.308 3.608-.974.974-2.242 1.246-3.608 1.308-1.266.058-1.646.069-4.85.069s-3.584-.012-4.85-.07c-1.366-.062-2.633-.334-3.608-1.308-.974-.974-1.246-2.242-1.308-3.608C2.175 15.647 2.163 15.267 2.163 12s.012-3.584.07-4.85c.062-1.366.334-2.633 1.308-3.608.974-.974 2.242-1.246 3.608-1.308C8.416 2.175 8.796 2.163 12 2.163zm0-2.163C8.741 0 8.332.013 7.052.072 5.775.131 4.602.425 3.635 1.392 2.668 2.359 2.374 3.532 2.315 4.808 2.256 6.088 2.243 6.497 2.243 12c0 5.503.013 5.912.072 7.192.059 1.276.353 2.449 1.32 3.416.967.967 2.14 1.261 3.416 1.32 1.28.059 1.689.072 7.192.072s5.912-.013 7.192-.072c1.276-.059 2.449-.353 3.416-1.32.967-.967 1.261-2.14 1.32-3.416.059-1.28.072-1.689.072-7.192s-.013-5.912-.072-7.192c-.059-1.276-.353-2.449-1.32-3.416C21.551.425 20.378.131 19.102.072 17.822.013 17.413 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a3.999 3.999 0 1 1 0-7.998 3.999 3.999 0 0 1 0 7.998zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
              </svg>
            </a>
            <a
              href="#"
              className={`w-12 h-12 rounded-full flex items-center justify-center text-white transition-colors duration-300 ${
                theme === 'dark' 
                  ? 'bg-gray-500 hover:bg-gray-600' 
                  : 'bg-gray-900 hover:bg-gray-700'
              }`}
              aria-label="Twitter"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
              </svg>
            </a>
          </motion.div>
        </div>
      </motion.section>
    </div>
  )
} 