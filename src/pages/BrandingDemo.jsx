/**
 * Branding Demo Page
 * Showcases the dynamic branding system in action
 */
import { useState } from 'react';
import { useBranding } from '../lib/useBranding.js';
import BrandingPreview from '../components/BrandingPreview.jsx';

export default function BrandingDemo() {
  const { branding, loading, error } = useBranding();
  const [activeTab, setActiveTab] = useState('preview');

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-secondary flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-brand-primary mx-auto mb-4"></div>
          <h2 className="text-xl font-brand-heading text-brand-dark">Loading Branding...</h2>
          <p className="text-brand-dark opacity-75">Fetching dynamic configuration</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-secondary">
      {/* Header */}
      <header className="bg-brand-light shadow-lg border-b border-brand-primary/20">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-brand-heading text-brand-dark">
                {branding?.companyName || 'Photo2Profit'} Branding System
              </h1>
              <p className="text-brand-dark opacity-75">Dynamic branding configuration showcase</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-brand-dark opacity-75">API Status</div>
              <div
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  error ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                }`}
              >
                <div
                  className={`w-2 h-2 rounded-full mr-2 ${error ? 'bg-red-500' : 'bg-green-500'}`}
                ></div>
                {error ? 'Using Fallback' : 'Live API'}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-brand-light border-b border-brand-primary/20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex space-x-8">
            {[
              { id: 'preview', label: 'Branding Preview' },
              { id: 'colors', label: 'Color System' },
              { id: 'typography', label: 'Typography' },
              { id: 'api', label: 'API Response' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-brand-primary text-brand-primary'
                    : 'border-transparent text-brand-dark hover:text-brand-primary'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        {activeTab === 'preview' && <BrandingPreview />}

        {activeTab === 'colors' && (
          <div className="bg-brand-light rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-brand-heading text-brand-dark mb-6">Color System</h2>

            {/* Primary Palette */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4 text-brand-dark">Primary Palette</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {branding?.colors &&
                  Object.entries(branding.colors).map(([name, color]) => (
                    <div key={name} className="text-center">
                      <div
                        className="w-24 h-24 rounded-lg mx-auto mb-3 shadow-lg border-2 border-gray-200"
                        style={{ backgroundColor: color }}
                      ></div>
                      <div className="font-medium text-brand-dark capitalize">{name}</div>
                      <div className="text-xs text-gray-500 font-mono">{color}</div>
                      <div className="text-xs text-gray-400 mt-1">CSS: var(--color-{name})</div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Tailwind Classes */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-brand-dark">Tailwind Utilities</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-medium text-brand-dark">Background Classes</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-brand-primary rounded"></div>
                      <code className="text-sm">bg-brand-primary</code>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-brand-secondary rounded"></div>
                      <code className="text-sm">bg-brand-secondary</code>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-brand-accent rounded"></div>
                      <code className="text-sm">bg-brand-accent</code>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <h4 className="font-medium text-brand-dark">Text Classes</h4>
                  <div className="space-y-2">
                    <div className="text-brand-primary">text-brand-primary</div>
                    <div className="text-brand-dark">text-brand-dark</div>
                    <div className="text-brand-accent">text-brand-accent</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'typography' && (
          <div className="bg-brand-light rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-brand-heading text-brand-dark mb-6">Typography System</h2>

            {/* Font Showcase */}
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-semibold mb-4 text-brand-dark">Heading Font</h3>
                <div className="space-y-4">
                  <div className="text-4xl font-brand-heading text-brand-dark">
                    {branding?.companyName || 'Photo2Profit'}
                  </div>
                  <div className="text-2xl font-brand-heading text-brand-dark">
                    Transform Your Photos Into Profit
                  </div>
                  <div className="text-xl font-brand-heading text-brand-dark">
                    Professional Photo Editing & Automation
                  </div>
                  <div className="text-sm text-gray-500">
                    Font: {branding?.fonts?.heading || 'Playfair Display, serif'}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4 text-brand-dark">Body Font</h3>
                <div className="space-y-4">
                  <div className="text-lg font-brand-body text-brand-dark">
                    This is our primary body text used throughout the application.
                  </div>
                  <div className="font-brand-body text-brand-dark">
                    Perfect for descriptions, content, and user interface elements. Clean, readable,
                    and professional for all communication.
                  </div>
                  <div className="text-sm font-brand-body text-brand-dark opacity-75">
                    Also used for smaller text, captions, and secondary information.
                  </div>
                  <div className="text-sm text-gray-500">
                    Font: {branding?.fonts?.body || 'Inter, sans-serif'}
                  </div>
                </div>
              </div>
            </div>

            {/* CSS Implementation */}
            <div className="mt-8 p-4 bg-gray-100 rounded-lg">
              <h4 className="font-semibold mb-2 text-brand-dark">CSS Implementation</h4>
              <pre className="text-sm text-gray-700">
                {`/* CSS Custom Properties */
:root {
  --font-heading: ${branding?.fonts?.heading || 'Playfair Display, serif'};
  --font-body: ${branding?.fonts?.body || 'Inter, sans-serif'};
}

/* Tailwind Classes */
.font-brand-heading { font-family: var(--font-heading); }
.font-brand-body { font-family: var(--font-body); }`}
              </pre>
            </div>
          </div>
        )}

        {activeTab === 'api' && (
          <div className="bg-brand-light rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-brand-heading text-brand-dark mb-6">API Response</h2>

            <div className="mb-4 flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                <strong>Endpoint:</strong> <code>/api/branding</code>
              </div>
              <div className="text-sm text-gray-600">
                <strong>Method:</strong> <code>GET</code>
              </div>
              <div className="text-sm text-gray-600">
                <strong>Cache:</strong> 1 hour
              </div>
            </div>

            <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-auto max-h-96">
              {JSON.stringify(branding, null, 2)}
            </pre>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-brand-light border-t border-brand-primary/20 mt-12">
        <div className="max-w-6xl mx-auto px-6 py-6 text-center">
          <p className="text-brand-dark opacity-75">
            Dynamic branding powered by <code>/api/branding</code> • Real-time CSS theming • Built
            with React & Tailwind CSS
          </p>
        </div>
      </footer>
    </div>
  );
}
