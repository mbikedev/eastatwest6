export default {
  plugins: {
    '@tailwindcss/postcss': {},
    autoprefixer: {
      // Only add prefixes for browsers we support
      overrideBrowserslist: [
        'Chrome >= 90',
        'Firefox >= 88', 
        'Safari >= 14.1',
        'Edge >= 90',
        '> 0.25%',
        'last 2 versions',
        'not dead',
        'not IE 11',
        'not op_mini all'
      ],
      // Remove outdated prefixes
      remove: true,
    },
    // Minify CSS in production
    ...(process.env.NODE_ENV === 'production' && {
      cssnano: {
        preset: ['default', {
          discardComments: { removeAll: true },
          normalizeWhitespace: true,
          mergeLonghand: true,
          mergeRules: true,
        }]
      }
    }),
  },
}