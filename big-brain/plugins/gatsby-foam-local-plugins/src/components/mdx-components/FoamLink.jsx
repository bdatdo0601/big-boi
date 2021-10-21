import { LinkToStacked } from 'react-stacked-pages-hook';
import React from 'react';
import Tippy from '@tippyjs/react';
import 'tippy.js/animations/shift-away.css';
import { MDXProvider } from '@mdx-js/react';
import MDXRenderer from './mdx-renderer';
import usePageIndex from '../../hooks/usePageIndex';

const PopupContent = ({ mdx }) => {
  const nestedComponents = {
    a({ children }) {
      return <span>{children}</span>;
    },
    p(props) {
      return <span {...props} />;
    },
    foamlink(props) {
      return <span {...props} />;
    },
    code(props) {
      return <pre {...props} />;
    },
  };

  return (
    <div className="tw-popover">
      <MDXProvider components={nestedComponents}>
        <MDXRenderer>{mdx}</MDXRenderer>
      </MDXProvider>
    </div>
  );
};

export const FoamLink = ({ children }) => {
  const { getPage } = usePageIndex();
  const page = getPage(children);

  if (!page) {
    return (
      <span className="px-1 rounded bg-skin-secondary text-skin-secondary cursor-not-allowed tracking-wide">
        excluded page
      </span>
    );
  }

  return (
    <>
      <span className="text-skin-secondary">[[</span>
      <Tippy
        animation="shift-away"
        content={<PopupContent mdx={page.mdx} />}
        maxWidth="none"
        arrow
      >
        {/* I dont know why to add a slash but it fixes links to other subfolders */}
        <LinkToStacked to={`/${page.href}`} title={page.title}>
          {children}
        </LinkToStacked>
      </Tippy>
      <span className="text-skin-secondary">]]</span>
    </>
  );
};
