/**
 * Photo2Profit — Firebase Storage Uploader (Organized Version)
 * -------------------------------------------------------------
 * Uploads listing photos into categorized folders in Firebase Storage.
 * Automatically sorts by main + subcategory for organization.
 */

import fs from "fs/promises";
import path from "path";
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import mime from "mime-types";

// 🔥 Firebase config (same as in firebase.js)
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY || "YOUR_API_KEY",
  authDomain: process.env.FIREBASE_AUTH_DOMAIN || "YOUR_AUTH_DOMAIN",
  projectId: process.env.FIREBASE_PROJECT_ID || "YOUR_PROJECT_ID",
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "YOUR_BUCKET",
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || "YOUR_SENDER_ID",
  appId: process.env.FIREBASE_APP_ID || "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

/**
 * Upload a file to Firebase Storage and return the public URL
 * Organized into category folders for better management.
 *
 * @param {string} filePath - Path to local image file
 * @param {string} listingId - Listing ID
 * @param {string} category - Category like "Women > Tops"
 * @param {Object} options - Additional upload options
 */
export async function uploadToStorage(filePath, listingId, category = "Misc", options = {}) {
  try {
    // Verify file exists
    await fs.access(filePath);
  } catch (error) {
    throw new Error(`File not found: ${filePath}`);
  }

  const fileBuffer = await fs.readFile(filePath);
  const fileExt = path.extname(filePath);
  const mimeType = mime.lookup(fileExt) || "image/jpeg";

  // 🗂️ Parse category for nested folders
  const categoryPath = category.replace(/\s*>\s*/g, "/").replace(/[^a-zA-Z0-9\-_\/]/g, "");
  const cleanCategory = categoryPath || "Misc";

  // Generate unique filename
  const timestamp = Date.now();
  const originalName = path.basename(filePath, fileExt);
  const safeName = originalName.replace(/[^a-zA-Z0-9\-_]/g, "_");
  const fileName = `${timestamp}_${safeName}${fileExt}`;
  
  // Create organized path structure
  const fullPath = `uploads/${cleanCategory}/${listingId}/${fileName}`;

  const storageRef = ref(storage, fullPath);
  const metadata = { 
    contentType: mimeType,
    customMetadata: {
      listingId: listingId,
      category: category,
      uploadedAt: new Date().toISOString(),
      originalName: originalName,
      ...options.metadata
    }
  };

  console.log(`📤 Uploading ${path.basename(filePath)} → ${fullPath} ...`);

  // Upload file
  await uploadBytes(storageRef, fileBuffer, metadata);
  
  // Get public download URL
  const downloadURL = await getDownloadURL(storageRef);

  console.log(`✅ Uploaded! Public URL:\n${downloadURL}\n`);
  
  return {
    url: downloadURL,
    path: fullPath,
    size: fileBuffer.length,
    mimeType: mimeType,
    metadata: metadata.customMetadata
  };
}

/**
 * Upload multiple images for a single listing
 * @param {Array} filePaths - Array of image file paths
 * @param {string} listingId - Listing ID
 * @param {string} category - Category for organization
 */
export async function uploadMultipleImages(filePaths, listingId, category = "Misc") {
  console.log(`📸 Uploading ${filePaths.length} images for listing ${listingId}...`);
  
  const results = [];
  const errors = [];
  
  for (const [index, filePath] of filePaths.entries()) {
    try {
      console.log(`\n📤 Uploading image ${index + 1}/${filePaths.length}...`);
      const result = await uploadToStorage(filePath, listingId, category, {
        metadata: { imageIndex: index.toString() }
      });
      results.push(result);
    } catch (error) {
      console.error(`❌ Failed to upload ${filePath}:`, error.message);
      errors.push({ filePath, error: error.message });
    }
  }
  
  console.log(`\n✅ Upload complete! ${results.length} successful, ${errors.length} failed`);
  
  return { results, errors };
}

/**
 * Delete an image from Firebase Storage
 * @param {string} imagePath - Storage path or full URL
 */
export async function deleteFromStorage(imagePath) {
  try {
    let storageRef;
    
    if (imagePath.startsWith('http')) {
      // Extract path from full URL
      const url = new URL(imagePath);
      const pathMatch = url.pathname.match(/\/o\/(.+)\?/);
      if (!pathMatch) throw new Error('Invalid Firebase Storage URL');
      const path = decodeURIComponent(pathMatch[1]);
      storageRef = ref(storage, path);
    } else {
      // Direct path
      storageRef = ref(storage, imagePath);
    }
    
    await deleteObject(storageRef);
    console.log(`🗑️ Deleted image from storage: ${imagePath}`);
    
  } catch (error) {
    console.error(`❌ Error deleting image:`, error.message);
    throw error;
  }
}

/**
 * Generate optimized image versions (thumbnail, medium, large)
 * This is a placeholder for future image processing functionality
 */
export async function generateImageVariants(filePath, listingId, category) {
  // For now, just upload the original
  // In the future, this could generate multiple sizes using Sharp.js
  const original = await uploadToStorage(filePath, listingId, category, {
    metadata: { variant: 'original' }
  });
  
  return {
    original: original.url,
    thumbnail: original.url, // Placeholder
    medium: original.url,    // Placeholder
    large: original.url      // Placeholder
  };
}

/**
 * Get storage analytics for a category or listing
 * @param {string} categoryOrListingId - Category path or listing ID
 */
export function getStorageAnalytics(categoryOrListingId) {
  // This would integrate with Firebase Storage analytics
  // For now, return mock data
  return {
    totalFiles: 0,
    totalSize: 0,
    lastUpload: null,
    categories: []
  };
}

/**
 * Clean up orphaned images (images without corresponding Firestore documents)
 * This would be run periodically to maintain storage efficiency
 */
export async function cleanupOrphanedImages() {
  console.log("🧹 Starting orphaned image cleanup...");
  // This would:
  // 1. List all images in storage
  // 2. Check if corresponding Firestore documents exist
  // 3. Delete images without matching documents
  // For now, just log the intention
  console.log("🧹 Cleanup complete (placeholder)");
}

// 📊 Storage path utilities
export function buildStoragePath(category, listingId, filename) {
  const categoryPath = category.replace(/\s*>\s*/g, "/").replace(/[^a-zA-Z0-9\-_\/]/g, "");
  return `uploads/${categoryPath}/${listingId}/${filename}`;
}

export function parseStoragePath(fullPath) {
  const parts = fullPath.split('/');
  if (parts[0] !== 'uploads' || parts.length < 4) {
    return null;
  }
  
  return {
    category: parts.slice(1, -2).join(' > '),
    listingId: parts[parts.length - 2],
    filename: parts[parts.length - 1]
  };
}

// --- CLI Usage Examples ---
if (import.meta.url === `file://${process.argv[1]}`) {
  const command = process.argv[2];
  
  if (command === "test") {
    // Test upload with sample category
    const imagePath = process.argv[3] || "./sample-image.jpg";
    uploadToStorage(imagePath, "test123", "Women > Tops")
      .then(result => {
        console.log("Upload result:", result);
      })
      .catch(console.error);
      
  } else if (command === "cleanup") {
    // Run cleanup
    cleanupOrphanedImages()
      .catch(console.error);
      
  } else {
    console.log(`
📸 Photo2Profit Firebase Storage Tool

Usage:
  node scripts/firebase-storage.js test [image-path]    # Test upload
  node scripts/firebase-storage.js cleanup             # Clean orphaned images

Examples:
  node scripts/firebase-storage.js test ./photo.jpg
  node scripts/firebase-storage.js cleanup
    `);
  }
}