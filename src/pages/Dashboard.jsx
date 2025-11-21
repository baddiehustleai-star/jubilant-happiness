import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { stripeService } from '../services/stripe';
// Future imports for direct service usage:
// import { removeBgService } from '../services/removebg';
// import { ebayService } from '../services/ebay';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Dashboard() {
  const { user, userProfile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [uploadHistory, setUploadHistory] = useState([]);
  const [usageStats, setUsageStats] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Load upload history and usage stats
      const [historyData, statsData] = await Promise.all([loadUploadHistory(), loadUsageStats()]);

      setUploadHistory(historyData);
      setUsageStats(statsData);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUploadHistory = async () => {
    // Mock data - replace with actual API call
    return [
      {
        id: '1',
        filename: 'product-image-1.jpg',
        processedAt: new Date('2024-01-15'),
        status: 'completed',
        backgroundRemoved: true,
        ebayListed: true,
        listingId: 'ebay-123456',
      },
      {
        id: '2',
        filename: 'product-image-2.jpg',
        processedAt: new Date('2024-01-14'),
        status: 'completed',
        backgroundRemoved: true,
        ebayListed: false,
        listingId: null,
      },
    ];
  };

  const loadUsageStats = async () => {
    const subscription = userProfile?.subscription || {};
    const usage = userProfile?.usage || {};

    const limits = stripeService.getUsageLimits(subscription.plan || 'free');

    return {
      plan: subscription.plan || 'free',
      status: subscription.status || 'active',
      imagesProcessed: usage.imagesProcessed || 0,
      backgroundsRemoved: usage.backgroundsRemoved || 0,
      listingsCreated: usage.listingsCreated || 0,
      limits,
    };
  };

  const handleUpgrade = async (planId) => {
    try {
      const { url } = await stripeService.createCheckoutSession(planId, user.uid);
      window.location.href = url;
    } catch (error) {
      console.error('Upgrade failed:', error);
      window.alert('Failed to start upgrade process. Please try again.');
    }
  };

  const handleManageBilling = async () => {
    try {
      const { url } = await stripeService.createPortalSession();
      window.location.href = url;
    } catch (error) {
      console.error('Failed to open billing portal:', error);
      window.alert('Failed to open billing management. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-blush">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-diamond text-dark">Dashboard</h1>
              <p className="text-muted-text mt-1">
                Welcome back, {user?.displayName || user?.email}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  usageStats?.plan === 'free'
                    ? 'bg-gray-100 text-gray-800'
                    : usageStats?.plan === 'pro'
                      ? 'bg-rose text-white'
                      : 'bg-gold text-dark'
                }`}
              >
                {usageStats?.plan?.toUpperCase()} Plan
              </span>
              <button onClick={handleManageBilling} className="btn-secondary text-sm">
                Manage Billing
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="border-b border-blush mb-8">
          <nav className="-mb-px flex space-x-8">
            {['overview', 'uploads', 'subscription'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-2 px-1 border-b-2 font-medium text-sm capitalize ${
                  activeTab === tab
                    ? 'border-rose text-rose'
                    : 'border-transparent text-muted-text hover:text-dark hover:border-blush'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <OverviewTab usageStats={usageStats} uploadHistory={uploadHistory} />
        )}

        {activeTab === 'uploads' && (
          <UploadsTab uploadHistory={uploadHistory} onRefresh={loadDashboardData} />
        )}

        {activeTab === 'subscription' && (
          <SubscriptionTab
            usageStats={usageStats}
            onUpgrade={handleUpgrade}
            onManageBilling={handleManageBilling}
          />
        )}
      </div>
    </div>
  );
}

function OverviewTab({ usageStats, uploadHistory }) {
  const recentUploads = uploadHistory.slice(0, 5);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Usage Stats */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white rounded-lg shadow-sm border border-blush p-6">
          <h3 className="text-lg font-semibold text-dark mb-4">Usage This Month</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <UsageCard
              title="Images Processed"
              current={usageStats?.imagesProcessed || 0}
              limit={usageStats?.limits?.imagesPerMonth}
              icon="📸"
            />
            <UsageCard
              title="Backgrounds Removed"
              current={usageStats?.backgroundsRemoved || 0}
              limit={usageStats?.limits?.backgroundRemovalPerMonth}
              icon="✂️"
            />
            <UsageCard
              title="eBay Listings"
              current={usageStats?.listingsCreated || 0}
              limit={usageStats?.limits?.ebayListingsPerMonth}
              icon="🏪"
            />
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm border border-blush p-6">
          <h3 className="text-lg font-semibold text-dark mb-4">Recent Activity</h3>
          {recentUploads.length > 0 ? (
            <div className="space-y-3">
              {recentUploads.map((upload) => (
                <div
                  key={upload.id}
                  className="flex items-center justify-between p-3 bg-cream rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="font-medium text-dark">{upload.filename}</span>
                  </div>
                  <span className="text-sm text-muted-text">
                    {upload.processedAt.toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-text">No recent uploads</p>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm border border-blush p-6">
          <h3 className="text-lg font-semibold text-dark mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full btn-primary">Upload New Image</button>
            <button className="w-full btn-secondary">View All Uploads</button>
            <button className="w-full btn-secondary">Create eBay Listing</button>
          </div>
        </div>

        {/* Plan Status */}
        <div className="bg-white rounded-lg shadow-sm border border-blush p-6">
          <h3 className="text-lg font-semibold text-dark mb-4">Current Plan</h3>
          <div className="text-center">
            <div
              className={`inline-flex px-4 py-2 rounded-full text-sm font-medium mb-4 ${
                usageStats?.plan === 'free'
                  ? 'bg-gray-100 text-gray-800'
                  : usageStats?.plan === 'pro'
                    ? 'bg-rose text-white'
                    : 'bg-gold text-dark'
              }`}
            >
              {usageStats?.plan?.toUpperCase()} Plan
            </div>
            {usageStats?.plan === 'free' && (
              <div>
                <p className="text-muted-text text-sm mb-4">Upgrade to unlock more features</p>
                <button className="w-full btn-primary">Upgrade Now</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function UploadsTab({ uploadHistory, onRefresh }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-blush">
      <div className="px-6 py-4 border-b border-blush flex justify-between items-center">
        <h3 className="text-lg font-semibold text-dark">Upload History</h3>
        <button onClick={onRefresh} className="btn-secondary text-sm">
          Refresh
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-blush">
          <thead className="bg-cream">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-text uppercase tracking-wider">
                Filename
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-text uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-text uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-text uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-blush">
            {uploadHistory.map((upload) => (
              <tr key={upload.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-dark">
                  {upload.filename}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-text">
                  {upload.processedAt.toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      upload.status === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : upload.status === 'processing'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {upload.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button className="text-rose hover:text-rose-dark">View</button>
                    {upload.ebayListed && (
                      <button className="text-rose hover:text-rose-dark">eBay Listing</button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SubscriptionTab({ usageStats, onUpgrade, onManageBilling }) {
  const plans = stripeService.SUBSCRIPTION_PLANS;
  const currentPlan = usageStats?.plan || 'free';

  return (
    <div className="space-y-8">
      {/* Current Subscription */}
      <div className="bg-white rounded-lg shadow-sm border border-blush p-6">
        <h3 className="text-lg font-semibold text-dark mb-4">Current Subscription</h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-lg font-medium text-dark">{plans[currentPlan].name} Plan</p>
            <p className="text-muted-text">
              {currentPlan === 'free' ? 'Free forever' : `$${plans[currentPlan].price}/month`}
            </p>
          </div>
          <div className="flex space-x-4">
            {currentPlan !== 'free' && (
              <button onClick={onManageBilling} className="btn-secondary">
                Manage Billing
              </button>
            )}
            {currentPlan !== 'business' && (
              <button
                onClick={() => onUpgrade(currentPlan === 'free' ? 'pro' : 'business')}
                className="btn-primary"
              >
                Upgrade
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Usage Breakdown */}
      <div className="bg-white rounded-lg shadow-sm border border-blush p-6">
        <h3 className="text-lg font-semibold text-dark mb-4">Usage Breakdown</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <UsageCard
            title="Images Processed"
            current={usageStats?.imagesProcessed || 0}
            limit={usageStats?.limits?.imagesPerMonth}
            icon="📸"
            showPercentage
          />
          <UsageCard
            title="Backgrounds Removed"
            current={usageStats?.backgroundsRemoved || 0}
            limit={usageStats?.limits?.backgroundRemovalPerMonth}
            icon="✂️"
            showPercentage
          />
          <UsageCard
            title="eBay Listings"
            current={usageStats?.listingsCreated || 0}
            limit={usageStats?.limits?.ebayListingsPerMonth}
            icon="🏪"
            showPercentage
          />
        </div>
      </div>

      {/* Available Plans */}
      <div className="bg-white rounded-lg shadow-sm border border-blush p-6">
        <h3 className="text-lg font-semibold text-dark mb-6">Available Plans</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.entries(plans).map(([planId, plan]) => (
            <div
              key={planId}
              className={`border-2 rounded-lg p-6 ${
                currentPlan === planId
                  ? 'border-rose bg-rose/5'
                  : 'border-blush hover:border-rose/50'
              }`}
            >
              <div className="text-center">
                <h4 className="text-lg font-semibold text-dark mb-2">{plan.name}</h4>
                <p className="text-2xl font-bold text-rose mb-4">
                  {planId === 'free' ? 'Free' : `$${plan.price}`}
                  {planId !== 'free' && <span className="text-sm text-muted-text">/month</span>}
                </p>
                <ul className="text-sm text-muted-text space-y-2 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <span className="text-green-500 mr-2">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
                {currentPlan === planId ? (
                  <button disabled className="w-full btn-secondary opacity-50 cursor-not-allowed">
                    Current Plan
                  </button>
                ) : (
                  <button onClick={() => onUpgrade(planId)} className="w-full btn-primary">
                    {planId === 'free' ? 'Downgrade' : 'Upgrade'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function UsageCard({ title, current, limit, icon, showPercentage = false }) {
  const percentage = limit ? Math.round((current / limit) * 100) : 0;
  const isUnlimited = limit === null || limit === undefined;

  return (
    <div className="bg-cream rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-muted-text">{title}</span>
        <span className="text-lg">{icon}</span>
      </div>
      <div className="text-2xl font-semibold text-dark mb-2">
        {current}
        {!isUnlimited && `/${limit}`}
      </div>
      {!isUnlimited && (
        <>
          <div className="w-full bg-blush rounded-full h-2 mb-2">
            <div
              className={`h-2 rounded-full ${
                percentage > 80 ? 'bg-red-400' : percentage > 60 ? 'bg-yellow-400' : 'bg-green-400'
              }`}
              style={{ width: `${Math.min(percentage, 100)}%` }}
            ></div>
          </div>
          {showPercentage && <div className="text-xs text-muted-text">{percentage}% used</div>}
        </>
      )}
    </div>
  );
}
