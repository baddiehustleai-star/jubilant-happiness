// User Dashboard - Main hub for Photo2Profit users
import { useState, useEffect } from 'react';
import { authService } from '../services/auth';
import { paymentService, formatPrice, formatDate } from '../services/payment';

export default function Dashboard({ user }) {
  const [userProfile, setUserProfile] = useState(null);
  const [subscriptionStatus, setSubscriptionStatus] = useState(null);
  const [currentUsage, setCurrentUsage] = useState(null);
  const [usageLimits, setUsageLimits] = useState(null);
  const [loading, setLoading] = useState(true);

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

  const handleSubscribeToTrial = async () => {
    try {
      await paymentService.subscribeToTrial(user.uid, user.email);
    } catch (error) {
      console.error('Subscription error:', error);
      alert('Failed to start subscription. Please try again.');
    }
  };

  const handleSubscribeToPro = async () => {
    try {
      await paymentService.subscribeToPro(user.uid, user.email);
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

        {/* Main Dashboard Content */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-bold text-dark mb-6">Dashboard</h2>
          
          {subscriptionStatus?.status === 'none' ? (
            <div className="text-center py-12">
              <div className="text-rose mb-4">
                <svg className="mx-auto h-16 w-16" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">Welcome to Photo2Profit!</h3>
              <p className="text-gray-600 mb-6">
                Start your journey to profitable reselling with AI-powered listing generation.
              </p>
              <div className="bg-gold-soft p-6 rounded-lg text-center mb-6">
                <h4 className="font-medium text-dark mb-2">🚀 Ready to get started?</h4>
                <p className="text-sm text-gray-700 mb-4">
                  Try our $1 trial to upload photos and see the magic of AI-generated listings!
                </p>
                <button
                  onClick={handleSubscribeToTrial}
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-rose to-gold text-white rounded-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                >
                  Start $1 Trial →
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-rose mb-4">
                <svg className="mx-auto h-12 w-12" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Ready to Upload Photos!</h3>
              <p className="text-gray-600 mb-4">
                Your {subscriptionStatus.status === 'trialing' ? 'trial' : 'subscription'} is active. Start uploading photos to create listings.
              </p>
              <div className="bg-rose-light p-4 rounded-lg text-rose-dark">
                <p className="text-sm">
                  � <strong>Upload Component:</strong> The enhanced photo upload component will be integrated here for full functionality.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}