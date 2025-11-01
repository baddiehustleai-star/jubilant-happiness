// Photo upload service with Firebase Storage integration and AI processing
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { collection, addDoc, updateDoc, doc, serverTimestamp, getDoc } from 'firebase/firestore';
import { storage, db } from '../firebase';

export const uploadService = {
  // Upload single photo to Firebase Storage
  uploadPhoto: async (file, userId, options = {}) => {
    try {
      // Validate file
      if (!file.type.startsWith('image/')) {
        throw new Error('Please select a valid image file');
      }

      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        throw new Error('File size must be less than 10MB');
      }

      // Create unique filename
      const timestamp = Date.now();
      const fileExtension = file.name.split('.').pop();
      const fileName = `${timestamp}_${Math.random().toString(36).substring(7)}.${fileExtension}`;
      
      // Upload to Firebase Storage
      const storageRef = ref(storage, `users/${userId}/uploads/${fileName}`);
      const uploadResult = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(uploadResult.ref);

      // Save upload record to Firestore
      const uploadData = {
        fileName,
        originalName: file.name,
        downloadURL,
        fileSize: file.size,
        fileType: file.type,
        uploadedAt: serverTimestamp(),
        userId,
        status: 'uploaded',
        processed: false,
        listing: null,
        ...options,
      };

      const docRef = await addDoc(collection(db, 'users', userId, 'uploads'), uploadData);

      return {
        id: docRef.id,
        ...uploadData,
        uploadedAt: new Date(), // For immediate UI update
      };
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  },

  // Upload multiple photos
  uploadPhotos: async (files, userId, onProgress = () => {}) => {
    const results = [];
    let completed = 0;

    for (const file of files) {
      try {
        const result = await uploadService.uploadPhoto(file, userId);
        results.push(result);
        completed++;
        onProgress(completed, files.length);
      } catch (error) {
        results.push({ error: error.message, file: file.name });
        completed++;
        onProgress(completed, files.length);
      }
    }

    return results;
  },

  // Delete photo from storage and database
  deletePhoto: async (uploadId, userId, fileName) => {
    try {
      // Delete from Storage
      const storageRef = ref(storage, `users/${userId}/uploads/${fileName}`);
      await deleteObject(storageRef);

      // Delete from Firestore
      const docRef = doc(db, 'users', userId, 'uploads', uploadId);
      await updateDoc(docRef, {
        status: 'deleted',
        deletedAt: serverTimestamp(),
      });

      return true;
    } catch (error) {
      console.error('Delete error:', error);
      throw error;
    }
  },

  // Process image with AI (enhanced with real AI integration)
  processImage: async (uploadId, userId) => {
    try {
      const docRef = doc(db, 'users', userId, 'uploads', uploadId);
      await updateDoc(docRef, {
        status: 'processing',
        processedAt: serverTimestamp(),
      });

      // Get the upload document to access image URL
      const uploadDoc = await getDoc(docRef);
      const uploadData = uploadDoc.data();

      if (!uploadData?.downloadURL) {
        throw new Error('Image URL not found');
      }

      // Import AI services (dynamic import to avoid build errors if not configured)
      const { listingGeneratorService } = await import('./listingGenerator');
      const { backgroundRemovalService } = await import('./backgroundRemoval');

      let processedImageUrl = uploadData.downloadURL;
      let backgroundRemoved = false;

      // Optional: Remove background if service is configured
      try {
        if (import.meta.env.VITE_REMOVEBG_API_KEY) {
          // Convert URL to file for background removal
          const response = await fetch(uploadData.downloadURL);
          const blob = await response.blob();
          const file = new File([blob], uploadData.fileName, { type: blob.type });
          
          const bgResult = await backgroundRemovalService.removeBackground(file, userId);
          if (bgResult.success) {
            processedImageUrl = bgResult.downloadURL;
            backgroundRemoved = true;
          }
        }
      } catch (bgError) {
        console.log('Background removal failed, continuing with original image:', bgError.message);
      }

      // Generate AI listing
      let aiListing;
      try {
        aiListing = await listingGeneratorService.generateListing(processedImageUrl);
      } catch (aiError) {
        console.log('AI listing generation failed, using fallback:', aiError.message);
        aiListing = listingGeneratorService.generateFallbackListing();
      }

      // Update document with AI results
      await updateDoc(docRef, {
        status: 'processed',
        processed: true,
        processedImageUrl: backgroundRemoved ? processedImageUrl : null,
        backgroundRemoved,
        aiTags: aiListing.keywords || ['fashion', 'quality'],
        suggestedTitle: aiListing.title,
        suggestedDescription: aiListing.description,
        suggestedCategory: aiListing.category,
        suggestedCondition: aiListing.condition,
        suggestedPriceRange: aiListing.priceRange,
        suggestedBrand: aiListing.brand,
        aiConfidence: aiListing.confidence || 0.7,
        processedAt: serverTimestamp(),
      });

      return {
        success: true,
        aiListing,
        backgroundRemoved,
        processedImageUrl,
      };
    } catch (error) {
      console.error('Processing error:', error);
      
      // Update with error status
      const docRef = doc(db, 'users', userId, 'uploads', uploadId);
      await updateDoc(docRef, {
        status: 'error',
        error: error.message,
        processedAt: serverTimestamp(),
      });
      
      throw error;
    }
  },

  // Create listing from processed upload
  createListing: async (uploadId, userId, listingData) => {
    try {
      const listingRef = await addDoc(collection(db, 'users', userId, 'listings'), {
        uploadId,
        title: listingData.title,
        description: listingData.description,
        category: listingData.category,
        condition: listingData.condition,
        price: listingData.price,
        brand: listingData.brand,
        images: listingData.images || [],
        keywords: listingData.keywords || [],
        status: 'draft',
        createdAt: serverTimestamp(),
        userId,
      });

      // Update upload document to link to listing
      const uploadRef = doc(db, 'users', userId, 'uploads', uploadId);
      await updateDoc(uploadRef, {
        listingId: listingRef.id,
        listing: 'created',
      });

      return listingRef.id;
    } catch (error) {
      console.error('Create listing error:', error);
      throw error;
    }
  },
};

// File validation helpers
export const validateImageFile = (file) => {
  const errors = [];

  if (!file.type.startsWith('image/')) {
    errors.push('File must be an image');
  }

  if (file.size > 10 * 1024 * 1024) {
    errors.push('File size must be less than 10MB');
  }

  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    errors.push('File must be JPEG, PNG, or WebP format');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};