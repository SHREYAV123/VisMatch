// services/api.ts
import axios from 'axios';
import type { SearchRequest, SearchResult, Product, SearchResponse } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for logging
api.interceptors.request.use((config) => {
  console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
  return config;
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const searchSimilarProducts = async (searchRequest: SearchRequest): Promise<SearchResult[]> => {
  try {
    const formData = new FormData();

    // Handle image upload
    if (searchRequest.image) {
      // Convert base64 to blob if needed
      const response = await fetch(searchRequest.image);
      const blob = await response.blob();
      formData.append('image', blob);
    }

    // Handle image URL
    if (searchRequest.imageUrl) {
      formData.append('imageUrl', searchRequest.imageUrl);
    }

    // Add filters
    formData.append('category', searchRequest.filters.category);
    formData.append('minSimilarity', searchRequest.filters.minSimilarity.toString());
    formData.append('maxResults', searchRequest.filters.maxResults.toString());
    formData.append('minPrice', searchRequest.filters.priceRange[0].toString());
    formData.append('maxPrice', searchRequest.filters.priceRange[1].toString());
    formData.append('brands', JSON.stringify(searchRequest.filters.brands));

    const response = await api.post<SearchResponse>('/search/similar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data.results;
  } catch (error) {
    console.error('Search failed:', error);
    throw new Error('Failed to search for similar products');
  }
};

export const getAllProducts = async (page = 1, limit = 20): Promise<Product[]> => {
  try {
    const response = await api.get<{ products: Product[] }>('/products', {
      params: { page, limit }
    });
    return response.data.products;
  } catch (error) {
    console.error('Failed to fetch products:', error);
    throw new Error('Failed to fetch products');
  }
};

export const getCategories = async (): Promise<string[]> => {
  try {
    const response = await api.get<{ categories: string[] }>('/categories');
    return response.data.categories;
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    return ['Electronics', 'Shoes', 'Clothing', 'Books', 'Home']; // fallback
  }
};

export const getBrands = async (): Promise<string[]> => {
  try {
    const response = await api.get<{ brands: string[] }>('/brands');
    return response.data.brands;
  } catch (error) {
    console.error('Failed to fetch brands:', error);
    return ['Apple', 'Samsung', 'Nike', 'Adidas', 'Sony']; // fallback
  }
};


export const healthCheck = async (): Promise<boolean> => {
  try {
    await api.get('/health');
    return true;
  } catch (error) {
    console.error('Health check failed:', error);
    return false;
  }
};