import { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/photo2profit-logo.svg';

export default function Dashboard() {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    const imageFiles = files.filter((file) => file.type.startsWith('image/'));

    if (imageFiles.length > 0) {
      setUploadedFiles((prev) => [...prev, ...imageFiles]);
    }
  };

  const handleFileInput = (e) => {
    const files = Array.from(e.target.files);
    setUploadedFiles((prev) => [...prev, ...files]);
  };

  const removeFile = (index) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-blush">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-rose-light">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Photo2Profit Logo" className="w-10 h-10" />
            <h1 className="text-2xl font-diamond text-rose-dark">
              PHOTO<span className="text-gold">2</span>PROFIT
            </h1>
          </div>
          <nav className="flex gap-4">
            <Link to="/" className="text-dark hover:text-rose-dark transition">
              Home
            </Link>
            <Link to="/dashboard" className="text-rose-dark font-semibold">
              Dashboard
            </Link>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-diamond text-dark mb-2">Welcome Back! 💎</h2>
          <p className="text-gray-600">Upload your photos and start creating profitable listings</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md border border-rose-light">
            <p className="text-sm text-gray-600 mb-1">Total Listings</p>
            <p className="text-3xl font-semibold text-rose-dark">{uploadedFiles.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md border border-rose-light">
            <p className="text-sm text-gray-600 mb-1">Active Posts</p>
            <p className="text-3xl font-semibold text-gold">0</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md border border-rose-light">
            <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
            <p className="text-3xl font-semibold text-rose">$0.00</p>
          </div>
        </div>

        {/* Upload Section */}
        <div className="bg-white p-8 rounded-lg shadow-md border border-rose-light mb-8">
          <h3 className="text-xl font-semibold text-dark mb-4">📸 Upload Photos</h3>

          <div
            className={`border-2 border-dashed rounded-lg p-12 text-center transition ${
              isDragging
                ? 'border-rose-dark bg-rose-light'
                : 'border-rose bg-blush hover:border-rose-dark'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="mb-4">
              <svg
                className="mx-auto h-12 w-12 text-rose"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <p className="text-lg text-dark mb-2">
              <label
                htmlFor="file-upload"
                className="cursor-pointer text-rose-dark hover:underline"
              >
                Click to upload
              </label>{' '}
              or drag and drop
            </p>
            <p className="text-sm text-gray-500">PNG, JPG, JPEG up to 10MB</p>
            <input
              id="file-upload"
              type="file"
              className="hidden"
              multiple
              accept="image/*"
              onChange={handleFileInput}
            />
          </div>

          {/* Uploaded Files List */}
          {uploadedFiles.length > 0 && (
            <div className="mt-6">
              <h4 className="text-lg font-semibold text-dark mb-3">
                Uploaded Photos ({uploadedFiles.length})
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {uploadedFiles.map((file, index) => (
                  <div key={index} className="relative group">
                    <div className="bg-blush border border-rose-light rounded-lg p-2 hover:shadow-lg transition">
                      <div className="aspect-square bg-rose-light rounded flex items-center justify-center mb-2">
                        <span className="text-4xl">📷</span>
                      </div>
                      <p className="text-xs text-gray-600 truncate">{file.name}</p>
                    </div>
                    <button
                      onClick={() => removeFile(index)}
                      className="absolute top-1 right-1 bg-rose-dark text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              <button className="cta mt-4">Generate Listings with AI ✨</button>
            </div>
          )}
        </div>

        {/* Subscription Card */}
        <div className="bg-gradient-to-br from-rose-light to-gold-soft p-8 rounded-lg shadow-md border border-rose">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-xl font-diamond text-dark mb-2">💎 Premium Plan</h3>
              <p className="text-gray-700 mb-4">
                Unlock unlimited listings, advanced AI features, and priority support
              </p>
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-3xl font-bold text-rose-dark">$9.99</span>
                <span className="text-gray-600">/month</span>
              </div>
              <button className="bg-white text-rose-dark px-6 py-2 rounded-full font-semibold hover:shadow-lg transition">
                Upgrade Now
              </button>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Current Plan</p>
              <p className="text-lg font-semibold text-dark">Free Trial</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
