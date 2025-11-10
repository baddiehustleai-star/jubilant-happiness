import logo from '../assets/photo2profit-logo.svg';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Landing() {
  const [showDemo, setShowDemo] = useState(false);
  const navigate = useNavigate();

  if (showDemo) {
    navigate('/upload');
    return null;
  }

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
      <div className="flex gap-4">
        <button className="cta" onClick={() => setShowDemo(true)}>
          Start Now
        </button>
        <button
          className="bg-white text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
          onClick={() => navigate('/dashboard')}
        >
          Dashboard
        </button>
      </div>
    </main>
  );
}
