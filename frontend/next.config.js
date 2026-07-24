/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    externalDir: true,
  },
  allowedDevOrigins: ['10.169.241.10'],
  typescript: {
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
