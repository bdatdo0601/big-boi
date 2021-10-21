import Tippy from '@tippyjs/react';
import 'tippy.js/animations/shift-away.css';
import { withPrefix } from 'gatsby';
import React from 'react';
import { ExternalLinkIcon } from '@heroicons/react/outline';

export const AnchorTag = ({
  title,
  href,
  withoutLink,
  withoutPopup,
  ...restProps
}) => {
  let child;

  const content = restProps.children;
  const externalLink = /^(http(s?)):\/\//i.test(href);

  if (withoutLink) {
    return <span>{content}</span>;
  }

  if (withoutPopup) {
    return child;
  }

  const popupContent = <div className="tw-popover">{href}</div>;

  if (externalLink) {
    // eslint-disable-next-line jsx-a11y/anchor-has-content
    child = (
      <span className="inline-flex items-center">
        {/* eslint-disable-next-line jsx-a11y/anchor-has-content,react/jsx-no-target-blank */}
        <a
          {...restProps}
          href={
            !href || (href.indexOf && href.indexOf('#') === 0)
              ? href
              : withPrefix(href)
          }
          title={title}
          target="_blank"
          rel="noopener noreferrer"
        />
        <ExternalLinkIcon className="inline-block text-skin-secondary w-4 h-4" />
      </span>
    );
  } else {
    // eslint-disable-next-line jsx-a11y/anchor-has-content
    child = (
      // eslint-disable-next-line jsx-a11y/anchor-has-content
      <a
        {...restProps}
        href={
          !href || (href.indexOf && href.indexOf('#') === 0)
            ? href
            : withPrefix(href)
        }
        title={title}
      />
    );
  }

  return (
    <Tippy animation="shift-away" content={popupContent} maxWidth="none" arrow>
      {child}
    </Tippy>
  );
};
