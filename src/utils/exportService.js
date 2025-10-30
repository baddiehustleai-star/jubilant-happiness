import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, query, orderBy, limit, getDocs, where } from 'firebase/firestore';
import { storage, db } from '../config/firebase';
import { getCSVGenerator } from './csvAdapters';

/**
 * Generate timestamp for filenames
 * @returns {string} Timestamp in format suitable for filenames
 */
function generateTimestamp() {
  return new Date().toISOString().replace(/[:.]/g, '-');
}

/**
 * Upload CSV to Firebase Storage
 * @param {string} csvContent - CSV content as string
 * @param {string} platform - Platform name
 * @param {string} userId - User ID
 * @returns {Promise<string>} Download URL
 */
export async function uploadCSVToStorage(csvContent, platform, userId) {
  const timestamp = generateTimestamp();
  const filename = `exports/${userId}/${platform}_export_${timestamp}.csv`;
  const storageRef = ref(storage, filename);
  
  // Convert string to blob
  const blob = new Blob([csvContent], { type: 'text/csv' });
  
  // Upload to Firebase Storage
  await uploadBytes(storageRef, blob);
  
  // Get download URL
  const downloadURL = await getDownloadURL(storageRef);
  
  return downloadURL;
}

/**
 * Log export to Firestore
 * @param {Object} exportData - Export metadata
 * @returns {Promise<string>} Document ID
 */
export async function logExportToFirestore(exportData) {
  const exportsCollection = collection(db, 'exports');
  
  const exportDoc = {
    userId: exportData.userId,
    platform: exportData.platform,
    downloadURL: exportData.downloadURL,
    filename: exportData.filename,
    itemCount: exportData.itemCount || 0,
    createdAt: new Date(),
    status: 'completed'
  };
  
  const docRef = await addDoc(exportsCollection, exportDoc);
  
  return docRef.id;
}

/**
 * Generate and upload CSV export
 * @param {Array} listings - Listings to export
 * @param {string} platform - Target platform
 * @param {string} userId - User ID
 * @returns {Promise<Object>} Export result with download URL
 */
export async function generateAndUploadExport(listings, platform, userId) {
  try {
    // Generate CSV
    const csvGenerator = getCSVGenerator(platform);
    const csvContent = csvGenerator(listings);
    
    // Upload to Storage
    const downloadURL = await uploadCSVToStorage(csvContent, platform, userId);
    
    // Log to Firestore
    const timestamp = generateTimestamp();
    const filename = `${platform}_export_${timestamp}.csv`;
    
    const exportId = await logExportToFirestore({
      userId,
      platform,
      downloadURL,
      filename,
      itemCount: listings.length
    });
    
    return {
      success: true,
      exportId,
      downloadURL,
      filename,
      itemCount: listings.length,
      platform
    };
  } catch (error) {
    console.error('Error generating export:', error);
    throw error;
  }
}

/**
 * Get user's export history
 * @param {string} userId - User ID
 * @param {number} limitCount - Number of exports to retrieve
 * @returns {Promise<Array>} Array of export records
 */
export async function getUserExportHistory(userId, limitCount = 50) {
  try {
    const exportsCollection = collection(db, 'exports');
    const q = query(
      exportsCollection,
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(q);
    const exports = [];
    
    querySnapshot.forEach((doc) => {
      exports.push({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate()
      });
    });
    
    return exports;
  } catch (error) {
    console.error('Error fetching export history:', error);
    return [];
  }
}

/**
 * Get all exports (for admin)
 * @param {number} limitCount - Number of exports to retrieve
 * @returns {Promise<Array>} Array of export records
 */
export async function getAllExports(limitCount = 100) {
  try {
    const exportsCollection = collection(db, 'exports');
    const q = query(
      exportsCollection,
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(q);
    const exports = [];
    
    querySnapshot.forEach((doc) => {
      exports.push({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate()
      });
    });
    
    return exports;
  } catch (error) {
    console.error('Error fetching all exports:', error);
    return [];
  }
}
