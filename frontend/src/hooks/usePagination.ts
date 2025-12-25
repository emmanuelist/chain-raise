import { useState, useMemo, useCallback, useEffect, useRef } from "react";

interface UsePaginationOptions<T> {
  items: T[];
  itemsPerPage?: number;
  initialPage?: number;
}

interface UsePaginationReturn<T> {
  currentPage: number;
  totalPages: number;
  paginatedItems: T[];
  hasNextPage: boolean;
  hasPrevPage: boolean;
  isLoadingMore: boolean;
  nextPage: () => void;
  prevPage: () => void;
  goToPage: (page: number) => void;
  loadMore: () => Promise<void>;
  reset: () => void;
  loadedCount: number;
  totalCount: number;
}

export function usePagination<T>({
  items,
  itemsPerPage = 9,
  initialPage = 1,
}: UsePaginationOptions<T>): UsePaginationReturn<T> {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [loadedPages, setLoadedPages] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const totalCount = items.length;
  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const paginatedItems = useMemo(() => {
    return items.slice(0, loadedPages * itemsPerPage);
  }, [items, loadedPages, itemsPerPage]);

  const hasNextPage = loadedPages < totalPages;
  const hasPrevPage = currentPage > 1;
  const loadedCount = paginatedItems.length;

  const nextPage = useCallback(() => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  }, [totalPages]);

  const prevPage = useCallback(() => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  }, []);

  const goToPage = useCallback((page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  }, [totalPages]);

  const loadMore = useCallback(async () => {
    if (isLoadingMore || !hasNextPage) return;
    
    setIsLoadingMore(true);
    // Simulate network delay for loading more items
    await new Promise((resolve) => setTimeout(resolve, 500));
    setLoadedPages((prev) => prev + 1);
    setIsLoadingMore(false);
  }, [isLoadingMore, hasNextPage]);

  const reset = useCallback(() => {
    setCurrentPage(initialPage);
    setLoadedPages(1);
  }, [initialPage]);

  return {
    currentPage,
    totalPages,
    paginatedItems,
    hasNextPage,
    hasPrevPage,
    isLoadingMore,
    nextPage,
    prevPage,
    goToPage,
    loadMore,
    reset,
    loadedCount,
    totalCount,
  };
}

// Infinite scroll hook for use with usePagination
export function useInfiniteScroll(
  loadMore: () => Promise<void>,
  hasMore: boolean,
  isLoading: boolean
) {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const targetRef = useRef<HTMLDivElement | null>(null);

  const setTargetRef = useCallback((node: HTMLDivElement | null) => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    if (node && hasMore && !isLoading) {
      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            loadMore();
          }
        },
        {
          rootMargin: "100px",
          threshold: 0.1,
        }
      );
      observerRef.current.observe(node);
    }

    targetRef.current = node;
  }, [loadMore, hasMore, isLoading]);

  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  return { setTargetRef };
}
