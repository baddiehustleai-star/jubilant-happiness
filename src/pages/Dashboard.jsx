import { useState } from 'react';
import logo from '../assets/photo2profit-logo.svg';

export default function Dashboard() {
  const [items, setItems] = useState([]);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (files) => {
    const newItems = Array.from(files).map((file, index) => ({
      id: Date.now() + index,
      name: file.name,
      file: file,
      preview: URL.createObjectURL(file),
      status: 'pending',
    }));
    setItems([...items, ...newItems]);
  };

  const removeItem = (id) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const exportToCSV = () => {
    // Placeholder for CSV export functionality
    alert('Export functionality will generate CSV files for cross-posting to platforms');
  };

  return (
    <div className="min-h-screen bg-blush">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-rose-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Photo2Profit Logo" className="w-10 h-10" />
            <h1 className="text-2xl font-diamond text-rose-dark">
              PHOTO<span className="text-rose">2</span>PROFIT
            </h1>
          </div>
          <nav className="flex gap-4">
            <button className="text-dark hover:text-rose-dark transition-colors">Dashboard</button>
            <button className="text-dark hover:text-rose-dark transition-colors">Settings</button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-diamond text-rose-dark mb-2">Welcome to Your Dashboard</h2>
          <p className="text-dark">
            Upload photos to create AI-powered listings and cross-post to multiple platforms 💎
          </p>
        </div>

        {/* Upload Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h3 className="text-xl font-semibold text-dark mb-4">Upload Photos</h3>
          <form
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className="relative"
          >
            <input
              type="file"
              id="file-upload"
              multiple
              accept="image/*"
              onChange={handleChange}
              className="hidden"
            />
            <label
              htmlFor="file-upload"
              className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer transition-all ${
                dragActive
                  ? 'border-rose-dark bg-rose-light/30'
                  : 'border-rose bg-rose-light/10 hover:bg-rose-light/20'
              }`}
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg
                  className="w-12 h-12 mb-4 text-rose-dark"
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
                <p className="mb-2 text-sm text-dark">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-dark/70">PNG, JPG, JPEG (MAX. 10MB per file)</p>
              </div>
            </label>
          </form>
        </div>

        {/* Items Grid */}
        {items.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-dark">Your Items ({items.length})</h3>
              <button
                onClick={exportToCSV}
                className="bg-gradient-to-r from-rose to-gold text-white px-6 py-2 rounded-full font-semibold hover:shadow-lg transition-all hover:scale-105"
              >
                Export for Cross-Posting
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="border border-rose-light rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="aspect-square bg-gray-100">
                    <img
                      src={item.preview}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <p className="text-sm text-dark font-medium truncate mb-2">{item.name}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs px-2 py-1 bg-rose-light text-rose-dark rounded-full">
                        {item.status}
                      </span>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-rose-dark hover:text-rose transition-colors text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Cross-Posting Info */}
        <div className="bg-gradient-to-r from-rose-light to-gold-soft rounded-lg p-6">
          <h3 className="text-xl font-semibold text-dark mb-3">Cross-Posting Platforms</h3>
          <p className="text-dark mb-4">
            Export your listings to multiple platforms with one click:
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              'eBay',
              'Poshmark',
              'Mercari',
              'Depop',
              'Facebook Shop',
              'Marketplace',
              'Instagram',
              'Pinterest',
            ].map((platform) => (
              <div
                key={platform}
                className="bg-white rounded-lg px-4 py-2 text-center text-sm font-medium text-dark"
              >
                {platform}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
