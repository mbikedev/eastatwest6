module.exports = {
  plugins: {
    '@tailwindcss/postcss': {},
    'autoprefixer': {
      overrideBrowserslist: [
        'Chrome >= 95',
        'Firefox >= 95',
        'Safari >= 15',
        'Edge >= 95',
        '> 1%',
        'not dead',
        'not IE 11'
      ]
    }
  }
}