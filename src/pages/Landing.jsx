import { useState } from 'react';
import UploadDemo from './UploadDemo.jsx';

export default function Landing() {
  const [showDemo, setShowDemo] = useState(false);

  if (showDemo) return <UploadDemo />;

  return (
    <div className="landing">
      <main className="flex flex-col items-center justify-center min-h-screen bg-blush text-dark text-center px-6">
        <img src="/logo.svg" alt="Photo2Profit logo" className="logo w-48 mb-6 drop-shadow-xl" />
        <h1 className="text-5xl font-diamond mb-2 tracking-wide">Turn Photos Into Profit</h1>
        <p className="text-lg mb-8 max-w-md">
          AI-powered resale automation that helps you list smarter, faster, and everywhere.
        </p>
        <button className="cta-btn" onClick={() => setShowDemo(true)}>
          Start Now
        </button>
      </main>
    </div>
  );
}
