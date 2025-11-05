# Firebase Setup Guide for Photo2Profit

## Project Information
- **Project ID**: `photo2profit-758851214311`
- **Project Number**: `758851214311`

## 🚀 Quick Setup

### 1. Get Firebase Credentials

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `photo2profit-758851214311`
3. Go to **Project Settings** (gear icon) > **General** tab
4. Scroll down to **Your apps** section
5. If no web app exists, click **Add app** and select **Web** (`</>`)
6. Register your app with name: `Photo2Profit Web App`
7. Copy the configuration values

### 2. Update Environment Variables

Update your `.env` file with the actual values from Firebase Console:

```env
# Firebase Configuration - Replace with your actual values
VITE_FIREBASE_API_KEY=AIzaSyC... (from Firebase Console)
VITE_FIREBASE_AUTH_DOMAIN=photo2profit-758851214311.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=photo2profit-758851214311
VITE_FIREBASE_STORAGE_BUCKET=photo2profit-758851214311.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=758851214311
VITE_FIREBASE_APP_ID=1:758851214311:web:... (from Firebase Console)
```

### 3. Enable Firebase Services

In the Firebase Console for your project:

#### **Authentication**
1. Go to **Authentication** > **Sign-in method**
2. Enable **Email/Password**
3. Enable **Google** (optional but recommended)
4. Configure authorized domains:
   - `localhost` (for development)
   - Your production domain

#### **Firestore Database**
1. Go to **Firestore Database**
2. Click **Create database**
3. Choose **Start in test mode** (or production mode with security rules)
4. Select a location (recommend `us-central1`)

#### **Storage**
1. Go to **Storage**
2. Click **Get started**
3. Choose **Start in test mode** (configure rules later)
4. Select same location as Firestore

### 4. Security Rules (Important!)

#### **Firestore Rules** (`firestore.rules`)
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Users can read/write their own photos
    match /photos/{photoId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
    }
    
    // Users can read/write their own listings
    match /listings/{listingId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
    }
    
    // Public read access for certain collections (if needed)
    match /public/{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

#### **Storage Rules** (`storage.rules`)
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Users can upload to their own folders
    match /users/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Public uploads folder (if needed)
    match /uploads/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## 💡 Usage Examples

### Basic Authentication
```javascript
import { useAuth } from '../contexts/AuthContext';

function MyComponent() {
  const { user, signin, logout } = useAuth();
  
  if (user) {
    return (
      <div>
        <p>Welcome, {user.email}!</p>
        <button onClick={logout}>Sign Out</button>
      </div>
    );
  }
  
  return (
    <button onClick={() => signin('email@example.com', 'password')}>
      Sign In
    </button>
  );
}
```

### Firestore Operations
```javascript
import { db } from '../firebase';
import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc 
} from 'firebase/firestore';

// Add a document
const addPhoto = async (photoData) => {
  try {
    const docRef = await addDoc(collection(db, 'photos'), {
      ...photoData,
      userId: auth.currentUser.uid,
      createdAt: new Date()
    });
    console.log('Document written with ID: ', docRef.id);
  } catch (error) {
    console.error('Error adding document: ', error);
  }
};

// Read documents
const getPhotos = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'photos'));
    const photos = [];
    querySnapshot.forEach((doc) => {
      photos.push({ id: doc.id, ...doc.data() });
    });
    return photos;
  } catch (error) {
    console.error('Error getting documents: ', error);
  }
};
```

### Storage Operations
```javascript
import { storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// Upload a file
const uploadPhoto = async (file) => {
  try {
    const storageRef = ref(storage, `photos/${Date.now()}_${file.name}`);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    console.log('File uploaded successfully:', downloadURL);
    return downloadURL;
  } catch (error) {
    console.error('Error uploading file:', error);
  }
};
```

## 🔧 App Integration

### 1. Wrap your app with AuthProvider

```javascript
// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { AuthProvider } from './contexts/AuthContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>,
);
```

### 2. Protected Routes

```javascript
// src/components/ProtectedRoute.jsx
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  return user ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
```

## 🚨 Important Security Notes

1. **Never commit `.env` files** - Add `.env` to `.gitignore`
2. **Use environment variables** for all sensitive data
3. **Configure proper Firestore rules** before going to production
4. **Set up proper Storage rules** to prevent unauthorized access
5. **Enable App Check** for production to prevent API abuse

## 🌐 Deployment Considerations

### Vercel/Netlify
- Add environment variables in your hosting platform's dashboard
- Set `VITE_FIREBASE_AUTH_DOMAIN` to your custom domain if using one

### Custom Domain
- Add your domain to Firebase Auth authorized domains
- Update `VITE_FIREBASE_AUTH_DOMAIN` if using custom domain

## 📚 Useful Firebase Documentation

- [Firebase Web Setup](https://firebase.google.com/docs/web/setup)
- [Authentication Guide](https://firebase.google.com/docs/auth/web/start)
- [Firestore Guide](https://firebase.google.com/docs/firestore/quickstart)
- [Storage Guide](https://firebase.google.com/docs/storage/web/start)
- [Security Rules](https://firebase.google.com/docs/rules)

## 🆘 Common Issues

### "Firebase not configured" Error
- Check if all environment variables are properly set
- Ensure `.env` file is in the project root
- Restart your development server after changing `.env`

### Authentication Not Working
- Verify your domain is in Firebase Auth authorized domains
- Check browser console for detailed error messages
- Ensure Auth methods are enabled in Firebase Console

### Firestore Permission Denied
- Check your Firestore security rules
- Ensure user is authenticated before making requests
- Verify the user has permission for the specific document