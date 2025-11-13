/* eslint-env browser */
/* global setTimeout, URL */
import React, { useState } from 'react';

/**
 * Deep Link Validator
 * Validates URLs for cross-posting platforms (eBay, Poshmark, Mercari, etc.)
 * Inspired by Play Console's deep link validation tool
 */
export default function DeepLinkValidator() {
  const [url, setUrl] = useState('');
  const [validationResult, setValidationResult] = useState(null);
  const [isValidating, setIsValidating] = useState(false);

  const platforms = [
    { name: 'eBay', pattern: /^https?:\/\/(www\.)?ebay\.com\/.+/i, icon: '🛒' },
    { name: 'Poshmark', pattern: /^https?:\/\/(www\.)?poshmark\.com\/.+/i, icon: '👗' },
    { name: 'Mercari', pattern: /^https?:\/\/(www\.)?mercari\.com\/.+/i, icon: '🏷️' },
    { name: 'Depop', pattern: /^https?:\/\/(www\.)?depop\.com\/.+/i, icon: '👕' },
    { name: 'Facebook Marketplace', pattern: /^https?:\/\/(www\.)?facebook\.com\/marketplace\/.+/i, icon: '📱' },
    { name: 'Instagram', pattern: /^https?:\/\/(www\.)?instagram\.com\/.+/i, icon: '📸' },
  ];

  const validateUrl = async () => {
    if (!url.trim()) {
      setValidationResult({ success: false, message: 'Please enter a URL to validate' });
      return;
    }

    setIsValidating(true);
    setValidationResult(null);

    // Simulate validation delay
    await new Promise(resolve => setTimeout(resolve, 800));

    try {
      const urlObj = new URL(url);
      const matchedPlatform = platforms.find(p => p.pattern.test(url));

      if (matchedPlatform) {
        setValidationResult({
          success: true,
          platform: matchedPlatform.name,
          icon: matchedPlatform.icon,
          message: `Valid ${matchedPlatform.name} link detected!`,
          details: {
            protocol: urlObj.protocol,
            hostname: urlObj.hostname,
            pathname: urlObj.pathname,
            hasParams: urlObj.search !== '',
          },
        });
      } else {
        setValidationResult({
          success: true,
          platform: 'Generic',
          icon: '🔗',
          message: 'Valid URL, but not a recognized marketplace platform',
          details: {
            protocol: urlObj.protocol,
            hostname: urlObj.hostname,
            pathname: urlObj.pathname,
            hasParams: urlObj.search !== '',
          },
        });
      }
    } catch (error) {
      setValidationResult({
        success: false,
        message: 'Invalid URL format. Please enter a valid URL including http:// or https://',
        error: error.message,
      });
    } finally {
      setIsValidating(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      validateUrl();
    }
  };

  return (
    <div className="min-h-screen bg-blush p-6">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => window.location.reload()}
          className="mb-4 text-rose-dark hover:underline"
        >
          ← Back to Home
        </button>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-diamond mb-2 text-rose-dark">Deep Link Validator</h1>
          <p className="text-gray-600 mb-6">
            Instantly validate your marketplace URLs to ensure they work correctly across platforms
          </p>

          <div className="mb-6">
            <label htmlFor="url-input" className="block text-sm font-medium mb-2">
              Enter URL to validate:
            </label>
            <div className="flex gap-2">
              <input
                id="url-input"
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="https://www.ebay.com/itm/12345..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose focus:border-rose"
                disabled={isValidating}
              />
              <button
                onClick={validateUrl}
                disabled={isValidating}
                className="cta px-6 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isValidating ? 'Validating...' : 'Validate'}
              </button>
            </div>
          </div>

          {validationResult && (
            <div
              className={`p-6 rounded-lg ${
                validationResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
              }`}
            >
              <div className="flex items-start gap-3">
                {validationResult.icon && (
                  <span className="text-3xl">{validationResult.icon}</span>
                )}
                <div className="flex-1">
                  <h3
                    className={`text-lg font-semibold mb-2 ${
                      validationResult.success ? 'text-green-800' : 'text-red-800'
                    }`}
                  >
                    {validationResult.message}
                  </h3>

                  {validationResult.platform && (
                    <p className="text-sm text-gray-700 mb-3">
                      Platform: <strong>{validationResult.platform}</strong>
                    </p>
                  )}

                  {validationResult.details && (
                    <div className="bg-white rounded p-4 text-sm">
                      <h4 className="font-semibold mb-2">URL Details:</h4>
                      <ul className="space-y-1">
                        <li>
                          <span className="font-medium">Protocol:</span> {validationResult.details.protocol}
                        </li>
                        <li>
                          <span className="font-medium">Hostname:</span> {validationResult.details.hostname}
                        </li>
                        <li>
                          <span className="font-medium">Path:</span> {validationResult.details.pathname}
                        </li>
                        <li>
                          <span className="font-medium">Has Parameters:</span>{' '}
                          {validationResult.details.hasParams ? 'Yes' : 'No'}
                        </li>
                      </ul>
                    </div>
                  )}

                  {validationResult.error && (
                    <p className="text-sm text-red-700 mt-2">Error: {validationResult.error}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="mt-8 border-t pt-6">
            <h3 className="text-lg font-semibold mb-3">Supported Platforms:</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {platforms.map((platform) => (
                <div
                  key={platform.name}
                  className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg"
                >
                  <span className="text-2xl">{platform.icon}</span>
                  <span className="text-sm font-medium">{platform.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
