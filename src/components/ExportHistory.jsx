import { useState, useEffect } from 'react';
import { getUserExportHistory } from '../utils/exportService';

export default function ExportHistory({ userId }) {
  const [exports, setExports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadExportHistory();
  }, [userId]);

  const loadExportHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      const history = await getUserExportHistory(userId);
      setExports(history);
    } catch (err) {
      console.error('Error loading export history:', err);
      setError('Failed to load export history. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPlatformColor = (platform) => {
    const colors = {
      mercari: 'bg-red-100 text-red-800',
      depop: 'bg-purple-100 text-purple-800',
      poshmark: 'bg-pink-100 text-pink-800',
      ebay: 'bg-blue-100 text-blue-800',
    };
    return colors[platform?.toLowerCase()] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-dark"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
        <p className="font-semibold">Error</p>
        <p className="text-sm">{error}</p>
        <button 
          onClick={loadExportHistory}
          className="mt-2 text-sm underline hover:no-underline"
        >
          Retry
        </button>
      </div>
    );
  }

  if (exports.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📦</div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">No Exports Yet</h3>
        <p className="text-gray-500">Your export history will appear here once you generate your first CSV export.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-diamond text-rose-dark">Export History</h2>
        <button 
          onClick={loadExportHistory}
          className="text-sm text-rose-dark hover:text-rose transition-colors"
        >
          🔄 Refresh
        </button>
      </div>

      <div className="overflow-hidden bg-white rounded-lg shadow-sm border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-blush">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-rose-dark uppercase tracking-wider">
                Platform
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-rose-dark uppercase tracking-wider">
                Filename
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-rose-dark uppercase tracking-wider">
                Items
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-rose-dark uppercase tracking-wider">
                Created
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-rose-dark uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-rose-dark uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {exports.map((exportItem) => (
              <tr key={exportItem.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getPlatformColor(exportItem.platform)}`}>
                    {exportItem.platform}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {exportItem.filename}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {exportItem.itemCount}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(exportItem.createdAt)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {exportItem.status || 'completed'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <a
                    href={exportItem.downloadURL}
                    download={exportItem.filename}
                    className="inline-flex items-center px-3 py-1 bg-rose text-white rounded-md hover:bg-rose-dark transition-colors"
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="text-sm text-gray-500 text-center pt-4">
        Showing {exports.length} export{exports.length !== 1 ? 's' : ''}
      </div>
    </div>
  );
}
