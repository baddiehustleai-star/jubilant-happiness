/**
 * Remove.bg API Service
 *
 * Handles background removal using the Remove.bg API
 * Includes error handling, rate limiting, and usage tracking
 */

import { analytics } from './monitoring.js';

class RemoveBgService {
  constructor() {
    this.apiKey = import.meta.env.VITE_REMOVEBG_API_KEY;
    this.baseUrl = 'https://api.remove.bg/v1.0';
    this.maxFileSize = 12 * 1024 * 1024; // 12MB limit
  }

  /**
   * Check if the service is configured
   */
  isConfigured() {
    return !!this.apiKey && this.apiKey !== 'your_removebg_api_key_here';
  }

  /**
   * Validate file before processing
   */
  validateFile(file) {
    const errors = [];

    // Check file size
    if (file.size > this.maxFileSize) {
      errors.push(`File size must be less than ${this.maxFileSize / (1024 * 1024)}MB`);
    }

    // Check file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      errors.push('Only JPEG, PNG, and WebP images are supported');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Remove background from image file
   * @param {File} imageFile - The image file to process
   * @param {Object} options - Processing options
   */
  async removeBackground(imageFile, options = {}) {
    if (!this.isConfigured()) {
      throw new Error('Remove.bg API key not configured. Please set VITE_REMOVEBG_API_KEY.');
    }

    // Validate file
    const validation = this.validateFile(imageFile);
    if (!validation.isValid) {
      throw new Error(validation.errors.join(', '));
    }

    const startTime = performance.now();

    try {
      const formData = new FormData();
      formData.append('image_file', imageFile);

      // Add processing options
      if (options.size) {
        formData.append('size', options.size); // auto, preview, full, regular, medium, hd, 4k
      }
      if (options.type) {
        formData.append('type', options.type); // auto, person, product, car
      }
      if (options.format) {
        formData.append('format', options.format); // auto, png, jpg, zip
      }

      // Set quality for JPG output
      if (options.format === 'jpg' && options.quality) {
        formData.append('bg_image_file', options.quality);
      }

      const response = await fetch(`${this.baseUrl}/removebg`, {
        method: 'POST',
        headers: {
          'X-API-Key': this.apiKey,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));

        // Handle specific error cases
        if (response.status === 402) {
          throw new Error('Insufficient credits. Please upgrade your Remove.bg plan.');
        } else if (response.status === 400) {
          throw new Error(errorData.errors?.[0]?.title || 'Invalid image or parameters');
        } else if (response.status === 403) {
          throw new Error('Invalid API key or forbidden request');
        } else if (response.status === 429) {
          throw new Error('Rate limit exceeded. Please try again later.');
        }

        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      // Get the processed image as blob
      const blob = await response.blob();
      const processedImageUrl = URL.createObjectURL(blob);

      const endTime = performance.now();
      const processingTime = endTime - startTime;

      // Track analytics
      analytics.track('background_removed', {
        file_size: imageFile.size,
        file_type: imageFile.type,
        processing_time: processingTime,
        output_size: blob.size,
        compression_ratio: (((imageFile.size - blob.size) / imageFile.size) * 100).toFixed(2),
        options: options,
      });

      // Get remaining credits from headers
      const creditsRemaining = response.headers.get('X-Credits-Charged');
      const creditsTotal = response.headers.get('X-Credits-Total');

      return {
        success: true,
        imageUrl: processedImageUrl,
        blob: blob,
        originalSize: imageFile.size,
        processedSize: blob.size,
        processingTime: processingTime,
        credits: {
          remaining: creditsRemaining,
          total: creditsTotal,
        },
        metadata: {
          width: null, // Would need additional API call to get dimensions
          height: null,
          format: blob.type,
        },
      };
    } catch (error) {
      analytics.track('background_removal_failed', {
        error: error.message,
        file_size: imageFile.size,
        file_type: imageFile.type,
      });

      throw error;
    }
  }

  /**
   * Remove background from image URL
   * @param {string} imageUrl - URL of the image to process
   * @param {Object} options - Processing options
   */
  async removeBackgroundFromUrl(imageUrl, options = {}) {
    if (!this.isConfigured()) {
      throw new Error('Remove.bg API key not configured. Please set VITE_REMOVEBG_API_KEY.');
    }

    try {
      const formData = new FormData();
      formData.append('image_url', imageUrl);

      // Add processing options
      if (options.size) formData.append('size', options.size);
      if (options.type) formData.append('type', options.type);
      if (options.format) formData.append('format', options.format);

      const response = await fetch(`${this.baseUrl}/removebg`, {
        method: 'POST',
        headers: {
          'X-API-Key': this.apiKey,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      const blob = await response.blob();
      const processedImageUrl = URL.createObjectURL(blob);

      analytics.track('background_removed_from_url', {
        source_url: imageUrl,
        output_size: blob.size,
        options: options,
      });

      return {
        success: true,
        imageUrl: processedImageUrl,
        blob: blob,
      };
    } catch (error) {
      analytics.track('background_removal_failed', {
        error: error.message,
        source_url: imageUrl,
      });

      throw error;
    }
  }

  /**
   * Get account information and credits
   */
  async getAccountInfo() {
    if (!this.isConfigured()) {
      throw new Error('Remove.bg API key not configured.');
    }

    try {
      const response = await fetch(`${this.baseUrl}/account`, {
        headers: {
          'X-API-Key': this.apiKey,
        },
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to get Remove.bg account info:', error);
      throw error;
    }
  }

  /**
   * Clean up object URLs to prevent memory leaks
   */
  cleanup(imageUrl) {
    if (imageUrl && imageUrl.startsWith('blob:')) {
      URL.revokeObjectURL(imageUrl);
    }
  }
}

// Export singleton instance
export const removeBgService = new RemoveBgService();
export default removeBgService;
