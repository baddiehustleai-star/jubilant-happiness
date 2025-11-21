import React, { useState, useEffect } from 'react';
import {
  FaImages,
  FaDownload,
  FaEye,
  FaTrash,
  FaGrid3X3,
  FaList,
  FaSearch,
  FaPlus,
} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { LoadingSpinner } from '../components/Layout/Loading';

const Gallery = () => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest'); // 'newest', 'oldest', 'name', 'size'
  const [filterBy, setFilterBy] = useState('all'); // 'all', 'optimized', 'original'

  useEffect(() => {
    loadPhotos();
  }, []);

  const loadPhotos = async () => {
    try {
      // Simulate loading photos from Firebase Storage
      window.setTimeout(() => {
        const mockPhotos = [
          {
            id: 1,
            name: 'vintage-watch-collection.jpg',
            originalSize: '3.2 MB',
            optimizedSize: '1.1 MB',
            savings: '66%',
            uploadDate: '2025-11-20',
            views: 45,
            downloads: 12,
            tags: ['vintage', 'watch', 'jewelry'],
            url: '/api/placeholder/400/300',
            thumbnailUrl: '/api/placeholder/200/150',
          },
          {
            id: 2,
            name: 'designer-handbag-luxury.jpg',
            originalSize: '2.8 MB',
            optimizedSize: '950 KB',
            savings: '66%',
            uploadDate: '2025-11-19',
            views: 32,
            downloads: 8,
            tags: ['fashion', 'handbag', 'luxury'],
            url: '/api/placeholder/400/300',
            thumbnailUrl: '/api/placeholder/200/150',
          },
          {
            id: 3,
            name: 'antique-furniture-set.jpg',
            originalSize: '4.1 MB',
            optimizedSize: '1.4 MB',
            savings: '66%',
            uploadDate: '2025-11-18',
            views: 28,
            downloads: 15,
            tags: ['antique', 'furniture', 'vintage'],
            url: '/api/placeholder/400/300',
            thumbnailUrl: '/api/placeholder/200/150',
          },
          {
            id: 4,
            name: 'electronics-bundle.jpg',
            originalSize: '2.5 MB',
            optimizedSize: '850 KB',
            savings: '66%',
            uploadDate: '2025-11-17',
            views: 67,
            downloads: 23,
            tags: ['electronics', 'tech', 'gadgets'],
            url: '/api/placeholder/400/300',
            thumbnailUrl: '/api/placeholder/200/150',
          },
          {
            id: 5,
            name: 'collectible-coins.jpg',
            originalSize: '1.9 MB',
            optimizedSize: '680 KB',
            savings: '64%',
            uploadDate: '2025-11-16',
            views: 21,
            downloads: 6,
            tags: ['collectible', 'coins', 'vintage'],
            url: '/api/placeholder/400/300',
            thumbnailUrl: '/api/placeholder/200/150',
          },
          {
            id: 6,
            name: 'sports-memorabilia.jpg',
            originalSize: '3.7 MB',
            optimizedSize: '1.3 MB',
            savings: '65%',
            uploadDate: '2025-11-15',
            views: 89,
            downloads: 31,
            tags: ['sports', 'memorabilia', 'collectible'],
            url: '/api/placeholder/400/300',
            thumbnailUrl: '/api/placeholder/200/150',
          },
        ];
        setPhotos(mockPhotos);
        setLoading(false);
      }, 800);
    } catch (error) {
      console.error('Error loading photos:', error);
      setLoading(false);
    }
  };

  const filteredAndSortedPhotos = photos
    .filter((photo) => {
      const matchesSearch =
        photo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        photo.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.uploadDate) - new Date(a.uploadDate);
        case 'oldest':
          return new Date(a.uploadDate) - new Date(b.uploadDate);
        case 'name':
          return a.name.localeCompare(b.name);
        case 'size':
          return parseFloat(b.originalSize) - parseFloat(a.originalSize);
        default:
          return 0;
      }
    });

  const handleDeletePhoto = async (photoId) => {
    if (window.confirm('Are you sure you want to delete this photo?')) {
      try {
        // Delete from Firebase Storage and Firestore
        setPhotos(photos.filter((photo) => photo.id !== photoId));
        // Show success message
      } catch (error) {
        console.error('Error deleting photo:', error);
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blush/20 via-white to-rose/10 flex items-center justify-center">
        <LoadingSpinner size="large" className="text-rose" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blush/20 via-white to-rose/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-diamond text-dark mb-2">Photo Gallery</h1>
              <p className="text-dark/60">Manage and organize your optimized photos</p>
            </div>

            <Link
              to="/upload"
              className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 bg-gradient-to-r from-rose to-gold text-white rounded-lg hover:shadow-lg transition-all"
            >
              <FaPlus className="mr-2" />
              Upload New Photos
            </Link>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-xl shadow-sm border border-rose/10 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark/40" />
              <input
                type="text"
                placeholder="Search photos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-rose/20 focus:border-rose transition-colors"
              />
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-rose/20 focus:border-rose transition-colors"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="name">Name A-Z</option>
              <option value="size">Size (Largest)</option>
            </select>

            {/* Filter */}
            <select
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-rose/20 focus:border-rose transition-colors"
            >
              <option value="all">All Photos</option>
              <option value="optimized">Optimized Only</option>
              <option value="original">Original Only</option>
            </select>

            {/* View Mode */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-rose text-white'
                    : 'bg-gray-100 text-dark/60 hover:bg-gray-200'
                }`}
              >
                <FaGrid3X3 />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'list'
                    ? 'bg-rose text-white'
                    : 'bg-gray-100 text-dark/60 hover:bg-gray-200'
                }`}
              >
                <FaList />
              </button>
            </div>
          </div>
        </div>

        {/* Photos Grid/List */}
        {filteredAndSortedPhotos.length > 0 ? (
          <>
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredAndSortedPhotos.map((photo) => (
                  <div
                    key={photo.id}
                    className="bg-white rounded-xl shadow-sm border border-rose/10 overflow-hidden hover:shadow-lg transition-shadow group"
                  >
                    {/* Photo Preview */}
                    <div className="relative aspect-video bg-gray-100">
                      <img
                        src={photo.thumbnailUrl}
                        alt={photo.name}
                        className="w-full h-full object-cover"
                      />

                      {/* Overlay Actions */}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                        <button className="p-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-colors">
                          <FaEye className="text-white" />
                        </button>
                        <button className="p-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-colors">
                          <FaDownload className="text-white" />
                        </button>
                        <button
                          onClick={() => handleDeletePhoto(photo.id)}
                          className="p-2 bg-red-500/80 backdrop-blur-sm rounded-lg hover:bg-red-500 transition-colors"
                        >
                          <FaTrash className="text-white" />
                        </button>
                      </div>

                      {/* Savings Badge */}
                      <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                        -{photo.savings}
                      </div>
                    </div>

                    {/* Photo Info */}
                    <div className="p-4">
                      <h3 className="font-medium text-dark truncate mb-2">{photo.name}</h3>

                      <div className="space-y-1 text-sm text-dark/60">
                        <div className="flex justify-between">
                          <span>Original:</span>
                          <span>{photo.originalSize}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Optimized:</span>
                          <span className="text-green-600">{photo.optimizedSize}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Uploaded:</span>
                          <span>{formatDate(photo.uploadDate)}</span>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                        <div className="flex items-center space-x-1 text-xs text-dark/60">
                          <FaEye />
                          <span>{photo.views}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-xs text-dark/60">
                          <FaDownload />
                          <span>{photo.downloads}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-rose/10 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="text-left p-4 font-medium text-dark">Photo</th>
                        <th className="text-left p-4 font-medium text-dark">Size</th>
                        <th className="text-left p-4 font-medium text-dark">Savings</th>
                        <th className="text-left p-4 font-medium text-dark">Stats</th>
                        <th className="text-left p-4 font-medium text-dark">Date</th>
                        <th className="text-right p-4 font-medium text-dark">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredAndSortedPhotos.map((photo) => (
                        <tr key={photo.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="p-4">
                            <div className="flex items-center space-x-3">
                              <img
                                src={photo.thumbnailUrl}
                                alt={photo.name}
                                className="w-12 h-12 object-cover rounded-lg"
                              />
                              <div>
                                <div className="font-medium text-dark">{photo.name}</div>
                                <div className="text-sm text-dark/60">
                                  {photo.tags.slice(0, 2).join(', ')}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="text-sm">
                              <div>
                                {photo.originalSize} → {photo.optimizedSize}
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              -{photo.savings}
                            </span>
                          </td>
                          <td className="p-4 text-sm text-dark/60">
                            {photo.views} views • {photo.downloads} downloads
                          </td>
                          <td className="p-4 text-sm text-dark/60">
                            {formatDate(photo.uploadDate)}
                          </td>
                          <td className="p-4">
                            <div className="flex items-center justify-end space-x-2">
                              <button className="p-1 text-dark/60 hover:text-rose transition-colors">
                                <FaEye />
                              </button>
                              <button className="p-1 text-dark/60 hover:text-gold transition-colors">
                                <FaDownload />
                              </button>
                              <button
                                onClick={() => handleDeletePhoto(photo.id)}
                                className="p-1 text-dark/60 hover:text-red-500 transition-colors"
                              >
                                <FaTrash />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-rose/10 p-12 text-center">
            <FaImages className="mx-auto text-6xl text-dark/20 mb-4" />
            <h3 className="text-xl font-semibold text-dark mb-2">No Photos Found</h3>
            <p className="text-dark/60 mb-6">
              {searchTerm
                ? 'Try adjusting your search terms'
                : 'Upload your first photos to get started'}
            </p>
            <Link
              to="/upload"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-rose to-gold text-white rounded-lg hover:shadow-lg transition-all"
            >
              <FaPlus className="mr-2" />
              Upload Photos
            </Link>
          </div>
        )}

        {/* Stats Summary */}
        {photos.length > 0 && (
          <div className="mt-8 bg-white rounded-xl shadow-sm border border-rose/10 p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-dark">{photos.length}</div>
                <div className="text-sm text-dark/60">Total Photos</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-rose">
                  {Math.round(
                    photos.reduce((acc, photo) => acc + parseInt(photo.savings), 0) / photos.length
                  )}
                  %
                </div>
                <div className="text-sm text-dark/60">Avg. Savings</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gold">
                  {photos.reduce((acc, photo) => acc + photo.views, 0)}
                </div>
                <div className="text-sm text-dark/60">Total Views</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {photos.reduce((acc, photo) => acc + photo.downloads, 0)}
                </div>
                <div className="text-sm text-dark/60">Total Downloads</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Gallery;
