import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  rewrites: async (): Promise<any> => {
    return {
      beforeFiles: [
        // Handle blogs.datbdo.com
        {
          source: '/:path*',
          has: [
            {
              type: 'host',
              value: 'blogs.datbdo.com',
            },
            {
              type: 'host',
              value: 'localhost:3000'
            }
          ],
          destination: '/blogs/:path*',
        },
        // Handle docs.datbdo.com
        {
          source: '/:path*',
          has: [
            {
              type: 'host',
              value: 'docs.datbdo.com',
            },
          ],
          destination: '/docs/:path*',
        },
      ],
    };
  },
};

export default nextConfig;
