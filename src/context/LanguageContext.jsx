'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

const LanguageContext = createContext()

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState('en')
  const { i18n } = useTranslation()

  useEffect(() => {
    // Get language from localStorage or default to 'en'
    const savedLanguage = localStorage.getItem('language') || 'en'
    setCurrentLanguage(savedLanguage)
    i18n.changeLanguage(savedLanguage)
  }, [i18n])

  const changeLanguage = (locale) => {
    setCurrentLanguage(locale)
    localStorage.setItem('language', locale)
    i18n.changeLanguage(locale)
  }

  const value = {
    currentLanguage,
    changeLanguage,
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
} 