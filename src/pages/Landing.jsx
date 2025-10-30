import { useState } from 'react';
import logo from '../assets/photo2profit-logo.svg';

export default function Landing() {
  const [email, setEmail] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    // In production, integrate with email service
    console.log('Email captured:', email);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
    setEmail('');
  };

  return (
    <div className="min-h-screen bg-blush">
      {/* Hero Section */}
      <main className="flex flex-col items-center justify-center min-h-screen text-dark text-center px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <img src={logo} alt="Photo2Profit Logo" className="w-48 mx-auto mb-6 drop-shadow-xl" />
          <h1 className="text-5xl md:text-6xl font-diamond mb-4 tracking-wide">
            PHOTO<span className="text-rose-dark">2</span>PROFIT
          </h1>
          <p className="text-xl md:text-2xl mb-6 max-w-2xl mx-auto font-semibold text-rose-dark">
            Turn Your Photos Into Profit in Minutes — Not Hours
          </p>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            AI-powered listings, automatic background removal, and instant cross-posting to 8+
            platforms. Join 10,000+ resellers making money faster 💎
          </p>

          {/* Pricing CTA with urgency */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8 max-w-md mx-auto border-4 border-rose">
            <div className="text-sm uppercase tracking-wide text-rose-dark font-semibold mb-2">
              LIMITED TIME OFFER
            </div>
            <div className="text-4xl font-bold mb-2">
              <span className="line-through text-gray-400">$9.99</span>
              <span className="text-rose-dark ml-2">$1</span>
            </div>
            <div className="text-sm text-gray-600 mb-4">7-day trial, then $9.99/month</div>
            <button
              className="cta w-full text-lg mb-3"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              Start Your $1 Trial Now
            </button>
            <p className="text-xs text-gray-500">
              Cancel anytime • No credit card required for trial
            </p>
          </div>

          {/* Email Capture */}
          <form onSubmit={handleEmailSubmit} className="max-w-md mx-auto mb-8">
            <div className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email to get started"
                required
                className="flex-1 px-4 py-3 rounded-full border-2 border-rose focus:outline-none focus:border-rose-dark"
              />
              <button type="submit" className="cta">
                Join
              </button>
            </div>
            {showSuccess && (
              <p className="text-green-600 mt-2 font-semibold">✓ Success! Check your email.</p>
            )}
          </form>
        </div>
      </main>

      {/* Social Proof */}
      <section className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-diamond text-center mb-8 text-rose-dark">
            Trusted by Top Resellers
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="text-4xl font-bold text-rose-dark mb-2">10,000+</div>
              <div className="text-gray-600">Active Users</div>
            </div>
            <div className="text-center p-6">
              <div className="text-4xl font-bold text-rose-dark mb-2">$2M+</div>
              <div className="text-gray-600">Revenue Generated</div>
            </div>
            <div className="text-center p-6">
              <div className="text-4xl font-bold text-rose-dark mb-2">8+</div>
              <div className="text-gray-600">Platform Integrations</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-diamond text-center mb-12 text-rose-dark">
            Everything You Need to Scale Your Resale Business
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="text-4xl mb-4">🤖</div>
              <h3 className="text-xl font-bold mb-3 text-rose-dark">AI-Powered Listings</h3>
              <p className="text-gray-700">
                Generate compelling titles, descriptions, and pricing suggestions in seconds. Save
                90% of your listing time.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="text-4xl mb-4">✂️</div>
              <h3 className="text-xl font-bold mb-3 text-rose-dark">Auto Background Removal</h3>
              <p className="text-gray-700">
                Professional-looking photos instantly. Remove backgrounds and enhance images with
                one click.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="text-4xl mb-4">📱</div>
              <h3 className="text-xl font-bold mb-3 text-rose-dark">Cross-Post Everywhere</h3>
              <p className="text-gray-700">
                List on eBay, Poshmark, Mercari, Depop, Facebook, Instagram, and more—all at once.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-bold mb-3 text-rose-dark">Trend Analytics</h3>
              <p className="text-gray-700">
                Know what's hot before everyone else. AI-powered insights on trending items and
                optimal pricing.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-bold mb-3 text-rose-dark">Bulk Export</h3>
              <p className="text-gray-700">
                Upload hundreds of items at once with CSV exports. Weekly automated batches to save
                time.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="text-4xl mb-4">💰</div>
              <h3 className="text-xl font-bold mb-3 text-rose-dark">Profit Tracking</h3>
              <p className="text-gray-700">
                Real-time analytics on your sales, margins, and ROI. Know exactly what's making
                money.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Logos */}
      <section className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h3 className="text-2xl font-diamond mb-8 text-rose-dark">
            Cross-Post to All Major Platforms
          </h3>
          <div className="flex flex-wrap justify-center items-center gap-8 text-gray-600 font-semibold">
            <span className="px-4 py-2 bg-blush rounded-full">eBay</span>
            <span className="px-4 py-2 bg-blush rounded-full">Poshmark</span>
            <span className="px-4 py-2 bg-blush rounded-full">Mercari</span>
            <span className="px-4 py-2 bg-blush rounded-full">Depop</span>
            <span className="px-4 py-2 bg-blush rounded-full">Facebook Shop</span>
            <span className="px-4 py-2 bg-blush rounded-full">Instagram Shop</span>
            <span className="px-4 py-2 bg-blush rounded-full">Pinterest</span>
            <span className="px-4 py-2 bg-blush rounded-full">TikTok Shop</span>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-diamond text-center mb-12 text-rose-dark">
            What Our Users Say
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="text-gold text-2xl mb-3">⭐⭐⭐⭐⭐</div>
              <p className="text-gray-700 mb-4">
                "I went from spending 4 hours listing items to just 30 minutes. This tool paid for
                itself in the first week!"
              </p>
              <div className="font-semibold text-rose-dark">— Sarah M., Full-time Reseller</div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="text-gold text-2xl mb-3">⭐⭐⭐⭐⭐</div>
              <p className="text-gray-700 mb-4">
                "The AI descriptions are better than what I wrote myself. My sales increased by 40%
                since using Photo2Profit."
              </p>
              <div className="font-semibold text-rose-dark">— Mike T., Side Hustle Pro</div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="text-gold text-2xl mb-3">⭐⭐⭐⭐⭐</div>
              <p className="text-gray-700 mb-4">
                "Cross-posting to 8 platforms used to take me all day. Now it's done in minutes.
                Game changer!"
              </p>
              <div className="font-semibold text-rose-dark">— Jessica L., Boutique Owner</div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-diamond text-center mb-12 text-rose-dark">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            <div className="bg-blush rounded-xl p-6">
              <h3 className="font-bold text-lg mb-2 text-rose-dark">How does the $1 trial work?</h3>
              <p className="text-gray-700">
                Pay just $1 to access all features for 7 days. After the trial, it's $9.99/month.
                Cancel anytime—no commitment.
              </p>
            </div>
            <div className="bg-blush rounded-xl p-6">
              <h3 className="font-bold text-lg mb-2 text-rose-dark">
                Which platforms can I cross-post to?
              </h3>
              <p className="text-gray-700">
                You can cross-post to eBay, Poshmark, Mercari, Depop, Facebook Shop, Instagram Shop,
                Pinterest, and TikTok Shop. More platforms coming soon!
              </p>
            </div>
            <div className="bg-blush rounded-xl p-6">
              <h3 className="font-bold text-lg mb-2 text-rose-dark">Do I need technical skills?</h3>
              <p className="text-gray-700">
                Not at all! Photo2Profit is designed for everyone. Just upload your photos and our
                AI handles the rest.
              </p>
            </div>
            <div className="bg-blush rounded-xl p-6">
              <h3 className="font-bold text-lg mb-2 text-rose-dark">What if I need help?</h3>
              <p className="text-gray-700">
                We offer 24/7 email support and a comprehensive knowledge base. Pro plan includes
                priority support and live chat.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 px-6 bg-gradient-to-br from-rose to-gold text-white text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-diamond mb-6">
            Ready to 10X Your Resale Business?
          </h2>
          <p className="text-xl mb-8">
            Join thousands of successful resellers already using Photo2Profit
          </p>
          <button
            className="bg-white text-rose-dark px-8 py-4 rounded-full font-bold text-lg shadow-2xl hover:scale-105 transition-transform"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            Start Your $1 Trial Now →
          </button>
          <p className="text-sm mt-4 opacity-90">
            🔒 Secure checkout • 💳 Cancel anytime • ✓ 7-day money-back guarantee
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-dark text-white text-center">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-4">
            <a href="mailto:support@photo2profit.app" className="hover:text-rose">
              support@photo2profit.app
            </a>
          </div>
          <div className="text-sm text-gray-400">
            © 2025 Photo2Profit. Built with 💎 by Baddie AI Hustle & Heal
          </div>
        </div>
      </footer>
    </div>
  );
}
