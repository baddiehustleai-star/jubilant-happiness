/**
 * Enhanced Stripe Service
 *
 * Handles subscription tiers, feature gating, and payment processing
 * Supports multiple plans with different feature sets
 */

import { analytics } from '../lib/monitoring.js';

// Subscription plans configuration
export const SUBSCRIPTION_PLANS = {
  free: {
    id: 'free',
    name: 'Free',
    price: 0,
    priceId: null,
    features: {
      imagesPerMonth: 5,
      backgroundRemoval: true,
      basicListings: true,
      ebayIntegration: false,
      prioritySupport: false,
      analytics: false,
      bulkProcessing: false,
      apiAccess: false,
    },
    description: 'Perfect for trying out Photo2Profit',
    popular: false,
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    price: 19.99,
    priceId: process.env.STRIPE_PRO_PRICE_ID,
    features: {
      imagesPerMonth: 100,
      backgroundRemoval: true,
      basicListings: true,
      ebayIntegration: true,
      prioritySupport: true,
      analytics: true,
      bulkProcessing: false,
      apiAccess: false,
    },
    description: 'Great for individual sellers',
    popular: true,
  },
  business: {
    id: 'business',
    name: 'Business',
    price: 49.99,
    priceId: process.env.STRIPE_BUSINESS_PRICE_ID,
    features: {
      imagesPerMonth: 500,
      backgroundRemoval: true,
      basicListings: true,
      ebayIntegration: true,
      prioritySupport: true,
      analytics: true,
      bulkProcessing: true,
      apiAccess: true,
    },
    description: 'Perfect for growing businesses',
    popular: false,
  },
};

class StripeService {
  constructor() {
    this.publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
    this.stripe = null;
    this.initStripe();
  }

  async initStripe() {
    if (typeof window !== 'undefined' && this.publishableKey) {
      try {
        const { loadStripe } = await import('@stripe/stripe-js');
        this.stripe = await loadStripe(this.publishableKey);
      } catch (error) {
        console.error('Failed to load Stripe:', error);
      }
    }
  }

  /**
   * Create checkout session for subscription
   */
  async createSubscriptionCheckout(planId, userId, userEmail) {
    const plan = SUBSCRIPTION_PLANS[planId];

    if (!plan || !plan.priceId) {
      throw new Error('Invalid subscription plan');
    }

    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: plan.priceId,
          successUrl: `${window.location.origin}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
          cancelUrl: `${window.location.origin}/pricing`,
          mode: 'subscription',
          customerEmail: userEmail,
          metadata: {
            userId,
            planId,
          },
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create checkout session');
      }

      analytics.track('subscription_checkout_started', {
        userId,
        planId,
        price: plan.price,
      });

      return result;
    } catch (error) {
      analytics.track('subscription_checkout_failed', {
        userId,
        planId,
        error: error.message,
      });
      throw error;
    }
  }

  /**
   * Redirect to Stripe Checkout
   */
  async redirectToCheckout(sessionId) {
    if (!this.stripe) {
      throw new Error('Stripe not initialized');
    }

    const { error } = await this.stripe.redirectToCheckout({ sessionId });

    if (error) {
      throw new Error(error.message);
    }
  }

  /**
   * Create customer portal session for managing subscription
   */
  async createCustomerPortalSession(customerId) {
    const response = await fetch('/api/create-portal-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        customerId,
        returnUrl: `${window.location.origin}/dashboard`,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Failed to create portal session');
    }

    return result;
  }

  /**
   * Check if user has access to a feature
   */
  hasFeatureAccess(userSubscription, feature) {
    const plan = SUBSCRIPTION_PLANS[userSubscription?.plan] || SUBSCRIPTION_PLANS.free;
    return plan.features[feature] || false;
  }

  /**
   * Get feature limit for user
   */
  getFeatureLimit(userSubscription, feature) {
    const plan = SUBSCRIPTION_PLANS[userSubscription?.plan] || SUBSCRIPTION_PLANS.free;
    return plan.features[feature] || 0;
  }

  /**
   * Check if user has reached usage limit
   */
  hasReachedLimit(userProfile, feature) {
    const usage = userProfile?.usage || {};
    const plan = SUBSCRIPTION_PLANS[userProfile?.subscription?.plan] || SUBSCRIPTION_PLANS.free;
    const limit = plan.features[feature];

    if (typeof limit === 'boolean') {
      return !limit;
    }

    if (typeof limit === 'number') {
      const currentUsage = usage[this.getUsageKey(feature)] || 0;
      return currentUsage >= limit;
    }

    return false;
  }

  /**
   * Get usage key for tracking
   */
  getUsageKey(feature) {
    const usageKeyMap = {
      imagesPerMonth: 'imagesProcessed',
      backgroundRemoval: 'backgroundsRemoved',
      basicListings: 'listingsCreated',
    };

    return usageKeyMap[feature] || feature;
  }

  /**
   * Get plan comparison data
   */
  getPlansComparison() {
    return Object.values(SUBSCRIPTION_PLANS).map((plan) => ({
      ...plan,
      features: Object.entries(plan.features).map(([key, value]) => ({
        name: this.formatFeatureName(key),
        value: this.formatFeatureValue(key, value),
        available: !!value,
      })),
    }));
  }

  /**
   * Format feature name for display
   */
  formatFeatureName(featureKey) {
    const nameMap = {
      imagesPerMonth: 'Images per month',
      backgroundRemoval: 'Background removal',
      basicListings: 'Basic listings',
      ebayIntegration: 'eBay integration',
      prioritySupport: 'Priority support',
      analytics: 'Advanced analytics',
      bulkProcessing: 'Bulk processing',
      apiAccess: 'API access',
    };

    return nameMap[featureKey] || featureKey;
  }

  /**
   * Format feature value for display
   */
  formatFeatureValue(featureKey, value) {
    if (typeof value === 'boolean') {
      return value ? '✓' : '✗';
    }

    if (typeof value === 'number') {
      if (featureKey.includes('PerMonth')) {
        return value.toLocaleString();
      }
      return value.toString();
    }

    return value;
  }

  /**
   * Calculate upgrade benefits
   */
  getUpgradeBenefits(currentPlan, targetPlan) {
    const current = SUBSCRIPTION_PLANS[currentPlan] || SUBSCRIPTION_PLANS.free;
    const target = SUBSCRIPTION_PLANS[targetPlan];

    if (!target) return [];

    const benefits = [];

    Object.entries(target.features).forEach(([feature, targetValue]) => {
      const currentValue = current.features[feature];

      if (typeof targetValue === 'number' && targetValue > currentValue) {
        benefits.push({
          feature: this.formatFeatureName(feature),
          improvement: `${currentValue.toLocaleString()} → ${targetValue.toLocaleString()}`,
        });
      } else if (typeof targetValue === 'boolean' && targetValue && !currentValue) {
        benefits.push({
          feature: this.formatFeatureName(feature),
          improvement: 'Now included',
        });
      }
    });

    return benefits;
  }
}

// Export singleton instance
export const stripeService = new StripeService();
export default stripeService;
