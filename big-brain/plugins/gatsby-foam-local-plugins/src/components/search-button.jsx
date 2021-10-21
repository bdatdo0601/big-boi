import React, { lazy, Suspense } from 'react';
import useSearchPopover from '../state/useSearchPopover';

const SearchPopover = lazy(() => import('./SearchPopover'));

const SearchButton = () => {
  const { open } = useSearchPopover();

  return (
    <>
      <button
        type="button"
        title="Show Graph visualisation"
        aria-label="Show Graph visualisation"
        className="header-button"
        onClick={() => open()}
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </button>
      {typeof window !== 'undefined' ? (
        <Suspense fallback={null}>
          <SearchPopover />
        </Suspense>
      ) : null}
    </>
  );
};

export default SearchButton;
