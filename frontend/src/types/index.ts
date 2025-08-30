// types/index.ts
export interface Product {
  _id: string;
  name: string;
  category: string;
  price: number;
  brand: string;
  description: string;
  imageUrl: string;
  tags: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface SearchResult extends Product {
  similarityScore: number;
}

export interface SearchFilters {
  category: string;
  minSimilarity: number;
  maxResults: number;
  priceRange: [number, number];
  brands: string[];
}

export interface SearchRequest {
  image: string | null;
  imageUrl: string | null;
  filters: SearchFilters;
}

export interface SearchResponse {
  success: boolean;
  results: SearchResult[];
  totalFound: number;
  queryTime?: number;
}

export interface ApiError {
  error: string;
  details?: string;
  status?: number;
}