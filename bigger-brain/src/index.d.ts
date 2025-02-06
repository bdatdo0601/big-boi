declare module 'react-syntax-highlighter' {
  import { ReactNode } from 'react';

  interface SyntaxHighlighterProps {
    language?: string;
    style?: any;
    children: string;
    className?: string;
    showLineNumbers?: boolean;
    wrapLines?: boolean;
    lineProps?: any;
    customStyle?: any;
  }

  export default function SyntaxHighlighter(props: SyntaxHighlighterProps): ReactNode;

  export const Prism: typeof SyntaxHighlighter;
  export const Light: typeof SyntaxHighlighter;
}

declare module 'react-syntax-highlighter/dist/esm/styles/prism' {
  const styles: { [key: string]: any };
  export const nightOwl: { [key: string]: any };
  export default styles;
}

declare module 'react-syntax-highlighter/dist/esm/styles/hljs' {
  const styles: { [key: string]: any };
  export default styles;
}

declare module 'reading-time/lib/reading-time' {
  export default function readingTime(text: string): {
    text: string;
    minutes: number;
    time: number;
    words: number;
  };
}

declare module '*.mdx' {
  import type { ComponentType } from 'react'
  const component: ComponentType
  export default component
}

interface FrontMatter {
  title?: string
  date?: string
  tags?: string[]
  [key: string]: any
}

interface MDXContent {
  slug: string
  metadata: FrontMatter
  content: string
  backlinks: string[]
}

declare module 'react-digraph' {
  export const GraphView: React.ComponentType<any>;
}