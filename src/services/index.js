// src/services/index.js
// Service exports for Photo2Profit

import { apiFetch } from './apiClient';

// Placeholder services - these will be implemented as features are built
export const uploadService = {
  uploadFiles: async (files) => {
    // TODO: Implement file upload to Firebase Storage
    console.log('Uploading files:', files);
    return files.map((file, index) => ({
      id: `file-${index}`,
      name: file.name,
      url: URL.createObjectURL(file),
      preview: URL.createObjectURL(file),
      uploadedAt: new Date()
    }));
  }
};

export const aiListingService = {
  generateListing: async (photo) => {
    // TODO: Implement AI listing generation with Gemini/OpenAI
    console.log('Generating listing for:', photo);
    return {
      id: `listing-${Date.now()}`,
      photo,
      title: 'Sample Product Listing',
      description: 'This is an AI-generated product description that will be created based on the photo analysis.',
      suggestedPrice: 29.99,
      category: 'General',
      createdAt: new Date()
    };
  }
};

export const crossPostingService = {
  /**
   * Cross-post a listing using backend API
   * @param {object} listing - listing object with id, title, description, suggestedPrice, photo
   * @param {string[]} platforms - target platforms
   * @param {string} [userId] - optional user id for backend validation
   */
  crossPost: async (listing, platforms, userId) => {
    const payload = {
      listingId: listing.id,
      title: listing.title,
      description: listing.description,
      price: listing.suggestedPrice,
      images: listing.photo?.url ? [listing.photo.url] : [],
      platforms: platforms || [],
      userId: userId || listing.userId || 'demo-user'
    };

    try {
      const res = await apiFetch('/api/cross-post', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      return res;
    } catch (error) {
      console.error('Cross-post API error:', error);
      return {
        success: false,
        error: error.body?.error || error.message,
        listingId: listing.id
      };
    }
  }
};

export const backgroundRemovalService = {
  removeBackground: async (file) => {
    // TODO: Implement background removal with Remove.bg API
    console.log('Removing background from:', file);
    return {
      success: true,
      originalUrl: file.url,
      processedUrl: file.url // Placeholder
    };
  }
};

// Export payment service
export { default as PaymentService } from './paymentService';
