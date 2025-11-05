// src/examples/FirebaseUsageExamples.jsx
/**
 * Complete examples of how to use Firebase in Photo2Profit
 * These examples show real-world usage patterns for the application
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  savePhoto,
  getUserPhotos,
  saveListing,
  getUserListings,
  updateUserProfile,
  getUserProfile,
  trackUsage,
  uploadFile,
} from '../services/firebaseService';

// Example 1: Photo Upload Component
export const PhotoUploadExample = () => {
  const [uploading, setUploading] = useState(false);
  const [photos, setPhotos] = useState([]);

  const handleFileUpload = async (files) => {
    setUploading(true);

    try {
      for (const file of files) {
        // 1. Upload file to Firebase Storage
        const uploadResult = await uploadFile(file, 'photos');

        // 2. Save photo metadata to Firestore
        const photoId = await savePhoto(uploadResult);

        // 3. Track usage for billing/analytics
        await trackUsage('photo_upload', {
          photoId,
          fileSize: file.size,
          fileType: file.type,
        });

        console.log('Photo uploaded successfully:', photoId);
      }

      // Refresh photos list
      loadPhotos();
    } catch (error) {
      console.error('Upload failed:', error);
      console.error('Upload failed: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const loadPhotos = async () => {
    try {
      const userPhotos = await getUserPhotos();
      setPhotos(userPhotos);
    } catch (error) {
      console.error('Failed to load photos:', error);
    }
  };

  useEffect(() => {
    loadPhotos();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Photo Upload Example</h2>

      <input
        type="file"
        multiple
        accept="image/*"
        onChange={(e) => handleFileUpload(Array.from(e.target.files))}
        disabled={uploading}
        className="mb-4"
      />

      {uploading && <p>Uploading...</p>}

      <div className="grid grid-cols-3 gap-4">
        {photos.map((photo) => (
          <div key={photo.id} className="border rounded p-2">
            <img src={photo.url} alt={photo.name} className="w-full h-32 object-cover" />
            <p className="text-sm mt-2">{photo.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// Example 2: Listing Management Component
export const ListingManagementExample = () => {
  const [listings, setListings] = useState([]);

  const generateListing = async (photo) => {
    try {
      // This would typically call your AI service
      const listingData = {
        photoId: photo.id,
        title: `Beautiful ${photo.name.split('.')[0]}`,
        description: 'AI-generated description would go here...',
        price: 29.99,
        category: 'Electronics',
        tags: ['vintage', 'collectible'],
        platforms: ['ebay', 'mercari', 'facebook'],
      };

      // Save to Firestore
      const listingId = await saveListing(listingData);

      // Track usage
      await trackUsage('listing_generation', {
        listingId,
        photoId: photo.id,
      });

      console.log('Listing generated:', listingId);
      loadListings();
    } catch (error) {
      console.error('Failed to generate listing:', error);
    }
  };

  const loadListings = async () => {
    try {
      const userListings = await getUserListings();
      setListings(userListings);
    } catch (error) {
      console.error('Failed to load listings:', error);
    }
  };

  useEffect(() => {
    loadListings();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Listing Management Example</h2>

      {/* This would be connected to your photo selection component */}
      <button
        onClick={() => generateListing({ id: 'demo', name: 'demo-photo.jpg' })}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
      >
        Generate Demo Listing
      </button>

      <div className="space-y-4">
        {listings.map((listing) => (
          <div key={listing.id} className="border rounded p-4">
            <h3 className="font-bold">{listing.title}</h3>
            <p className="text-gray-600">{listing.description}</p>
            <p className="text-green-600 font-semibold">${listing.price}</p>
            <div className="flex space-x-2 mt-2">
              {listing.platforms?.map((platform) => (
                <span key={platform} className="bg-gray-200 px-2 py-1 rounded text-sm">
                  {platform}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Example 3: User Profile Management
export const UserProfileExample = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    displayName: '',
    businessName: '',
    defaultPlatforms: [],
    preferences: {},
  });

  const loadProfile = async () => {
    try {
      const userProfile = await getUserProfile();
      if (userProfile) {
        setProfile(userProfile);
        setFormData({
          displayName: userProfile.displayName || '',
          businessName: userProfile.businessName || '',
          defaultPlatforms: userProfile.defaultPlatforms || [],
          preferences: userProfile.preferences || {},
        });
      }
    } catch (error) {
      console.error('Failed to load profile:', error);
    }
  };

  const saveProfile = async () => {
    try {
      await updateUserProfile(formData);
      setEditing(false);
      loadProfile();
      console.log('Profile updated successfully');
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  if (!user) {
    return <div>Please log in to view profile</div>;
  }

  return (
    <div className="p-6 max-w-md">
      <h2 className="text-2xl font-bold mb-4">User Profile Example</h2>

      {editing ? (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Display Name</label>
            <input
              type="text"
              value={formData.displayName}
              onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Business Name</label>
            <input
              type="text"
              value={formData.businessName}
              onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div className="flex space-x-2">
            <button onClick={saveProfile} className="bg-green-500 text-white px-4 py-2 rounded">
              Save
            </button>
            <button
              onClick={() => setEditing(false)}
              className="bg-gray-500 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Display Name:</strong> {profile?.displayName || 'Not set'}
          </p>
          <p>
            <strong>Business Name:</strong> {profile?.businessName || 'Not set'}
          </p>

          <button
            onClick={() => setEditing(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Edit Profile
          </button>
        </div>
      )}
    </div>
  );
};

// Example 4: Authentication Integration
export const AuthenticationExample = () => {
  const { user, signin, signup, signInWithGoogle, logout } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  const handleEmailAuth = async (e) => {
    e.preventDefault();

    try {
      if (isSignUp) {
        await signup(email, password);
        console.log('Account created successfully');
      } else {
        await signin(email, password);
        console.log('Signed in successfully');
      }
    } catch (error) {
      console.error('Authentication error:', error);
      console.error('Error message:', error.message);
    }
  };

  const handleGoogleAuth = async () => {
    try {
      await signInWithGoogle();
      console.log('Google sign-in successful');
    } catch (error) {
      console.error('Google auth error:', error);
      console.error('Error message:', error.message);
    }
  };

  if (user) {
    return (
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Welcome, {user.email}!</h2>
        <p className="mb-4">You are successfully authenticated with Firebase.</p>
        <button onClick={logout} className="bg-red-500 text-white px-4 py-2 rounded">
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-md">
      <h2 className="text-2xl font-bold mb-4">{isSignUp ? 'Sign Up' : 'Sign In'} Example</h2>

      <form onSubmit={handleEmailAuth} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded">
          {isSignUp ? 'Sign Up' : 'Sign In'}
        </button>
      </form>

      <button onClick={handleGoogleAuth} className="w-full bg-red-500 text-white py-2 rounded mt-2">
        Continue with Google
      </button>

      <button onClick={() => setIsSignUp(!isSignUp)} className="w-full text-blue-500 py-2 mt-2">
        {isSignUp ? 'Already have an account? Sign In' : 'Need an account? Sign Up'}
      </button>
    </div>
  );
};

// Example 5: Complete Firebase Integration Demo
export const CompleteFirebaseDemo = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">
          Photo2Profit Firebase Integration Examples
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow">
            <AuthenticationExample />
          </div>

          <div className="bg-white rounded-lg shadow">
            <UserProfileExample />
          </div>

          <div className="bg-white rounded-lg shadow">
            <PhotoUploadExample />
          </div>

          <div className="bg-white rounded-lg shadow">
            <ListingManagementExample />
          </div>
        </div>

        <div className="mt-8 bg-blue-50 border-l-4 border-blue-400 p-4">
          <h3 className="font-bold text-blue-800 mb-2">Getting Started:</h3>
          <ol className="list-decimal list-inside text-blue-700 space-y-1">
            <li>Update your .env file with Firebase credentials</li>
            <li>Enable Authentication and Firestore in Firebase Console</li>
            <li>Set up security rules for production</li>
            <li>Test the examples above</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default CompleteFirebaseDemo;
