/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['@prisma/client', 'prisma', '@langchain/core', '@langchain/openai', '@langchain/langgraph', 'nodemailer', 'dotenv', '@notionhq/client'],
  experimental: {
    externalDir: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
