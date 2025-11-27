// Client-side image processing utilities
// Handles WebP conversion, compression, and file optimization

export const convertToWebP = async (file, quality = 0.8) => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      // Calculate optimal dimensions (max 1920px width, maintain aspect ratio)
      const maxWidth = 1920;
      const maxHeight = 1080;
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

      // Draw and compress
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            const optimizedFile = new window.File([blob], file.name.replace(/\.[^/.]+$/, '.webp'), {
              type: 'image/webp',
              lastModified: Date.now(),
            });
            resolve(optimizedFile);
          } else {
            reject(new Error('Failed to convert to WebP'));
          }
        },
        'image/webp',
        quality
      );
    };

    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
};

export const compressImage = async (file, maxSizeKB = 800, quality = 0.8) => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const compress = (currentQuality) => {
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const sizeKB = blob.size / 1024;

              if (sizeKB <= maxSizeKB || currentQuality <= 0.1) {
                const compressedFile = new window.File([blob], file.name, {
                  type: file.type,
                  lastModified: Date.now(),
                });
                resolve(compressedFile);
              } else {
                // Reduce quality and try again
                compress(currentQuality - 0.1);
              }
            } else {
              reject(new Error('Failed to compress image'));
            }
          },
          file.type,
          currentQuality
        );
      };

      compress(quality);
    };

    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
};

export const getImageDimensions = (file) => {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => {
      resolve({
        width: img.width,
        height: img.height,
        aspectRatio: img.width / img.height,
      });
      URL.revokeObjectURL(img.src);
    };

    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
};

export const validateImageFile = (file) => {
  const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  const maxSizeMB = 10;

  if (!validTypes.includes(file.type)) {
    throw new Error('Invalid file type. Please upload JPEG, PNG, WebP, or GIF images.');
  }

  if (file.size > maxSizeMB * 1024 * 1024) {
    throw new Error(`File too large. Maximum size is ${maxSizeMB}MB.`);
  }

  return true;
};

export const calculateSavings = (originalSize, optimizedSize) => {
  const savings = ((originalSize - optimizedSize) / originalSize) * 100;
  return Math.round(Math.max(0, savings));
};

export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const generateThumbnail = async (file, maxWidth = 200, maxHeight = 200) => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      // Calculate thumbnail dimensions
      let { width, height } = img;

      if (width > height) {
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }
      }

      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to generate thumbnail'));
          }
        },
        'image/jpeg',
        0.8
      );
    };

    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
};

// Batch processing for multiple files
export const processBatch = async (files, options = {}) => {
  const {
    convertToWebP: shouldConvertToWebP = true,
    compress = true,
    maxSizeKB = 800,
    quality = 0.8,
    onProgress = () => {},
  } = options;

  const results = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];

    try {
      validateImageFile(file);

      let processedFile = file;
      const originalSize = file.size;

      // Convert to WebP if requested
      if (shouldConvertToWebP && !file.type.includes('webp')) {
        processedFile = await convertToWebP(processedFile, quality);
      }

      // Compress if requested
      if (compress) {
        processedFile = await compressImage(processedFile, maxSizeKB, quality);
      }

      const optimizedSize = processedFile.size;
      const savings = calculateSavings(originalSize, optimizedSize);

      results.push({
        original: file,
        processed: processedFile,
        originalSize,
        optimizedSize,
        savings,
        originalSizeFormatted: formatFileSize(originalSize),
        optimizedSizeFormatted: formatFileSize(optimizedSize),
        success: true,
      });

      onProgress(i + 1, files.length, results[results.length - 1]);
    } catch (error) {
      results.push({
        original: file,
        error: error.message,
        success: false,
      });

      onProgress(i + 1, files.length, results[results.length - 1]);
    }
  }

  return results;
};

// Remove background using Remove.bg API (client-side call to our API)
export const removeBackground = async (file, apiKey) => {
  const formData = new FormData();
  formData.append('image', file);

  try {
    const response = await fetch('/api/images/remove-background', {
      method: 'POST',
      headers: {
        'X-API-Key': apiKey,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Background removal failed');
    }

    const blob = await response.blob();
    return new window.File([blob], file.name.replace(/\.[^/.]+$/, '_nobg.png'), {
      type: 'image/png',
      lastModified: Date.now(),
    });
  } catch (error) {
    throw new Error(`Background removal failed: ${error.message}`);
  }
};

// Upload files to our API with progress tracking
export const uploadFiles = async (files, userId, options = {}) => {
  const formData = new FormData();

  files.forEach((file) => {
    formData.append('photos', file);
  });

  formData.append('userId', userId);
  formData.append('optimize', options.optimize || false);
  formData.append('removeBackground', options.removeBackground || false);

  try {
    const response = await fetch('/api/images/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Upload failed');
    }

    return await response.json();
  } catch (error) {
    throw new Error(`Upload failed: ${error.message}`);
  }
};
