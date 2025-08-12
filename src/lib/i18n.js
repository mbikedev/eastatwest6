import { createInstance } from 'i18next'
import { initReactI18next } from 'react-i18next'
import HttpBackend from 'i18next-http-backend'

const initI18next = async (locale) => {
  const i18nInstance = createInstance()
  await i18nInstance
    .use(HttpBackend)
    .use(initReactI18next)
    .init({
      lng: locale,
      fallbackLng: 'en',
      ns: ['common'],
      defaultNS: 'common',
      backend: {
        loadPath: '/locales/{{lng}}/{{ns}}.json',
      },
      react: { useSuspense: false },
      interpolation: { escapeValue: false },
    })
  return i18nInstance
}

export default initI18next 