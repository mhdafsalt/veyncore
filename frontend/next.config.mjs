/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  optimizeFonts: false,
  experimental: {
    optimizePackageImports: ['react-icons'],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000') + '/api/:path*',
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
    ];
  },
};

export default nextConfig;
