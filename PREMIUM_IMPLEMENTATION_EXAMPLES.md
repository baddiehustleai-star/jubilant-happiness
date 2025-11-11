# Quick Start: Adding Premium Features to Your Dashboard

## 🎯 Use Case Examples

### Example 1: Premium Background Picker in Upload Form

```jsx
// In your src/pages/Dashboard.jsx or UploadForm.jsx

import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import PremiumBackgroundPicker from '../components/PremiumBackgroundPicker';
import { Link } from 'react-router-dom';

function PhotoUploadSection() {
  const { user } = useAuth();
  const [selectedBackground, setSelectedBackground] = useState(null);
  const [preview, setPreview] = useState(null);

  return (
    <div className="space-y-6">
      {/* Image Preview */}
      <div className="relative">
        <img 
          src={preview || selectedBackground || '/placeholder.jpg'} 
          alt="Preview"
          className="rounded-xl shadow-lg"
        />
      </div>

      {/* Premium Background Picker */}
      {user?.premium ? (
        <PremiumBackgroundPicker 
          onSelect={(url) => {
            setSelectedBackground(url);
            // Call your background replacement API here
            replaceBackground(preview, url);
          }}
          currentBackground={selectedBackground}
        />
      ) : (
        <div className="text-center p-6 bg-gray-50 rounded-xl border border-gray-200">
          <div className="text-5xl mb-3">🔒</div>
          <h3 className="text-xl font-semibold mb-2 text-gray-900">
            Premium Backgrounds
          </h3>
          <p className="text-gray-600 mb-4">
            Replace your photo backgrounds with professional studio backdrops
          </p>
          <Link 
            to="/upgrades" 
            className="inline-block px-6 py-3 bg-gradient-to-r from-rose-500 to-rose-600 text-white rounded-lg hover:from-rose-600 hover:to-rose-700 font-medium shadow-sm hover:shadow-md transition-all"
          >
            Upgrade to Premium
          </Link>
          <p className="text-xs text-gray-500 mt-3">
            Unlock 20+ professional backgrounds and AI pricing
          </p>
        </div>
      )}
    </div>
  );
}
```

---

### Example 2: AI Pricing in Product Editor

```jsx
// In your src/pages/ProductEditor.jsx

import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

function PricingSection({ product }) {
  const { user } = useAuth();
  const [pricing, setPricing] = useState({
    used: product.price_used || 0,
    marketplace: product.price_marketplace || 0,
    new: product.price_new || 0
  });
  const [loading, setLoading] = useState(false);

  const generateAIPricing = async () => {
    if (!user?.premium) {
      alert('Upgrade to Premium to use AI-powered pricing!');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/generate-pricing', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          title: product.title,
          description: product.description,
          category: product.category
        })
      });
      
      const data = await response.json();
      setPricing(data.pricing);
    } catch (err) {
      console.error('AI pricing failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Pricing</h3>
        
        {user?.premium ? (
          <button
            onClick={generateAIPricing}
            disabled={loading}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                Generating...
              </>
            ) : (
              <>
                <span>🤖</span>
                Generate AI Prices
              </>
            )}
          </button>
        ) : (
          <span className="text-sm text-gray-500">
            🔒 Premium feature
          </span>
        )}
      </div>

      {/* Price Inputs */}
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Used Condition
          </label>
          <div className="relative">
            <span className="absolute left-3 top-2 text-gray-500">$</span>
            <input
              type="number"
              value={pricing.used}
              onChange={(e) => setPricing({...pricing, used: parseFloat(e.target.value)})}
              className="pl-7 w-full px-3 py-2 border border-gray-300 rounded-lg"
              step="0.01"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Marketplace
          </label>
          <div className="relative">
            <span className="absolute left-3 top-2 text-gray-500">$</span>
            <input
              type="number"
              value={pricing.marketplace}
              onChange={(e) => setPricing({...pricing, marketplace: parseFloat(e.target.value)})}
              className="pl-7 w-full px-3 py-2 border border-gray-300 rounded-lg"
              step="0.01"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            New Condition
          </label>
          <div className="relative">
            <span className="absolute left-3 top-2 text-gray-500">$</span>
            <input
              type="number"
              value={pricing.new}
              onChange={(e) => setPricing({...pricing, new: parseFloat(e.target.value)})}
              className="pl-7 w-full px-3 py-2 border border-gray-300 rounded-lg"
              step="0.01"
            />
          </div>
        </div>
      </div>

      {/* AI-generated badge */}
      {pricing.aiGenerated && (
        <div className="flex items-center gap-2 text-sm text-purple-600 bg-purple-50 px-3 py-2 rounded-lg">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
            <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd"/>
          </svg>
          Generated by AI based on market data
        </div>
      )}
    </div>
  );
}
```

---

### Example 3: Backend API Endpoint for AI Pricing

```javascript
// Add to your api/server.js

import { getSmartPricing, validatePricing } from './services/aiPricing.service.js';

// Generate AI pricing (premium users only)
app.post('/api/generate-pricing', authMiddleware, async (req, res) => {
  try {
    const { title, description, category } = req.body;
    
    // Check if user is premium
    const userEmail = req.user.email;
    const usersRef = db.collection('users');
    const userQuery = await usersRef.where('email', '==', userEmail).get();
    
    if (userQuery.empty) {
      return res.status(403).json({ error: 'User not found' });
    }
    
    const userData = userQuery.docs[0].data();
    if (!userData.premium) {
      return res.status(403).json({ 
        error: 'Premium subscription required',
        upgradeUrl: '/upgrades'
      });
    }
    
    // Generate pricing
    const pricing = await getSmartPricing(title, description, category);
    const validated = validatePricing(pricing);
    
    res.json({
      success: true,
      pricing: validated,
      aiGenerated: true
    });
    
  } catch (error) {
    console.error('AI pricing error:', error);
    res.status(500).json({ error: error.message });
  }
});
```

---

### Example 4: Premium Badge in Navigation

```jsx
// Update your navigation component

function NavigationHeader() {
  const { user } = useAuth();

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/dashboard" className="font-bold text-xl">
            Photo2Profit
          </Link>
          
          <div className="flex gap-4">
            <Link to="/products" className="text-gray-700 hover:text-gray-900">
              Products
            </Link>
            <Link to="/upgrades" className="text-gray-700 hover:text-gray-900">
              Upgrades
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Premium Badge */}
          {user?.premium ? (
            <div className="flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-400 text-white rounded-full text-sm font-medium shadow-sm">
              <span>⭐</span>
              <span>Premium</span>
            </div>
          ) : (
            <Link
              to="/upgrades"
              className="px-4 py-2 bg-gradient-to-r from-rose-500 to-rose-600 text-white rounded-lg hover:from-rose-600 hover:to-rose-700 font-medium shadow-sm text-sm"
            >
              Upgrade
            </Link>
          )}
          
          {/* User Menu */}
          <div className="text-sm text-gray-600">
            {user?.email}
          </div>
        </div>
      </div>
    </nav>
  );
}
```

---

### Example 5: Feature Usage Limits (Free vs Premium)

```jsx
// Create a hook for feature limits

// src/hooks/useFeatureLimits.js
import { useAuth } from '../contexts/AuthContext';

export function useFeatureLimits() {
  const { user } = useAuth();
  
  const limits = {
    uploads: user?.premium ? Infinity : 10,
    backgrounds: user?.premium ? 20 : 1,
    aiPricing: user?.premium,
    batchPublish: user?.premium ? 100 : 10,
    analytics: user?.premium ? 'full' : 'limited'
  };
  
  const checkLimit = (feature, current) => {
    const limit = limits[feature];
    if (typeof limit === 'boolean') return limit;
    if (limit === Infinity) return true;
    return current < limit;
  };
  
  return { limits, checkLimit, isPremium: user?.premium };
}

// Usage in components:
function UploadButton() {
  const { limits, checkLimit } = useFeatureLimits();
  const [uploadCount, setUploadCount] = useState(0);

  const canUpload = checkLimit('uploads', uploadCount);

  return (
    <button 
      disabled={!canUpload}
      className="..."
    >
      {canUpload 
        ? `Upload Photo (${uploadCount}/${limits.uploads})`
        : `Limit Reached - Upgrade to Continue`
      }
    </button>
  );
}
```

---

### Example 6: Premium Upsell Modal

```jsx
// src/components/PremiumUpsellModal.jsx

import { Link } from 'react-router-dom';

export function PremiumUpsellModal({ feature, onClose }) {
  const features = {
    backgrounds: {
      icon: '🎨',
      title: 'Premium Backgrounds',
      description: 'Access 20+ professional studio backgrounds to make your products shine',
      benefits: [
        'White, marble, granite backgrounds',
        'Textured and gradient options',
        'One-click background replacement',
        'Unlimited usage'
      ]
    },
    aiPricing: {
      icon: '🤖',
      title: 'AI-Powered Pricing',
      description: 'Let AI analyze market data and suggest optimal prices for maximum profit',
      benefits: [
        'Market-based price suggestions',
        'Category-specific pricing',
        'Brand and condition detection',
        'Instant price generation'
      ]
    },
    batchPublish: {
      icon: '🚀',
      title: 'Batch Publishing',
      description: 'Publish hundreds of products to eBay and Facebook in one click',
      benefits: [
        'Publish up to 100 products at once',
        'Automatic inventory sync',
        'Multi-channel publishing',
        'Save hours of manual work'
      ]
    }
  };

  const config = features[feature] || features.backgrounds;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-rose-500 to-orange-500 text-white p-6 rounded-t-2xl text-center">
          <div className="text-5xl mb-3">{config.icon}</div>
          <h2 className="text-2xl font-bold">{config.title}</h2>
          <p className="mt-2 text-white text-opacity-90">{config.description}</p>
        </div>

        {/* Benefits */}
        <div className="p-6">
          <h3 className="font-semibold mb-3 text-gray-900">What you'll get:</h3>
          <ul className="space-y-2 mb-6">
            {config.benefits.map((benefit, i) => (
              <li key={i} className="flex items-start gap-2">
                <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                </svg>
                <span className="text-gray-700">{benefit}</span>
              </li>
            ))}
          </ul>

          {/* Pricing */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-center">
            <div className="text-3xl font-bold text-gray-900">$29.99<span className="text-lg text-gray-600">/mo</span></div>
            <div className="text-sm text-gray-600 mt-1">Cancel anytime</div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Maybe Later
            </button>
            <Link
              to="/upgrades"
              className="flex-1 px-4 py-2 bg-gradient-to-r from-rose-500 to-rose-600 text-white rounded-lg hover:from-rose-600 hover:to-rose-700 font-medium text-center"
            >
              Upgrade Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
```

---

## 🎯 Summary

### To lock a feature:
```jsx
{user?.premium ? <Feature /> : <UpgradePrompt />}
```

### To check premium status:
```jsx
const { user } = useAuth();
if (user?.premium) {
  // Premium feature
}
```

### To redirect to upgrades:
```jsx
<Link to="/upgrades">Upgrade to Premium</Link>
```

That's it! Your premium system is ready to use. 🚀
