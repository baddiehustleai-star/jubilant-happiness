import { useState, useEffect } from 'react';
import { uploadPhoto, uploadMultiplePhotos } from '../utils/storage.js';

export default function PhotoUpload({ userId = 'anonymous', onUploadComplete = null }) {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [uploadResults, setUploadResults] = useState([]);

  // Cleanup preview URLs on unmount
  useEffect(() => {
    return () => {
      previews.forEach((url) => window.URL.revokeObjectURL(url));
    };
  }, [previews]);

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);

    // Validate file types before creating previews
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    const invalidFiles = files.filter((file) => !validTypes.includes(file.type));

    if (invalidFiles.length > 0) {
      setError('Please select only JPEG, PNG, GIF, or WebP images.');
      return;
    }

    // Revoke old preview URLs to free memory
    previews.forEach((url) => window.URL.revokeObjectURL(url));

    setSelectedFiles(files);
    setError(null);
    setUploadResults([]);

    // Create preview URLs (safe: blob URLs are created by the browser)
    const previewUrls = files.map((file) => window.URL.createObjectURL(file));
    setPreviews(previewUrls);
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      setError('Please select at least one file');
      return;
    }

    setUploading(true);
    setError(null);
    setProgress(0);

    try {
      const results =
        selectedFiles.length === 1
          ? [await uploadPhoto(selectedFiles[0], userId, setProgress)]
          : await uploadMultiplePhotos(selectedFiles, userId, setProgress);

      setUploadResults(results);
      setProgress(100);

      if (onUploadComplete) {
        onUploadComplete(results);
      }
    } catch (err) {
      setError(err.message);
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
    }
  };

  const handleClear = () => {
    // Revoke preview URLs to free memory
    previews.forEach((url) => window.URL.revokeObjectURL(url));

    setSelectedFiles([]);
    setPreviews([]);
    setProgress(0);
    setError(null);
    setUploadResults([]);
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-diamond mb-4 text-rose-dark">Upload Photos</h2>

      <div className="mb-4">
        <label
          htmlFor="file-input"
          className="block w-full p-8 border-2 border-dashed border-rose rounded-lg text-center cursor-pointer hover:border-rose-dark transition"
        >
          <input
            id="file-input"
            type="file"
            multiple
            accept="image/jpeg,image/png,image/gif,image/webp"
            onChange={handleFileSelect}
            className="hidden"
            disabled={uploading}
          />
          <p className="text-lg mb-2">
            {selectedFiles.length > 0
              ? `${selectedFiles.length} file(s) selected`
              : 'Click to select photos'}
          </p>
          <p className="text-sm text-gray-500">JPEG, PNG, GIF, or WebP (max 10MB each)</p>
        </label>
      </div>

      {previews.length > 0 && (
        <div className="mb-4 grid grid-cols-3 gap-2">
          {previews.map((preview, index) => (
            <img
              key={index}
              src={preview}
              alt={`Preview ${index + 1}`}
              className="w-full h-32 object-cover rounded border border-rose"
            />
          ))}
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {uploading && (
        <div className="mb-4">
          <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
            <div
              className="bg-rose-dark h-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm text-center mt-2">{Math.round(progress)}% uploaded</p>
        </div>
      )}

      {uploadResults.length > 0 && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          Successfully uploaded {uploadResults.length} file(s)!
        </div>
      )}

      <div className="flex gap-2">
        <button
          onClick={handleUpload}
          disabled={uploading || selectedFiles.length === 0}
          className="cta flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {uploading ? 'Uploading...' : 'Upload'}
        </button>
        <button
          onClick={handleClear}
          disabled={uploading}
          className="px-6 py-2 border-2 border-rose text-rose rounded-full hover:bg-rose hover:text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Clear
        </button>
      </div>
    </div>
  );
}
