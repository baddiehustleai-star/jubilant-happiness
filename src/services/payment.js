// Stripe payment service for Photo2Profit subscriptions
import { loadStripe } from '@stripe/stripe-js';
import { doc, updateDoc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export const paymentService = {
  // Create checkout session for subscription
  createCheckoutSession: async (userId, priceId = 'price_trial_to_pro') => {
    try {
      // Create checkout session via your backend API
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          priceId,
          successUrl: `${window.location.origin}/dashboard?success=true`,
          cancelUrl: `${window.location.origin}/dashboard?canceled=true`,
        }),
      });

      const session = await response.json();

      if (!response.ok) {
        throw new Error(session.error || 'Failed to create checkout session');
      }

      // Redirect to Stripe Checkout
      const stripe = await stripePromise;
      const { error } = await stripe.redirectToCheckout({
        sessionId: session.id,
      });

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Checkout error:', error);
      throw error;
    }
  },

  // Create trial subscription ($1 for 7 days, then $14.99/month)
  createTrialSubscription: async (userId) => {
    return paymentService.createCheckoutSession(userId, 'price_trial_subscription');
  },

  // Upgrade to Pro subscription ($14.99/month)
  upgradeToProSubscription: async (userId) => {
    return paymentService.createCheckoutSession(userId, 'price_pro_subscription');
  },

  // Get subscription status from Firestore
  getSubscriptionStatus: async (userId) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        return {
          isPro: userData.isPro || false,
          subscriptionStatus: userData.subscriptionStatus || 'free',
          stripeCustomerId: userData.stripeCustomerId || null,
          subscriptionId: userData.subscriptionId || null,
          currentPeriodEnd: userData.currentPeriodEnd || null,
          uploadsUsed: userData.uploadsUsed || 0,
          uploadLimit: userData.uploadLimit || 5,
        };
      }
      return null;
    } catch (error) {
      console.error('Error getting subscription status:', error);
      throw error;
    }
  },

  // Update user subscription status (called by webhook)
  updateSubscriptionStatus: async (userId, subscriptionData) => {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        isPro: subscriptionData.status === 'active',
        subscriptionStatus: subscriptionData.status,
        stripeCustomerId: subscriptionData.customerId,
        subscriptionId: subscriptionData.subscriptionId,
        currentPeriodEnd: new Date(subscriptionData.currentPeriodEnd * 1000),
        uploadLimit: subscriptionData.status === 'active' ? 100 : 5, // Pro vs Free limits
        updatedAt: new Date(),
      });
    } catch (error) {
      console.error('Error updating subscription status:', error);
      throw error;
    }
  },

  // Check if user has reached upload limit
  checkUploadLimit: async (userId) => {
    try {
      const status = await paymentService.getSubscriptionStatus(userId);
      if (!status) return { canUpload: false, reason: 'User not found' };

      const canUpload = status.uploadsUsed < status.uploadLimit;
      return {
        canUpload,
        uploadsUsed: status.uploadsUsed,
        uploadLimit: status.uploadLimit,
        isPro: status.isPro,
        reason: canUpload ? null : 'Upload limit reached',
      };
    } catch (error) {
      console.error('Error checking upload limit:', error);
      throw error;
    }
  },

  // Increment upload count
  incrementUploadCount: async (userId, count = 1) => {
    try {
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        const currentCount = userDoc.data().uploadsUsed || 0;
        await updateDoc(userRef, {
          uploadsUsed: currentCount + count,
          lastUpload: new Date(),
        });
      }
    } catch (error) {
      console.error('Error incrementing upload count:', error);
      throw error;
    }
  },

  // Create customer portal session (for managing subscriptions)
  createPortalSession: async (customerId) => {
    try {
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

      const session = await response.json();

      if (!response.ok) {
        throw new Error(session.error || 'Failed to create portal session');
      }

      // Redirect to customer portal
      window.location.href = session.url;
    } catch (error) {
      console.error('Portal session error:', error);
      throw error;
    }
  },
};

// Price plans configuration
export const PRICE_PLANS = {
  free: {
    name: 'Free Trial',
    price: '$0',
    uploads: 5,
    features: [
      '5 photo uploads',
      'Basic AI listing generation',
      'Manual cross-posting',
      'Standard support',
    ],
  },
  trial: {
    name: 'Trial Subscription',
    price: '$1',
    period: '7 days, then $14.99/month',
    uploads: 25,
    features: [
      '25 photo uploads',
      'Advanced AI listing generation',
      'Auto cross-posting to 5 platforms',
      'Background removal',
      'Priority support',
    ],
  },
  pro: {
    name: 'Pro',
    price: '$14.99',
    period: 'per month',
    uploads: 100,
    features: [
      '100 photo uploads',
      'Advanced AI listing generation',
      'Auto cross-posting to all platforms',
      'Background removal',
      'Bulk upload & processing',
      'Analytics dashboard',
      'Priority support',
      'Custom branding',
    ],
  },
};