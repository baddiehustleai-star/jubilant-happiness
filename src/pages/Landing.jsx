import logo from '../assets/photo2profit-logo.svg';
import { useState } from 'react';
import UploadDemo from './UploadDemo.jsx';
import Dashboard from './Dashboard.jsx';
import DeepLinkValidator from './DeepLinkValidator.jsx';
import TranslationService from './TranslationService.jsx';

export default function Landing() {
  const [currentView, setCurrentView] = useState('home');

  if (currentView === 'demo') return <UploadDemo />;
  if (currentView === 'dashboard') return <Dashboard />;
  if (currentView === 'validator') return <DeepLinkValidator />;
  if (currentView === 'translate') return <TranslationService />;

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
      
      <div className="flex flex-col gap-3 mb-8">
        <button className="cta" onClick={() => setCurrentView('demo')}>
          Start Now
        </button>
        <button 
          className="cta bg-rose-dark" 
          onClick={() => setCurrentView('dashboard')}
        >
          📊 Your Dashboard
        </button>
      </div>

      {/* New Developer Tools Section */}
      <div className="mt-8 max-w-3xl">
        <h2 className="text-2xl font-diamond mb-4 text-rose-dark">New Developer Tools</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => setCurrentView('validator')}
            className="p-4 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow text-left"
          >
            <div className="text-3xl mb-2">🔗</div>
            <h3 className="font-semibold mb-1">Deep Link Validator</h3>
            <p className="text-xs text-gray-600">
              Instantly validate marketplace URLs
            </p>
          </button>
          
          <button
            onClick={() => setCurrentView('translate')}
            className="p-4 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow text-left"
          >
            <div className="text-3xl mb-2">🌍</div>
            <h3 className="font-semibold mb-1">Gemini Translation</h3>
            <p className="text-xs text-gray-600">
              Reach global markets with AI translations
            </p>
          </button>
          
          <button
            onClick={() => setCurrentView('dashboard')}
            className="p-4 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow text-left"
          >
            <div className="text-3xl mb-2">📈</div>
            <h3 className="font-semibold mb-1">AI Insights</h3>
            <p className="text-xs text-gray-600">
              Get automated performance summaries
            </p>
          </button>
        </div>
      </div>
    </main>
  );
}
