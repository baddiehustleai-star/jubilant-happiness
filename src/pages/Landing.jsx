import logo from '../assets/photo2profit-logo.svg';
import { useState, Suspense, lazy } from 'react';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import AuthModal from '../components/AuthModal.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';
import { usePageTracking, useAnalytics } from '../hooks/useAnalytics.js';
import { useBranding } from '../lib/useBranding.js';

// Lazy load UploadDemo for better performance
const UploadDemo = lazy(() => import('./UploadDemo.jsx'));

export default function Landing() {
  const [showDemo, setShowDemo] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user } = useAuth();
  const { trackInteraction } = useAnalytics();
  const { branding, loading: brandingLoading } = useBranding();

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
    <main className="flex flex-col items-center justify-center min-h-screen bg-blush text-dark text-center px-6">
      <img
        src={logo}
        alt={`${branding?.companyName || 'Photo2Profit'} Logo`}
        className="w-48 mb-6 drop-shadow-xl"
      />
      <h1 className="text-5xl font-diamond mb-2 tracking-wide">
        {branding?.companyName || 'PHOTO2PROFIT'}
      </h1>
      <p className="text-lg mb-8 max-w-md">
        {branding?.tagline ||
          'Turn your photos into profit — AI-powered listings, background removal, and instant cross-posting'}{' '}
        💎
      </p>

      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <button
          className="cta"
          onClick={() => {
            trackInteraction('cta_button', 'click');
            if (user) {
              window.location.href = '/dashboard';
            } else {
              setShowAuthModal(true);
            }
          }}
        >
          {user ? 'Go to Dashboard' : 'Get Started'}
        </button>

        <button
          className="btn-secondary"
          onClick={() => {
            trackInteraction('demo_button', 'click');
            setShowDemo(true);
          }}
        >
          Try Demo
        </button>
      </div>

      {user && (
        <p className="text-sm text-muted-text">Welcome back, {user.displayName || user.email}!</p>
      )}

      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
    </main>
  );
}
