'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useTranslation } from 'react-i18next'
import { useTheme } from '../context/ThemeContext'
import LanguageSwitcher from './LanguageSwitcher'
import ThemeToggle from './ThemeToggle'
import { motion, AnimatePresence } from 'framer-motion'

const Header = () => {
  const { t } = useTranslation('common')
  const { theme } = useTheme()
  const [scrolled, setScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isMobileMenuOpen])

  return (
    <motion.header
      className={`fixed w-full top-0 z-50 transition-all duration-700 ${scrolled
          ? theme === 'dark'
            ? 'bg-gray-900/50 backdrop-blur-md border-b border-white/10 shadow-lg'
            : 'bg-gray-900/50 backdrop-blur-md border-b border-gray-900/10 shadow-lg'
          : theme === 'dark'
            ? 'bg-gray-900 backdrop-blur-sm'
            : 'bg-gray-900/75 backdrop-blur-sm'
        }`}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-5 md:px-6 lg:px-8 relative">
        <div className={`flex items-center justify-between transition-all duration-300 ${scrolled ? 'h-12 sm:h-13 md:h-14' : 'h-14 sm:h-15 md:h-16'}`}>
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link href="/" className="flex items-center space-x-2 group">
              <motion.div
                className="relative"
                initial={{ rotate: -5 }}
                animate={{ rotate: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                <Image
                  src="/images/logo-tr.webp"
                  alt="East at West Logo"
                  width={40}
                  height={40}
                  sizes="(max-width: 640px) 28px, (max-width: 768px) 32px, 40px"
                  quality={60}
                  priority
                  className={`transition-all duration-500 group-hover:scale-110 ${scrolled ? 'h-6 sm:h-7 md:h-8' : 'h-8 sm:h-9 md:h-10'
                    } w-auto ${theme === 'dark'
                      ? 'drop-shadow-[0_0_8px_rgba(251,146,60,0.4)] group-hover:drop-shadow-[0_0_12px_rgba(251,146,60,0.6)]'
                      : 'drop-shadow-[0_2px_8px_rgba(0,0,0,0.1)] group-hover:drop-shadow-[0_4px_16px_rgba(251,146,60,0.3)]'
                    }`}
                />
                <motion.div
                  className={`absolute inset-0 rounded-full blur-xl opacity-0 group-hover:opacity-100 ${theme === 'dark'
                      ? 'bg-gradient-to-r from-[rgb(26,26,26)]/20 via-[rgb(26,26,26)]/20 to-[rgb(26,26,26)]/20'
                      : 'bg-gradient-to-r from-[rgb(168,213,186)]/20 via-[rgb(168,213,186)]/20 to-[rgb(168,213,186)]/20'
                    }`}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>
              <div
                className={`relative ml-3 sm:ml-4 md:ml-5 h-auto italic hidden md:block ${theme === 'dark' ? 'text-[rgb(255,255,255)]' : 'text-[rgb(168,213,186)]'
                  }`}
                style={{ font: 'italic 20px sm:text-24px md:text-28px lg:text-30px Rozha One, serif' }}
              >
                <p>
                  <em></em>East At West
                </p>
              </div>
            </Link>
          </motion.div>



          {/* Modern Responsive Navigation */}
          <motion.nav
            className="flex items-center"
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            {/* Navigation Links */}
            <div className="hidden lg:flex items-center space-x-0.5 sm:space-x-1 md:space-x-1.5 lg:space-x-2">
              {[
                { href: '/menu', label: t('nav.menu') },
                { href: '/reservations', label: t('nav.reservations') },
                { href: '/takeaway', label: t('nav.takeaway') },
                { href: '/blog', label: t('nav.blog') },
                { href: '/events-catering', label: t('nav.events') },
                { href: '/about', label: t('nav.about') }
              ].map((item, index) => (
                <motion.div
                  key={item.href}
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                >
                  <Link
                    href={item.href}
                    target={item.href.endsWith('.pdf') ? '_blank' : undefined}
                    rel={item.href.endsWith('.pdf') ? 'noopener noreferrer' : undefined}
                    className={`relative px-2 sm:px-2.5 md:px-3 lg:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm md:text-sm lg:text-base font-medium transition-all duration-300 group backdrop-blur-sm ${theme === 'dark'
                        ? 'text-white/90 hover:text-white hover:bg-white/10 border border-transparent hover:border-white/20'
                        : 'text-white/90 hover:text-white hover:bg-black/10 border border-transparent hover:border-black/20'
                      }`}
                  >
                    <span className="relative z-10">{item.label}</span>
                    <motion.div
                      className={`absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 ${theme === 'dark'
                          ? 'bg-gradient-to-r from-[rgb(26,26,26)]/20 to-[rgb(26,26,26)]/20'
                          : 'bg-gradient-to-r from-[rgb(168,213,186)]/20 to-[rgb(168,213,186)]/20'
                        }`}
                      transition={{ duration: 0.3 }}
                    />
                    <motion.div
                      className={`absolute bottom-0 left-1/2 w-0 h-0.5 group-hover:w-full group-hover:left-0 transition-all duration-300 ${theme === 'dark'
                          ? 'bg-gradient-to-r from-[rgb(26,26,26)] to-[rgb(26,26,26)]'
                          : 'bg-gradient-to-r from-[rgb(168,213,186)] to-[rgb(168,213,186)]'
                        }`}
                    />
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden">
              <motion.button
                onClick={toggleMobileMenu}
                className={`relative p-3 rounded-xl transition-all duration-300 group backdrop-blur-sm ${theme === 'dark'
                    ? 'text-white hover:text-[rgb(255,255,255)] hover:bg-[rgb(26,26,26)]/10'
                    : 'text-white hover:text-[rgb(168,213,186)] hover:bg-black/10'
                  }`}
                aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="w-6 h-6 relative flex flex-col justify-center items-center">
                  <motion.span
                    className="block h-0.5 w-6 rounded-full bg-white transition-all duration-300"
                    animate={isMobileMenuOpen ? { rotate: 45, y: 0 } : { rotate: 0, y: -4 }}
                  />
                  <motion.span
                    className="block h-0.5 w-6 rounded-full bg-white transition-all duration-300"
                    animate={isMobileMenuOpen ? { opacity: 0 } : { opacity: 1 }}
                  />
                  <motion.span
                    className="block h-0.5 w-6 rounded-full bg-white transition-all duration-300"
                    animate={isMobileMenuOpen ? { rotate: -45, y: 0 } : { rotate: 0, y: 4 }}
                  />
                </div>
              </motion.button>
            </div>

            {/* Controls */}
            <motion.div
              className="flex items-center space-x-1.5 sm:space-x-2 md:space-x-2.5 lg:space-x-3 ml-2 sm:ml-2.5 md:ml-3 lg:ml-4 pl-2 sm:pl-2.5 md:pl-3 lg:pl-4 border-l border-white/20"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <LanguageSwitcher />
              <ThemeToggle />
            </motion.div>
          </motion.nav>
        </div>

        {/* Mobile Menu Dropdown */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              className={`absolute top-full left-0 right-0 lg:hidden z-40 ${theme === 'dark'
                  ? 'bg-black/95 border-b border-white/10'
                  : 'bg-white/95 border-b border-black/10'
                } backdrop-blur-xl shadow-2xl`}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <div className="px-4 sm:px-6 py-3 sm:py-4 space-y-1 sm:space-y-2">
                {[
                  { href: '/menu', label: t('nav.menu'), icon: '🍽️' },
                  { href: '/reservations', label: t('nav.reservations'), icon: '📅' },
                  { href: '/takeaway', label: t('nav.takeaway'), icon: '🥡' },
                  { href: '/blog', label: t('nav.blog'), icon: '📝' },
                  { href: '/events-catering', label: t('nav.events'), icon: '🎉' },
                  { href: '/about', label: t('nav.about'), icon: '👥' }
                ].map((item, index) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Link
                      href={item.href}
                      target={item.href.endsWith('.pdf') ? '_blank' : undefined}
                      rel={item.href.endsWith('.pdf') ? 'noopener noreferrer' : undefined}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center space-x-2 sm:space-x-3 p-3 sm:p-4 rounded-lg sm:rounded-xl transition-all duration-300 group ${theme === 'dark'
                          ? 'text-white hover:bg-white/10 border border-transparent hover:border-white/20'
                          : 'text-gray-900 hover:bg-black/10 border border-transparent hover:border-black/20'
                        }`}
                    >
                      <span className="text-lg sm:text-xl">{item.icon}</span>
                      <span className="font-bold text-sm sm:text-base">{item.label}</span>
                      <motion.div
                        className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </motion.div>
                    </Link>
                  </motion.div>
                ))}

                {/* Mobile Controls */}
                <div className="pt-3 sm:pt-4 mt-3 sm:mt-4 border-t border-white/10 flex items-center justify-between">
                  <div className="flex items-center space-x-2 sm:space-x-4">
                    <span className={`text-xs sm:text-sm font-medium ${theme === 'dark' ? 'text-white/70' : 'text-gray-700'
                      }`}>
                      Settings
                    </span>
                    <LanguageSwitcher />
                    <ThemeToggle />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </motion.header>
  )
}

export default Header
