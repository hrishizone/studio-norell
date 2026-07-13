/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
      },
    ],
  },
  // three.js ships ESM; transpile the R3F ecosystem for maximum compatibility.
  transpilePackages: ['three'],
  experimental: {
    optimizePackageImports: ['framer-motion', 'react-icons'],
  },
};

export default nextConfig;
