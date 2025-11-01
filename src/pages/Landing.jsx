import { useState } from 'react';
import logo from '../assets/photo2profit-logo.svg';
import PhotoUpload from '../components/PhotoUpload.jsx';
import Billing from '../components/Billing.jsx';

export default function Landing() {
  const [activeSection, setActiveSection] = useState('home');

  const handleUploadComplete = (results) => {
    console.log('Upload complete:', results);
    // You can add additional logic here, like saving to database
    window.alert(`Successfully uploaded ${results.length} photo(s)!`);
  };

  return (
    <div className="min-h-screen bg-blush">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center min-h-screen text-dark text-center px-6">
        <img src={logo} alt="Photo2Profit Logo" className="w-48 mb-6 drop-shadow-xl" />
        <h1 className="text-5xl font-diamond mb-2 tracking-wide">
          PHOTO<span className="text-rose-dark">2</span>PROFIT
        </h1>
        <p className="text-lg mb-8 max-w-md">
          Turn your photos into profit — AI-powered listings, background removal, and instant
          cross-posting 💎
        </p>
        <div className="flex gap-4">
          <button onClick={() => setActiveSection('upload')} className="cta">
            Upload Photos
          </button>
          <button onClick={() => setActiveSection('pricing')} className="cta">
            View Pricing
          </button>
        </div>
      </section>

      {/* Upload Section */}
      {activeSection === 'upload' && (
        <section className="py-16 px-6 bg-white">
          <div className="max-w-4xl mx-auto">
            <button
              onClick={() => setActiveSection('home')}
              className="mb-6 text-rose-dark hover:underline"
            >
              ← Back to Home
            </button>
            <PhotoUpload onUploadComplete={handleUploadComplete} />
          </div>
        </section>
      )}

      {/* Pricing Section */}
      {activeSection === 'pricing' && (
        <section className="py-16 px-6 bg-white">
          <div className="max-w-6xl mx-auto">
            <button
              onClick={() => setActiveSection('home')}
              className="mb-6 text-rose-dark hover:underline"
            >
              ← Back to Home
            </button>
            <Billing />
          </div>
        </section>
      )}
    </div>
  );
}
