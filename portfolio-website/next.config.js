/** @type {import('next').NextConfig} */
const nextConfig = {
  // Removed 'output: export' to enable API routes
  eslint: {
    ignoreDuringBuilds: false, // Enable ESLint in production
  },
  typescript: {
    ignoreBuildErrors: false, // Enable TypeScript checking
  },
  images: { 
    unoptimized: false, // Enable image optimization now that we're not using static export
    domains: ['localhost'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // Optimize for Vercel deployment
  trailingSlash: false,
  reactStrictMode: true,
};

module.exports = nextConfig;
