// Stripe Payment Service for Photo2Profit
import { loadStripe } from '@stripe/stripe-js';
import { auth, db } from '../firebase';
import { doc, setDoc, getDoc, updateDoc, onSnapshot } from 'firebase/firestore';

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

  // Create checkout session for subscription (mock implementation for demo)
  async createCheckoutSession(priceId, userId, email) {
    try {
      if (!auth.currentUser) {
        throw new Error('User must be authenticated');
      }

      // For demo purposes, we'll simulate the checkout process
      console.log('Creating checkout session for:', { priceId, userId, email });

      // In a real implementation, this would call your Firebase function
      // const response = await fetch('/api/create-checkout-session', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ priceId, userId, email })
      // });

      // For demo, we'll simulate a successful subscription
      await this.simulateSubscriptionCreation(userId, priceId);
      
      return { success: true, message: 'Demo subscription activated!' };

    } catch (error) {
      console.error('Checkout session error:', error);
      throw error;
    }
  }

  // Simulate subscription creation for demo
  async simulateSubscriptionCreation(userId, priceId) {
    const plan = priceId.includes('trial') ? 'trial' : 'pro';
    const status = 'active';
    
    const subscriptionData = {
      subscriptionStatus: status,
      subscriptionPlan: plan,
      stripeCustomerId: `demo_cus_${Date.now()}`,
      stripeSubscriptionId: `demo_sub_${Date.now()}`,
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      cancelAtPeriodEnd: false,
      updatedAt: new Date(),
    };

    await this.updateUserSubscription(userId, subscriptionData);
  }

  // Subscribe to trial plan ($1)
  async subscribeToTrial(userId, email) {
    const trialPriceId = import.meta.env.VITE_STRIPE_PRICE_ID_TRIAL || 'price_trial_demo';
    return this.createCheckoutSession(trialPriceId, userId, email);
  }

  // Subscribe to pro plan ($14.99)
  async subscribeToPro(userId, email) {
    const proPriceId = import.meta.env.VITE_STRIPE_PRICE_ID_PRO || 'price_pro_demo';
    return this.createCheckoutSession(proPriceId, userId, email);
  }

  // Create customer portal session (mock for demo)
  async createCustomerPortalSession(customerId) {
    try {
      console.log('Opening customer portal for:', customerId);
      
      // In a real implementation, this would call your Firebase function
      // const response = await fetch('/api/create-portal-session', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ customerId })
      // });

      // For demo, show a mock portal
      alert('Demo: Customer portal would open here. You can manage your subscription, view invoices, and update payment methods.');
      
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
    
    if (status.status === 'trialing' || status.plan === 'trial') {
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
      const currentDate = new Date();
      const usageDocId = `${userId}_${currentDate.getFullYear()}_${currentDate.getMonth() + 1}`;
      const usageRef = doc(db, 'usage', usageDocId);
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
      const currentDate = new Date();
      const usageDocId = `${userId}_${currentDate.getFullYear()}_${currentDate.getMonth() + 1}`;
      const usageRef = doc(db, 'usage', usageDocId);
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

  // Cancel subscription
  async cancelSubscription(userId) {
    try {
      // In a real implementation, this would call your Firebase function
      // to cancel the Stripe subscription
      
      // For demo, we'll just update the local status
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        cancelAtPeriodEnd: true,
        updatedAt: new Date(),
      });

      return { success: true, message: 'Subscription will cancel at period end' };
    } catch (error) {
      console.error('Error canceling subscription:', error);
      throw error;
    }
  }

  // Pricing information
  getPricingInfo() {
    return {
      trial: {
        price: 1.00,
        currency: 'USD',
        interval: 'month',
        name: 'Trial Plan',
        features: [
          '10 photo uploads',
          '5 background removals',
          'AI listing generation',
          'CSV exports',
          'eBay integration',
          'Email support',
        ],
      },
      pro: {
        price: 14.99,
        currency: 'USD',
        interval: 'month',
        name: 'Pro Plan',
        features: [
          'Unlimited photo uploads',
          '100 background removals',
          'Advanced AI features',
          'Priority support',
          'Advanced analytics',
          'All integrations',
          'Custom branding',
          'API access',
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