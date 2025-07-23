'use client';

import { MDXProvider } from '@mdx-js/react';
import { MDXRemote } from 'next-mdx-remote';

interface MDXContentProps {
  source: any;
  components?: Record<string, React.ComponentType>;
}

export default function MDXContent({ source, components = {} }: MDXContentProps) {
  if (!source) return null;
  return (
    <MDXProvider components={components}>
      <div className="prose max-w-4xl mx-auto flex flex-col gap-4 overflow-auto">
        <MDXRemote {...source} components={components} />
      </div>
    </MDXProvider>
  );
}
