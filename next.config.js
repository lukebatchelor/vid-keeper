const withPWA = require('next-pwa');

module.exports = withPWA({
  reactStrictMode: false,
  pwa: {
    dest: 'public',
    disable: phase === PHASE_DEVELOPMENT_SERVER,
  },
});
