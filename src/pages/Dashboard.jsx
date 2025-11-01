// User Dashboard - Main hub for Photo2Profit users
import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { paymentService, PRICE_PLANS } from '../services/payment';
import { authService } from '../services/auth';
import PhotoUpload from '../components/PhotoUpload';

export default function Dashboard({ user }) {
  const [userProfile, setUserProfile] = useState(null);
  const [uploads, setUploads] = useState([]);
  const [subscriptionStatus, setSubscriptionStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upload');
  const [uploadLimit, setUploadLimit] = useState({ canUpload: true, uploadsUsed: 0, uploadLimit: 5 });

  useEffect(() => {
    if (!user) return;

    const loadUserData = async () => {
      try {
        // Load user profile
        const profile = await authService.getUserProfile(user.uid);
        setUserProfile(profile);

        // Load subscription status
        const subStatus = await paymentService.getSubscriptionStatus(user.uid);
        setSubscriptionStatus(subStatus);

        // Check upload limits
        const limits = await paymentService.checkUploadLimit(user.uid);
        setUploadLimit(limits);

        setLoading(false);
      } catch (error) {
        console.error('Error loading user data:', error);
        setLoading(false);
      }
    };

    loadUserData();

    // Listen to uploads in real-time
    const uploadsQuery = query(
      collection(db, 'users', user.uid, 'uploads'),
      orderBy('uploadedAt', 'desc')
    );

    const unsubscribe = onSnapshot(uploadsQuery, (snapshot) => {
      const uploadsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUploads(uploadsData);
    });

    return () => unsubscribe();
  }, [user]);

  const handleUpgrade = async () => {
    try {
      if (subscriptionStatus?.isPro) {
        // Open customer portal for existing subscribers
        await paymentService.createPortalSession(subscriptionStatus.stripeCustomerId);
      } else {
        // Create new subscription
        await paymentService.createTrialSubscription(user.uid);
      }
    } catch (error) {
      console.error('Upgrade error:', error);
      alert('Failed to process upgrade. Please try again.');
    }
  };

  const handleUploadComplete = async (newUploads) => {
    // Increment upload count
    await paymentService.incrementUploadCount(user.uid, newUploads.length);
    
    // Refresh upload limits
    const limits = await paymentService.checkUploadLimit(user.uid);
    setUploadLimit(limits);
  };

  const handleSignOut = async () => {
    try {
      await authService.signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-blush flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose"></div>
      </div>
    );
  }

  const currentPlan = subscriptionStatus?.isPro ? PRICE_PLANS.pro : PRICE_PLANS.free;

  return (
    <div className="min-h-screen bg-blush">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-rose-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-diamond text-rose-dark">PHOTO2PROFIT</h1>
              <span className="ml-4 px-3 py-1 bg-gold-soft text-dark text-sm rounded-full">
                {currentPlan.name}
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Welcome, {userProfile?.displayName || 'User'}!
              </span>
              <button
                onClick={handleSignOut}
                className="text-gray-500 hover:text-gray-700 text-sm"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab('upload')}
                  className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                    activeTab === 'upload' ? 'bg-rose-light text-rose-dark' : 'hover:bg-gray-50'
                  }`}
                >
                  📷 Upload Photos
                </button>
                <button
                  onClick={() => setActiveTab('listings')}
                  className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                    activeTab === 'listings' ? 'bg-rose-light text-rose-dark' : 'hover:bg-gray-50'
                  }`}
                >
                  📋 My Listings
                </button>
                <button
                  onClick={() => setActiveTab('analytics')}
                  className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                    activeTab === 'analytics' ? 'bg-rose-light text-rose-dark' : 'hover:bg-gray-50'
                  }`}
                >
                  📊 Analytics
                </button>
                <button
                  onClick={() => setActiveTab('settings')}
                  className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                    activeTab === 'settings' ? 'bg-rose-light text-rose-dark' : 'hover:bg-gray-50'
                  }`}
                >
                  ⚙️ Settings
                </button>
              </nav>

              {/* Usage Stats */}
              <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-3">Usage This Month</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Photos Uploaded</span>
                    <span>{uploadLimit.uploadsUsed}/{uploadLimit.uploadLimit}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-rose to-gold h-2 rounded-full"
                      style={{ width: `${(uploadLimit.uploadsUsed / uploadLimit.uploadLimit) * 100}%` }}
                    ></div>
                  </div>
                  {!uploadLimit.canUpload && (
                    <p className="text-xs text-red-600 mt-2">Upload limit reached</p>
                  )}
                </div>
              </div>

              {/* Upgrade Button */}
              {!subscriptionStatus?.isPro && (
                <button
                  onClick={handleUpgrade}
                  className="w-full mt-4 cta text-center"
                >
                  Upgrade to Pro ✨
                </button>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm p-6">
              {activeTab === 'upload' && (
                <div>
                  <h2 className="text-2xl font-bold text-dark mb-6">Upload Photos</h2>
                  {uploadLimit.canUpload ? (
                    <PhotoUpload
                      user={user}
                      onUploadComplete={handleUploadComplete}
                      maxFiles={subscriptionStatus?.isPro ? 10 : 5}
                    />
                  ) : (
                    <div className="text-center py-12">
                      <div className="text-gray-400 mb-4">
                        <svg className="mx-auto h-12 w-12" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Upload Limit Reached</h3>
                      <p className="text-gray-600 mb-4">
                        You've used all {uploadLimit.uploadLimit} uploads for this month.
                      </p>
                      <button onClick={handleUpgrade} className="cta">
                        Upgrade to Pro for More Uploads 🚀
                      </button>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'listings' && (
                <div>
                  <h2 className="text-2xl font-bold text-dark mb-6">My Listings</h2>
                  {uploads.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {uploads.map((upload) => (
                        <div key={upload.id} className="border border-gray-200 rounded-lg overflow-hidden">
                          <div className="aspect-square">
                            <img
                              src={upload.downloadURL}
                              alt={upload.originalName}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="p-4">
                            <h3 className="font-medium text-gray-900 truncate">
                              {upload.suggestedTitle || upload.originalName}
                            </h3>
                            <p className="text-sm text-gray-600 mt-1">
                              {upload.status === 'processed' ? '✅ Ready to post' : '⏳ Processing...'}
                            </p>
                            <div className="mt-3">
                              <button className="text-sm text-rose hover:text-rose-dark">
                                Edit Listing →
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-gray-600">No listings yet. Upload some photos to get started!</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'analytics' && (
                <div>
                  <h2 className="text-2xl font-bold text-dark mb-6">Analytics</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gradient-to-r from-rose to-gold text-white p-6 rounded-lg">
                      <h3 className="text-lg font-semibold">Total Uploads</h3>
                      <p className="text-3xl font-bold mt-2">{uploads.length}</p>
                    </div>
                    <div className="bg-gradient-to-r from-gold to-rose text-white p-6 rounded-lg">
                      <h3 className="text-lg font-semibold">Processed</h3>
                      <p className="text-3xl font-bold mt-2">
                        {uploads.filter(u => u.processed).length}
                      </p>
                    </div>
                    <div className="bg-gradient-to-r from-rose-dark to-rose text-white p-6 rounded-lg">
                      <h3 className="text-lg font-semibold">Success Rate</h3>
                      <p className="text-3xl font-bold mt-2">
                        {uploads.length > 0 ? Math.round((uploads.filter(u => u.processed).length / uploads.length) * 100) : 0}%
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'settings' && (
                <div>
                  <h2 className="text-2xl font-bold text-dark mb-6">Settings</h2>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-3">Account Information</h3>
                      <div className="space-y-2">
                        <p><strong>Email:</strong> {userProfile?.email}</p>
                        <p><strong>Plan:</strong> {currentPlan.name}</p>
                        <p><strong>Member Since:</strong> {userProfile?.createdAt?.toDate?.()?.toLocaleDateString()}</p>
                      </div>
                    </div>

                    {subscriptionStatus?.isPro && (
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-3">Subscription</h3>
                        <button
                          onClick={handleUpgrade}
                          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                          Manage Subscription
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}