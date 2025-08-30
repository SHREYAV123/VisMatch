// components/ProductCard.tsx
import React, { useState } from 'react';
import { ShoppingCart, Eye, Heart, Award } from 'lucide-react';
import type { SearchResult } from '../types';

interface ProductCardProps {
  product: SearchResult;
  viewMode?: 'grid' | 'list';
  rank?: number;
}

const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  viewMode = 'grid', 
  rank 
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const getSimilarityColor = (score: number): string => {
    if (score >= 0.8) return 'bg-green-500';
    if (score >= 0.6) return 'bg-yellow-500';
    return 'bg-orange-500';
  };

  const getSimilarityText = (score: number): string => {
    if (score >= 0.8) return 'Excellent match';
    if (score >= 0.6) return 'Good match';
    return 'Fair match';
  };

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  if (viewMode === 'list') {
    return (
      <div className="overflow-hidden transition-shadow bg-white rounded-lg shadow-md hover:shadow-lg">
        <div className="flex">
          {/* Image Section */}
          <div className="relative flex-shrink-0 w-32 h-32 md:w-48 md:h-48">
            {!imageLoaded && !imageError && (
              <div className="absolute inset-0 bg-gray-200 rounded-l-lg animate-pulse" />
            )}
            
            {imageError ? (
              <div className="flex items-center justify-center w-full h-full bg-gray-100 rounded-l-lg">
                <span className="text-xs text-gray-400">No image</span>
              </div>
            ) : (
              <img
                src={product.imageUrl}
                alt={product.name}
                className={`w-full h-full object-cover rounded-l-lg transition-opacity ${
                  imageLoaded ? 'opacity-100' : 'opacity-0'
                }`}
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageError(true)}
              />
            )}

            {/* Rank Badge */}
            {rank && rank <= 3 && (
              <div className="absolute flex items-center px-2 py-1 text-xs font-bold text-yellow-900 bg-yellow-400 rounded-full top-2 left-2">
                <Award className="w-3 h-3 mr-1" />
                #{rank}
              </div>
            )}

            {/* Similarity Badge */}
            <div className={`absolute top-2 right-2 ${getSimilarityColor(product.similarityScore)} text-white px-2 py-1 rounded-full text-xs font-medium`}>
              {(product.similarityScore * 100).toFixed(0)}%
            </div>
          </div>

          {/* Content Section */}
          <div className="flex flex-col justify-between flex-1 p-4">
            <div>
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-lg font-semibold leading-tight text-gray-900">
                  {product.name}
                </h3>
                <span className="ml-4 text-xl font-bold text-green-600">
                  {formatPrice(product.price)}
                </span>
              </div>
              
              <p className="mb-3 text-sm text-gray-600 line-clamp-2">
                {product.description}
              </p>
              
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-blue-600">
                  {product.brand}
                </span>
                <span className="px-2 py-1 text-xs bg-gray-100 rounded-full">
                  {product.category}
                </span>
              </div>
              
              <div className="flex flex-wrap gap-1 mb-3">
                {product.tags.slice(0, 4).map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 text-xs text-blue-700 rounded-full bg-blue-50"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex mt-4 space-x-2">
              <button className="flex items-center justify-center flex-1 px-3 py-2 space-x-1 text-sm text-white transition-colors bg-blue-600 rounded-md hover:bg-blue-700">
                <ShoppingCart className="w-4 h-4" />
                <span>Add to Cart</span>
              </button>
              <button className="p-2 text-gray-700 transition-colors bg-gray-100 rounded-md hover:bg-gray-200">
                <Eye className="w-4 h-4" />
              </button>
              <button className="p-2 text-gray-700 transition-colors bg-gray-100 rounded-md hover:bg-gray-200">
                <Heart className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid view (default)
  return (
    <div className="overflow-hidden transition-all duration-300 bg-white rounded-lg shadow-md hover:shadow-lg hover:-translate-y-1">
      {/* Image Section */}
      <div className="relative">
        {!imageLoaded && !imageError && (
          <div className="w-full h-48 bg-gray-200 animate-pulse" />
        )}
        
        {imageError ? (
          <div className="flex items-center justify-center w-full h-48 bg-gray-100">
            <span className="text-gray-400">No image available</span>
          </div>
        ) : (
          <img
            src={product.imageUrl}
            alt={product.name}
            className={`w-full h-48 object-cover transition-opacity ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
          />
        )}

        {/* Rank Badge */}
        {rank && rank <= 3 && (
          <div className="absolute flex items-center px-2 py-1 text-xs font-bold text-yellow-900 bg-yellow-400 rounded-full top-2 left-2">
            <Award className="w-3 h-3 mr-1" />
            #{rank}
          </div>
        )}

        {/* Similarity Badge */}
        <div className={`absolute top-2 right-2 ${getSimilarityColor(product.similarityScore)} text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg`}>
          {(product.similarityScore * 100).toFixed(0)}% match
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 flex items-center justify-center transition-all duration-300 bg-black bg-opacity-0 opacity-0 hover:bg-opacity-10 hover:opacity-100">
          <button className="flex items-center px-4 py-2 space-x-2 text-gray-800 transition-colors bg-white rounded-lg shadow-lg hover:bg-gray-100">
            <Eye className="w-4 h-4" />
            <span>Quick View</span>
          </button>
        </div>
      </div>
      
      {/* Content Section */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="flex-1 mr-2 text-sm font-semibold leading-tight text-gray-900 line-clamp-2">
            {product.name}
          </h3>
          <span className="text-lg font-bold text-green-600 whitespace-nowrap">
            {formatPrice(product.price)}
          </span>
        </div>
        
        <p className="mb-3 text-xs leading-relaxed text-gray-600 line-clamp-2">
          {product.description}
        </p>
        
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-blue-600">
            {product.brand}
          </span>
          <span className="px-2 py-1 text-xs bg-gray-100 rounded-full">
            {product.category}
          </span>
        </div>

        {/* Similarity indicator */}
        <div className="mb-3">
          <div className="flex items-center justify-between mb-1 text-xs">
            <span className="text-gray-500">Similarity</span>
            <span className="font-medium">{getSimilarityText(product.similarityScore)}</span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full">
            <div 
              className={`h-2 rounded-full ${getSimilarityColor(product.similarityScore)}`}
              style={{ width: `${product.similarityScore * 100}%` }}
            />
          </div>
        </div>
        
        <div className="flex flex-wrap gap-1 mb-4">
          {product.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 text-xs text-blue-700 rounded-full bg-blue-50"
            >
              {tag}
            </span>
          ))}
          {product.tags.length > 3 && (
            <span className="px-2 py-1 text-xs text-gray-600 bg-gray-100 rounded-full">
              +{product.tags.length - 3}
            </span>
          )}
        </div>
        
        {/* Action Buttons */}
        <div className="flex space-x-2">
          <button className="flex items-center justify-center flex-1 px-3 py-2 space-x-1 text-sm text-white transition-colors bg-blue-600 rounded-md hover:bg-blue-700">
            <ShoppingCart className="w-4 h-4" />
            <span>Add to Cart</span>
          </button>
          <button className="p-2 text-gray-700 transition-colors bg-gray-100 rounded-md hover:bg-gray-200">
            <Eye className="w-4 h-4" />
          </button>
          <button className="p-2 text-gray-700 transition-colors bg-gray-100 rounded-md hover:bg-gray-200">
            <Heart className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;