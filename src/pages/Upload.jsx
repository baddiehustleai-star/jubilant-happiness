import { useState } from "react";
import { Link } from "react-router-dom";

export default function Upload() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

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
    
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  const handleProcessImage = () => {
    // Placeholder for processing logic
    console.log("Processing image:", selectedImage.name);
    alert("Image processing will be implemented with AI features!");
  };

  return (
    <div className="min-h-screen bg-blush p-6">
      {/* Header Navigation */}
      <div className="max-w-4xl mx-auto mb-6">
        <Link
          to="/workspace"
          className="inline-flex items-center text-rose-dark hover:text-rose transition-all"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to Workspace
        </Link>
      </div>

      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-diamond text-rose-dark mb-2 text-center">
          Upload Your Photo
        </h1>
        <p className="text-center text-dark mb-8">
          Transform your photos into professional listings 💎
        </p>

        {!previewUrl ? (
          <div
            className={`border-4 border-dashed rounded-2xl p-12 text-center transition-all ${
              isDragging
                ? "border-rose bg-rose-light"
                : "border-rose-dark bg-white"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="mb-6">
              <svg
                className="w-24 h-24 mx-auto text-rose"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <p className="text-xl mb-4 text-dark">
              Drag & drop your photo here
            </p>
            <p className="text-sm text-dark opacity-60 mb-6">or</p>
            <label className="cta cursor-pointer inline-block">
              Browse Files
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-6 shadow-xl">
            <div className="mb-6">
              <img
                src={previewUrl}
                alt="Preview"
                className="max-w-full h-auto rounded-lg mx-auto max-h-96 object-contain"
              />
            </div>
            <div className="text-center">
              <p className="text-dark mb-4">
                <strong>File:</strong> {selectedImage.name}
              </p>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={handleRemoveImage}
                  className="px-6 py-2 border-2 border-rose text-rose rounded-full hover:bg-rose hover:text-white transition-all"
                >
                  Remove
                </button>
                <button onClick={handleProcessImage} className="cta">
                  Process Image
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl text-center shadow-md">
            <div className="text-3xl mb-3">🎯</div>
            <h3 className="font-semibold text-rose-dark mb-2">
              AI-Powered Listings
            </h3>
            <p className="text-sm text-dark opacity-75">
              Generate compelling product descriptions automatically
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl text-center shadow-md">
            <div className="text-3xl mb-3">✨</div>
            <h3 className="font-semibold text-rose-dark mb-2">
              Background Removal
            </h3>
            <p className="text-sm text-dark opacity-75">
              Professional-looking photos with clean backgrounds
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl text-center shadow-md">
            <div className="text-3xl mb-3">🚀</div>
            <h3 className="font-semibold text-rose-dark mb-2">
              Cross-Post Instantly
            </h3>
            <p className="text-sm text-dark opacity-75">
              Share to multiple marketplaces with one click
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
