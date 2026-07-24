/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['@prisma/client', 'prisma', '@langchain/core', '@langchain/openai', '@langchain/langgraph', 'nodemailer', 'dotenv', '@notionhq/client'],
  experimental: {
    externalDir: true,
    workerThreads: false,
    cpus: 1,
  },
  allowedDevOrigins: ['10.169.241.10'],
  typescript: {
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
