import { Dialog, Transition } from '@headlessui/react';
import { navigate } from 'gatsby';
import React, { Fragment, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import useDebounce from '../hooks/useDebounce';
import useSearchPopover from '../state/useSearchPopover';
import useSearch from '../use-search';

const SearchResult = ({ result }) => {
  const { path, title, excerpt } = result;

  return (
    <li>
      <button
        type="button"
        onClick={() => navigate(path)}
        className="w-full py-2 rounded-lg text-left no-underline hover:bg-skin-popover-hover ring-inset focus:outline-none focus:ring-2 focus:ring-skin-base"
      >
        <div className="px-4">
          <h4 className="text-skin-base text-lg font-semibold">{title}</h4>
          <span className="text-skin-secondary">{excerpt}</span>
        </div>
      </button>
    </li>
  );
};

const SearchPopover = () => {
  const { isOpen, close } = useSearchPopover();
  const [query, setQuery] = useState('');
  const inputRef = useRef();

  const debouncedQuery = useDebounce(query, 250);
  const results = useSearch(debouncedQuery);

  // otherwise / from keyboard command will end up in search
  const debouncedOpen = useDebounce(isOpen, 20);

  const changeQuery = (val) => {
    if (isOpen && debouncedOpen) {
      setQuery(val);
    }
  };

  return createPortal(
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        static
        open={isOpen}
        className="fixed z-10 inset-0 overflow-y-auto"
        initialFocus={inputRef}
        onClose={() => close()}
      >
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 backdrop-filter backdrop-blur transition-opacity bg-skin-popover-overlay" />
          </Transition.Child>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="p-2 inline-block align-bottom bg-skin-popover opacity-95 backdrop-filter backdrop-blur-lg rounded-xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full md:max-w-screen-lg m-auto">
              <input
                className="bg-skin-popover-hover text-skin-base rounded w-full py-4 px-3 text-xl focus:outline-none"
                type="text"
                value={query}
                onChange={(e) => changeQuery(e.target.value)}
                ref={inputRef}
              />
              {results && results.length > 0 && (
                <div className="my-3">
                  <ul>
                    {results.map((r) => (
                      <SearchResult result={r} key={r.path} />
                    ))}
                  </ul>
                </div>
              )}
              {results !== null && results.length === 0 && (
                <div className="py-3 text-skin-secondary text-lg font-semibold flex">
                  <span className="flex mx-auto">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 my-auto"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>

                    <span className="ml-2 text-skin-base">No matches...</span>
                  </span>
                </div>
              )}
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>,
    document.body
  );
};

export default SearchPopover;
