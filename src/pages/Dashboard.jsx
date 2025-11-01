import { useState } from 'react';
import logo from '../assets/photo2profit-logo.svg';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('upload');
  const listings = [
    { id: 1, title: 'Vintage Denim Jacket', status: 'Active', price: '$45.00' },
    { id: 2, title: 'Designer Handbag', status: 'Draft', price: '$120.00' },
    { id: 3, title: 'Leather Boots', status: 'Active', price: '$85.00' },
  ];

  return (
    <div className="min-h-screen bg-blush">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-rose-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img src={logo} alt="Photo2Profit Logo" className="w-10 h-10" />
            <h1 className="text-2xl font-diamond text-rose-dark">
              PHOTO<span className="text-rose">2</span>PROFIT
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <button className="text-dark hover:text-rose-dark transition">Settings</button>
            <button className="cta text-sm py-2 px-4">Upgrade</button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-rose-light">
            <p className="text-sm text-gray-600 mb-1">Total Listings</p>
            <p className="text-3xl font-bold text-rose-dark">24</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 border border-rose-light">
            <p className="text-sm text-gray-600 mb-1">Active Sales</p>
            <p className="text-3xl font-bold text-rose-dark">12</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 border border-rose-light">
            <p className="text-sm text-gray-600 mb-1">Revenue</p>
            <p className="text-3xl font-bold text-rose-dark">$1,240</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 border border-rose-light">
            <p className="text-sm text-gray-600 mb-1">Saved Time</p>
            <p className="text-3xl font-bold text-rose-dark">18hrs</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-sm border border-rose-light mb-6">
          <div className="border-b border-rose-light">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('upload')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition ${
                  activeTab === 'upload'
                    ? 'border-rose-dark text-rose-dark'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                📸 Upload Photos
              </button>
              <button
                onClick={() => setActiveTab('listings')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition ${
                  activeTab === 'listings'
                    ? 'border-rose-dark text-rose-dark'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                📋 My Listings
              </button>
              <button
                onClick={() => setActiveTab('crosspost')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition ${
                  activeTab === 'crosspost'
                    ? 'border-rose-dark text-rose-dark'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                🔄 Cross-Post
              </button>
              <button
                onClick={() => setActiveTab('analytics')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition ${
                  activeTab === 'analytics'
                    ? 'border-rose-dark text-rose-dark'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                📊 Analytics
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'upload' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-dark mb-4">Upload Your Photos</h2>
                <div className="border-2 border-dashed border-rose rounded-lg p-12 text-center bg-rose-light/20">
                  <div className="flex flex-col items-center">
                    <svg
                      className="w-16 h-16 text-rose-dark mb-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                    <p className="text-lg font-medium text-dark mb-2">
                      Drag & drop photos here, or click to select
                    </p>
                    <p className="text-sm text-gray-600 mb-4">
                      Upload up to 10 photos at once. JPG, PNG, or HEIC
                    </p>
                    <button className="cta">Select Photos</button>
                  </div>
                </div>
                <div className="bg-blush rounded-lg p-4">
                  <h3 className="font-semibold text-dark mb-2">✨ AI Magic Happens Next:</h3>
                  <ul className="text-sm text-gray-700 space-y-1 ml-4">
                    <li>• Background removal automatically applied</li>
                    <li>• AI-generated product titles & descriptions</li>
                    <li>• Smart pricing suggestions based on market trends</li>
                    <li>• Ready to cross-post to 8+ platforms instantly</li>
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 'listings' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-dark">My Listings</h2>
                  <button className="cta text-sm py-2 px-4">+ New Listing</button>
                </div>
                <div className="space-y-3">
                  {listings.map((listing) => (
                    <div
                      key={listing.id}
                      className="flex items-center justify-between p-4 bg-white border border-rose-light rounded-lg hover:shadow-md transition"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-rose-light rounded-lg flex items-center justify-center">
                          <span className="text-2xl">📦</span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-dark">{listing.title}</h3>
                          <p className="text-sm text-gray-600">{listing.price}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            listing.status === 'Active'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {listing.status}
                        </span>
                        <button className="text-rose-dark hover:text-rose font-medium text-sm">
                          Edit
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'crosspost' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-dark mb-4">Cross-Post Manager</h2>
                <p className="text-gray-600 mb-6">
                  Instantly share your listings across multiple resale platforms
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {['eBay', 'Poshmark', 'Mercari', 'Depop', 'Facebook Shop', 'Instagram', 'Pinterest', 'TikTok'].map(
                    (platform) => (
                      <div
                        key={platform}
                        className="bg-white border-2 border-rose-light rounded-lg p-4 text-center hover:border-rose-dark transition cursor-pointer"
                      >
                        <div className="w-12 h-12 bg-rose-light rounded-full mx-auto mb-2 flex items-center justify-center">
                          <span className="text-2xl">🛒</span>
                        </div>
                        <p className="font-medium text-dark text-sm">{platform}</p>
                        <p className="text-xs text-gray-500 mt-1">Connected</p>
                      </div>
                    )
                  )}
                </div>
                <div className="bg-gold-soft rounded-lg p-4 border border-gold">
                  <p className="text-sm text-dark">
                    <strong>💎 Pro Tip:</strong> Cross-posting increases visibility by 8x on average.
                    Export your listings weekly for maximum reach!
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'analytics' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-dark mb-4">Performance Analytics</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white border border-rose-light rounded-lg p-6">
                    <h3 className="font-semibold text-dark mb-4">Sales This Month</h3>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>eBay</span>
                          <span className="font-medium">$520</span>
                        </div>
                        <div className="w-full bg-rose-light rounded-full h-2">
                          <div className="bg-rose-dark h-2 rounded-full" style={{ width: '65%' }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Poshmark</span>
                          <span className="font-medium">$420</span>
                        </div>
                        <div className="w-full bg-rose-light rounded-full h-2">
                          <div className="bg-rose-dark h-2 rounded-full" style={{ width: '52%' }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Mercari</span>
                          <span className="font-medium">$300</span>
                        </div>
                        <div className="w-full bg-rose-light rounded-full h-2">
                          <div className="bg-rose-dark h-2 rounded-full" style={{ width: '38%' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white border border-rose-light rounded-lg p-6">
                    <h3 className="font-semibold text-dark mb-4">Top Categories</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Clothing</span>
                        <span className="font-medium">12 items</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Accessories</span>
                        <span className="font-medium">8 items</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Shoes</span>
                        <span className="font-medium">4 items</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
