import Link from 'next/link';
import { ReactNode } from 'react';

export function useMDXComponents(components: any): any {
  return {
    h1: ({ children }: { children: ReactNode }) => <h1 className="text-4xl font-bold mt-8 mb-4">{children}</h1>,
    h2: ({ children }: { children: ReactNode }) => <h2 className="text-3xl font-semibold mt-6 mb-3">{children}</h2>,
    h3: ({ children }: { children: ReactNode }) => <h3 className="text-2xl font-semibold mt-5 mb-2">{children}</h3>,
    p: ({ children }: { children: ReactNode }) => <p className="my-4 leading-relaxed">{children}</p>,
    a: ({ href, children }: { href?: string; children: ReactNode }) => {
      const isInternal = href?.startsWith('/');
      if (isInternal) {
        return (
          <Link href={href as any} className="text-blue-600 hover:underline">
            {children}
          </Link>
        );
      }
      return (
        <a href={href} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
          {children}
        </a>
      );
    },
    pre: ({ children }: { children: ReactNode }) => (
      <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto my-4">{children}</pre>
    ),
    code: ({ children }: { children: ReactNode }) => (
      <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">{children}</code>
    ),
    ul: ({ children }: { children: ReactNode }) => <ul className="list-disc list-inside my-4 space-y-2">{children}</ul>,
    ol: ({ children }: { children: ReactNode }) => (
      <ol className="list-decimal list-inside my-4 space-y-2">{children}</ol>
    ),
    li: ({ children }: { children: ReactNode }) => <li className="ml-4">{children}</li>,
    blockquote: ({ children }: { children: ReactNode }) => (
      <blockquote className="border-l-4 border-gray-200 pl-4 my-4 italic">{children}</blockquote>
    ),
    table: ({ children }: { children: ReactNode }) => (
      <div className="overflow-x-auto my-4">
        <table className="min-w-full divide-y divide-gray-200">{children}</table>
      </div>
    ),
    th: ({ children }: { children: ReactNode }) => (
      <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
        {children}
      </th>
    ),
    td: ({ children }: { children: ReactNode }) => (
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{children}</td>
    ),
    ...components,
  };
}
