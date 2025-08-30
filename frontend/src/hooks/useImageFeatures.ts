// hooks/useImageFeatures.ts
import { useState, useCallback, useEffect } from 'react';
import imageProcessingService from '../services/imageProcessing';
import toast from 'react-hot-toast';

interface UseImageFeaturesResult {
  features: number[] | null;
  loading: boolean;
  error: string | null;
  modelReady: boolean;
  extractFromFile: (file: File) => Promise<number[] | null>;
  extractFromUrl: (url: string) => Promise<number[] | null>;
  clearFeatures: () => void;
  clearError: () => void;
}

export const useImageFeatures = (): UseImageFeaturesResult => {
  const [features, setFeatures] = useState<number[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modelReady, setModelReady] = useState(false);

  // Initialize TensorFlow.js model on mount
  useEffect(() => {
    const initModel = async () => {
      try {
        await imageProcessingService.loadModel();
        setModelReady(true);
        console.log('TensorFlow.js model ready');
      } catch (err) {
        const errorMessage = 'Failed to load AI model';
        setError(errorMessage);
        console.error('Model initialization failed:', err);
        toast.error(errorMessage);
      }
    };

    initModel();

    // Cleanup on unmount
    return () => {
      imageProcessingService.dispose();
    };
  }, []);

  const extractFromFile = useCallback(async (file: File): Promise<number[] | null> => {
    if (!modelReady) {
      toast.error('AI model is not ready yet');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      // Validate file first
      imageProcessingService.validateImageFile(file);
      
      const extractedFeatures = await imageProcessingService.extractFeatures(file);
      setFeatures(extractedFeatures);
      
      console.log(`Extracted ${extractedFeatures.length} features from image`);
      return extractedFeatures;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to extract image features';
      setError(errorMessage);
      toast.error(errorMessage);
      setFeatures(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, [modelReady]);

  const extractFromUrl = useCallback(async (url: string): Promise<number[] | null> => {
    if (!modelReady) {
      toast.error('AI model is not ready yet');
      return null;
    }

    if (!url.trim()) {
      toast.error('Please provide a valid image URL');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const extractedFeatures = await imageProcessingService.extractFeaturesFromUrl(url);
      setFeatures(extractedFeatures);
      
      console.log(`Extracted ${extractedFeatures.length} features from URL`);
      return extractedFeatures;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to extract features from URL';
      setError(errorMessage);
      toast.error(errorMessage);
      setFeatures(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, [modelReady]);

  const clearFeatures = useCallback(() => {
    setFeatures(null);
    setError(null);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    features,
    loading,
    error,
    modelReady,
    extractFromFile,
    extractFromUrl,
    clearFeatures,
    clearError
  };
};