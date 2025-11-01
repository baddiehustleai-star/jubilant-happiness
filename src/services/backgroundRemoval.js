// Background removal service using remove.bg API
import { uploadBytes, ref, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase';

export class BackgroundRemovalService {
  constructor() {
    this.apiKey = import.meta.env.VITE_REMOVEBG_API_KEY;
    this.apiUrl = 'https://api.remove.bg/v1.0/removebg';
  }

  // Remove background from image
  async removeBackground(imageFile, userId) {
    if (!this.apiKey) {
      throw new Error('remove.bg API key not configured');
    }

    try {
      // Create FormData for API request
      const formData = new FormData();
      formData.append('image_file', imageFile);
      formData.append('size', 'auto');
      formData.append('type', 'auto');

      // Call remove.bg API
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'X-Api-Key': this.apiKey,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.errors?.[0]?.title || 'Background removal failed');
      }

      // Get processed image blob
      const imageBlob = await response.blob();

      // Upload processed image to Firebase Storage
      const timestamp = Date.now();
      const fileName = `${timestamp}_${imageFile.name.replace(/\.[^/.]+$/, "")}_nobg.png`;
      const storageRef = ref(storage, `users/${userId}/processed/${fileName}`);
      
      const uploadResult = await uploadBytes(storageRef, imageBlob);
      const downloadURL = await getDownloadURL(uploadResult.ref);

      return {
        success: true,
        downloadURL,
        fileName,
        originalSize: imageFile.size,
        processedSize: imageBlob.size,
      };
    } catch (error) {
      console.error('Background removal error:', error);
      throw error;
    }
  }

  // Check API usage/credits
  async getAccountInfo() {
    if (!this.apiKey) {
      throw new Error('remove.bg API key not configured');
    }

    try {
      const response = await fetch('https://api.remove.bg/v1.0/account', {
        headers: {
          'X-Api-Key': this.apiKey,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to get account info');
      }

      const data = await response.json();
      return {
        creditsRemaining: data.attributes.credits.remaining,
        creditsTotal: data.attributes.credits.total,
      };
    } catch (error) {
      console.error('Account info error:', error);
      throw error;
    }
  }
}

export const backgroundRemovalService = new BackgroundRemovalService();