'use client'

import Image from 'next/image'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/context/ThemeContext'

export default function MenuHeroClient() {
  const { t } = useTranslation('common')
  const { theme } = useTheme()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name: 'EastAtWest',
    url: '/menu',
    servesCuisine: ['Mediterranean', 'Middle Eastern', 'Lebanese'],
    hasMenu: '/menu',
  }

  return (
    <main className={theme === 'dark' ? 'bg-[#1A1A1A] text-white' : 'bg-white text-[#1A1A1A]'}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="relative w-full min-h-[60vh] sm:min-h-[70vh] lg:min-h-[75vh] flex items-center justify-center overflow-hidden">
        <Image src="/images/banner.webp" alt={t('menu.heroAlt')} fill priority className="object-cover" quality={50} sizes="100vw" />
        <div className="absolute inset-0 bg-black/40" />

        <div className="relative z-10 max-w-4xl w-full px-4 sm:px-6 lg:px-8 text-center">
          <h1 className={`text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight ${theme === 'dark'
            ? 'bg-gradient-to-b from-gray-100 via-gray-300 to-gray-900 bg-clip-text text-transparent'
            : 'text-gray-400'}
`}>{t('menu.title')}</h1>
          <p className="mt-4 sm:mt-6 text-base sm:text-lg md:text-xl opacity-90 text-white ${theme === 'dark'
                ? ' text-[#1A1A1A] focus:ring-white/30 text-white'
                :  text-white focus:ring-[#1A1A1A]/30'}
              `}">{t('menu.subtitle')}</p>

          <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <a
              href="/pdfs/menus.pdf"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t('menu.buttons.menu')}
              className={`inline-block px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-base sm:text-lg font-semibold transition-all duration-300 transform hover:scale-105 focus:scale-105 shadow-lg focus:outline-none focus:ring-4 ${theme === 'dark'
                ? 'bg-gradient-to-b from-gray-100 via-gray-700 to-gray-900 text-[#1A1A1A] focus:ring-white/30 text-white'
                : 'bg-gradient-to-b from-[#2A7B9B] via-[#1A703E] to-green-900 text-[#3F423A] focus:ring-white/30 text-white'}
              `}
            >
              {t('menu.buttons.menu')}
            </a>

            <a
              href="/pdfs/take-away-only.pdf"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t('menu.buttons.menuTakeawayOnly')}
              className={`inline-block px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-base sm:text-lg font-semibold transition-all duration-300 transform hover:scale-105 focus:scale-105 shadow-lg focus:outline-none focus:ring-4 ${theme === 'dark'
                ? 'bg-gradient-to-b from-gray-100 via-gray-700 to-gray-900 text-[#1A1A1A] focus:ring-white/30 text-white'
                : 'bg-gradient-to-b from-[#2A7B9B] via-[#1A703E] to-green-900 text-[#3F423A] focus:ring-white/30 text-white'}
              `}
            >
              {t('menu.buttons.menuTakeawayOnly')}
            </a>
          </div>
        </div>
      </section>

      <section className={`py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 ${theme === 'dark' ? 'bg-[#111] text-white/90' : 'bg-[#f9f7f5] text-[#1A1A1A]'}`}>
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-base sm:text-lg md:text-xl leading-relaxed">{t('menu.description')}</p>
        </div>
      </section>

      <section id="menu-list" className="py-8 sm:py-12" />
    </main>
  )
}


