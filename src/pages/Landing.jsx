/* eslint-env browser */
/* global localStorage */
import logo from '../assets/photo2profit-logo.svg';
import { useState } from 'react';
import UploadDemo from './UploadDemo.jsx';
import Dashboard from './Dashboard.jsx';

export default function Landing() {
  const [showDemo, setShowDemo] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);

  if (showDemo) return <UploadDemo />;
  if (showDashboard) return <Dashboard />;

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
        <button className="cta" onClick={() => setShowDemo(true)}>Start Now</button>
        <button className="cta bg-gray-600" onClick={() => {
          // Set a test user email for demo purposes
          localStorage.setItem('userEmail', 'paid@example.com');
          setShowDashboard(true);
        }}>View Dashboard (Paid User)</button>
      </div>
      <div className="mt-4">
        <button className="text-sm text-gray-600 underline" onClick={() => {
          // Set a free user email for demo purposes
          localStorage.setItem('userEmail', 'free@example.com');
          setShowDashboard(true);
        }}>View Dashboard (Free User)</button>
      </div>
    </main>
  );
}
