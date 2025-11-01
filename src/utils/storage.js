import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../config/firebase.js';

/**
 * Upload a photo to Firebase Storage
 * @param {File} file - The file to upload
 * @param {string} userId - The user ID (for organizing uploads)
 * @param {function} onProgress - Optional callback for upload progress (0-100)
 * @returns {Promise<{url: string, path: string}>} - Download URL and storage path
 */
export async function uploadPhoto(file, userId = 'anonymous', onProgress = null) {
  if (!storage) {
    throw new Error('Firebase Storage is not initialized. Please check your configuration.');
  }

  if (!file) {
    throw new Error('No file provided');
  }

  // Validate file type
  const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  if (!validTypes.includes(file.type)) {
    throw new Error('Invalid file type. Please upload a JPEG, PNG, GIF, or WebP image.');
  }

  // Validate file size (max 10MB)
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    throw new Error('File size exceeds 10MB limit');
  }

  // Create a unique filename
  const timestamp = Date.now();
  const filename = `${timestamp}-${file.name}`;
  const storagePath = `uploads/${userId}/${filename}`;

  // Create a storage reference
  const storageRef = ref(storage, storagePath);

  // Upload the file
  const uploadTask = uploadBytesResumable(storageRef, file);

  return new Promise((resolve, reject) => {
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        // Track upload progress
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        if (onProgress) {
          onProgress(progress);
        }
      },
      (error) => {
        // Handle upload errors
        console.error('Upload error:', error);
        reject(new Error(`Upload failed: ${error.message}`));
      },
      async () => {
        // Upload completed successfully, get download URL
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve({
            url: downloadURL,
            path: storagePath,
          });
        } catch (error) {
          reject(new Error(`Failed to get download URL: ${error.message}`));
        }
      }
    );
  });
}

/**
 * Upload multiple photos
 * @param {File[]} files - Array of files to upload
 * @param {string} userId - The user ID
 * @param {function} onProgress - Optional callback for overall progress
 * @returns {Promise<Array<{url: string, path: string}>>} - Array of upload results
 */
export async function uploadMultiplePhotos(files, userId = 'anonymous', onProgress = null) {
  const totalFiles = files.length;
  let completedFiles = 0;

  const uploadPromises = files.map((file) =>
    uploadPhoto(file, userId, (fileProgress) => {
      if (onProgress) {
        // Calculate overall progress
        const overallProgress = ((completedFiles + fileProgress / 100) / totalFiles) * 100;
        onProgress(overallProgress);
      }
    }).then((result) => {
      completedFiles++;
      return result;
    })
  );

  return Promise.all(uploadPromises);
}
