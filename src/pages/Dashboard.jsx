/* eslint-env browser */
/* global setTimeout, clearTimeout, alert */
import React, { useState, useEffect } from 'react';

/**
 * Dashboard / "You Tab" - Personalized user experience
 * Inspired by Play Console's "You tab" for re-engagement and personalized content
 */
export default function Dashboard() {
  const [userPoints, setUserPoints] = useState(150);
  const [insights, setInsights] = useState([]);
  const [isLoadingInsights, setIsLoadingInsights] = useState(true);

  useEffect(() => {
    // Simulate loading AI-powered insights
    const timer = setTimeout(() => {
      setInsights([
        {
          id: 1,
          type: 'trend',
          icon: '📈',
          title: 'Your listing performance is up 23% this week',
          description: 'Vintage denim items are getting 2x more views than other categories.',
        },
        {
          id: 2,
          type: 'recommendation',
          icon: '💡',
          title: 'Recommended: Add translations to reach global buyers',
          description: 'Listings with Spanish and French translations get 40% more engagement.',
        },
        {
          id: 3,
          type: 'event',
          icon: '🎯',
          title: 'Weekend boost opportunity',
          description: 'List new items Friday-Sunday for 50% higher visibility.',
        },
      ]);
      setIsLoadingInsights(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const recentActivity = [
    { id: 1, action: 'Listed', item: 'Vintage Levi\'s Jacket', points: 10, time: '2 hours ago' },
    { id: 2, action: 'Sold', item: 'Designer Handbag', points: 50, time: '1 day ago' },
    { id: 3, action: 'Shared', item: 'Sneaker Collection', points: 5, time: '2 days ago' },
  ];

  const rewards = [
    { id: 1, title: 'Free Background Removal', cost: 100, icon: '✂️' },
    { id: 2, title: 'Premium Listing Template', cost: 200, icon: '⭐' },
    { id: 3, title: 'AI Description Upgrade', cost: 150, icon: '🤖' },
    { id: 4, title: 'Priority Support', cost: 300, icon: '💎' },
  ];

  return (
    <div className="min-h-screen bg-blush p-6">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => window.location.reload()}
          className="mb-4 text-rose-dark hover:underline"
        >
          ← Back to Home
        </button>

        {/* Header */}
        <div className="bg-gradient-to-r from-rose to-rose-dark text-white rounded-lg shadow-lg p-8 mb-6">
          <h1 className="text-4xl font-diamond mb-2">Your Dashboard</h1>
          <p className="text-lg opacity-90">Welcome back! Here's what's happening with your listings</p>
          <div className="mt-4 flex items-center gap-2">
            <span className="text-3xl">💎</span>
            <span className="text-2xl font-semibold">{userPoints} Points</span>
          </div>
        </div>

        {/* AI-Powered Insights */}
        <div className="mb-6">
          <h2 className="text-2xl font-diamond mb-4 text-rose-dark">AI-Powered Insights</h2>
          {isLoadingInsights ? (
            <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
              <div className="animate-pulse">Generating insights with Gemini AI...</div>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {insights.map((insight) => (
                <div
                  key={insight.id}
                  className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-3xl">{insight.icon}</span>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">{insight.title}</h3>
                      <p className="text-sm text-gray-600">{insight.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Grid Layout for Recent Activity and Rewards */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-diamond mb-4 text-rose-dark">Recent Activity</h2>
            <div className="space-y-3">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex-1">
                    <div className="font-medium">{activity.action}: {activity.item}</div>
                    <div className="text-sm text-gray-500">{activity.time}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-rose-dark font-semibold">+{activity.points} pts</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Rewards Store */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-diamond mb-4 text-rose-dark">Rewards Store</h2>
            <p className="text-sm text-gray-600 mb-4">
              Use your points to unlock premium features and benefits
            </p>
            <div className="space-y-3">
              {rewards.map((reward) => (
                <div
                  key={reward.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{reward.icon}</span>
                    <span className="font-medium">{reward.title}</span>
                  </div>
                  <button
                    className={`px-4 py-1 rounded-full text-sm font-semibold ${
                      userPoints >= reward.cost
                        ? 'bg-rose text-white hover:bg-rose-dark'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                    disabled={userPoints < reward.cost}
                    onClick={() => {
                      if (userPoints >= reward.cost) {
                        setUserPoints(userPoints - reward.cost);
                        alert(`Redeemed: ${reward.title}!`);
                      }
                    }}
                  >
                    {reward.cost} pts
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-diamond mb-4 text-rose-dark">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="p-4 bg-blush rounded-lg hover:bg-rose hover:text-white transition-colors">
              <div className="text-2xl mb-2">📸</div>
              <div className="text-sm font-medium">New Listing</div>
            </button>
            <button className="p-4 bg-blush rounded-lg hover:bg-rose hover:text-white transition-colors">
              <div className="text-2xl mb-2">🌍</div>
              <div className="text-sm font-medium">Translate</div>
            </button>
            <button className="p-4 bg-blush rounded-lg hover:bg-rose hover:text-white transition-colors">
              <div className="text-2xl mb-2">📊</div>
              <div className="text-sm font-medium">Analytics</div>
            </button>
            <button className="p-4 bg-blush rounded-lg hover:bg-rose hover:text-white transition-colors">
              <div className="text-2xl mb-2">🔗</div>
              <div className="text-sm font-medium">Validate Links</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
