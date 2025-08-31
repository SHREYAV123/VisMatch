// frontend/src/components/ImageUpload.tsx
import React, { useState } from 'react';
import { Search, Link, X } from 'lucide-react';
import toast from 'react-hot-toast';
import type { SearchFilters } from '../types';
import { searchSimilarProducts } from '../services/api';



interface Props {
  onSearchResults: (results: any[]) => void;
  onLoadingChange: (loading: boolean) => void;
  filters: SearchFilters;
}

const ImageUpload: React.FC<Props> = ({ onSearchResults, onLoadingChange, filters }) => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState('');
  const [activeTab, setActiveTab] = useState<'upload' | 'url'>('upload');

  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 30 * 1024 * 1024) { 
        toast.error('File size exceeds 30MB');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => setUploadedImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

 
  const handleSearch = async () => {
    if (!uploadedImage && !imageUrl) {
      toast.error('Please upload an image or provide an image URL');
      return;
    }

    onLoadingChange(true);
    try {
      const results = await searchSimilarProducts({
        image: activeTab === 'upload' ? uploadedImage : null,
        imageUrl: activeTab === 'url' ? imageUrl : null,
        filters
      });
      
      if (!Array.isArray(results)) {
        console.error('Invalid response format:', results);
        toast.error('Invalid response from server');
        return;
      }
      
      onSearchResults(results);
      if (results.length === 0) {
        toast.success('No similar products found. Try adjusting your filters.');
      } else {
        toast.success(`Found ${results.length} similar products`);
      }
    } catch (err: any) {
      console.error('Search error:', err);
      const errorMessage = err.response?.data?.error || err.message || 'Search failed. Please try again.';
      toast.error(errorMessage);
    } finally {
      onLoadingChange(false);
    }
  };

  
  const clearImage = () => {
    setUploadedImage(null);
    setImageUrl('');
    onSearchResults([]);
  };

  return (
    <div className="space-y-4">

    
      <div className="flex p-1 space-x-1 bg-gray-100 rounded-lg">
        <button
          onClick={() => setActiveTab('upload')}
          className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'upload'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Upload File
        </button>
        <button
          onClick={() => setActiveTab('url')}
          className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'url'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Image URL
        </button>
      </div>


      {activeTab === 'upload' && (
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="block w-full p-2 text-gray-700 border border-gray-300 rounded-lg cursor-pointer"
        />
      )}

      {activeTab === 'url' && (
        <div className="relative">
          <Link className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="Enter image URL..."
            className="w-full py-3 pl-10 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      )}

    
      {(uploadedImage || imageUrl) && (
        <div className="relative">
          <img
            src={uploadedImage || imageUrl}
            alt="Preview"
            className="object-cover w-full h-48 rounded-lg shadow-sm"
            onError={() => {
              toast.error('Failed to load image');
              if (activeTab === 'url') setImageUrl('');
            }}
          />
          <button
            onClick={clearImage}
            className="absolute p-1 text-white bg-red-500 rounded-full top-2 right-2 hover:bg-red-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

     
      <button
        onClick={handleSearch}
        disabled={!uploadedImage && !imageUrl}
        className="flex items-center justify-center w-full px-4 py-3 space-x-2 font-medium text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        <Search className="w-5 h-5" />
        <span>Find Similar Products</span>
      </button>
    </div>
  );
};

export default ImageUpload;
