/* eslint-env browser */
import React, { useState } from 'react';
import { createCheckout } from '../lib/stripe';
import { usePageTracking, useAnalytics, useErrorTracking } from '../hooks/useAnalytics.js';

export default function UploadDemo() {
  const [preview, setPreview] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);
  const [message, setMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const { trackInteraction, trackFileUpload } = useAnalytics();
  const { captureError } = useErrorTracking();

  // Track page view
  usePageTracking('upload_demo');

  async function handleFile(e) {
    const f = e.target.files[0];
    if (!f) return;

    // Track file upload
    trackFileUpload(f.type, f.size);
    setMessage('Generating preview...');

    // Simple client-side preview: createObjectURL + attempt simple canvas resize to webp
    const url = URL.createObjectURL(f);
    setPreview(url);

    try {
      const img = new Image();
      img.src = url;
      await img.decode();
      const maxW = 1200;
      const scale = Math.min(1, maxW / img.width);
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const webpDataUrl = canvas.toDataURL('image/webp', 0.8);
      setPreview(webpDataUrl);
      setMessage('Preview ready - Processing background removal...');

      // Automatically remove background
      window.setTimeout(() => handleRemoveBackground(), 500);
    } catch (err) {
      console.warn('Preview optimization failed', err);
      captureError(err, { context: 'file_preview_optimization' });
      setMessage('Preview ready (original) - Processing background removal...');

      // Still try to remove background even if optimization failed
      window.setTimeout(() => handleRemoveBackground(), 500);
    }
  }

  async function handleRemoveBackground() {
    if (!preview) return;

    setIsProcessing(true);
    setMessage('Removing background...');

    try {
      // Convert data URL to blob if needed
      let blob;
      if (preview.startsWith('data:')) {
        const response = await fetch(preview);
        blob = await response.blob();
      } else {
        const response = await fetch(preview);
        blob = await response.blob();
      }

      // Create file from blob
      const file = new window.File([blob], 'image.jpg', { type: blob.type });

      // Use Remove.bg API directly for more reliable results
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('/api/images/remove-background', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Background removal failed');
      }

      const resultBlob = await response.blob();
      const processedUrl = URL.createObjectURL(resultBlob);

      setProcessedImage(processedUrl);
      setMessage('Background removed successfully!');
      trackInteraction('background_removal', 'success');
    } catch (error) {
      console.error('Background removal failed:', error);
      captureError(error, { context: 'background_removal' });
      setMessage(`Background removal failed: ${error.message}`);
      trackInteraction('background_removal', 'error');
    } finally {
      setIsProcessing(false);
    }
  }

  function handleShare() {
    trackInteraction('share_button', 'click');
    setMessage('Shareable link: (demo) paste image into your app or upload to a server.');
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-diamond text-rose-dark mb-4">Photo2Profit Studio</h1>
        <h2 className="text-2xl font-semibold text-gold mb-4">Professional Background Removal</h2>
        <p className="text-lg text-gray-700 mb-6">
          Transform your photos instantly with AI-powered background removal. Perfect for
          e-commerce, social media, and professional photography.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <label className="block">
          <div className="border-2 border-dashed border-rose rounded-lg p-8 text-center hover:border-gold transition-colors cursor-pointer">
            <div className="text-4xl mb-4">📸</div>
            <h3 className="text-lg font-semibold text-rose-dark mb-2">Upload Your Photo</h3>
            <p className="text-gray-600 mb-4">Click here or drag and drop your image</p>
            <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
            <div className="bg-gradient-to-r from-rose to-gold text-white px-6 py-2 rounded-full font-semibold inline-block">
              Choose Photo
            </div>
          </div>
        </label>
      </div>

      {message && <div className="mb-4 text-sm text-gray-700">{message}</div>}

      {preview && (
        <div className="mb-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-lg p-4">
              <h3 className="text-lg font-semibold text-rose-dark mb-3 flex items-center">
                📸 Original Photo
              </h3>
              <img
                src={preview}
                alt="original"
                className="w-full rounded-lg border-2 border-gray-200"
              />
            </div>

            {processedImage ? (
              <div className="bg-white rounded-lg shadow-lg p-4">
                <h3 className="text-lg font-semibold text-gold mb-3 flex items-center">
                  ✨ Background Removed
                </h3>
                <div className="relative">
                  <img
                    src={processedImage}
                    alt="processed"
                    className="w-full rounded-lg"
                    style={{
                      background:
                        'repeating-conic-gradient(#808080 0% 25%, transparent 0% 50%) 50% / 20px 20px',
                    }}
                  />
                  <div className="absolute top-2 right-2 bg-rose text-white px-2 py-1 rounded-full text-xs font-bold">
                    Photo2Profit
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg shadow-lg p-4 flex items-center justify-center min-h-[300px]">
                <div className="text-center">
                  {isProcessing ? (
                    <div className="animate-spin w-12 h-12 border-4 border-rose border-t-transparent rounded-full mx-auto mb-4"></div>
                  ) : (
                    <div className="text-6xl mb-4">🎨</div>
                  )}
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">
                    {isProcessing ? 'Removing Background...' : 'Processing Will Appear Here'}
                  </h3>
                  <p className="text-gray-500">AI-powered background removal in progress</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {processedImage && (
        <div className="text-center mb-6">
          <div className="bg-gradient-to-r from-rose to-gold text-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold mb-2">🎉 Background Removed Successfully!</h3>
            <p className="mb-4">Your professional photo is ready for download or sharing</p>
            <div className="flex gap-3 justify-center flex-wrap">
              <button
                className="bg-white text-rose px-6 py-2 rounded-full font-semibold hover:bg-gray-100"
                onClick={handleShare}
              >
                📤 Share Photo
              </button>
              <a
                href={processedImage}
                download="photo2profit-background-removed.png"
                className="bg-gold text-white px-6 py-2 rounded-full font-semibold hover:bg-yellow-600"
              >
                💾 Download
              </a>
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-3 flex-wrap justify-center">
        <button
          className="cta bg-gradient-to-r from-rose to-gold text-white px-8 py-3 rounded-full font-bold text-lg hover:shadow-lg transform hover:scale-105 transition-all"
          onClick={async () => {
            try {
              setMessage('Redirecting to checkout...');
              const priceId = import.meta.env.VITE_STRIPE_PRICE_ID || 'price_XXXXXXXXXXXX';
              const successUrl = window.location.origin + '/';
              const cancelUrl = window.location.origin + '/';
              // Use client helper if available
              try {
                const json = await createCheckout({ priceId, successUrl, cancelUrl });
                if (json.url) {
                  window.location.href = json.url;
                } else {
                  setMessage(
                    'Could not start checkout. Deploy and set STRIPE_SECRET_KEY on the server.'
                  );
                }
              } catch (err) {
                // Fallback to direct fetch (in case helper not available)
                console.warn('createCheckout helper failed, falling back to fetch:', err);
                const res = await fetch('/api/create-checkout-session', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ priceId, successUrl, cancelUrl }),
                });
                const json = await res.json();
                if (res.ok && json.url) window.location.href = json.url;
                else setMessage('Checkout failed: ' + (json.error || 'unknown'));
              }
            } catch (err) {
              console.error(err);
              setMessage(
                'Checkout failed. Ensure your serverless function and STRIPE_SECRET_KEY are configured.'
              );
            }
          }}
        >
          🚀 Upgrade to Photo2Profit Pro
        </button>
      </div>
    </div>
  );
}
