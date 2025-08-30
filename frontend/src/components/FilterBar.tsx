// components/FilterBar.tsx
import React, { useState, useEffect } from 'react';
import { Sliders, X, RotateCcw, ChevronDown, ChevronUp } from 'lucide-react';
import type { SearchFilters } from '../types';
import { getCategories, getBrands } from '../services/api';

interface FilterBarProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  className?: string;
}

const FilterBar: React.FC<FilterBarProps> = ({ 
  filters, 
  onFiltersChange, 
  className = '' 
}) => {
  const [showFilters, setShowFilters] = useState(false);
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const [availableBrands, setAvailableBrands] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Load available categories and brands
  useEffect(() => {
    const loadFilterOptions = async () => {
      setLoading(true);
      try {
        const [categories, brands] = await Promise.all([
          getCategories(),
          getBrands()
        ]);
        setAvailableCategories(['all', ...categories]);
        setAvailableBrands(brands);
      } catch (error) {
        console.error('Failed to load filter options:', error);
        // Fallback data
        setAvailableCategories(['all', 'Electronics', 'Shoes', 'Clothing', 'Books', 'Home']);
        setAvailableBrands(['Apple', 'Samsung', 'Nike', 'Adidas', 'Sony']);
      } finally {
        setLoading(false);
      }
    };

    loadFilterOptions();
  }, []);

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const handleBrandToggle = (brand: string) => {
    const newBrands = filters.brands.includes(brand)
      ? filters.brands.filter(b => b !== brand)
      : [...filters.brands, brand];
    
    handleFilterChange('brands', newBrands);
  };

  const resetFilters = () => {
    onFiltersChange({
      category: 'all',
      minSimilarity: 0.3,
      maxResults: 20,
      priceRange: [0, 2000],
      brands: []
    });
  };

  const hasActiveFilters = 
    filters.category !== 'all' || 
    filters.minSimilarity !== 0.3 || 
    filters.maxResults !== 20 || 
    filters.priceRange[0] !== 0 || 
    filters.priceRange[1] !== 2000 ||
    filters.brands.length > 0;

  return (
    <div className={className}>
      {/* Filter Toggle Button */}
      <button
        onClick={() => setShowFilters(!showFilters)}
        className="flex items-center justify-between w-full p-2 text-left text-gray-700 transition-colors rounded-lg hover:text-gray-900 hover:bg-gray-50"
      >
        <div className="flex items-center space-x-2">
          <Sliders className="w-5 h-5" />
          <span className="font-medium">Filters</span>
          {hasActiveFilters && (
            <span className="px-2 py-1 text-xs text-blue-800 bg-blue-100 rounded-full">
              Active
            </span>
          )}
        </div>
        {showFilters ? (
          <ChevronUp className="w-4 h-4" />
        ) : (
          <ChevronDown className="w-4 h-4" />
        )}
      </button>

      {/* Filter Panel */}
      {showFilters && (
        <div className="p-4 mt-4 space-y-6 border rounded-lg bg-gray-50">
          {/* Filter Header */}
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900">Search Filters</h3>
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="flex items-center space-x-1 text-xs text-gray-500 transition-colors hover:text-gray-700"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}
          </div>

          {/* Category Filter */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Category
            </label>
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={loading}
            >
              {availableCategories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>
          </div>

          {/* Minimum Similarity */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Minimum Similarity: {(filters.minSimilarity * 100).toFixed(0)}%
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={filters.minSimilarity}
              onChange={(e) => handleFilterChange('minSimilarity', parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between mt-1 text-xs text-gray-500">
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
          </div>

          {/* Price Range */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Price Range: ${filters.priceRange[0]} - ${filters.priceRange[1]}
            </label>
            <div className="space-y-2">
              <div>
                <label className="text-xs text-gray-500">Min Price</label>
                <input
                  type="range"
                  min="0"
                  max="2000"
                  step="50"
                  value={filters.priceRange[0]}
                  onChange={(e) => handleFilterChange('priceRange', [
                    parseInt(e.target.value), 
                    filters.priceRange[1]
                  ])}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500">Max Price</label>
                <input
                  type="range"
                  min="0"
                  max="2000"
                  step="50"
                  value={filters.priceRange[1]}
                  onChange={(e) => handleFilterChange('priceRange', [
                    filters.priceRange[0], 
                    parseInt(e.target.value)
                  ])}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>
            <div className="flex justify-between mt-1 text-xs text-gray-500">
              <span>$0</span>
              <span>$1000</span>
              <span>$2000</span>
            </div>
          </div>

          {/* Brand Filter */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Brands {filters.brands.length > 0 && (
                <span className="text-xs text-gray-500">({filters.brands.length} selected)</span>
              )}
            </label>
            <div className="space-y-2 overflow-y-auto max-h-32">
              {availableBrands.map(brand => (
                <label key={brand} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.brands.includes(brand)}
                    onChange={() => handleBrandToggle(brand)}
                    className="text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{brand}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Max Results */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Max Results: {filters.maxResults}
            </label>
            <input
              type="range"
              min="5"
              max="50"
              step="5"
              value={filters.maxResults}
              onChange={(e) => handleFilterChange('maxResults', parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between mt-1 text-xs text-gray-500">
              <span>5</span>
              <span>25</span>
              <span>50</span>
            </div>
          </div>

          {/* Filter Summary */}
          {hasActiveFilters && (
            <div className="pt-4 border-t border-gray-200">
              <div className="text-xs text-gray-600">
                <p className="mb-1">Active filters:</p>
                <div className="flex flex-wrap gap-1">
                  {filters.category !== 'all' && (
                    <span className="px-2 py-1 text-xs text-blue-800 bg-blue-100 rounded-full">
                      {filters.category}
                    </span>
                  )}
                  {filters.minSimilarity !== 0.3 && (
                    <span className="px-2 py-1 text-xs text-green-800 bg-green-100 rounded-full">
                      ≥{(filters.minSimilarity * 100).toFixed(0)}% similar
                    </span>
                  )}
                  {(filters.priceRange[0] !== 0 || filters.priceRange[1] !== 2000) && (
                    <span className="px-2 py-1 text-xs text-purple-800 bg-purple-100 rounded-full">
                      ${filters.priceRange[0]}-${filters.priceRange[1]}
                    </span>
                  )}
                  {filters.brands.map(brand => (
                    <span 
                      key={brand} 
                      className="flex items-center px-2 py-1 space-x-1 text-xs text-orange-800 bg-orange-100 rounded-full"
                    >
                      <span>{brand}</span>
                      <button
                        onClick={() => handleBrandToggle(brand)}
                        className="hover:bg-orange-200 rounded-full p-0.5"
                      >
                        <X className="w-2 h-2" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
<style>{`
  .slider::-webkit-slider-thumb {
    appearance: none;
    height: 16px;
    width: 16px;
    border-radius: 50%;
    background: #2563eb;
    cursor: pointer;
    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
  }

  .slider::-moz-range-thumb {
    height: 16px;
    width: 16px;
    border-radius: 50%;
    background: #2563eb;
    cursor: pointer;
    border: none;
    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
  }
`}</style>

    </div>
  );
};

export default FilterBar;