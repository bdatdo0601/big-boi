import { useState, useEffect, useRef, useCallback } from 'react';
import { FixedSizeList as List } from 'react-window';

interface InfiniteListProps<T extends object> {
  parentHeight: string;
  RowRenderer: React.FC<{ data: T[], index: number; style: React.CSSProperties }>;
  items: T[];
  fetchMore: () => Promise<void>;
  isFetchingItems: boolean;
  newItems: T[];
  dataCompleted: boolean;
}

const InfiniteList = <T extends object>({ parentHeight, RowRenderer, items, fetchMore, isFetchingItems, newItems, dataCompleted }: InfiniteListProps<T>) => {
  const [internalItems, setInternalItems] = useState<T[]>(items);
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const listRef = useRef<List | null>(null);
  const [scrollPosition, setScrollPosition] = useState<number>(0);
  const [previousLastVisibleIndex, setPreviousLastVisibleIndex] = useState<number>(-1);
  const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
    const target = entries[0];
    if (target.isIntersecting && !isFetchingItems && internalItems.length > 0) {
      const lastVisibleIndex = Math.floor(scrollPosition / 80) + Math.floor(parseInt(parentHeight) / 80);
      if (previousLastVisibleIndex !== lastVisibleIndex && lastVisibleIndex >= internalItems.length - 1 && !dataCompleted) {
        fetchMore().then();
        setPreviousLastVisibleIndex(lastVisibleIndex);
      }
    }
  }, [isFetchingItems, internalItems.length, scrollPosition, parentHeight, fetchMore, dataCompleted, previousLastVisibleIndex]);

  useEffect(() => {
    const option: IntersectionObserverInit = {
      root: null,
      rootMargin: "20px",
      threshold: 0
    };
    const observer = new IntersectionObserver(handleObserver, option);

    if (loaderRef.current) observer.observe(loaderRef.current);

    return () => {
      if (loaderRef.current) observer.unobserve(loaderRef.current);
    };
  }, [handleObserver]);

  useEffect(() => {
    setInternalItems([...newItems, ...items]);
  }, [items, newItems]);

  useEffect(() => {
    if (newItems.length > 0) {
      setInternalItems(prev => [...newItems, ...prev]);

      if (listRef.current) {
        listRef.current.scrollToItem(0, 'start');
      }
    }
  }, [newItems]);

  const handleScroll = useCallback(({ scrollOffset }: { scrollOffset: number }) => {
    setScrollPosition(scrollOffset);
  }, []);

  return (
    <div className="w-full mx-auto p-4 scroll-smooth flex flex-col gap-2" style={{ height: parentHeight }}>
      <List
        ref={listRef}
        height={parseInt(parentHeight)}
        itemCount={internalItems.length}
        itemSize={80}
        width="100%"
        onScroll={handleScroll}
        overscanCount={5}
      >
        {RowRenderer}
      </List>

      <div ref={loaderRef} className="h-4" />
    </div>
  );
};

export default InfiniteList;