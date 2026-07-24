/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    externalDir: true,
    cpus: 1,
    workerThreads: false,
    memoryBasedWorkersCount: true,
  },
  allowedDevOrigins: ['10.169.241.10'],
};

module.exports = nextConfig;
