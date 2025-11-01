// Upload Service - Firebase Storage Integration with AI Processing Pipeline
import { getStorage, ref, uploadBytesResumable, getDownloadURL, deleteObject, listAll } from 'firebase/storage';
import { getFirestore, doc, addDoc, updateDoc, collection, serverTimestamp, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Import other services
import { listingGeneratorService } from './listingGenerator.js';
import { backgroundRemovalService } from './backgroundRemoval.js';
import { paymentService } from './payment.js';

class UploadService {
  constructor() {
    this.storage = getStorage();
    this.firestore = getFirestore();
    this.auth = getAuth();
    
    this.maxFileSize = 25 * 1024 * 1024; // 25MB
    this.allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/heic'];
    this.thumbnailSizes = [150, 300, 600]; // Different thumbnail sizes
    
    this.uploadStates = new Map(); // Track active uploads
  }

  // Main upload function with AI processing pipeline
  async uploadWithAI(files, options = {}) {
    try {
      // Validate user subscription and usage
      const user = this.auth.currentUser;
      if (!user) {
        throw new Error('User must be authenticated');
      }

      const subscription = await paymentService.getSubscriptionStatus(user.uid);
      if (!subscription.canUpload) {
        throw new Error('Upload limit reached. Please upgrade your subscription.');
      }

      // Process files
      const uploadPromises = Array.from(files).map(file => 
        this.processSingleFile(file, options)
      );

      const results = await Promise.allSettled(uploadPromises);
      
      // Update usage tracking
      const successfulUploads = results.filter(r => r.status === 'fulfilled').length;
      if (successfulUploads > 0) {
        await paymentService.updateUsage(user.uid, 'uploads', successfulUploads);
      }

      return {
        successful: results.filter(r => r.status === 'fulfilled').map(r => r.value),
        failed: results.filter(r => r.status === 'rejected').map(r => r.reason),
        totalProcessed: successfulUploads,
        totalFailed: results.length - successfulUploads,
      };

    } catch (error) {
      console.error('Upload with AI failed:', error);
      throw error;
    }
  }

  // Process a single file through the complete pipeline
  async processSingleFile(file, options = {}) {
    const uploadId = this.generateUploadId();
    const user = this.auth.currentUser;
    
    try {
      // Initialize upload state
      this.uploadStates.set(uploadId, {
        status: 'starting',
        progress: 0,
        stage: 'validation',
        file: file,
        startTime: Date.now(),
      });

      // 1. Validate file
      this.updateUploadState(uploadId, { stage: 'validation', progress: 5 });
      await this.validateFile(file);

      // 2. Create database record
      this.updateUploadState(uploadId, { stage: 'creating_record', progress: 10 });
      const uploadRecord = await this.createUploadRecord(file, user.uid, uploadId);

      // 3. Upload original image
      this.updateUploadState(uploadId, { stage: 'uploading_original', progress: 15 });
      const originalUpload = await this.uploadToStorage(file, `uploads/${user.uid}/${uploadId}/original`, (progress) => {
        this.updateUploadState(uploadId, { progress: 15 + (progress * 0.25) }); // 15-40%
      });

      // 4. Generate thumbnails
      this.updateUploadState(uploadId, { stage: 'generating_thumbnails', progress: 40 });
      const thumbnails = await this.generateThumbnails(file, `uploads/${user.uid}/${uploadId}/thumbnails`);
      this.updateUploadState(uploadId, { progress: 50 });

      // 5. AI Analysis (if enabled)
      let aiAnalysis = null;
      if (options.enableAI !== false) {
        this.updateUploadState(uploadId, { stage: 'ai_analysis', progress: 55 });
        aiAnalysis = await listingGeneratorService.analyzeImage(originalUpload.url, {
          generateListing: options.generateListing,
          platform: options.platform,
        });
        this.updateUploadState(uploadId, { progress: 70 });
      }

      // 6. Background removal (if requested)
      let backgroundRemoved = null;
      if (options.removeBackground) {
        this.updateUploadState(uploadId, { stage: 'background_removal', progress: 75 });
        const bgResult = await backgroundRemovalService.removeBackground(file);
        
        if (bgResult.success) {
          // Upload background-removed version
          const bgFile = new File([bgResult.blob], `${uploadId}_nobg.png`, { type: 'image/png' });
          backgroundRemoved = await this.uploadToStorage(bgFile, `uploads/${user.uid}/${uploadId}/background_removed`, (progress) => {
            this.updateUploadState(uploadId, { progress: 75 + (progress * 0.15) }); // 75-90%
          });
        }
      }

      // 7. Update database with results
      this.updateUploadState(uploadId, { stage: 'finalizing', progress: 90 });
      await this.updateUploadRecord(uploadRecord.id, {
        originalUrl: originalUpload.url,
        thumbnails,
        aiAnalysis,
        backgroundRemovedUrl: backgroundRemoved?.url,
        status: 'completed',
        completedAt: serverTimestamp(),
        processingTime: Date.now() - this.uploadStates.get(uploadId).startTime,
      });

      // 8. Complete
      this.updateUploadState(uploadId, { 
        stage: 'completed', 
        progress: 100, 
        status: 'completed' 
      });

      // Clean up upload state after delay
      setTimeout(() => {
        this.uploadStates.delete(uploadId);
      }, 30000); // Keep for 30 seconds for status checking

      return {
        id: uploadRecord.id,
        uploadId,
        originalUrl: originalUpload.url,
        thumbnails,
        aiAnalysis,
        backgroundRemovedUrl: backgroundRemoved?.url,
        metadata: {
          fileName: file.name,
          fileSize: file.size,
          fileType: file.type,
          uploadedAt: new Date(),
          processingTime: Date.now() - this.uploadStates.get(uploadId).startTime,
        }
      };

    } catch (error) {
      console.error(`Upload failed for ${file.name}:`, error);
      
      this.updateUploadState(uploadId, { 
        status: 'failed', 
        error: error.message 
      });

      // Clean up any partial uploads
      await this.cleanupFailedUpload(uploadId, user.uid);
      
      throw error;
    }
  }

  // File validation
  async validateFile(file) {
    if (!this.allowedTypes.includes(file.type)) {
      throw new Error(`Unsupported file type: ${file.type}. Please use JPEG, PNG, WebP, or HEIC.`);
    }

    if (file.size > this.maxFileSize) {
      throw new Error(`File too large: ${(file.size / 1024 / 1024).toFixed(1)}MB. Maximum size is ${this.maxFileSize / 1024 / 1024}MB.`);
    }

    if (file.size < 1024) {
      throw new Error('File too small. Please upload a valid image file.');
    }

    // Additional validation using FileReader
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          if (img.width < 100 || img.height < 100) {
            reject(new Error('Image too small. Minimum dimensions: 100x100 pixels.'));
          } else {
            resolve();
          }
        };
        img.onerror = () => reject(new Error('Invalid image file.'));
        img.src = e.target.result;
      };
      reader.onerror = () => reject(new Error('Could not read file.'));
      reader.readAsDataURL(file);
    });
  }

  // Upload to Firebase Storage with progress tracking
  async uploadToStorage(file, path, onProgress = null) {
    const storageRef = ref(this.storage, path);
    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          if (onProgress) onProgress(progress);
        },
        (error) => {
          console.error('Upload error:', error);
          reject(error);
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            resolve({
              url: downloadURL,
              ref: uploadTask.snapshot.ref,
              metadata: uploadTask.snapshot.metadata,
            });
          } catch (error) {
            reject(error);
          }
        }
      );
    });
  }

  // Generate multiple thumbnail sizes
  async generateThumbnails(file, basePath) {
    const thumbnails = {};
    
    for (const size of this.thumbnailSizes) {
      try {
        const thumbnail = await this.createThumbnail(file, size);
        const uploadResult = await this.uploadToStorage(
          thumbnail, 
          `${basePath}/thumb_${size}.jpg`
        );
        thumbnails[size] = uploadResult.url;
      } catch (error) {
        console.error(`Failed to generate ${size}px thumbnail:`, error);
        // Continue with other sizes
      }
    }
    
    return thumbnails;
  }

  // Create thumbnail of specific size
  async createThumbnail(file, size) {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // Calculate dimensions maintaining aspect ratio
        let { width, height } = img;
        
        if (width > height) {
          if (width > size) {
            height = (height * size) / width;
            width = size;
          }
        } else {
          if (height > size) {
            width = (width * size) / height;
            height = size;
          }
        }

        canvas.width = width;
        canvas.height = height;

        // Draw and compress
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(resolve, 'image/jpeg', 0.8);
      };

      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  }

  // Database operations
  async createUploadRecord(file, userId, uploadId) {
    const uploadData = {
      uploadId,
      userId,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      status: 'processing',
      createdAt: serverTimestamp(),
      metadata: {
        originalName: file.name,
        lastModified: file.lastModified,
      }
    };

    const docRef = await addDoc(collection(this.firestore, 'uploads'), uploadData);
    return { id: docRef.id, ...uploadData };
  }

  async updateUploadRecord(docId, updates) {
    const docRef = doc(this.firestore, 'uploads', docId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
    return updates;
  }

  // Get user's uploads with pagination
  async getUserUploads(userId, options = {}) {
    try {
      const uploadsRef = collection(this.firestore, 'uploads');
      let q = query(
        uploadsRef,
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );

      if (options.limit) {
        q = query(q, limit(options.limit));
      }

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

    } catch (error) {
      console.error('Failed to get user uploads:', error);
      throw error;
    }
  }

  // Delete upload and all associated files
  async deleteUpload(uploadId, userId) {
    try {
      // Delete from storage
      const basePath = `uploads/${userId}/${uploadId}`;
      await this.deleteStorageFolder(basePath);

      // Delete from database
      const uploadsRef = collection(this.firestore, 'uploads');
      const q = query(uploadsRef, where('uploadId', '==', uploadId), where('userId', '==', userId));
      const snapshot = await getDocs(q);

      const deletePromises = snapshot.docs.map(doc => doc.ref.delete());
      await Promise.all(deletePromises);

      return { success: true };

    } catch (error) {
      console.error('Failed to delete upload:', error);
      throw error;
    }
  }

  // Delete entire storage folder
  async deleteStorageFolder(path) {
    try {
      const folderRef = ref(this.storage, path);
      const listResult = await listAll(folderRef);

      // Delete all files
      const deletePromises = listResult.items.map(item => deleteObject(item));
      
      // Delete all subfolders recursively
      const subfolderPromises = listResult.prefixes.map(prefix => 
        this.deleteStorageFolder(prefix.fullPath)
      );

      await Promise.all([...deletePromises, ...subfolderPromises]);

    } catch (error) {
      console.error('Failed to delete storage folder:', error);
      // Don't throw - partial cleanup is better than none
    }
  }

  // Cleanup failed upload
  async cleanupFailedUpload(uploadId, userId) {
    try {
      await this.deleteStorageFolder(`uploads/${userId}/${uploadId}`);
    } catch (error) {
      console.error('Failed to cleanup failed upload:', error);
    }
  }

  // Batch upload operations
  async batchUpload(files, options = {}) {
    const batchSize = options.batchSize || 3; // Process 3 files at a time
    const results = [];

    for (let i = 0; i < files.length; i += batchSize) {
      const batch = Array.from(files).slice(i, i + batchSize);
      const batchResults = await this.uploadWithAI(batch, options);
      results.push(...batchResults.successful);

      // Add delay between batches to prevent overwhelming the system
      if (i + batchSize < files.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    return results;
  }

  // Get upload statistics
  async getUploadStats(userId, timeframe = '30d') {
    try {
      const uploadsRef = collection(this.firestore, 'uploads');
      const startDate = new Date();
      
      switch (timeframe) {
        case '7d':
          startDate.setDate(startDate.getDate() - 7);
          break;
        case '30d':
          startDate.setDate(startDate.getDate() - 30);
          break;
        case '90d':
          startDate.setDate(startDate.getDate() - 90);
          break;
      }

      const q = query(
        uploadsRef,
        where('userId', '==', userId),
        where('createdAt', '>=', startDate)
      );

      const snapshot = await getDocs(q);
      const uploads = snapshot.docs.map(doc => doc.data());

      return {
        total: uploads.length,
        successful: uploads.filter(u => u.status === 'completed').length,
        failed: uploads.filter(u => u.status === 'failed').length,
        withAI: uploads.filter(u => u.aiAnalysis).length,
        withBackgroundRemoval: uploads.filter(u => u.backgroundRemovedUrl).length,
        totalSize: uploads.reduce((sum, u) => sum + (u.fileSize || 0), 0),
        averageProcessingTime: uploads
          .filter(u => u.processingTime)
          .reduce((sum, u) => sum + u.processingTime, 0) / uploads.length || 0,
      };

    } catch (error) {
      console.error('Failed to get upload stats:', error);
      return {
        total: 0,
        successful: 0,
        failed: 0,
        withAI: 0,
        withBackgroundRemoval: 0,
        totalSize: 0,
        averageProcessingTime: 0,
      };
    }
  }

  // Utility functions
  updateUploadState(uploadId, updates) {
    const currentState = this.uploadStates.get(uploadId);
    if (currentState) {
      this.uploadStates.set(uploadId, {
        ...currentState,
        ...updates,
        lastUpdated: Date.now(),
      });
    }
  }

  getUploadState(uploadId) {
    return this.uploadStates.get(uploadId);
  }

  generateUploadId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
  }

  // Format file size for display
  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // Get processing recommendations
  getProcessingRecommendations(files) {
    const recommendations = [];
    
    const totalSize = Array.from(files).reduce((sum, file) => sum + file.size, 0);
    const largeFiles = Array.from(files).filter(file => file.size > 10 * 1024 * 1024);
    
    if (totalSize > 100 * 1024 * 1024) {
      recommendations.push({
        type: 'batch',
        message: 'Large batch detected. Consider uploading in smaller groups for better performance.',
        action: 'split_batch'
      });
    }

    if (largeFiles.length > 0) {
      recommendations.push({
        type: 'compression',
        message: `${largeFiles.length} large files detected. Consider compressing for faster upload.`,
        action: 'compress_files'
      });
    }

    return recommendations;
  }
}

// Export singleton instance
export const uploadService = new UploadService();