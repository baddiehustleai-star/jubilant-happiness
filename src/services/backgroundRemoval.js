// Background Removal Service - remove.bg Integration
class BackgroundRemovalService {
  constructor() {
    this.apiKey = import.meta.env.VITE_REMOVEBG_API_KEY;
    this.baseUrl = 'https://api.remove.bg/v1.0';
    this.maxFileSize = 12 * 1024 * 1024; // 12MB
  }

  // Remove background from image
  async removeBackground(imageFile, options = {}) {
    try {
      // Validate API key
      if (!this.apiKey) {
        console.warn('remove.bg API key not configured, using mock removal');
        return this.mockBackgroundRemoval(imageFile);
      }

      // Validate file size
      if (imageFile.size > this.maxFileSize) {
        throw new Error('File too large. Maximum size is 12MB.');
      }

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(imageFile.type)) {
        throw new Error('Unsupported file type. Please use JPEG, PNG, or WebP.');
      }

      const formData = new FormData();
      formData.append('image_file', imageFile);
      formData.append('size', options.size || 'auto');
      formData.append('type', options.type || 'auto');
      formData.append('format', options.format || 'png');
      
      // Add additional parameters based on options
      if (options.crop) formData.append('crop', 'true');
      if (options.position) formData.append('position', options.position);
      if (options.channels) formData.append('channels', options.channels);
      if (options.addShadow) formData.append('add_shadow', 'true');
      if (options.semitransparency) formData.append('semitransparency', 'true');

      const response = await fetch(`${this.baseUrl}/removebg`, {
        method: 'POST',
        headers: {
          'X-Api-Key': this.apiKey,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.errors?.[0]?.title || `API Error: ${response.status} ${response.statusText}`);
      }

      // Get the processed image as blob
      const blob = await response.blob();
      
      // Get API usage info from headers
      const apiUsage = {
        creditsRemaining: response.headers.get('X-RateLimit-Remaining'),
        creditsTotal: response.headers.get('X-RateLimit-Limit'),
        resetTime: response.headers.get('X-RateLimit-Reset'),
      };

      return {
        success: true,
        blob,
        originalSize: imageFile.size,
        processedSize: blob.size,
        format: options.format || 'png',
        apiUsage,
        url: URL.createObjectURL(blob),
      };

    } catch (error) {
      console.error('Background removal failed:', error);
      
      // Fallback to mock for demo purposes
      if (error.message.includes('API') || error.message.includes('fetch')) {
        console.warn('API call failed, using mock background removal');
        return this.mockBackgroundRemoval(imageFile);
      }
      
      throw error;
    }
  }

  // Batch background removal
  async removeBackgroundBatch(imageFiles, options = {}) {
    const results = [];
    const errors = [];

    for (let i = 0; i < imageFiles.length; i++) {
      try {
        const result = await this.removeBackground(imageFiles[i], options);
        results.push({
          index: i,
          originalFile: imageFiles[i],
          result,
        });

        // Add delay between API calls to respect rate limits
        if (i < imageFiles.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      } catch (error) {
        errors.push({
          index: i,
          file: imageFiles[i].name,
          error: error.message,
        });
      }
    }

    return {
      successful: results,
      failed: errors,
      totalProcessed: results.length,
      totalFailed: errors.length,
    };
  }

  // Get account info and remaining credits
  async getAccountInfo() {
    try {
      if (!this.apiKey) {
        return this.getMockAccountInfo();
      }

      const response = await fetch(`${this.baseUrl}/account`, {
        method: 'GET',
        headers: {
          'X-Api-Key': this.apiKey,
        },
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return {
        success: true,
        credits: {
          remaining: data.attributes.api.free_calls + data.attributes.api.sizes.preview.remaining,
          total: data.attributes.api.free_calls + data.attributes.api.sizes.preview.total,
        },
        account: data.attributes,
      };

    } catch (error) {
      console.error('Failed to get account info:', error);
      return this.getMockAccountInfo();
    }
  }

  // Mock background removal for demo/fallback
  mockBackgroundRemoval(imageFile) {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Create a canvas to simulate background removal
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        
        img.onload = () => {
          canvas.width = img.width;
          canvas.height = img.height;
          
          // Draw the original image
          ctx.drawImage(img, 0, 0);
          
          // Add a subtle effect to simulate background removal
          ctx.globalCompositeOperation = 'multiply';
          ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          
          canvas.toBlob((blob) => {
            resolve({
              success: true,
              blob,
              originalSize: imageFile.size,
              processedSize: blob.size,
              format: 'png',
              apiUsage: {
                creditsRemaining: '45',
                creditsTotal: '50',
                resetTime: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
              },
              url: URL.createObjectURL(blob),
              isMock: true,
            });
          }, 'image/png');
        };
        
        img.src = URL.createObjectURL(imageFile);
      }, 2000); // Simulate processing time
    });
  }

  // Mock account info for demo
  getMockAccountInfo() {
    return {
      success: true,
      credits: {
        remaining: 45,
        total: 50,
      },
      account: {
        type: 'free',
        api: {
          free_calls: 45,
          sizes: {
            preview: {
              remaining: 0,
              total: 50,
            }
          }
        }
      },
      isMock: true,
    };
  }

  // Optimize image for background removal
  async optimizeForRemoval(imageFile, options = {}) {
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      return new Promise((resolve, reject) => {
        img.onload = () => {
          // Calculate optimal dimensions (remove.bg works best with images under 10MP)
          const maxPixels = 10000000; // 10 megapixels
          const currentPixels = img.width * img.height;
          
          let newWidth = img.width;
          let newHeight = img.height;
          
          if (currentPixels > maxPixels) {
            const scale = Math.sqrt(maxPixels / currentPixels);
            newWidth = Math.round(img.width * scale);
            newHeight = Math.round(img.height * scale);
          }
          
          canvas.width = newWidth;
          canvas.height = newHeight;
          
          // Apply image enhancements for better background removal
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          
          // Draw and enhance the image
          ctx.drawImage(img, 0, 0, newWidth, newHeight);
          
          // Increase contrast slightly (helps with edge detection)
          if (options.enhanceContrast !== false) {
            const imageData = ctx.getImageData(0, 0, newWidth, newHeight);
            const data = imageData.data;
            
            for (let i = 0; i < data.length; i += 4) {
              // Increase contrast
              data[i] = Math.min(255, Math.max(0, (data[i] - 128) * 1.1 + 128));     // Red
              data[i + 1] = Math.min(255, Math.max(0, (data[i + 1] - 128) * 1.1 + 128)); // Green
              data[i + 2] = Math.min(255, Math.max(0, (data[i + 2] - 128) * 1.1 + 128)); // Blue
            }
            
            ctx.putImageData(imageData, 0, 0);
          }
          
          canvas.toBlob((blob) => {
            resolve({
              optimizedFile: new File([blob], imageFile.name, { type: 'image/jpeg' }),
              originalDimensions: { width: img.width, height: img.height },
              optimizedDimensions: { width: newWidth, height: newHeight },
              compressionRatio: blob.size / imageFile.size,
            });
          }, 'image/jpeg', 0.95);
        };
        
        img.onerror = reject;
        img.src = URL.createObjectURL(imageFile);
      });
    } catch (error) {
      console.error('Image optimization failed:', error);
      throw error;
    }
  }

  // Compare before/after images
  createComparison(originalFile, processedBlob) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    return new Promise((resolve) => {
      const originalImg = new Image();
      const processedImg = new Image();
      let loadedCount = 0;
      
      const onImageLoad = () => {
        loadedCount++;
        if (loadedCount === 2) {
          // Create side-by-side comparison
          const maxWidth = 800;
          const maxHeight = 600;
          
          const scale = Math.min(
            maxWidth / (originalImg.width * 2),
            maxHeight / Math.max(originalImg.height, processedImg.height)
          );
          
          canvas.width = (originalImg.width + processedImg.width) * scale;
          canvas.height = Math.max(originalImg.height, processedImg.height) * scale;
          
          // Draw original on left
          ctx.drawImage(originalImg, 0, 0, originalImg.width * scale, originalImg.height * scale);
          
          // Draw processed on right
          ctx.drawImage(processedImg, originalImg.width * scale, 0, processedImg.width * scale, processedImg.height * scale);
          
          // Add labels
          ctx.fillStyle = 'white';
          ctx.fillRect(0, 0, originalImg.width * scale, 30);
          ctx.fillRect(originalImg.width * scale, 0, processedImg.width * scale, 30);
          
          ctx.fillStyle = 'black';
          ctx.font = '16px Arial';
          ctx.fillText('Original', 10, 20);
          ctx.fillText('Background Removed', originalImg.width * scale + 10, 20);
          
          canvas.toBlob(resolve, 'image/jpeg', 0.9);
        }
      };
      
      originalImg.onload = onImageLoad;
      processedImg.onload = onImageLoad;
      
      originalImg.src = URL.createObjectURL(originalFile);
      processedImg.src = URL.createObjectURL(processedBlob);
    });
  }

  // Get processing recommendations
  getProcessingRecommendations(imageFile) {
    const recommendations = [];
    
    // File size recommendations
    if (imageFile.size > 8 * 1024 * 1024) {
      recommendations.push({
        type: 'size',
        message: 'Large file detected. Consider optimizing for faster processing.',
        action: 'optimize'
      });
    }
    
    // Format recommendations
    if (imageFile.type === 'image/webp') {
      recommendations.push({
        type: 'format',
        message: 'WebP format may have reduced compatibility. Consider JPEG/PNG for best results.',
        action: 'convert'
      });
    }
    
    return recommendations;
  }

  // Calculate estimated processing cost
  getEstimatedCost(imageFiles, accountInfo = null) {
    const baseCredit = 1; // 1 credit per image
    const totalImages = Array.isArray(imageFiles) ? imageFiles.length : 1;
    
    return {
      credits: totalImages * baseCredit,
      cost: totalImages * 0.20, // $0.20 per image (approximate)
      currency: 'USD',
      remainingAfter: accountInfo ? accountInfo.credits.remaining - (totalImages * baseCredit) : null,
    };
  }
}

// Export singleton instance
export const backgroundRemovalService = new BackgroundRemovalService();