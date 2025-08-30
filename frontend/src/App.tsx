
import  { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import ImageUpload from './components/ImageUpload';
import SearchResults from './components/SearchResults';
import FilterBar from './components/FilterBar';
import type { SearchResult, SearchFilters } from './types';

function App() {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    category: 'all',
    minSimilarity: 0.3,
    maxResults: 20,
     priceRange: [0, 2000],
    brands: []
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="px-4 py-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Visual Product Matcher
          </h1>
          <p className="mt-2 text-gray-600">
            Find similar products by uploading an image
          </p>
        </div>
      </header>

      <main className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          
          {/* Upload Section */}
          <div className="lg:col-span-1">
            <div className="sticky p-6 bg-white rounded-lg shadow-md top-8">
              <h2 className="mb-4 text-xl font-semibold">Upload Image</h2>
              <ImageUpload 
                onSearchResults={setResults}
                onLoadingChange={setLoading}
                filters={filters}
              />
              
              <FilterBar 
                filters={filters}
                onFiltersChange={setFilters}
                className="mt-6"
              />
            </div>
          </div>

          Results Section
          <div className="lg:col-span-2">
            <SearchResults 
              results={results}
              loading={loading}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;