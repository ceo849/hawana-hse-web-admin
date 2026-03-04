import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  allowedDevOrigins: ['localhost','127.0.0.1','192.168.1.2'],

  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://127.0.0.1:3001/v1/:path*',
      },
    ];
  },
};

export default nextConfig;
