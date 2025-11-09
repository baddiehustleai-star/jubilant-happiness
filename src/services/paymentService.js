// src/services/paymentService.js
import { loadStripe } from '@stripe/stripe-js';
import { apiFetch, getApiBase } from './apiClient.js';

// ✅ Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const paymentService = {
  /**
   * ✅ Create Stripe Checkout Session
   * @param {string} priceId - Stripe Price ID
   * @param {string} userId - Firebase User ID
   */
  async createCheckoutSession(priceId, userId) {
    try {
      console.log('🔄 Creating checkout session...', { priceId, userId });

      // For demo purposes, we'll show an alert
      // In production, this would call your Firebase Cloud Function
      if (!priceId) {
        alert('⚠️ Stripe Price ID not configured. Please check your environment variables.');
        return;
      }

      // Demo mode - show checkout info
      const isDemoMode = !import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
      
      if (isDemoMode) {
        alert(`🔧 Demo Mode: Would create checkout for Price ID: ${priceId}\n\nTo enable real payments:\n1. Add VITE_STRIPE_PUBLISHABLE_KEY to .env\n2. Set up Firebase Cloud Functions\n3. Configure Stripe webhooks`);
        return;
      }

      // Real Stripe implementation
      const { sessionId } = await apiFetch('/api/create-checkout-session', {
        method: 'POST',
        body: JSON.stringify({
          priceId,
          userId,
          successUrl: `${window.location.origin}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
          cancelUrl: `${window.location.origin}/dashboard`,
        }),
      });
      
      const stripe = await stripePromise;
      const { error } = await stripe.redirectToCheckout({ sessionId });

      if (error) {
        console.error('❌ Stripe checkout error:', error);
        alert('Failed to redirect to checkout. Please try again.');
      }

    } catch (error) {
      console.error('❌ Checkout session creation failed:', error);
      alert('Failed to start checkout. Please try again.');
    }
  },

  /**
   * ✅ Open Stripe Customer Portal
   * @param {string} customerId - Stripe Customer ID
   */
  async createCustomerPortalSession(customerId) {
    try {
      console.log('🔄 Opening billing portal...', { customerId });

      // Demo mode check
      const isDemoMode = !import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
      
      if (isDemoMode) {
        alert(`🔧 Demo Mode: Would open billing portal for Customer: ${customerId}\n\nTo enable real billing management:\n1. Add VITE_STRIPE_PUBLISHABLE_KEY to .env\n2. Set up Firebase Cloud Functions\n3. Configure Stripe customer portal`);
        return;
      }

      // Real implementation
      const { url } = await apiFetch('/api/create-portal-session', {
        method: 'POST',
        body: JSON.stringify({
          customerId,
          returnUrl: `${window.location.origin}/dashboard`,
        }),
      });
      window.location.href = url;

    } catch (error) {
      console.error('❌ Portal session creation failed:', error);
      alert('Failed to open billing portal. Please try again.');
    }
  },

  /**
   * ✅ Get subscription status (demo data for now)
   * @param {string} userId - Firebase User ID
   */
  async getSubscriptionStatus(userId) {
    try {
      console.log('🔄 Getting subscription status...', { userId });
      
      // Demo data - in production, this would fetch from Firestore
      return {
        status: 'trialing',
        plan: 'Pro',
        currentPeriodEnd: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60, // 7 days from now
        customerId: 'demo_customer_id',
        trialEnd: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60,
      };

    } catch (error) {
      console.error('❌ Failed to get subscription status:', error);
      return {
        status: 'none',
        plan: null,
        currentPeriodEnd: null,
        customerId: null,
      };
    }
  },

  /**
   * ✅ Get current usage (demo data)
   * @param {string} userId - Firebase User ID
   */
  async getCurrentUsage(userId) {
    try {
      console.log('🔄 Getting current usage...', { userId });
      
      // Demo data - in production, this would fetch from Firestore
      return {
        uploads: 3,
        backgroundRemovals: 2,
        aiAnalysis: 4,
        apiCalls: 15,
      };

    } catch (error) {
      console.error('❌ Failed to get usage data:', error);
      return {
        uploads: 0,
        backgroundRemovals: 0,
        aiAnalysis: 0,
        apiCalls: 0,
      };
    }
  },

  /**
   * ✅ Get usage limits (demo data)
   * @param {string} userId - Firebase User ID
   */
  async getUsageLimits(userId) {
    try {
      console.log('🔄 Getting usage limits...', { userId });
      
      // Demo data - in production, this would be based on subscription plan
      return {
        uploadsPerMonth: 20,
        backgroundRemovals: 10,
        aiAnalysis: 50,
        apiCallsPerDay: 100,
      };

    } catch (error) {
      console.error('❌ Failed to get usage limits:', error);
      return {
        uploadsPerMonth: 5,
        backgroundRemovals: 0,
        aiAnalysis: 3,
        apiCallsPerDay: 10,
      };
    }
  },

  /**
   * ✅ Check if user can perform action based on usage limits
   * @param {string} userId - Firebase User ID
   * @param {string} action - Action type ('upload', 'backgroundRemoval', 'aiAnalysis')
   */
  async canPerformAction(userId, action) {
    try {
      const usage = await this.getCurrentUsage(userId);
      const limits = await this.getUsageLimits(userId);

      switch (action) {
        case 'upload':
          return usage.uploads < limits.uploadsPerMonth;
        case 'backgroundRemoval':
          return usage.backgroundRemovals < limits.backgroundRemovals;
        case 'aiAnalysis':
          return usage.aiAnalysis < limits.aiAnalysis;
        default:
          return true;
      }
    } catch (error) {
      console.error('❌ Failed to check action permission:', error);
      return false;
    }
  },

  /**
   * ✅ Increment usage counter
   * @param {string} userId - Firebase User ID
   * @param {string} action - Action type
   */
  async incrementUsage(userId, action) {
    try {
      console.log('🔄 Incrementing usage...', { userId, action });
      
      // Demo mode - just log
      console.log(`✅ Usage incremented: ${action} for user ${userId}`);
      
      // In production, this would update Firestore
      return true;

    } catch (error) {
      console.error('❌ Failed to increment usage:', error);
      return false;
    }
  }
};

export default paymentService;