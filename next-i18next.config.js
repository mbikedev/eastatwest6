module.exports = {
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'fr', 'nl'],
    localeDetection: true,
  },
  localePath: './public/locales',
  reloadOnPrerender: process.env.NODE_ENV === 'development',
} 