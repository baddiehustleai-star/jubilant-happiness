import { useState } from 'react';
import ExportHistory from '../components/ExportHistory';
import { generateAndUploadExport } from '../utils/exportService';

export default function Dashboard() {
  // TODO: Replace with actual auth context when Firebase Auth is implemented
  // For now, using demo-user for demonstration purposes
  const [userId] = useState('demo-user');
  const [selectedPlatform, setSelectedPlatform] = useState('mercari');
  const [isGenerating, setIsGenerating] = useState(false);
  const [message, setMessage] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Sample listings for demo purposes
  const sampleListings = [
    {
      title: 'Vintage Leather Jacket',
      description: 'Classic vintage leather jacket in excellent condition. Size M.',
      price: '89.99',
      category: 'Jackets & Coats',
      brand: 'Vintage Brand',
      condition: 'Like New',
      size: 'M',
      color: 'Black',
      photos: ['https://example.com/photo1.jpg', 'https://example.com/photo2.jpg']
    },
    {
      title: 'Designer Handbag',
      description: 'Authentic designer handbag with dust bag included.',
      price: '299.99',
      category: 'Bags',
      brand: 'Designer Brand',
      condition: 'Excellent',
      color: 'Brown',
      photos: ['https://example.com/photo3.jpg']
    },
    {
      title: 'Sneakers - Limited Edition',
      description: 'Limited edition sneakers, never worn. Size 9.',
      price: '149.99',
      category: 'Shoes',
      brand: 'Premium Brand',
      condition: 'New',
      size: '9',
      color: 'White',
      photos: ['https://example.com/photo4.jpg', 'https://example.com/photo5.jpg']
    }
  ];

  const handleGenerateExport = async () => {
    try {
      setIsGenerating(true);
      setMessage(null);

      const result = await generateAndUploadExport(
        sampleListings,
        selectedPlatform,
        userId
      );

      setMessage({
        type: 'success',
        text: `Successfully generated ${result.platform} export with ${result.itemCount} items!`
      });

      // Refresh the export history
      setRefreshKey(prev => prev + 1);

    } catch (error) {
      console.error('Error generating export:', error);
      setMessage({
        type: 'error',
        text: 'Failed to generate export. Please try again.'
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const platforms = [
    { value: 'mercari', label: 'Mercari', icon: '🛍️' },
    { value: 'depop', label: 'Depop', icon: '👗' },
    { value: 'poshmark', label: 'Poshmark', icon: '👜' },
    { value: 'ebay', label: 'eBay', icon: '📦' }
  ];

  return (
    <div className="min-h-screen bg-blush">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-diamond text-rose-dark">
            PHOTO<span className="text-rose">2</span>PROFIT Dashboard 💎
          </h1>
          <p className="text-gray-600 mt-1">Manage your exports and cross-post to multiple platforms</p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Export Generator Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-2xl font-diamond text-rose-dark mb-4">Generate New Export</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Select Platform
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {platforms.map((platform) => (
                  <button
                    key={platform.value}
                    onClick={() => setSelectedPlatform(platform.value)}
                    className={`flex items-center justify-center px-4 py-3 rounded-lg border-2 transition-all ${
                      selectedPlatform === platform.value
                        ? 'border-rose bg-rose-light shadow-md'
                        : 'border-gray-200 hover:border-rose-light'
                    }`}
                  >
                    <span className="text-2xl mr-2">{platform.icon}</span>
                    <span className="font-semibold">{platform.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>Demo Mode:</strong> This will generate a CSV with {sampleListings.length} sample listings for <strong>{selectedPlatform}</strong>.
              </p>
            </div>

            <button
              onClick={handleGenerateExport}
              disabled={isGenerating}
              className={`cta w-full ${isGenerating ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isGenerating ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating Export...
                </span>
              ) : (
                '📤 Generate CSV Export'
              )}
            </button>

            {message && (
              <div className={`rounded-lg p-4 ${
                message.type === 'success'
                  ? 'bg-green-50 border border-green-200 text-green-800'
                  : 'bg-red-50 border border-red-200 text-red-800'
              }`}>
                <p className="text-sm font-medium">{message.text}</p>
              </div>
            )}
          </div>
        </div>

        {/* Export History Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <ExportHistory key={refreshKey} userId={userId} />
        </div>
      </div>
    </div>
  );
}
