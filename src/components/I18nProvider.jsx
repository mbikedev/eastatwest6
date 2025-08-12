'use client'

import { useEffect, useState } from 'react'
import { I18nextProvider } from 'react-i18next'
import initI18next from '../lib/i18n'

const I18nProvider = ({ children }) => {
  const [i18nInstance, setI18nInstance] = useState(null)
  const [language, setLanguage] = useState(
    typeof window !== 'undefined'
      ? localStorage.getItem('language') || 'en'
      : 'en'
  )

  useEffect(() => {
    const onStorage = () => {
      const lang = localStorage.getItem('language') || 'en'
      setLanguage(lang)
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  useEffect(() => {
    const initI18n = async () => {
      const instance = await initI18next(language)
      setI18nInstance(instance)
    }
    initI18n()
  }, [language])

  if (!i18nInstance) {
    return <div>Loading...</div>
  }

  return (
    <I18nextProvider i18n={i18nInstance}>
      {children}
    </I18nextProvider>
  )
}

export default I18nProvider 