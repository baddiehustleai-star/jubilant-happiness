// src/components/EnhancedPhotoUpload.jsx
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

export default function EnhancedPhotoUpload({ user, onUploadComplete, maxFiles = 5 }) {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  // ✅ Handle file drop/selection
  const onDrop = useCallback(async (acceptedFiles) => {
    if (!user) {
      alert('Please sign in to upload photos');
      return;
    }

    if (acceptedFiles.length === 0) {
      alert('Please select valid image files');
      return;
    }

    setUploading(true);
    setProgress(0);

    try {
      const newUploads = [];

      for (let i = 0; i < acceptedFiles.length; i++) {
        const file = acceptedFiles[i];
        setProgress(((i + 1) / acceptedFiles.length) * 100);

        // Simulate upload process (in production, this would upload to Firebase Storage)
        await new Promise(resolve => setTimeout(resolve, 1000));

        const mockUpload = {
          id: Date.now() + i,
          file,
          originalName: file.name,
          downloadURL: URL.createObjectURL(file),
          uploadedAt: new Date(),
          aiListing: {
            title: `Beautiful ${file.name.replace(/\.[^/.]+$/, "")}`,
            priceRange: {
              min: Math.floor(Math.random() * 20) + 10,
              max: Math.floor(Math.random() * 50) + 30,
            }
          }
        };

        newUploads.push(mockUpload);
        setUploadedFiles(prev => [...prev, mockUpload]);
      }

      // Notify parent component
      onUploadComplete(newUploads);
      
      alert(`✅ Successfully uploaded ${acceptedFiles.length} photos!`);

    } catch (error) {
      console.error('❌ Upload failed:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setUploading(false);
      setProgress(0);
    }
  }, [user, onUploadComplete]);

  // ✅ Dropzone configuration
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp', '.heic']
    },
    maxFiles,
    maxSize: 25 * 1024 * 1024, // 25MB
    disabled: uploading
  });

  // ✅ Remove uploaded file
  const removeFile = (fileId) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
  };

  return (
    <div className="p-6">
      {/* ✅ Upload Area */}
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all
          ${isDragActive 
            ? 'border-rose-500 bg-rose-50' 
            : uploading 
            ? 'border-gray-300 bg-gray-50 cursor-not-allowed'
            : 'border-gray-300 hover:border-rose-400 hover:bg-rose-25'
          }
        `}
      >
        <input {...getInputProps()} />
        
        <div className="text-6xl mb-4">
          {uploading ? '⏳' : isDragActive ? '📥' : '📷'}
        </div>
        
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {uploading 
            ? 'Uploading Photos...' 
            : isDragActive 
            ? 'Drop photos here!' 
            : 'Upload Your Product Photos'
          }
        </h3>
        
        <p className="text-gray-600 mb-4">
          {uploading 
            ? `Processing ${Math.round(progress)}% complete` 
            : `Drag & drop up to ${maxFiles} photos, or click to select`
          }
        </p>

        {/* ✅ Progress Bar */}
        {uploading && (
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div 
              className="bg-gradient-to-r from-rose-500 to-amber-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        )}

        <div className="text-sm text-gray-500">
          Supports: JPEG, PNG, WebP, HEIC • Max 25MB per file
        </div>
      </div>

      {/* ✅ File Format Info */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
        <div className="bg-green-50 p-4 rounded-lg">
          <h4 className="font-medium text-green-800 mb-1">✅ Best Quality</h4>
          <p className="text-green-700">JPEG, PNG files for crisp listings</p>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-medium text-blue-800 mb-1">🚀 AI Processing</h4>
          <p className="text-blue-700">Auto-generate titles, descriptions & pricing</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <h4 className="font-medium text-purple-800 mb-1">📱 Multi-Platform</h4>
          <p className="text-purple-700">Export to Poshmark, Mercari, eBay & more</p>
        </div>
      </div>

      {/* ✅ Uploaded Files Preview */}
      {uploadedFiles.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Uploaded Photos ({uploadedFiles.length})
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {uploadedFiles.map((upload) => (
              <div key={upload.id} className="relative group">
                <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                  <img
                    src={upload.downloadURL}
                    alt={upload.originalName}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* ✅ File Info Overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all rounded-lg flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-all text-center text-white p-2">
                    <p className="text-sm font-medium truncate">
                      {upload.originalName}
                    </p>
                    {upload.aiListing && (
                      <p className="text-xs text-green-300 mt-1">
                        ${upload.aiListing.priceRange.min}-${upload.aiListing.priceRange.max}
                      </p>
                    )}
                  </div>
                </div>

                {/* ✅ Remove Button */}
                <button
                  onClick={() => removeFile(upload.id)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          {/* ✅ Action Buttons */}
          <div className="mt-6 flex flex-wrap gap-3">
            <button className="px-4 py-2 bg-gradient-to-r from-rose-500 to-amber-500 text-white rounded-lg hover:shadow-lg transition-all">
              🤖 Generate AI Listings
            </button>
            <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all">
              🎨 Remove Backgrounds
            </button>
            <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all">
              📤 Export to Platforms
            </button>
          </div>
        </div>
      )}

      {/* ✅ Demo Notice */}
      <div className="mt-6 bg-amber-50 border border-amber-200 rounded-lg p-4">
        <div className="flex items-start">
          <div className="text-amber-600 mr-3">💡</div>
          <div>
            <h4 className="text-amber-800 font-medium mb-1">Demo Mode Active</h4>
            <p className="text-amber-700 text-sm">
              This is a fully functional demo. Files are processed locally. 
              To enable cloud storage and AI processing, configure your Firebase and API keys.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}