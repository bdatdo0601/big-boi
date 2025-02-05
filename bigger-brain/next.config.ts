import createMDX from '@next/mdx'
import remarkGfm from 'remark-gfm'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import type { NextConfig } from 'next';

const withMDX = createMDX({
  options: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [rehypeSlug, rehypeAutolinkHeadings],
  },
})

const nextConfig: NextConfig = {
  transpilePackages: ['next-mdx-remote'],
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

export default withMDX(nextConfig)
