import { useState, useEffect } from 'react';
import { auth, db, storage } from '../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import stripePromise from '../stripe';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [photos, setPhotos] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState('none');

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      if (currentUser && db) {
        // Load user's photos
        try {
          const photosQuery = query(
            collection(db, 'photos'),
            where('userId', '==', currentUser.uid)
          );
          const photosSnapshot = await getDocs(photosQuery);
          const photosData = photosSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setPhotos(photosData);

          // Check subscription status
          const subscriptionQuery = query(
            collection(db, 'subscriptions'),
            where('userId', '==', currentUser.uid)
          );
          const subscriptionSnapshot = await getDocs(subscriptionQuery);
          if (!subscriptionSnapshot.empty) {
            setSubscriptionStatus(subscriptionSnapshot.docs[0].data().status || 'active');
          }
        } catch (error) {
          console.error('Error loading user data:', error);
        }
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    if (auth) {
      try {
        await signOut(auth);
      } catch (error) {
        console.error('Error signing out:', error);
      }
    }
  };

  const handlePhotoUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file || !user || !storage || !db) return;

    setUploading(true);
    try {
      // Upload to Firebase Storage
      const storageRef = ref(storage, `photos/${user.uid}/${Date.now()}_${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);

      // Save metadata to Firestore
      const photoData = {
        userId: user.uid,
        url: downloadURL,
        filename: file.name,
        uploadedAt: new Date().toISOString(),
        status: 'pending'
      };

      // Add photo metadata to Firestore
      const { addDoc } = await import('firebase/firestore');
      await addDoc(collection(db, 'photos'), photoData);

      // Update local state
      setPhotos([photoData, ...photos]);
      window.alert('Photo uploaded successfully!');
      
    } catch (error) {
      console.error('Error uploading photo:', error);
      window.alert('Failed to upload photo. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubscribe = async () => {
    if (!stripePromise) {
      window.alert('Stripe is not configured. Please add your Stripe publishable key to environment variables.');
      return;
    }

    try {
      await stripePromise;
      // In a real app, you would create a checkout session on your backend
      // and redirect to Stripe Checkout
      window.alert('Subscription feature coming soon! Stripe integration is configured and ready.');
    } catch (error) {
      console.error('Error with Stripe:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-blush">
        <div className="text-2xl text-dark">Loading...</div>
      </div>
    );
  }

  if (!auth || !user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-blush text-dark px-6">
        <h1 className="text-4xl font-diamond mb-4">Dashboard</h1>
        <p className="text-lg mb-8">
          Firebase authentication is not configured or you are not signed in.
        </p>
        <p className="text-sm text-gray-600 max-w-md text-center">
          To use the dashboard, please configure Firebase by adding your credentials to the environment variables.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blush">
      {/* Header */}
      <header className="bg-rose-dark text-white shadow-lg">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-diamond">
            PHOTO<span className="text-gold">2</span>PROFIT
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-sm">{user.email}</span>
            <button
              onClick={handleSignOut}
              className="px-4 py-2 bg-white text-rose-dark rounded-lg hover:bg-gray-100 transition"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Subscription Status */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-diamond mb-4 text-dark">Subscription Status</h2>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-lg">
                Status: <span className="font-semibold capitalize">{subscriptionStatus}</span>
              </p>
              {subscriptionStatus === 'none' && (
                <p className="text-sm text-gray-600 mt-2">
                  Subscribe to unlock all features including AI-powered listings and unlimited uploads.
                </p>
              )}
            </div>
            {subscriptionStatus === 'none' && (
              <button
                onClick={handleSubscribe}
                className="cta"
              >
                Subscribe Now
              </button>
            )}
          </div>
        </div>

        {/* Photo Upload Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-diamond mb-4 text-dark">Upload Photos</h2>
          <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-8 hover:border-rose transition">
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              disabled={uploading}
              className="hidden"
              id="photo-upload"
            />
            <label
              htmlFor="photo-upload"
              className={`cursor-pointer text-center ${uploading ? 'opacity-50' : ''}`}
            >
              <div className="text-4xl mb-2">📸</div>
              <p className="text-lg text-dark mb-2">
                {uploading ? 'Uploading...' : 'Click to upload a photo'}
              </p>
              <p className="text-sm text-gray-600">
                Supported formats: JPG, PNG, WEBP
              </p>
            </label>
          </div>
        </div>

        {/* Photos Gallery */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-diamond mb-4 text-dark">Your Photos</h2>
          {photos.length === 0 ? (
            <p className="text-gray-600 text-center py-8">
              No photos uploaded yet. Upload your first photo to get started!
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {photos.map((photo) => (
                <div key={photo.id || photo.filename} className="border rounded-lg overflow-hidden shadow-sm">
                  <img
                    src={photo.url}
                    alt={photo.filename}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <p className="text-sm font-semibold truncate">{photo.filename}</p>
                    <p className="text-xs text-gray-600 mt-1">
                      Status: <span className="capitalize">{photo.status}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
