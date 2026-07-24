/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    externalDir: true,
    cpus: 1,
    memoryBasedWorkersCount: true,
  },
  allowedDevOrigins: ['10.169.241.10'],
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
