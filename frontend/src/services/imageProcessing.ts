// services/imageProcessing.ts
import * as tf from '@tensorflow/tfjs';

class ImageProcessingService {
  private model: tf.LayersModel | null = null;
  private isModelLoading = false;

  // Load pre-trained MobileNet model for feature extraction
  async loadModel(): Promise<tf.LayersModel> {
    if (this.model) {
      return this.model;
    }

    if (this.isModelLoading) {
      // Wait for model to finish loading
      while (this.isModelLoading) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      return this.model!;
    }

    try {
      this.isModelLoading = true;
      console.log('Loading TensorFlow.js model...');
      
      // Load MobileNetV2 for feature extraction
      // Note: Using a CDN URL since tfhub URLs might not work in browser
      this.model = await tf.loadLayersModel('/models/mobilenet/model.json');
      
      console.log('Model loaded successfully');
      return this.model;
    } catch (error) {
      console.error('Failed to load model:', error);
      throw new Error('Failed to load image processing model');
    } finally {
      this.isModelLoading = false;
    }
  }

  // Preprocess image for model input
  private preprocessImage(imageElement: HTMLImageElement): tf.Tensor {
    return tf.tidy(() => {
      // Convert image to tensor
      const tensor = tf.browser.fromPixels(imageElement);
      
      // Resize to 224x224 (MobileNet input size)
      const resized = tf.image.resizeBilinear(tensor, [224, 224]);
      
      // Normalize to [-1, 1] range
      const normalized = resized.div(127.5).sub(1);
      
      // Add batch dimension
      const batched = normalized.expandDims(0);
      
      return batched;
    });
  }

  // Extract features from image
  async extractFeatures(imageFile: File): Promise<number[]> {
    try {
      await this.loadModel();

      return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        
        img.onload = async () => {
          try {
            const preprocessed = this.preprocessImage(img);
            
            // Extract features using the model
            const features = this.model!.predict(preprocessed) as tf.Tensor;
            
            // Convert to array
            const featuresArray = await features.data();
            
            // Cleanup tensors
            preprocessed.dispose();
            features.dispose();
            
            resolve(Array.from(featuresArray));
          } catch (error) {
            reject(error);
          }
        };

        img.onerror = () => {
          reject(new Error('Failed to load image'));
        };

        img.src = URL.createObjectURL(imageFile);
      });
    } catch (error) {
      console.error('Feature extraction failed:', error);
      throw new Error('Failed to extract image features');
    }
  }

  // Extract features from image URL
  async extractFeaturesFromUrl(imageUrl: string): Promise<number[]> {
    try {
      await this.loadModel();

      return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        
        img.onload = async () => {
          try {
            const preprocessed = this.preprocessImage(img);
            const features = this.model!.predict(preprocessed) as tf.Tensor;
            const featuresArray = await features.data();
            
            preprocessed.dispose();
            features.dispose();
            
            resolve(Array.from(featuresArray));
          } catch (error) {
            reject(error);
          }
        };

        img.onerror = () => {
          reject(new Error('Failed to load image from URL'));
        };

        img.src = imageUrl;
      });
    } catch (error) {
      console.error('Feature extraction from URL failed:', error);
      throw new Error('Failed to extract features from image URL');
    }
  }

  // Calculate cosine similarity between two feature vectors
  calculateSimilarity(features1: number[], features2: number[]): number {
    if (features1.length !== features2.length) {
      throw new Error('Feature vectors must have the same length');
    }

    let dotProduct = 0;
    let magnitude1 = 0;
    let magnitude2 = 0;

    for (let i = 0; i < features1.length; i++) {
      dotProduct += features1[i] * features2[i];
      magnitude1 += features1[i] * features1[i];
      magnitude2 += features2[i] * features2[i];
    }

    if (magnitude1 === 0 || magnitude2 === 0) {
      return 0;
    }

    return dotProduct / (Math.sqrt(magnitude1) * Math.sqrt(magnitude2));
  }

  // Validate image file
  validateImageFile(file: File): boolean {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!allowedTypes.includes(file.type)) {
      throw new Error('Invalid file type. Please use JPEG, PNG, GIF, or WebP images.');
    }

    if (file.size > maxSize) {
      throw new Error('File too large. Please use images smaller than 10MB.');
    }

    return true;
  }

  // Convert file to base64
  async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = () => {
        resolve(reader.result as string);
      };
      
      reader.onerror = () => {
        reject(new Error('Failed to convert file to base64'));
      };
      
      reader.readAsDataURL(file);
    });
  }

  // Resize image canvas (for optimization)
  async resizeImage(file: File, maxWidth = 800, maxHeight = 600): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          reject(new Error('Canvas not supported'));
          return;
        }

        // Calculate new dimensions
        let { width, height } = img;
        
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }

        canvas.width = width;
        canvas.height = height;

        // Draw resized image
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to resize image'));
          }
        }, 'image/jpeg', 0.8);
      };

      img.onerror = () => {
        reject(new Error('Failed to load image for resizing'));
      };

      img.src = URL.createObjectURL(file);
    });
  }

  // Clean up resources
  dispose(): void {
    if (this.model) {
      this.model.dispose();
      this.model = null;
    }
  }
}

// Export singleton instance
export const imageProcessingService = new ImageProcessingService();
export default imageProcessingService;