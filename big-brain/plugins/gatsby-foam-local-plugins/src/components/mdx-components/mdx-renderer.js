import { mdx } from '@mdx-js/react';
import React from 'react';

export default function MDXRenderer({ children, ...props }) {
  // Memoize the compiled component
  const End = React.useMemo(() => {
    if (!children) {
      return null;
    }

    // eslint-disable-next-line
    const fn = new Function(`_fn`, 'React', 'mdx', `${children}`);

    return fn({}, React, mdx);
  }, [children]);

  return React.createElement(End, { ...props });
}
