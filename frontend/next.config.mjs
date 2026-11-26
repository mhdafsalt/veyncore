/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  optimizeFonts: false,
  compress: true,
  poweredByHeader: false,
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [360, 480, 640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: (process.env.NEXT_PUBLIC_API_URL || 'https://veyncore.vercel.app') + '/api/:path*',
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/login',
        destination: '/account/login',
        permanent: true,
      },
      {
        source: '/account',
        destination: '/account/login',
        permanent: false,
      },
      {
        source: '/terms',
        destination: '/pages/terms-of-service',
        permanent: true,
      },
      {
        source: '/terms-and-conditions',
        destination: '/pages/terms-of-service',
        permanent: true,
      },
      {
        source: '/terms-of-service',
        destination: '/pages/terms-of-service',
        permanent: true,
      },
      {
        source: '/privacy',
        destination: '/pages/privacy-policy',
        permanent: true,
      },
      {
        source: '/privacy-policy',
        destination: '/pages/privacy-policy',
        permanent: true,
      },
      {
        source: '/refund',
        destination: '/pages/refund-policy',
        permanent: true,
      },
      {
        source: '/refund-policy',
        destination: '/pages/refund-policy',
        permanent: true,
      },
      {
        source: '/shipping',
        destination: '/pages/shipping-policy',
        permanent: true,
      },
      {
        source: '/shipping-policy',
        destination: '/pages/shipping-policy',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
