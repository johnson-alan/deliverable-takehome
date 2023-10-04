/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  target: 'serverless',
  images: {
    remotePatterns: [{ protocol: 'https', hostname: 'upload.wikimedia.org' }],
  },
  experimental: {
    outputFileTracing: true
  },
  serverlessFunctions: {
    'pages/api/ai.js': {
      outputFileTracingIncludes: ['types/filters.ts']
    }
  }
};

module.exports = nextConfig;
