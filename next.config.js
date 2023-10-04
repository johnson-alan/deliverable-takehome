/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [{ protocol: 'https', hostname: 'upload.wikimedia.org' }],
  },
  experimental: {
    outputFileTracingIncludes: {
      '/api/ai': ['./types/filters.ts'],
    },
  },
};

module.exports = nextConfig;
