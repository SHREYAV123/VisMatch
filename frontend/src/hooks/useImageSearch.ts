// hooks/useImageSearch.ts
import { useState, useCallback } from 'react';
import type { SearchResult, SearchFilters } from '../types';
import { searchSimilarProducts } from '../services/api';
import toast from 'react-hot-toast';

interface UseImageSearchResult {
  results: SearchResult[];
  loading: boolean;
  error: string | null;
  searchByFile: (file: File, filters: SearchFilters) => Promise<void>;
  searchByUrl: (url: string, filters: SearchFilters) => Promise<void>;
  clearResults: () => void;
  clearError: () => void;
}

export const useImageSearch = (): UseImageSearchResult => {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchByFile = useCallback(async (file: File, filters: SearchFilters) => {
    if (!file) {
      toast.error('Please select a file');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      // Convert file to base64
      const reader = new FileReader();
      const base64Image = await new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const searchResults = await searchSimilarProducts({
        image: base64Image,
        imageUrl: null,
        filters
      });

      setResults(searchResults);
      toast.success(`Found ${searchResults.length} similar products!`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Search failed';
      setError(errorMessage);
      toast.error(errorMessage);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const searchByUrl = useCallback(async (url: string, filters: SearchFilters) => {
    if (!url.trim()) {
      toast.error('Please provide an image URL');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const searchResults = await searchSimilarProducts({
        image: null,
        imageUrl: url,
        filters
      });

      setResults(searchResults);
      toast.success(`Found ${searchResults.length} similar products!`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Search failed';
      setError(errorMessage);
      toast.error(errorMessage);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearResults = useCallback(() => {
    setResults([]);
    setError(null);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    results,
    loading,
    error,
    searchByFile,
    searchByUrl,
    clearResults,
    clearError
  };
};