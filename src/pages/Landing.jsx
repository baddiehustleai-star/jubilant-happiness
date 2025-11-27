import logo from '../assets/photo2profit-logo.svg';
import { useState, Suspense, lazy } from 'react';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import AuthModal from '../components/AuthModal.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';
import { usePageTracking, useAnalytics } from '../hooks/useAnalytics.js';
import { useBranding } from '../contexts/BrandingContext.jsx';

// Lazy load UploadDemo for better performance
const UploadDemo = lazy(() => import('./UploadDemo.jsx'));

export default function Landing() {
  const [showDemo, setShowDemo] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user } = useAuth();
  const { trackInteraction } = useAnalytics();
  const branding = useBranding();

  // Track page view
  usePageTracking('landing');

  if (showDemo) {
    return (
      <Suspense fallback={<LoadingSpinner />}>
        <UploadDemo />
      </Suspense>
    );
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blush via-rose-light to-blush text-dark text-center px-6">
      {/* Sparkle effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="sparkle sparkle-1"></div>
        <div className="sparkle sparkle-2"></div>
        <div className="sparkle sparkle-3"></div>
      </div>

      <img
        src={branding?.logoUrl || logo}
        alt={`${branding?.companyName || 'Photo2Profit'} Logo`}
        className="w-64 mb-8 drop-shadow-2xl animate-float"
      />
      <h1
        className="text-6xl md:text-7xl font-diamond mb-4 tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-rose-dark via-rose to-gold"
        style={{ fontFamily: branding?.fontFamily }}
      >
        {branding?.companyName || 'PHOTO2PROFIT'}
      </h1>
      <p className="text-2xl md:text-3xl font-semibold mb-3 text-rose-dark">
        Your Photos. Your Empire. Your Profit. 💎
      </p>
      <p className="text-lg mb-10 max-w-2xl text-dark opacity-90 leading-relaxed">
        Stop hustling for pennies. Turn your camera roll into cold, hard cash with AI-powered
        automation.
        <br />
        <span className="text-rose-dark font-semibold">List. Sell. Profit. Repeat.</span>
      </p>

      <div className="flex flex-col sm:flex-row gap-6 mb-12">
        <button
          className="gem-button gem-button-primary group relative overflow-hidden"
          onClick={() => {
            trackInteraction('cta_button', 'click');
            if (user) {
              window.location.href = '/dashboard';
            } else {
              setShowAuthModal(true);
            }
          }}
        >
          <span className="relative z-10 flex items-center gap-2">
            ✨ {user ? '💎 Enter Your Empire' : '💰 Start Earning Now'}
          </span>
        </button>

        <button
          className="gem-button gem-button-secondary group relative overflow-hidden"
          onClick={() => {
            trackInteraction('demo_button', 'click');
            setShowDemo(true);
          }}
        >
          <span className="relative z-10 flex items-center gap-2">🎥 Watch the Magic</span>
        </button>
      </div>

      {/* Social Proof */}
      <div className="text-sm text-rose-dark opacity-75 mb-4">
        <span className="font-semibold">Join 10,000+ Boss Babes</span> turning photos into paychecks
        💅
      </div>

      {user && (
        <p className="text-sm text-muted-text">Welcome back, {user.displayName || user.email}!</p>
      )}

      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
    </main>
  );
}
