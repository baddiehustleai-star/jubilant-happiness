/* eslint-env browser */
/* global URL, Image, fetch */
import React, { useState } from 'react';
import { createCheckout } from '../lib/stripe';

export default function UploadDemo() {
  const [preview, setPreview] = useState(null);
  const [message, setMessage] = useState('');

  async function handleFile(e) {
    const f = e.target.files[0];
    if (!f) return;
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
      setMessage('Preview ready (optimized)');
    } catch (err) {
      console.warn('Preview optimization failed', err);
      setMessage('Preview ready (original)');
    }
  }

  function handleShare() {
    setMessage('Shareable link: (demo) paste image into your app or upload to a server.');
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Upload Demo</h2>
      <p className="mb-4">
        Sign in to save your uploads. This demo shows a client-side optimized preview (WebP) so
        users can see a faster result instantly.
      </p>

      <label className="block mb-2">
        <input type="file" accept="image/*" onChange={handleFile} className="block" />
      </label>

      {message && <div className="mb-4 text-sm text-gray-700">{message}</div>}

      {preview && (
        <div className="mb-4">
          <img src={preview} alt="preview" className="rounded shadow max-w-full h-auto" />
        </div>
      )}

      <div className="flex gap-3">
        <button className="cta" onClick={handleShare}>
          Get share link
        </button>
        <button
          className="cta bg-gray-600"
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
                const apiUrl = import.meta.env.VITE_API_URL || '';
                const res = await fetch(`${apiUrl}/api/create-checkout-session`, {
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
          Upgrade
        </button>
      </div>
    </div>
  );
}
