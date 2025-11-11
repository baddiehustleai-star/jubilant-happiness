import React, { useState, useEffect } from 'react';
import { FaDownload, FaTimes, FaMobile } from 'react-icons/fa';
import { HiSparkles } from 'react-icons/hi';

export default function PWAInstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Store the event so it can be triggered later
      setDeferredPrompt(e);
      // Show our custom install prompt
      setShowPrompt(true);
    };

    // Listen for successful app installation
    const handleAppInstalled = () => {
      console.log('Photo2Profit app was installed');
      setShowPrompt(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Check if app is already installed
    if (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) {
      setShowPrompt(false);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    } else {
      console.log('User dismissed the install prompt');
    }

    // Clear the deferredPrompt
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    // Don't show again for this session
    sessionStorage.setItem('pwa-prompt-dismissed', 'true');
  };

  // Don't show if user has dismissed this session
  if (sessionStorage.getItem('pwa-prompt-dismissed') === 'true') {
    return null;
  }

  if (!showPrompt || !deferredPrompt) {
    return null;
  }

  return (
    <div className={`pwa-install-prompt ${showPrompt ? 'show' : ''}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center flex-1">
          <div className="mr-3 p-2 bg-white bg-opacity-20 rounded-lg">
            <FaMobile className="text-white" size={20} />
          </div>
          <div className="flex-1">
            <div className="font-diamond text-white text-lg font-bold flex items-center">
              <HiSparkles className="mr-1" />
              Install Photo2Profit
            </div>
            <div className="text-white text-sm opacity-90">
              Get the full app experience on your phone
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2 ml-4">
          <button
            onClick={handleDismiss}
            className="p-2 text-white opacity-60 hover:opacity-100 transition-opacity"
          >
            <FaTimes size={16} />
          </button>

          <button
            onClick={handleInstallClick}
            className="mobile-btn haptic-medium bg-white text-rosegold px-4 py-2 rounded-lg font-semibold flex items-center"
          >
            <FaDownload className="mr-2" size={14} />
            Install
          </button>
        </div>
      </div>
    </div>
  );
}
