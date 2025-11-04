// src/services/firebaseService.js
import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  getDoc,
  updateDoc, 
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp
} from 'firebase/firestore';
import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject 
} from 'firebase/storage';
import { db, storage, auth } from '../firebase';

/**
 * Firebase service for Photo2Profit application
 * Provides easy-to-use methods for Firestore and Storage operations
 */

// =============================================================================
// FIRESTORE OPERATIONS
// =============================================================================

/**
 * Add a new document to a collection
 * @param {string} collectionName - Name of the collection
 * @param {object} data - Data to add
 * @returns {Promise<string>} Document ID
 */
export const addDocument = async (collectionName, data) => {
  try {
    const docRef = await addDoc(collection(db, collectionName), {
      ...data,
      userId: auth.currentUser?.uid,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding document:', error);
    throw error;
  }
};

/**
 * Get all documents from a collection for the current user
 * @param {string} collectionName - Name of the collection
 * @param {number} limitCount - Number of documents to return
 * @returns {Promise<Array>} Array of documents
 */
export const getUserDocuments = async (collectionName, limitCount = 50) => {
  try {
    if (!auth.currentUser) throw new Error('User not authenticated');
    
    const q = query(
      collection(db, collectionName),
      where('userId', '==', auth.currentUser.uid),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(q);
    const documents = [];
    querySnapshot.forEach((doc) => {
      documents.push({ id: doc.id, ...doc.data() });
    });
    
    return documents;
  } catch (error) {
    console.error('Error getting documents:', error);
    throw error;
  }
};

/**
 * Get a specific document by ID
 * @param {string} collectionName - Name of the collection
 * @param {string} docId - Document ID
 * @returns {Promise<object|null>} Document data or null if not found
 */
export const getDocument = async (collectionName, docId) => {
  try {
    const docRef = doc(db, collectionName, docId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error getting document:', error);
    throw error;
  }
};

/**
 * Update a document
 * @param {string} collectionName - Name of the collection
 * @param {string} docId - Document ID
 * @param {object} data - Data to update
 * @returns {Promise<void>}
 */
export const updateDocument = async (collectionName, docId, data) => {
  try {
    const docRef = doc(db, collectionName, docId);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating document:', error);
    throw error;
  }
};

/**
 * Delete a document
 * @param {string} collectionName - Name of the collection
 * @param {string} docId - Document ID
 * @returns {Promise<void>}
 */
export const deleteDocument = async (collectionName, docId) => {
  try {
    const docRef = doc(db, collectionName, docId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting document:', error);
    throw error;
  }
};

// =============================================================================
// STORAGE OPERATIONS
// =============================================================================

/**
 * Upload a file to Firebase Storage
 * @param {File} file - File to upload
 * @param {string} folderPath - Storage folder path (e.g., 'photos', 'listings')
 * @returns {Promise<object>} Object with downloadURL and path
 */
export const uploadFile = async (file, folderPath = 'uploads') => {
  try {
    if (!auth.currentUser) throw new Error('User not authenticated');
    
    const fileName = `${Date.now()}_${file.name}`;
    const filePath = `${folderPath}/${auth.currentUser.uid}/${fileName}`;
    const storageRef = ref(storage, filePath);
    
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    return {
      downloadURL,
      path: filePath,
      fileName,
      size: file.size,
      type: file.type
    };
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};

/**
 * Delete a file from Firebase Storage
 * @param {string} filePath - Full path to the file in storage
 * @returns {Promise<void>}
 */
export const deleteFile = async (filePath) => {
  try {
    const fileRef = ref(storage, filePath);
    await deleteObject(fileRef);
  } catch (error) {
    console.error('Error deleting file:', error);
    throw error;
  }
};

// =============================================================================
// PHOTO2PROFIT SPECIFIC OPERATIONS
// =============================================================================

/**
 * Save uploaded photo data to Firestore
 * @param {object} photoData - Photo information
 * @returns {Promise<string>} Photo document ID
 */
export const savePhoto = async (photoData) => {
  return addDocument('photos', {
    name: photoData.name,
    url: photoData.downloadURL,
    path: photoData.path,
    size: photoData.size,
    type: photoData.type,
    status: 'uploaded',
    processed: false
  });
};

/**
 * Get user's photos
 * @returns {Promise<Array>} Array of photo documents
 */
export const getUserPhotos = async () => {
  return getUserDocuments('photos');
};

/**
 * Save generated listing to Firestore
 * @param {object} listingData - Listing information
 * @returns {Promise<string>} Listing document ID
 */
export const saveListing = async (listingData) => {
  return addDocument('listings', {
    photoId: listingData.photoId,
    title: listingData.title,
    description: listingData.description,
    price: listingData.price,
    category: listingData.category,
    tags: listingData.tags || [],
    platforms: listingData.platforms || [],
    status: 'draft'
  });
};

/**
 * Get user's listings
 * @returns {Promise<Array>} Array of listing documents
 */
export const getUserListings = async () => {
  return getUserDocuments('listings');
};

/**
 * Update user profile/settings
 * @param {object} profileData - User profile data
 * @returns {Promise<void>}
 */
export const updateUserProfile = async (profileData) => {
  if (!auth.currentUser) throw new Error('User not authenticated');
  
  const userId = auth.currentUser.uid;
  try {
    // Try to update existing profile
    await updateDocument('users', userId, profileData);
  } catch (error) {
    // If profile doesn't exist, create it
    if (error.code === 'not-found') {
      await addDocument('users', {
        ...profileData,
        email: auth.currentUser.email,
        uid: userId
      });
    } else {
      throw error;
    }
  }
};

/**
 * Get user profile
 * @returns {Promise<object|null>} User profile data
 */
export const getUserProfile = async () => {
  if (!auth.currentUser) return null;
  
  try {
    return await getDocument('users', auth.currentUser.uid);
  } catch (error) {
    console.error('Error getting user profile:', error);
    return null;
  }
};

// =============================================================================
// USAGE TRACKING
// =============================================================================

/**
 * Track user usage for billing/limits
 * @param {string} action - Action type ('photo_upload', 'listing_generation', etc.)
 * @param {object} metadata - Additional metadata
 * @returns {Promise<void>}
 */
export const trackUsage = async (action, metadata = {}) => {
  if (!auth.currentUser) return;
  
  try {
    await addDocument('usage', {
      action,
      metadata,
      timestamp: serverTimestamp()
    });
  } catch (error) {
    console.error('Error tracking usage:', error);
  }
};

// =============================================================================
// EXAMPLE USAGE
// =============================================================================

/*
// Upload and save a photo
const handlePhotoUpload = async (file) => {
  try {
    // Upload file to storage
    const uploadResult = await uploadFile(file, 'photos');
    
    // Save photo metadata to Firestore
    const photoId = await savePhoto(uploadResult);
    
    // Track usage
    await trackUsage('photo_upload', { photoId, fileSize: file.size });
    
    console.log('Photo uploaded successfully:', photoId);
  } catch (error) {
    console.error('Upload failed:', error);
  }
};

// Get user's photos
const loadPhotos = async () => {
  try {
    const photos = await getUserPhotos();
    console.log('User photos:', photos);
  } catch (error) {
    console.error('Failed to load photos:', error);
  }
};

// Save a generated listing
const handleListingGeneration = async (listingData) => {
  try {
    const listingId = await saveListing(listingData);
    await trackUsage('listing_generation', { listingId });
    console.log('Listing saved:', listingId);
  } catch (error) {
    console.error('Failed to save listing:', error);
  }
};
*/