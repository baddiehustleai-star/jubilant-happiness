import { initializeApp } from "firebase/app";
import { 
  getFirestore, 
  collection, 
  getDocs, 
  doc, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  query,
  where,
  orderBy,
  limit
} from "firebase/firestore";

// 🔥 Firebase configuration - replace with your own from Firebase console
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY || "YOUR_API_KEY_HERE",
  authDomain: process.env.FIREBASE_AUTH_DOMAIN || "YOUR_PROJECT.firebaseapp.com",
  projectId: process.env.FIREBASE_PROJECT_ID || "YOUR_PROJECT_ID",
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "YOUR_PROJECT.appspot.com",
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: process.env.FIREBASE_APP_ID || "1:123456789:web:abcdef123456"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// ✨ LISTINGS OPERATIONS
export async function fetchListings() {
  try {
    const snapshot = await getDocs(collection(db, "listings"));
    const listings = snapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data(),
      // Ensure consistent data structure
      dateAdded: doc.data().dateAdded || new Date().toISOString(),
      lastUpdated: doc.data().lastUpdated || new Date().toISOString()
    }));
    
    console.log(`📦 Fetched ${listings.length} listings from Firestore`);
    return listings;
  } catch (error) {
    console.error("❌ Error fetching listings:", error);
    // Return sample data if Firestore fails (for development)
    return getSampleListings();
  }
}

export async function saveListing(id, data) {
  try {
    const listingData = {
      ...data,
      lastUpdated: new Date().toISOString()
    };
    
    if (id) {
      await setDoc(doc(db, "listings", id), listingData, { merge: true });
      console.log(`✅ Updated listing: ${id}`);
    } else {
      const docRef = await addDoc(collection(db, "listings"), {
        ...listingData,
        dateAdded: new Date().toISOString()
      });
      console.log(`✅ Created new listing: ${docRef.id}`);
      return docRef.id;
    }
  } catch (error) {
    console.error("❌ Error saving listing:", error);
    throw error;
  }
}

export async function deleteListing(id) {
  try {
    await deleteDoc(doc(db, "listings", id));
    console.log(`🗑️ Deleted listing: ${id}`);
  } catch (error) {
    console.error("❌ Error deleting listing:", error);
    throw error;
  }
}

// ✨ REPORTS OPERATIONS
export async function saveReport(reportType, reportData) {
  try {
    const report = {
      ...reportData,
      type: reportType,
      createdAt: new Date().toISOString(),
      date: new Date().toISOString().split('T')[0]
    };
    
    const docRef = await addDoc(collection(db, "reports"), report);
    console.log(`📊 Saved ${reportType} report: ${docRef.id}`);
    return docRef.id;
  } catch (error) {
    console.error("❌ Error saving report:", error);
    throw error;
  }
}

export async function fetchReports(reportType = null, limitCount = 50) {
  try {
    let q = collection(db, "reports");
    
    if (reportType) {
      q = query(q, where("type", "==", reportType));
    }
    
    q = query(q, orderBy("createdAt", "desc"), limit(limitCount));
    
    const snapshot = await getDocs(q);
    const reports = snapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data() 
    }));
    
    console.log(`📈 Fetched ${reports.length} reports from Firestore`);
    return reports;
  } catch (error) {
    console.error("❌ Error fetching reports:", error);
    return [];
  }
}

// ✨ PRICING OPERATIONS
export async function savePricingUpdate(listingId, pricingData) {
  try {
    const pricingUpdate = {
      listingId,
      ...pricingData,
      updatedAt: new Date().toISOString()
    };
    
    // Save to pricing history collection
    const docRef = await addDoc(collection(db, "pricing_history"), pricingUpdate);
    
    // Update the listing with new pricing info
    if (pricingData.suggestedPrice) {
      await updateDoc(doc(db, "listings", listingId), {
        suggestedPrice: pricingData.suggestedPrice,
        lastPriceUpdate: new Date().toISOString(),
        pricingConfidence: pricingData.confidence || 'medium'
      });
    }
    
    console.log(`💰 Saved pricing update for listing: ${listingId}`);
    return docRef.id;
  } catch (error) {
    console.error("❌ Error saving pricing update:", error);
    throw error;
  }
}

// ✨ SOCIAL MEDIA OPERATIONS
export async function saveSocialPost(postData) {
  try {
    const socialPost = {
      ...postData,
      createdAt: new Date().toISOString(),
      status: 'pending' // pending, posted, failed
    };
    
    const docRef = await addDoc(collection(db, "social_posts"), socialPost);
    console.log(`📱 Saved social post: ${docRef.id}`);
    return docRef.id;
  } catch (error) {
    console.error("❌ Error saving social post:", error);
    throw error;
  }
}

export async function fetchPendingSocialPosts() {
  try {
    const q = query(
      collection(db, "social_posts"), 
      where("status", "==", "pending"),
      orderBy("createdAt", "asc")
    );
    
    const snapshot = await getDocs(q);
    const posts = snapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data() 
    }));
    
    console.log(`📱 Found ${posts.length} pending social posts`);
    return posts;
  } catch (error) {
    console.error("❌ Error fetching social posts:", error);
    return [];
  }
}

export async function updateSocialPostStatus(postId, status) {
  try {
    await updateDoc(doc(db, "social_posts", postId), {
      status,
      updatedAt: new Date().toISOString()
    });
    console.log(`📱 Updated social post ${postId} status to: ${status}`);
  } catch (error) {
    console.error("❌ Error updating social post status:", error);
    throw error;
  }
}

// ✨ ANALYTICS OPERATIONS
export async function saveAnalytics(analyticsType, data) {
  try {
    const analytics = {
      type: analyticsType,
      data,
      createdAt: new Date().toISOString(),
      date: new Date().toISOString().split('T')[0]
    };
    
    const docRef = await addDoc(collection(db, "analytics"), analytics);
    console.log(`📊 Saved ${analyticsType} analytics: ${docRef.id}`);
    return docRef.id;
  } catch (error) {
    console.error("❌ Error saving analytics:", error);
    throw error;
  }
}

// ✨ UTILITY FUNCTIONS
export function getSampleListings() {
  console.log("🔄 Using sample data (Firestore not available)");
  return [
    {
      id: "sample-1",
      title: "Vintage Denim Jacket",
      description: "Classic Levi's trucker jacket, size M. Great condition.",
      price: "$45",
      tags: ["vintage", "denim", "style"],
      image: "https://example.com/jacket.jpg",
      url: "https://poshmark.com/listing/123",
      dateAdded: new Date().toISOString(),
      lastUpdated: new Date().toISOString()
    },
    {
      id: "sample-2", 
      title: "Dewalt Cordless Drill",
      description: "Includes battery + charger. Works perfectly.",
      price: "$60",
      tags: ["tools", "DIY", "hardware"],
      image: "https://example.com/drill.jpg",
      url: "https://ebay.com/item/456",
      dateAdded: new Date().toISOString(),
      lastUpdated: new Date().toISOString()
    }
  ];
}

export async function initializeFirebase() {
  try {
    // Test connection by trying to fetch listings
    await fetchListings();
    console.log("🔥 Firebase connection successful!");
    return true;
  } catch (error) {
    console.warn("⚠️ Firebase connection failed, falling back to sample data");
    console.warn("Make sure to set your Firebase config in scripts/firebase.js");
    return false;
  }
}

// Export common Firestore functions for advanced usage
export { 
  collection, 
  doc, 
  getDocs, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  query,
  where,
  orderBy,
  limit
} from "firebase/firestore";