"use client"

import Image from 'next/image'
import { useTranslation } from 'react-i18next'
import { useTheme } from '../context/ThemeContext'

const Footer = () => {
  const { t } = useTranslation('common')
  const { theme } = useTheme()

  return (
    <footer 
      className={`w-full relative overflow-hidden ${
        theme === 'dark' 
          ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white' 
          : 'bg-gradient-to-br from-[#033b3d] via-[#044a4c] to-[#033b3d] text-white'
      }`}
      role="contentinfo"
      aria-label="East at West Restaurant Footer"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5" aria-hidden="true">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.1%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
      </div>

      <div className="relative z-10">
        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-center">
            
            {/* Left Section - Logo and Brand */}
            <section className="flex flex-col items-center lg:items-start space-y-4" aria-labelledby="restaurant-info">
              <div className="relative group">
                <Image
                  src="/images/logo-tr.webp"
                  alt="East at West - Authentic Lebanese Restaurant in Brussels"
                  width={180}
                  height={60}
                  sizes="(max-width: 640px) 120px, (max-width: 768px) 150px, 180px"
                  quality={60}
                  className={`h-12 w-auto transition-all duration-500 group-hover:scale-110 ${
                    theme === 'dark' 
                      ? 'drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]' 
                      : 'drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]'
                  }`}
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
              
              <div className="text-center lg:text-left">
                <h2 id="restaurant-info" className="sr-only">Restaurant Information</h2>
                <p className="text-sm text-white/80 leading-relaxed max-w-xs" style={{ fontFamily: 'Rozha One, serif' }}>
                  {t('footer.tagline', 'Authentic Lebanese cuisine in the heart of Brussels')}
                </p>
              </div>
            </section>

            {/* Center Section - Social Media */}
            <section className="flex flex-col items-center space-y-4" aria-labelledby="social-media">
              <h2 id="social-media" className="text-lg font-semibold mb-4" style={{ fontFamily: 'Rozha One, serif' }}>
                {t('footer.followUs', 'Follow Us')}
              </h2>
              <nav className="flex space-x-4" aria-label="Social media links">
                <a
                  href="https://www.facebook.com/people/East-at-West/100063702576184/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Follow us on Facebook"
                  className="group relative p-3 rounded-full bg-gradient-to-r from-[#3b5998] to-[#2d4373] hover:from-[#2d4373] hover:to-[#1e2f4a] transition-all duration-300 transform hover:scale-110 hover:shadow-lg hover:shadow-[#3b5998]/30"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24" width="20" height="20" className="transition-transform duration-300 group-hover:scale-110" aria-hidden="true">
                    <path d="M22.675 0h-21.35C.595 0 0 .592 0 1.326v21.348C0 23.406.595 24 1.325 24h11.495v-9.294H9.691v-3.622h3.129V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116C23.406 24 24 23.406 24 22.674V1.326C24 .592 23.406 0 22.675 0" />
                  </svg>
                  <div className="absolute inset-0 rounded-full bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </a>
                
                <a
                  href="https://www.instagram.com/east_at_west/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Follow us on Instagram"
                  className="group relative p-3 rounded-full bg-gradient-to-r from-[#E4405F] to-[#C13584] hover:from-[#C13584] hover:to-[#A02A6B] transition-all duration-300 transform hover:scale-110 hover:shadow-lg hover:shadow-[#E4405F]/30"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24" width="20" height="20" className="transition-transform duration-300 group-hover:scale-110" aria-hidden="true">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.334 3.608 1.308.974.974 1.246 2.242 1.308 3.608.058 1.266.069 1.646.069 4.85s-.012 3.584-.07 4.85c-.062 1.366-.334 2.633-1.308 3.608-.974.974-2.242 1.246-3.608 1.308-1.266.058-1.646.069-4.85.069s-3.584-.012-4.85-.07c-1.366-.062-2.633-.334-3.608-1.308-.974-.974-1.246-2.242-1.308-3.608C2.175 15.647 2.163 15.267 2.163 12s.012-3.584.07-4.85c.062-1.366.334-2.633 1.308-3.608.974-.974 2.242-1.246 3.608-1.308C8.416 2.175 8.796 2.163 12 2.163zm0-2.163C8.741 0 8.332.013 7.052.072 5.775.131 4.602.425 3.635 1.392 2.668 2.359 2.374 3.532 2.315 4.808 2.256 6.088 2.243 6.497 2.243 12c0 5.503.013 5.912.072 7.192.059 1.276.353 2.449 1.32 3.416.967.967 2.14 1.261 3.416 1.32 1.28.059 1.689.072 7.192.072s5.912-.013 7.192-.072c1.276-.059 2.449-.353 3.416-1.32.967-.967 1.261-2.14 1.32-3.416.059-1.28.072-1.689.072-7.192s-.013-5.912-.072-7.192c-.059-1.276-.353-2.449-1.32-3.416C21.551.425 20.378.131 19.102.072 17.822.013 17.413 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a3.999 3.999 0 1 1 0-7.998 3.999 3.999 0 0 1 0 7.998zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
                  </svg>
                  <div className="absolute inset-0 rounded-full bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </a>
              </nav>
            </section>

            {/* Quick Links Section */}
            <section className="flex flex-col items-center space-y-4" aria-labelledby="quick-links">
              <h2 id="quick-links" className="text-lg font-semibold mb-4" style={{ fontFamily: 'Rozha One, serif' }}>
                {t('footer.quickLinks', 'Quick Links')}
              </h2>
              <nav className="flex flex-col space-y-2" aria-label="Quick links">
                <a
                  href="/contact"
                  className="group flex items-center space-x-2 text-sm text-white/80 hover:text-white transition-colors duration-300"
                  style={{ fontFamily: 'Rozha One, serif' }}
                >
                  <svg className="w-4 h-4 text-white/70 group-hover:text-white transition-colors duration-300" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  <span>{t('nav.contact')}</span>
                </a>
                <a
                  href="/gallery"
                  className="group flex items-center space-x-2 text-sm text-white/80 hover:text-white transition-colors duration-300"
                  style={{ fontFamily: 'Rozha One, serif' }}
                >
                  <svg className="w-4 h-4 text-white/70 group-hover:text-white transition-colors duration-300" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                    <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                  </svg>
                  <span>{t('nav.gallery')}</span>
                </a>
              </nav>
            </section>

            {/* Right Section - Contact Information */}
            <section className="flex flex-col items-center lg:items-end space-y-3" aria-labelledby="contact-info">
              <h2 id="contact-info" className="text-lg font-semibold mb-4" style={{ fontFamily: 'Rozha One, serif' }}>
                {t('footer.contact', 'Contact')}
              </h2>
              <address className="flex flex-col items-center lg:items-end space-y-2 text-sm not-italic">
                <div className="flex items-center space-x-2 group">
                  <svg className="w-4 h-4 text-white/70 group-hover:text-white transition-colors duration-300" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  <a 
                    href={`mailto:${t('footer.email')}`}
                    className="hover:text-white/90 transition-colors duration-300" 
                    style={{ fontFamily: 'Rozha One, serif' }}
                    aria-label={`Email us at ${t('footer.email')}`}
                  >
                    {t('footer.email')}
                  </a>
                </div>
                <div className="flex items-center space-x-2 group">
                  <svg className="w-4 h-4 text-white/70 group-hover:text-white transition-colors duration-300" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                  <a 
                    href={`tel:${t('footer.phone').replace(/\s+/g, '')}`}
                    className="hover:text-white/90 transition-colors duration-300" 
                    style={{ fontFamily: 'Rozha One, serif' }}
                    aria-label={`Call us at ${t('footer.phone')}`}
                  >
                    {t('footer.phone')}
                  </a>
                </div>
                <div className="flex items-center space-x-2 group">
                  <svg className="w-4 h-4 text-white/70 group-hover:text-white transition-colors duration-300" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  <span className="hover:text-white/90 transition-colors duration-300 text-center lg:text-right max-w-xs" style={{ fontFamily: 'Rozha One, serif' }}>
                    {t('footer.address')}
                  </span>
                </div>
              </address>
            </section>
          </div>
        </div>

        {/* Bottom Section - Copyright and Design Credit */}
        <div className="border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4 text-sm text-white/70">
                <span style={{ fontFamily: 'Rozha One, serif' }}>{t('footer.copyright')}</span>
                <span className="hidden md:inline-block" aria-hidden="true">•</span>
                <span style={{ fontFamily: 'Rozha One, serif' }}>{t('footer.design')}</span>
              </div>
              
              <div className="flex items-center space-x-2 text-xs text-white/50" style={{ fontFamily: 'Rozha One, serif' }}>
                <span>Made with</span>
                <svg className="w-4 h-4 text-red-500 animate-pulse" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
                <span>in Brussels</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Restaurant",
            "name": "East at West",
            "description": "Authentic Lebanese cuisine in the heart of Brussels",
            "url": "https://eastatwest.com",
            "telephone": t('footer.phone'),
            "email": t('footer.email'),
            "address": {
              "@type": "PostalAddress",
              "streetAddress": t('footer.address')
            },
            "servesCuisine": "Lebanese",
            "priceRange": "€€",
            "sameAs": [
              "https://www.facebook.com/people/East-at-West/100063702576184/",
              "https://www.instagram.com/east_at_west/"
            ]
          })
        }}
      />
    </footer>
  )
}

export default Footer
