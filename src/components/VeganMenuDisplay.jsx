'use client'

import Image from 'next/image'
import { useTranslation } from 'react-i18next'
import { useTheme } from '../context/ThemeContext'
import { useLightbox } from '../context/LightboxContext'

export default function VeganMenuDisplay() {
  const { t } = useTranslation('common')
  const { theme } = useTheme()
  const { openLightbox } = useLightbox()

  // Define all menu images for gallery browsing
  const menuImages = [
    {
      src: "/images/menus/menu-east-at-west.webp",
      alt: t('menu.menuDisplay.title')
    },
    {
      src: "/images/menus/menu-vegan.webp", 
      alt: t('menu.veganMenuDisplay.title')
    }
  ]

  const veganMenuItems = [
    'grilledEggplant',
    'specialSauce',
    'hummus',
    'moutabal',
    'fattoush',
    'extraBread'
  ]

  return (
    <section className={`py-20 px-4 sm:px-6 lg:px-8 ${
      theme === 'dark' ? 'bg-zinc-800 border-t border-gray-700' : 'bg-gray-50'
    }`}>
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className={`text-4xl sm:text-5xl font-bold mb-4 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            {t('menu.veganMenuDisplay.title')}
          </h2>
          <p className={`text-xl font-semibold ${
            theme === 'dark' ? 'text-orange-400' : 'text-orange-500'
          }`}>
            {t('menu.veganMenuDisplay.pricePerPerson')}
          </p>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left Side - Image */}
          <div className="relative">
            <div 
              className="relative overflow-hidden rounded-lg shadow-2xl cursor-pointer group transition-all duration-300 hover:shadow-3xl"
              onClick={() => openLightbox(
                "/images/menus/menu-vegan.webp",
                t('menu.veganMenuDisplay.title'),
                menuImages,
                1
              )}
            >
              <Image
                src="/images/menus/menu-vegan.webp"
                alt={t('menu.veganMenuDisplay.title')}
                width={600}
                height={800}
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                priority
                style={{ width: '100%', height: 'auto' }}
              />
              
              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <div className={`p-3 rounded-full ${
                  theme === 'dark' ? 'bg-white/90' : 'bg-black/80'
                } backdrop-blur-sm`}>
                  <svg 
                    className={`w-8 h-8 ${theme === 'dark' ? 'text-gray-900' : 'text-white'}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Menu Content */}
          <div className={`${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            <h3 className={`text-2xl sm:text-3xl font-bold mb-6 italic ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              {t('menu.veganMenuDisplay.setMenuTitle')}
            </h3>

            {/* Description */}
            <p className={`text-lg mb-8 leading-relaxed ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              {t('menu.veganMenuDisplay.description')}
            </p>

            {/* Menu Items List */}
            <ul className="space-y-4">
              {veganMenuItems.map((item, index) => (
                <li key={index} className="flex items-start">
                  <span className={`inline-block w-2 h-2 rounded-full mt-2 mr-4 flex-shrink-0 ${
                    theme === 'dark' ? 'bg-green-400' : 'bg-green-500'
                  }`}></span>
                  <span className={`text-base leading-relaxed ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    {t(`menu.veganMenuDisplay.items.${item}`)}
                  </span>
                </li>
              ))}
            </ul>

            {/* Vegan Badge */}
            <div className="mt-8 inline-flex items-center px-4 py-2 rounded-full bg-green-100 dark:bg-green-900/30">
              <span className="text-green-600 dark:text-green-400 font-semibold text-sm">
                🌱 100% Vegan
              </span>
            </div>

            {/* Call to Action */}
            <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="/reservations"
                  className="inline-block bg-green-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-green-700 transition-all duration-300 transform hover:scale-105 shadow-lg focus:ring-4 focus:ring-green-300 focus:outline-none text-center"
                >
                  {t('nav.reservations')}
                </a>
                <a
                  href="/contact"
                  className={`inline-block border-2 px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg focus:ring-4 focus:outline-none text-center ${
                    theme === 'dark'
                      ? 'border-green-400 text-green-400 hover:bg-green-400 hover:text-zinc-900 focus:ring-green-300'
                      : 'border-green-600 text-green-600 hover:bg-green-600 hover:text-white focus:ring-green-300'
                  }`}
                >
                  {t('nav.contact')}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 