'use client'

import { useTranslation } from 'react-i18next'
import { useTheme } from '../context/ThemeContext'

const LanguageSwitcher = () => {
  const { i18n } = useTranslation()
  const { theme } = useTheme()

  const languages = [
    { code: 'en', label: 'EN', flag: '🇺🇸' },
    { code: 'fr', label: 'FR', flag: '🇫🇷' },
    { code: 'nl', label: 'NL', flag: '🇳🇱' },
  ]

  const handleLanguageChange = (langCode) => {
    i18n.changeLanguage(langCode)
    localStorage.setItem('language', langCode)
  }

  return (
    <div className="flex items-center space-x-1">
      {languages.map((language) => (
        <button
          key={language.code}
          onClick={() => handleLanguageChange(language.code)}
          className={`flex items-center space-x-1 px-2 py-1 rounded-md text-sm font-medium transition-all duration-200 ${
            i18n.language === language.code
              ? theme === 'dark'
                ? 'bg-[#1A1A1A] text-white'
                : 'bg-[#1A1A1A] text-white'
              : theme === 'dark'
              ? 'text-white/80 hover:text-white hover:bg-white/10'
              : 'text-white/80 hover:text-white hover:bg-black/10'
          }`}
          aria-label={`Switch to ${language.label}`}
        >
          <span className="text-sm">{language.flag}</span>
          <span className="text-xs font-medium">{language.label}</span>
        </button>
      ))}
    </div>
  )
}

export default LanguageSwitcher
