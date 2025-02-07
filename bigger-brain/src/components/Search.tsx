import React, { useState, useRef, useEffect } from 'react';
import { useFuzzySearchList } from '@nozbe/microfuzz/react'
import { HighlightRanges } from '@nozbe/microfuzz';

interface SearchProps {
  items: { name: string, content: string, path: string }[];
  onResultSelect: (result: { name: string, content: string, path: string, matches: HighlightRanges }) => void;
}

const Search: React.FC<SearchProps> = ({ items, onResultSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isComponentFocused, setIsComponentFocused] = useState(false);
  const componentRef = useRef<HTMLDivElement>(null);

  const filteredList = useFuzzySearchList<{ name: string, content: string, path: string }, { name: string, content: string, path: string, matches: HighlightRanges }>({
    list: items,
    queryText: searchTerm,
    getText: (item: { name: string, content: string, path: string }) => [item.content],
    mapResultItem: ({ item, matches: [highlightRanges] }) => ({
      ...item,
      matches: highlightRanges || [],
    })
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
  };

  const handleResultClick = (result: { name: string, content: string, path: string, matches: HighlightRanges }) => {
    onResultSelect(result);
    setSearchTerm('');
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (componentRef.current && !componentRef.current.contains(event.target as Node)) {
        setIsComponentFocused(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="w-[300px] max-w-lg mx-auto z-20" ref={componentRef}>
      <input
        type="text"
        value={searchTerm}
        onChange={handleInputChange}
        onFocus={() => setIsComponentFocused(true)}
        placeholder="Search..."
        className="w-full px-4 py-2 text-input bg-background border rounded-lg focus:border-primary focus:outline-none focus:ring"
      />
      {isComponentFocused && searchTerm && (
        <ul className="mt-2 bg-accent rounded-lg shadow-lg absolute overflow-auto max-h-64 border-primary border-2">
          {filteredList.map((result, index) => (
            <li
              key={index}
              onClick={() => handleResultClick(result)}
              className="px-4 py-4 hover:bg-card-foreground cursor-pointer list-none flex flex-col gap-2 border-b-2 border-primary mb-2 pb-2"
            >
              <span className="font-semibold">{result.name}</span>
              {result.matches.filter(([start, end]) => end - start > 1).map((match, matchIndex) => (
                <span key={matchIndex} className="bg-card pl-2 py-1 pr-1 rounded-lg w-full overflow-auto">
                  {result.content.substring(Math.max(0, match[0] - 50), match[0])}
                  <span className='text-card-foreground'>{result.content.substring(match[0], Math.min(match[1] + 1, result.content.length))}</span>
                  {result.content.substring(match[1], Math.min(match[1] + 50, result.content.length - 1))}
                </span>
              ))}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Search;
