
import { useCallback } from 'react';
import { MIN_RESOLUTION } from '../constants';

export const useImageValidator = () => {
  const validateImage = useCallback(async (file: File): Promise<string | null> => {
    // 1. Dimension Check
    try {
      const dimensions = await new Promise<{ width: number; height: number }>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const img = new Image();
          img.onload = () => {
            resolve({ width: img.width, height: img.height });
          };
          img.onerror = reject;
          img.src = e.target?.result as string;
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      if (dimensions.width < MIN_RESOLUTION || dimensions.height < MIN_RESOLUTION) {
        return `Image is too small (${dimensions.width}x${dimensions.height}). Please use images at least ${MIN_RESOLUTION}x${MIN_RESOLUTION}px.`;
      }
    } catch (error) {
      return 'Could not read image dimensions. The file might be corrupted.';
    }

    // 2. Simulated Face Detection and Occlusion Check
    // In a real app, this would be a lightweight client-side ML model (e.g., TensorFlow.js)
    // or a quick API call. Here, we simulate it with a random check.
    const hasSingleFace = Math.random() > 0.1; // 90% chance of success
    if (!hasSingleFace) {
      return 'Could not detect a single clear face. Please try another photo.';
    }

    const hasOcclusion = Math.random() > 0.85; // 15% chance of finding occlusion
    if (hasOcclusion) {
        return 'Face might be unclear. Avoid photos with glasses, hats, or shadows.';
    }

    return null; // No errors
  }, []);

  return { validateImage };
};
