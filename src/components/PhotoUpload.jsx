// Photo Upload Component with drag-and-drop functionality
import { useState, useRef } from 'react';
import { uploadService, validateImageFile, formatFileSize } from '../services/upload';

export default function PhotoUpload({ user, onUploadComplete, maxFiles = 5 }) {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [errors, setErrors] = useState([]);
  
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

      if (successfulUploads.length > 0 && onUploadComplete) {
        onUploadComplete(successfulUploads);
      }

    } catch (error) {
      setErrors([error.message]);
    } finally {
      setUploading(false);
      setUploadProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const removeFile = async (fileId, fileName) => {
    try {
      await uploadService.deletePhoto(fileId, user.uid, fileName);
      setUploadedFiles(prev => prev.filter(file => file.id !== fileId));
    } catch (error) {
      setErrors([error.message]);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      {/* Upload Area */}
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200
          ${dragActive ? 'border-rose bg-rose-light' : 'border-gray-300 hover:border-rose'}
          ${uploading ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => !uploading && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          disabled={uploading}
        />

        {uploading ? (
          <div className="space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose mx-auto"></div>
            <p className="text-lg font-medium text-dark">Uploading photos...</p>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-rose to-gold h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600">{Math.round(uploadProgress)}% complete</p>
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

      {/* Uploaded Files Preview */}
      {uploadedFiles.length > 0 && (
        <div className="mt-6">
          <h4 className="text-lg font-medium text-dark mb-4">Uploaded Photos</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {uploadedFiles.map((file) => (
              <div key={file.id} className="relative group">
                <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                  <img
                    src={file.downloadURL}
                    alt={file.originalName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 rounded-lg flex items-center justify-center">
                  <button
                    onClick={() => removeFile(file.id, file.fileName)}
                    className="opacity-0 group-hover:opacity-100 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-all duration-200"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
                <div className="mt-2 text-xs text-gray-600">
                  <p className="truncate">{file.originalName}</p>
                  <p>{formatFileSize(file.fileSize)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}