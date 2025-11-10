import logo from '../assets/photo2profit-logo.svg';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import UploadDemo from './UploadDemo.jsx';

export default function Landing() {
  const [showDemo, setShowDemo] = useState(false);

  if (showDemo) return <UploadDemo />;

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-blush text-dark text-center px-6">
      <img src={logo} alt="Photo2Profit Logo" className="w-48 mb-6 drop-shadow-xl" />
      <h1 className="text-5xl font-diamond mb-2 tracking-wide">
        PHOTO<span className="text-rose-dark">2</span>PROFIT
      </h1>
      <p className="text-lg mb-8 max-w-md">
        Turn your photos into profit — AI-powered listings, background removal, and instant
        cross-posting 💎
      </p>
      <button className="cta" onClick={() => setShowDemo(true)}>Start Now</button>
      <div className="mt-4">
        <Link to="/analytics" className="text-rose-dark hover:underline">
          View Analytics →
        </Link>
      </div>
    </main>
  );
}
