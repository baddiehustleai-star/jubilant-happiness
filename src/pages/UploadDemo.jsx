/* eslint-env browser */
/* global URL, Image, alert */
import React, { useState } from 'react';

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
          onClick={() => alert('Upgrade flow: connect Stripe checkout (see README)')}
        >
          Upgrade
        </button>
      </div>
    </div>
  );
}
