import createMDX from '@next/mdx';
import type { NextConfig } from 'next';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';

const withMDX = createMDX({
  options: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [rehypeSlug, rehypeAutolinkHeadings],
  },
});

const nextConfig: NextConfig = {
  transpilePackages: ['next-mdx-remote'],
};

export default withMDX(nextConfig);
