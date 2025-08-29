import { useState, useCallback, useRef } from 'react';

export interface SearchResult {
  id: string;
  name: string;
  description: string;
  price: number;
  category_name: string;
  category_id: string;
  image_url?: string;
  has_variants: boolean;
}

export interface SearchResponse {
  results: SearchResult[];
  total: number;
  page: number;
  limit: number;
  cached?: boolean;
}

// Custom debounce hook
function useDebounce<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  return useCallback(
    ((...args: any[]) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    }) as T,
    [callback, delay]
  );
}

export function useSearch() {
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const performSearch = useCallback(async (query: string, page: number = 1, limit: number = 10) => {
    if (!query.trim()) {
      setSearchResults([]);
      setTotal(0);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        q: query,
        page: page.toString(),
        limit: limit.toString()
      });

      const response = await fetch(`/api/search?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Search request failed');
      }

      const data: SearchResponse = await response.json();
      setSearchResults(data.results);
      setTotal(data.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
      setSearchResults([]);
      setTotal(0);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const searchProducts = useDebounce(performSearch, 300);

  const clearSearch = useCallback(() => {
    setSearchResults([]);
    setTotal(0);
    setError(null);
    setIsLoading(false);
  }, []);

  return {
    searchResults,
    isLoading,
    total,
    error,
    searchProducts,
    clearSearch
  };
}
