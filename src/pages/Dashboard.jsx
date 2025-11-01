// User Dashboard - Main hub for Photo2Profit users
import { useState, useEffect } from 'react';
import { authService } from '../services/auth';
import { paymentService, formatPrice, formatDate } from '../services/payment';
import EnhancedPhotoUpload from '../components/EnhancedPhotoUpload';

export default function Dashboard({ user }) {
  const [userProfile, setUserProfile] = useState(null);
  const [subscriptionStatus, setSubscriptionStatus] = useState(null);
  const [currentUsage, setCurrentUsage] = useState(null);
  const [usageLimits, setUsageLimits] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const [recentUploads, setRecentUploads] = useState([]);

  useEffect(() => {
    if (!user) return;

    const loadUserData = async () => {
      try {
        // Load user profile
        const profile = await authService.getUserProfile(user.uid);
        setUserProfile(profile);

        // Load subscription status
        const subscription = await paymentService.getSubscriptionStatus(user.uid);
        setSubscriptionStatus(subscription);

        // Load current usage
        const usage = await paymentService.getCurrentUsage(user.uid);
        setCurrentUsage(usage);

        // Load usage limits
        const limits = await paymentService.getUsageLimits(user.uid);
        setUsageLimits(limits);

        setLoading(false);
      } catch (error) {
        console.error('Error loading user data:', error);
        setLoading(false);
      }
    };

    loadUserData();
  }, [user]);

  const handleSignOut = async () => {
    try {
      await authService.signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const handleUploadComplete = (uploads) => {
    setRecentUploads(prev => [...uploads, ...prev].slice(0, 10)); // Keep last 10
    setShowUpload(false); // Close upload modal
  };

  const handleSubscribeToTrial = async () => {
    try {
      const result = await paymentService.subscribeToTrial(user.uid, user.email);
      if (result.success) {
        // Reload subscription data
        const subscription = await paymentService.getSubscriptionStatus(user.uid);
        setSubscriptionStatus(subscription);
        alert(result.message);
      }
    } catch (error) {
      console.error('Subscription error:', error);
      alert('Failed to start subscription. Please try again.');
    }
  };

  const handleSubscribeToPro = async () => {
    try {
      const result = await paymentService.subscribeToPro(user.uid, user.email);
      if (result.success) {
        // Reload subscription data
        const subscription = await paymentService.getSubscriptionStatus(user.uid);
        setSubscriptionStatus(subscription);
        alert(result.message);
      }
    } catch (error) {
      console.error('Subscription error:', error);
      alert('Failed to upgrade subscription. Please try again.');
    }
  };

  const handleManageBilling = async () => {
    try {
      if (subscriptionStatus?.customerId) {
        await paymentService.createCustomerPortalSession(subscriptionStatus.customerId);
      }
    } catch (error) {
      console.error('Portal error:', error);
      alert('Failed to open billing portal. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-blush flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blush">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-rose-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-diamond text-rose-dark">PHOTO2PROFIT</h1>
              <span className={`ml-4 px-3 py-1 text-sm rounded-full ${
                subscriptionStatus?.status === 'active' ? 'bg-green-100 text-green-800' :
                subscriptionStatus?.status === 'trialing' ? 'bg-gold-soft text-dark' :
                'bg-gray-100 text-gray-800'
              }`}>
                {subscriptionStatus?.status === 'active' ? `${subscriptionStatus.plan?.toUpperCase()} Plan` :
                 subscriptionStatus?.status === 'trialing' ? 'Trial Active' :
                 'Free Account'}
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Welcome, {userProfile?.displayName || user?.displayName || 'User'}!
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
        {/* Subscription Status Card */}
        {subscriptionStatus && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Subscription Status</h3>
                <p className="text-sm text-gray-600 mt-1">
                  {subscriptionStatus.status === 'active' ? 
                    `${subscriptionStatus.plan?.toUpperCase()} plan - Next billing: ${formatDate(subscriptionStatus.currentPeriodEnd)}` :
                   subscriptionStatus.status === 'trialing' ?
                    `Trial period - Ends: ${formatDate(subscriptionStatus.currentPeriodEnd)}` :
                    'No active subscription'}
                </p>
              </div>
              <div className="flex space-x-3">
                {subscriptionStatus.status === 'none' && (
                  <>
                    <button
                      onClick={handleSubscribeToTrial}
                      className="px-4 py-2 bg-gold text-white rounded-lg hover:bg-gold-dark transition-colors"
                    >
                      Start $1 Trial
                    </button>
                    <button
                      onClick={handleSubscribeToPro}
                      className="px-4 py-2 bg-rose text-white rounded-lg hover:bg-rose-dark transition-colors"
                    >
                      Subscribe to Pro
                    </button>
                  </>
                )}
                {subscriptionStatus.status === 'trialing' && (
                  <button
                    onClick={handleSubscribeToPro}
                    className="px-4 py-2 bg-rose text-white rounded-lg hover:bg-rose-dark transition-colors"
                  >
                    Upgrade to Pro
                  </button>
                )}
                {(subscriptionStatus.status === 'active' || subscriptionStatus.status === 'trialing') && subscriptionStatus.customerId && (
                  <button
                    onClick={handleManageBilling}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Manage Billing
                  </button>
                )}
              </div>
            </div>

            {/* Usage Stats */}
            {currentUsage && usageLimits && (
              <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-rose">
                    {currentUsage.uploads || 0}
                    {usageLimits.uploadsPerMonth > 0 && `/${usageLimits.uploadsPerMonth}`}
                  </div>
                  <div className="text-sm text-gray-600">Uploads This Month</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-rose">
                    {currentUsage.backgroundRemovals || 0}
                    {usageLimits.backgroundRemovals > 0 && `/${usageLimits.backgroundRemovals}`}
                  </div>
                  <div className="text-sm text-gray-600">Background Removals</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-rose">
                    {currentUsage.aiAnalysis || 0}
                    {usageLimits.aiAnalysis > 0 && `/${usageLimits.aiAnalysis}`}
                  </div>
                  <div className="text-sm text-gray-600">AI Analyses</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-rose">
                    {currentUsage.apiCalls || 0}
                    {usageLimits.apiCallsPerDay > 0 && `/${usageLimits.apiCallsPerDay}`}
                  </div>
                  <div className="text-sm text-gray-600">API Calls Today</div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Quick Actions */}
        <div className="mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold text-dark mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => setShowUpload(true)}
                className="p-6 border-2 border-dashed border-rose-light rounded-lg hover:border-rose hover:bg-rose-light transition-all duration-200 text-center group"
              >
                <div className="text-rose mb-2 group-hover:text-rose-dark">
                  <svg className="mx-auto h-8 w-8" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="font-medium text-gray-900">Upload Photos</h3>
                <p className="text-sm text-gray-600 mt-1">Start creating listings with AI</p>
              </button>

              <div className="p-6 border border-gray-200 rounded-lg text-center bg-gray-50">
                <div className="text-gray-400 mb-2">
                  <svg className="mx-auto h-8 w-8" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="font-medium text-gray-500">Analytics</h3>
                <p className="text-sm text-gray-400 mt-1">Coming soon</p>
              </div>

              <div className="p-6 border border-gray-200 rounded-lg text-center bg-gray-50">
                <div className="text-gray-400 mb-2">
                  <svg className="mx-auto h-8 w-8" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="font-medium text-gray-500">Scheduler</h3>
                <p className="text-sm text-gray-400 mt-1">Coming soon</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Uploads */}
        {recentUploads.length > 0 && (
          <div className="mb-8">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-dark mb-4">Recent Uploads</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {recentUploads.slice(0, 6).map((upload) => (
                  <div key={upload.id} className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="aspect-video relative">
                      <img
                        src={upload.downloadURL}
                        alt={upload.originalName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-3">
                      <h5 className="font-medium text-gray-900 text-sm truncate">
                        {upload.aiListing?.title || upload.originalName}
                      </h5>
                      {upload.aiListing && (
                        <p className="text-xs text-gray-600">
                          ${upload.aiListing.priceRange.min} - ${upload.aiListing.priceRange.max}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Upload Modal */}
        {showUpload && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                <h2 className="text-xl font-bold text-dark">Upload Photos</h2>
                <button
                  onClick={() => setShowUpload(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
              <div className="p-0">
                <EnhancedPhotoUpload 
                  user={user} 
                  onUploadComplete={handleUploadComplete}
                  maxFiles={5}
                />
              </div>
            </div>
          </div>
        )}

        {/* Welcome Card */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-bold text-dark mb-6">Welcome to Photo2Profit!</h2>
          
          <div className="text-center py-12">
            <div className="text-rose mb-4">
              <svg className="mx-auto h-16 w-16" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">Ready to Start Selling?</h3>
            <p className="text-gray-600 mb-6">
              Upload your photos and let AI create professional listings in seconds.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto mb-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-rose-light rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-rose font-bold">1</span>
                </div>
                <h4 className="font-medium text-gray-900 mb-1">Upload Photos</h4>
                <p className="text-sm text-gray-600">Drag & drop your product photos</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-gold-soft rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-gold font-bold">2</span>
                </div>
                <h4 className="font-medium text-gray-900 mb-1">AI Processing</h4>
                <p className="text-sm text-gray-600">AI analyzes and creates listings</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-green-600 font-bold">3</span>
                </div>
                <h4 className="font-medium text-gray-900 mb-1">Cross-Post</h4>
                <p className="text-sm text-gray-600">Export to multiple platforms</p>
              </div>
            </div>

            <button
              onClick={() => setShowUpload(true)}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-rose to-gold text-white rounded-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              🚀 Start Uploading Photos
            </button>

            <div className="mt-8 bg-gold-soft p-4 rounded-lg text-center">
              <p className="text-sm text-gray-700">
                💡 <strong>Demo Mode:</strong> This is a fully functional demo. To enable real AI processing and marketplace integration, configure your API keys in the environment variables.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}