/**
 * Branding Preview Component
 * Shows current branding configuration and allows testing
 */
import { useBranding } from '../lib/useBranding.js';
import { useState } from 'react';

export default function BrandingPreview() {
  const { branding, loading, error } = useBranding();
  const [showJson, setShowJson] = useState(false);

  if (loading) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-md">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-300 rounded w-1/4 mb-4"></div>
          <div className="h-3 bg-gray-300 rounded w-full mb-2"></div>
          <div className="h-3 bg-gray-300 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
        <h3 className="text-red-800 font-semibold">Branding Error</h3>
        <p className="text-red-600 text-sm">
          Failed to load branding configuration. Using defaults.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-brand-heading text-brand-dark mb-2">
          {branding?.companyName || 'Photo2Profit'}
        </h2>
        <p className="text-brand-dark opacity-75">
          {branding?.tagline || 'Transform Your Photos Into Profit'}
        </p>
      </div>

      {/* Color Palette Preview */}
      <div className="mb-6">
        <h3 className="font-semibold mb-3 text-brand-dark">Color Palette</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {branding?.colors &&
            Object.entries(branding.colors).map(([name, color]) => (
              <div key={name} className="text-center">
                <div
                  className="w-16 h-16 rounded-lg mx-auto mb-2 border-2 border-gray-200"
                  style={{ backgroundColor: color }}
                ></div>
                <div className="text-xs font-medium text-brand-dark">{name}</div>
                <div className="text-xs text-gray-500 font-mono">{color}</div>
              </div>
            ))}
        </div>
      </div>

      {/* Typography Preview */}
      <div className="mb-6">
        <h3 className="font-semibold mb-3 text-brand-dark">Typography</h3>
        <div className="space-y-4">
          <div>
            <div className="text-sm text-gray-500 mb-1">Heading Font</div>
            <div className="text-xl font-brand-heading text-brand-dark">
              The quick brown fox jumps over the lazy dog
            </div>
            <div className="text-xs text-gray-400 font-mono">{branding?.fonts?.heading}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500 mb-1">Body Font</div>
            <div className="font-brand-body text-brand-dark">
              The quick brown fox jumps over the lazy dog
            </div>
            <div className="text-xs text-gray-400 font-mono">{branding?.fonts?.body}</div>
          </div>
        </div>
      </div>

      {/* Features Preview */}
      {branding?.features && (
        <div className="mb-6">
          <h3 className="font-semibold mb-3 text-brand-dark">Features</h3>
          <div className="grid md:grid-cols-3 gap-4">
            {Object.entries(branding.features).map(([key, feature]) => (
              <div key={key} className="p-4 bg-brand-secondary rounded-lg">
                <h4 className="font-semibold text-brand-dark mb-2">{feature.name}</h4>
                <p className="text-sm text-brand-dark opacity-75">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Contact Information */}
      {branding?.contact && (
        <div className="mb-6">
          <h3 className="font-semibold mb-3 text-brand-dark">Contact & Social</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-500">Email</div>
              <div className="text-brand-dark">{branding.contact.email}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Website</div>
              <div className="text-brand-dark">{branding.contact.website}</div>
            </div>
          </div>
          {branding.contact.social && (
            <div className="mt-4">
              <div className="text-sm text-gray-500 mb-2">Social Media</div>
              <div className="flex flex-wrap gap-2">
                {Object.entries(branding.contact.social).map(([platform, handle]) => (
                  <span
                    key={platform}
                    className="px-2 py-1 bg-brand-accent text-white rounded text-xs"
                  >
                    {platform}: {handle}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* JSON Preview Toggle */}
      <div className="border-t pt-4">
        <button
          onClick={() => setShowJson(!showJson)}
          className="text-brand-primary hover:text-brand-accent font-medium text-sm"
        >
          {showJson ? 'Hide' : 'Show'} JSON Configuration
        </button>

        {showJson && (
          <pre className="mt-4 p-4 bg-gray-100 rounded-lg text-xs overflow-auto">
            {JSON.stringify(branding, null, 2)}
          </pre>
        )}
      </div>

      {/* Meta Information */}
      {branding?.meta && (
        <div className="mt-4 text-xs text-gray-500 border-t pt-4">
          <div>Version: {branding.meta.version}</div>
          <div>Updated: {new Date(branding.meta.lastUpdated).toLocaleString()}</div>
          <div>Environment: {branding.meta.environment}</div>
        </div>
      )}
    </div>
  );
}
