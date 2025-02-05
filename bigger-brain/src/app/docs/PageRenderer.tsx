"use client"

import React from 'react';
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';

interface Attachment {
  name: string;
  path: string;
}

interface DocumentContent {
  slug: string;
  frontmatter: {
    title: string;
    [key: string]: any;
  };
  mdxSource: MDXRemoteSerializeResult;
  attachments?: Attachment[];
}

interface PageRendererProps {
  content: DocumentContent[];
}

const PageRenderer: React.FC<PageRendererProps> = ({ content }) => {
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <div className="documentation-page">
      <h1>Documentation</h1>
      {content.map((doc, index) => (
        <section key={index}>
          <h2>{doc.frontmatter.title}</h2>
          <MDXRemote {...doc.mdxSource} />
          {doc.attachments && doc.attachments.length > 0 && (
            <div>
              <h3>Attachments:</h3>
              <ul>
                {doc.attachments.map((attachment, idx) => (
                  <li key={idx}>
                    <a href={attachment.path} target="_blank" rel="noopener noreferrer">
                      {attachment.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      ))}
    </div>
  );
};

export default PageRenderer;