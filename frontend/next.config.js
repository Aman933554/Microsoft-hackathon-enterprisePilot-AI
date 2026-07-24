/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    externalDir: true,
    serverComponentsExternalPackages: ['@prisma/client', 'prisma', '@langchain/core', '@langchain/openai', '@langchain/langgraph', 'nodemailer', 'dotenv', '@notionhq/client'],
  },
  allowedDevOrigins: ['10.169.241.10'],
  typescript: {
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
