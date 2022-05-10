// eslint-disable-next-line @typescript-eslint/no-var-requires
const withPlugins = require('next-compose-plugins');
const withPWA = require('next-pwa')
const withFonts = require('next-fonts');
const isProduction = process.env.NODE_ENV === 'production'

module.exports = withPlugins(
  [
    [withPWA({
      pwa: {
        dest: 'public',
        disable: !isProduction
      }
    })],
    [withFonts({
      webpack(config, options) {
        return config;
      }
    })],
  ],
)

module.exports = withPWA({
  pwa: {
    dest: 'public',
    disable: !isProduction
  }
})
