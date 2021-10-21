import React, { lazy, Suspense, useState } from 'react';

const G6GraphViz = lazy(() => import('./g6-graph-viz'));

const GraphButton2 = () => {
  const [graphVisible, setGraphVisible] = useState(false);

  return (
    <>
      <button
        type="button"
        title="Show Graph visualisation"
        aria-label="Show Graph visualisation"
        className="header-button"
        onClick={() => setGraphVisible(true)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          width="20"
          height="20"
          fill="currentColor"
        >
          <g stroke="currentColor" strokeWidth="2">
            <circle cx="11.733" cy="3.181" r="1.902" />
            <circle cx="16.864" cy="10.861" r="1.902" />
            <circle cx="7.47" cy="16.822" r="1.902" />
            <circle cx="3.046" cy="6.275" r="1.902" />
            <circle cx="9.372" cy="10.861" r="1.902" />
            <line
              stroke="currentColor"
              x1="11.635"
              x2="14.655"
              y1="10.861"
              y2="10.861"
            />
            <line
              stroke="currentColor"
              x1="10"
              x2="10.895"
              y1="8.959"
              y2="5.573"
            />
            <line stroke="currentColor" x1="7.47" x2="4.5" y1="9.68" y2="7.5" />
            <line
              stroke="currentColor"
              x1="8.25"
              x2="8.809"
              y1="14.92"
              y2="13.088"
            />
          </g>
        </svg>
      </button>
      {typeof window !== 'undefined' ? (
        <Suspense fallback={null}>
          <G6GraphViz
            graphVisible={graphVisible}
            setGraphVisible={setGraphVisible}
          />
        </Suspense>
      ) : null}
    </>
  );
};

export default GraphButton2;
