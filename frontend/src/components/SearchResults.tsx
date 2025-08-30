// components/SearchResults.tsx
import React, { useState } from 'react';
import { Search, Grid, List } from 'lucide-react';
import type { SearchResult } from '../types';
import ProductCard from './ProductCard';

interface SearchResultsProps {
  results: SearchResult[];
  loading: boolean;
}

const SearchResults: React.FC<SearchResultsProps> = ({ results, loading }) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  if (loading) {
    return (
      <div className="p-8 bg-white rounded-lg shadow-md">
        <div className="flex items-center justify-center space-x-3">
          <div className="w-8 h-8 border-b-2 border-blue-600 rounded-full animate-spin"></div>
          <div className="text-center">
            <p className="text-lg text-gray-600">Searching for similar products...</p>
            <p className="mt-2 text-sm text-gray-500">Using AI to analyze your image</p>
          </div>
        </div>
        
        {/* Loading skeleton */}
        <div className="grid grid-cols-1 gap-6 mt-8 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-48 mb-4 bg-gray-200 rounded-lg"></div>
              <div className="h-4 mb-2 bg-gray-200 rounded"></div>
              <div className="w-3/4 h-4 mb-2 bg-gray-200 rounded"></div>
              <div className="w-1/2 h-4 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="p-12 text-center bg-white rounded-lg shadow-md">
        <Search className="w-16 h-16 mx-auto mb-6 text-gray-400" />
        <h3 className="mb-3 text-xl font-medium text-gray-900">
          Upload an image to get started
        </h3>
        <p className="max-w-md mx-auto mb-6 text-gray-600">
          Find visually similar products by uploading an image or providing an image URL. 
          Our AI will analyze the image and show you the most similar products.
        </p>
        <div className="flex justify-center space-x-8 text-sm text-gray-500">
          <div className="flex items-center">
            <div className="w-3 h-3 mr-2 bg-green-400 rounded-full"></div>
            AI-Powered Search
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 mr-2 bg-blue-400 rounded-full"></div>
            Instant Results
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 mr-2 bg-purple-400 rounded-full"></div>
            Smart Filtering
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Results Header */}
      <div className="p-4 bg-white rounded-lg shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Found {results.length} similar products
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              Sorted by similarity score (highest first)
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="mr-3 text-sm text-gray-500">View:</span>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'grid'
                  ? 'bg-blue-100 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
              title="Grid view"
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'list'
                  ? 'bg-blue-100 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
              title="List view"
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Results Summary */}
        {results.length > 0 && (
          <div className="flex items-center mt-4 space-x-6 text-sm text-gray-600">
            <div className="flex items-center">
              <span className="font-medium">Best match:</span>
              <span className="ml-1 text-green-600">
                {Math.round(results[0].similarityScore * 100)}% similar
              </span>
            </div>
            <div className="flex items-center">
              <span className="font-medium">Average similarity:</span>
              <span className="ml-1">
                {Math.round(
                  (results.reduce((sum, item) => sum + item.similarityScore, 0) / results.length) * 100
                )}%
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Results Grid/List */}
      <div className={`grid gap-6 ${
        viewMode === 'grid' 
          ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
          : 'grid-cols-1'
      }`}>
        {results.map((product, index) => (
          <ProductCard 
            key={product._id} 
            product={product} 
            viewMode={viewMode}
            rank={index + 1}
          />
        ))}
      </div>

      {/* Load More Button (for future pagination) */}
      {results.length >= 20 && (
        <div className="py-8 text-center">
          <button className="px-6 py-3 text-gray-700 transition-colors bg-gray-100 rounded-lg hover:bg-gray-200">
            Load More Results
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchResults;