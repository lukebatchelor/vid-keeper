const withPWA = require('next-pwa');
const { PHASE_DEVELOPMENT_SERVER, PHASE_PRODUCTION_SERVER } = require('next/constants');

module.exports = module.exports = (phase) => {
  return withPWA({
    reactStrictMode: true,
    pwa: {
      dest: 'public',
      disable: phase === PHASE_DEVELOPMENT_SERVER,
    },
  });
};
