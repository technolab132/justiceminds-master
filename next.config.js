/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
}
require('dotenv').config();
const path = require('path');

module.exports = {
  webpack: (config) => {
    config.resolve.alias['@'] = path.join(__dirname, 'src');
    return config;
  },
};

module.exports = nextConfig
