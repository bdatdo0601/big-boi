import React from 'react';
import { LinkToStacked } from 'react-stacked-pages-hook';

const Reference = ({ node }) => (
  <li key={node.slug} className="text-blueGray-400 dark:text-blueGray-600">
    <LinkToStacked to={node.slug} className="tw-link">
      <span className="text-base">
        {node.title}
      </span>
      {node.content}
    </LinkToStacked>
  </li>
);

export default Reference;
