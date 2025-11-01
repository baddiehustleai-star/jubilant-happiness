// Stripe Payment Service for Photo2Profit
import { loadStripe } from '@stripe/stripe-js';
import { auth, db, functions } from '../firebase';
import { doc, setDoc, getDoc, updateDoc, onSnapshot } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

class PaymentService {
  constructor() {
    this.stripe = null;
    this.initialized = false;
  }

  async initialize() {
    if (!this.initialized) {
      this.stripe = await stripePromise;
      this.initialized = true;
    }
    return this.stripe;
  }

  // Create checkout session for subscription
  async createCheckoutSession(priceId, userId, email) {
    try {
      if (!auth.currentUser) {
        throw new Error('User must be authenticated');
      }

      // Call Firebase Cloud Function
      const createCheckoutSession = httpsCallable(functions, 'createCheckoutSession');
      const result = await createCheckoutSession({
        priceId,
        userId,
        email,
        successUrl: `${window.location.origin}/dashboard?success=true`,
        cancelUrl: `${window.location.origin}/dashboard?canceled=true`,
      });

      const { sessionId } = result.data;
      
      // Redirect to Stripe Checkout
      const stripe = await this.initialize();
      const { error } = await stripe.redirectToCheckout({
        sessionId,
      });

      if (error) {
        throw new Error(error.message);
      }

    } catch (error) {
      console.error('Checkout session error:', error);
      throw error;
    }
  }

  // Subscribe to trial plan ($1)
  async subscribeToTrial(userId, email) {
    const trialPriceId = import.meta.env.VITE_STRIPE_PRICE_ID_TRIAL || 'price_trial_default';
    return this.createCheckoutSession(trialPriceId, userId, email);
  }

  // Subscribe to pro plan ($14.99)
  async subscribeToPro(userId, email) {
    const proPriceId = import.meta.env.VITE_STRIPE_PRICE_ID_PRO || 'price_pro_default';
    return this.createCheckoutSession(proPriceId, userId, email);
  }

  // Create customer portal session
  async createCustomerPortalSession(customerId) {
    try {
      // Call Firebase Cloud Function
      const createPortalSession = httpsCallable(functions, 'createPortalSession');
      const result = await createPortalSession({
        customerId,
        returnUrl: `${window.location.origin}/dashboard`,
      });

      const { url } = result.data;
      window.location.href = url;

    } catch (error) {
      console.error('Portal session error:', error);
      throw error;
    }
  }

  // Get user subscription status
  async getSubscriptionStatus(userId) {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (!userDoc.exists()) {
        return { status: 'none', plan: null };
      }

      const userData = userDoc.data();
      return {
        status: userData.subscriptionStatus || 'none',
        plan: userData.subscriptionPlan || null,
        customerId: userData.stripeCustomerId || null,
        subscriptionId: userData.stripeSubscriptionId || null,
        currentPeriodEnd: userData.currentPeriodEnd || null,
        cancelAtPeriodEnd: userData.cancelAtPeriodEnd || false,
      };
    } catch (error) {
      console.error('Error getting subscription status:', error);
      return { status: 'error', plan: null };
    }
  }

  // Update user subscription in Firestore
  async updateUserSubscription(userId, subscriptionData) {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        subscriptionStatus: subscriptionData.status,
        subscriptionPlan: subscriptionData.plan,
        stripeCustomerId: subscriptionData.customerId,
        stripeSubscriptionId: subscriptionData.subscriptionId,
        currentPeriodEnd: subscriptionData.currentPeriodEnd,
        cancelAtPeriodEnd: subscriptionData.cancelAtPeriodEnd || false,
        updatedAt: new Date(),
      });
    } catch (error) {
      console.error('Error updating subscription:', error);
      throw error;
    }
  }

  // Listen to subscription changes
  subscribeToUserData(userId, callback) {
    const userRef = doc(db, 'users', userId);
    return onSnapshot(userRef, (doc) => {
      if (doc.exists()) {
        callback(doc.data());
      }
    });
  }

  // Check if user has active subscription
  async hasActiveSubscription(userId) {
    const status = await this.getSubscriptionStatus(userId);
    return ['active', 'trialing'].includes(status.status);
  }

  // Check if user is on trial
  async isOnTrial(userId) {
    const status = await this.getSubscriptionStatus(userId);
    return status.status === 'trialing';
  }

  // Check if user can upload (based on subscription)
  async canUpload(userId) {
    const status = await this.getSubscriptionStatus(userId);
    return ['active', 'trialing'].includes(status.status);
  }

  // Get usage limits based on subscription
  async getUsageLimits(userId) {
    const status = await this.getSubscriptionStatus(userId);
    
    if (status.status === 'trialing') {
      return {
        uploadsPerMonth: 10,
        backgroundRemovals: 5,
        aiAnalysis: 10,
        apiCallsPerDay: 50,
      };
    }
    
    if (status.status === 'active' && status.plan === 'pro') {
      return {
        uploadsPerMonth: -1, // unlimited
        backgroundRemovals: 100,
        aiAnalysis: -1, // unlimited
        apiCallsPerDay: 1000,
      };
    }

    // Free tier or no subscription
    return {
      uploadsPerMonth: 0,
      backgroundRemovals: 0,
      aiAnalysis: 0,
      apiCallsPerDay: 0,
    };
  }

  // Track usage for billing purposes
  async trackUsage(userId, type, count = 1) {
    try {
      const usageRef = doc(db, 'usage', `${userId}_${new Date().getFullYear()}_${new Date().getMonth() + 1}`);
      const usageDoc = await getDoc(usageRef);
      
      const currentUsage = usageDoc.exists() ? usageDoc.data() : {};
      const newUsage = {
        ...currentUsage,
        [type]: (currentUsage[type] || 0) + count,
        lastUpdated: new Date(),
      };

      await setDoc(usageRef, newUsage, { merge: true });
      return newUsage;
    } catch (error) {
      console.error('Error tracking usage:', error);
      throw error;
    }
  }

  // Get current month usage
  async getCurrentUsage(userId) {
    try {
      const usageRef = doc(db, 'usage', `${userId}_${new Date().getFullYear()}_${new Date().getMonth() + 1}`);
      const usageDoc = await getDoc(usageRef);
      
      return usageDoc.exists() ? usageDoc.data() : {
        uploads: 0,
        backgroundRemovals: 0,
        aiAnalysis: 0,
        apiCalls: 0,
      };
    } catch (error) {
      console.error('Error getting usage:', error);
      return { uploads: 0, backgroundRemovals: 0, aiAnalysis: 0, apiCalls: 0 };
    }
  }

  // Pricing information
  getPricingInfo() {
    return {
      trial: {
        price: 1.00,
        currency: 'USD',
        interval: 'month',
        features: [
          '10 photo uploads',
          '5 background removals',
          'AI listing generation',
          'CSV exports',
          'eBay integration',
        ],
      },
      pro: {
        price: 14.99,
        currency: 'USD',
        interval: 'month',
        features: [
          'Unlimited photo uploads',
          '100 background removals',
          'Advanced AI features',
          'Priority support',
          'Advanced analytics',
          'All integrations',
        ],
      },
    };
  }
}

// Export singleton instance
export const paymentService = new PaymentService();

// Utility functions
export const formatPrice = (price, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(price);
};

export const formatDate = (timestamp) => {
  if (!timestamp) return '';
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};