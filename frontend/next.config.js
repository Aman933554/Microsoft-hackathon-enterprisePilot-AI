/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    externalDir: true,
  },
  allowedDevOrigins: ['10.169.241.10'],
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
