// Enhanced Photo Upload Component with AI processing
import { useState, useRef } from 'react';
import { uploadService, validateImageFile, formatFileSize } from '../services/upload';
import { crossPostingService } from '../services/crossPosting';

export default function EnhancedPhotoUpload({ user, onUploadComplete, maxFiles = 5 }) {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [errors, setErrors] = useState([]);
  const [processingStatus, setProcessingStatus] = useState({});
  
  const fileInputRef = useRef();

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

    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    handleFiles(files);
  };

  const handleFiles = async (files) => {
    setErrors([]);
    
    // Validate file count
    if (files.length > maxFiles) {
      setErrors([`Maximum ${maxFiles} files allowed`]);
      return;
    }

    // Validate each file
    const validationErrors = [];
    const validFiles = [];

    files.forEach((file, index) => {
      const validation = validateImageFile(file);
      if (!validation.isValid) {
        validationErrors.push(`File ${index + 1}: ${validation.errors.join(', ')}`);
      } else {
        validFiles.push(file);
      }
    });

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    if (validFiles.length === 0) return;

    // Upload files
    setUploading(true);
    setUploadProgress(0);

    try {
      const results = await uploadService.uploadPhotos(
        validFiles,
        user.uid,
        (completed, total) => {
          setUploadProgress((completed / total) * 100);
        }
      );

      // Filter successful uploads
      const successfulUploads = results.filter(result => !result.error);
      const failedUploads = results.filter(result => result.error);

      setUploadedFiles(prev => [...prev, ...successfulUploads]);

      if (failedUploads.length > 0) {
        setErrors(failedUploads.map(fail => `${fail.file}: ${fail.error}`));
      }

      if (successfulUploads.length > 0) {
        // Start AI processing
        setProcessing(true);
        await processUploadsWithAI(successfulUploads);
        
        if (onUploadComplete) {
          onUploadComplete(successfulUploads);
        }
      }

    } catch (error) {
      setErrors([error.message]);
    } finally {
      setUploading(false);
      setProcessing(false);
      setUploadProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const processUploadsWithAI = async (uploads) => {
    for (const upload of uploads) {
      try {
        setProcessingStatus(prev => ({
          ...prev,
          [upload.id]: { status: 'processing', message: 'Analyzing image with AI...' }
        }));

        const result = await uploadService.processImage(upload.id, user.uid);
        
        setProcessingStatus(prev => ({
          ...prev,
          [upload.id]: { 
            status: 'completed', 
            message: 'AI processing complete!',
            result: result.aiListing
          }
        }));

        // Update the upload in state
        setUploadedFiles(prev => prev.map(file => 
          file.id === upload.id 
            ? { ...file, processed: true, aiListing: result.aiListing }
            : file
        ));

      } catch (error) {
        console.error(`Processing failed for ${upload.id}:`, error);
        setProcessingStatus(prev => ({
          ...prev,
          [upload.id]: { 
            status: 'error', 
            message: `Processing failed: ${error.message}` 
          }
        }));
      }
    }
  };

  const removeFile = async (fileId, fileName) => {
    try {
      await uploadService.deletePhoto(fileId, user.uid, fileName);
      setUploadedFiles(prev => prev.filter(file => file.id !== fileId));
      setProcessingStatus(prev => {
        const newStatus = { ...prev };
        delete newStatus[fileId];
        return newStatus;
      });
    } catch (error) {
      setErrors([error.message]);
    }
  };

  const createListing = async (fileId) => {
    const file = uploadedFiles.find(f => f.id === fileId);
    if (!file?.aiListing) return;

    try {
      const listingId = await uploadService.createListing(fileId, user.uid, {
        title: file.aiListing.title,
        description: file.aiListing.description,
        category: file.aiListing.category,
        condition: file.aiListing.condition,
        price: file.aiListing.priceRange.min,
        brand: file.aiListing.brand,
        images: [file.downloadURL],
        keywords: file.aiListing.keywords,
      });

      // Update file status
      setUploadedFiles(prev => prev.map(f => 
        f.id === fileId ? { ...f, listingCreated: true, listingId } : f
      ));

    } catch (error) {
      setErrors([`Failed to create listing: ${error.message}`]);
    }
  };

  const exportToPlatform = (platform) => {
    const processedFiles = uploadedFiles.filter(f => f.processed && f.aiListing);
    if (processedFiles.length === 0) {
      setErrors(['No processed listings to export']);
      return;
    }

    try {
      const listings = processedFiles.map(f => ({
        title: f.aiListing.title,
        description: f.aiListing.description,
        category: f.aiListing.category,
        condition: f.aiListing.condition,
        priceRange: f.aiListing.priceRange,
        brand: f.aiListing.brand,
        images: [f.downloadURL],
      }));

      crossPostingService.exportForPlatform(listings, platform);
    } catch (error) {
      setErrors([`Export failed: ${error.message}`]);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      {/* Upload Area */}
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200
          ${dragActive ? 'border-rose bg-rose-light' : 'border-gray-300 hover:border-rose'}
          ${uploading || processing ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => !uploading && !processing && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          disabled={uploading || processing}
        />

        {uploading || processing ? (
          <div className="space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose mx-auto"></div>
            <p className="text-lg font-medium text-dark">
              {uploading ? 'Uploading photos...' : 'Processing with AI...'}
            </p>
            {uploading && (
              <>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-rose to-gold h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600">{Math.round(uploadProgress)}% complete</p>
              </>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="mx-auto w-16 h-16 text-rose">
              <svg fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="text-lg font-medium text-dark">
                Drop photos here or click to browse
              </p>
              <p className="text-sm text-gray-600 mt-2">
                Upload up to {maxFiles} photos • JPEG, PNG, WebP • Max 10MB each
              </p>
              <p className="text-xs text-gold mt-1">
                ✨ AI will automatically generate listings, remove backgrounds, and suggest prices
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Error Messages */}
      {errors.length > 0 && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <h4 className="text-red-800 font-medium mb-2">Upload Errors:</h4>
          <ul className="text-red-700 text-sm space-y-1">
            {errors.map((error, index) => (
              <li key={index}>• {error}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Export Options */}
      {uploadedFiles.filter(f => f.processed).length > 0 && (
        <div className="mt-6 p-4 bg-gold-soft rounded-lg">
          <h4 className="font-medium text-dark mb-3">📤 Export Listings</h4>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => exportToPlatform('poshmark')}
              className="px-3 py-1 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
            >
              Poshmark CSV
            </button>
            <button
              onClick={() => exportToPlatform('mercari')}
              className="px-3 py-1 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
            >
              Mercari CSV
            </button>
            <button
              onClick={() => exportToPlatform('depop')}
              className="px-3 py-1 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
            >
              Depop CSV
            </button>
          </div>
        </div>
      )}

      {/* Uploaded Files Preview */}
      {uploadedFiles.length > 0 && (
        <div className="mt-6">
          <h4 className="text-lg font-medium text-dark mb-4">Uploaded Photos</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {uploadedFiles.map((file) => (
              <div key={file.id} className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="aspect-square relative">
                  <img
                    src={file.downloadURL}
                    alt={file.originalName}
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => removeFile(file.id, file.fileName)}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-all duration-200"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
                
                <div className="p-4">
                  <h5 className="font-medium text-gray-900 text-sm truncate">
                    {file.originalName}
                  </h5>
                  <p className="text-xs text-gray-500">{formatFileSize(file.fileSize)}</p>
                  
                  {/* Processing Status */}
                  {processingStatus[file.id] && (
                    <div className="mt-2 p-2 bg-gray-50 rounded text-xs">
                      <div className={`flex items-center ${
                        processingStatus[file.id].status === 'completed' ? 'text-green-600' :
                        processingStatus[file.id].status === 'error' ? 'text-red-600' :
                        'text-blue-600'
                      }`}>
                        {processingStatus[file.id].status === 'processing' && (
                          <div className="animate-spin rounded-full h-3 w-3 border-b border-current mr-2"></div>
                        )}
                        {processingStatus[file.id].status === 'completed' && '✅ '}
                        {processingStatus[file.id].status === 'error' && '❌ '}
                        {processingStatus[file.id].message}
                      </div>
                    </div>
                  )}

                  {/* AI Results */}
                  {file.aiListing && (
                    <div className="mt-3 text-xs">
                      <p className="font-medium text-gray-900 truncate">
                        {file.aiListing.title}
                      </p>
                      <p className="text-gray-600">
                        ${file.aiListing.priceRange.min} - ${file.aiListing.priceRange.max}
                      </p>
                      <div className="mt-2 flex gap-1">
                        <button
                          onClick={() => createListing(file.id)}
                          disabled={file.listingCreated}
                          className="px-2 py-1 bg-rose text-white rounded text-xs hover:bg-rose-dark disabled:opacity-50"
                        >
                          {file.listingCreated ? '✅ Listed' : 'Create Listing'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}