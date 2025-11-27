/**
 * Analytics and Error Tracking Configuration for Photo2Profit
 *
 * This module provides a unified interface for analytics and error tracking
 * across different platforms and environments.
 */

// Environment detection
const isDevelopment = import.meta.env.DEV;
const isProduction = import.meta.env.PROD;

/**
 * Analytics configuration
 */
class Analytics {
  constructor() {
    this.initialized = false;
    this.queue = [];
  }

  // Initialize analytics services
  async initialize() {
    if (this.initialized) return;

    try {
      // Initialize Vercel Analytics if available
      if (typeof window !== 'undefined' && window.va) {
        console.log('📊 Vercel Analytics initialized');
      }

      // Initialize Google Analytics if configured
      const GA_ID = import.meta.env.VITE_GA_ID;
      if (GA_ID && isProduction) {
        await this.initializeGoogleAnalytics(GA_ID);
      }

      this.initialized = true;

      // Process queued events
      this.queue.forEach((event) => this.track(event.name, event.properties));
      this.queue = [];
    } catch (error) {
      console.error('Analytics initialization failed:', error);
    }
  }

  // Initialize Google Analytics
  async initializeGoogleAnalytics(gaId) {
    const script = document.createElement('script');
    script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
    script.async = true;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    function gtag() {
      dataLayer.push(arguments);
    }
    window.gtag = gtag;

    gtag('js', new Date());
    gtag('config', gaId);

    console.log('📊 Google Analytics initialized');
  }

  // Track events
  track(eventName, properties = {}) {
    if (!this.initialized) {
      this.queue.push({ name: eventName, properties });
      return;
    }

    try {
      // Send to Google Analytics if available
      if (window.gtag) {
        window.gtag('event', eventName, {
          custom_parameter: properties,
          timestamp: new Date().toISOString(),
        });
      }

      // Send to Vercel Analytics if available
      if (window.va) {
        window.va('track', eventName, properties);
      }

      if (isDevelopment) {
        console.log('📊 Analytics Event:', eventName, properties);
      }
    } catch (error) {
      console.error('Analytics tracking failed:', error);
    }
  }

  // Track page views
  trackPageView(path = window.location.pathname) {
    this.track('page_view', { path });
  }

  // Track user interactions
  trackInteraction(element, action) {
    this.track('user_interaction', { element, action });
  }

  // Track file uploads
  trackFileUpload(fileType, fileSize) {
    this.track('file_upload', { file_type: fileType, file_size: fileSize });
  }

  // Track errors
  trackError(error, context = {}) {
    this.track('error', {
      message: error.message,
      stack: error.stack,
      context,
      timestamp: new Date().toISOString(),
    });
  }
}

/**
 * Error Tracking Service
 */
class ErrorTracker {
  constructor() {
    this.setupGlobalErrorHandling();
  }

  setupGlobalErrorHandling() {
    if (typeof window === 'undefined') return;

    // Handle uncaught JavaScript errors
    window.addEventListener('error', (event) => {
      this.captureError(event.error, {
        type: 'uncaught_error',
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      });
    });

    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.captureError(new Error(event.reason), {
        type: 'unhandled_rejection',
        promise: event.promise,
      });
    });

    console.log('🛡️ Global error tracking initialized');
  }

  captureError(error, context = {}) {
    try {
      // Log to console in development
      if (isDevelopment) {
        console.error('🚨 Error captured:', error, context);
      }

      // Send to analytics
      analytics.trackError(error, context);

      // In production, you could send to external error tracking services
      if (isProduction) {
        // Example: Send to Sentry, LogRocket, etc.
        // Sentry.captureException(error, { contexts: { custom: context } });
      }
    } catch (trackingError) {
      console.error('Error tracking failed:', trackingError);
    }
  }

  // Manually capture exceptions
  captureException(error, context = {}) {
    this.captureError(error, { ...context, manual: true });
  }

  // Capture user feedback/issues
  captureUserFeedback(message, userInfo = {}) {
    this.captureError(new Error(`User Feedback: ${message}`), {
      type: 'user_feedback',
      user: userInfo,
    });
  }
}

// Create singleton instances
const analytics = new Analytics();
const errorTracker = new ErrorTracker();

// Initialize on DOM ready
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => analytics.initialize());
  } else {
    analytics.initialize();
  }
}

// Performance monitoring
const performanceMonitor = {
  // Track Core Web Vitals
  trackCoreWebVitals() {
    if ('web-vital' in window) {
      import('web-vitals')
        .then(({ onCLS, onFID, onFCP, onLCP, onTTFB }) => {
          onCLS((metric) =>
            analytics.track('core_web_vital', { name: 'CLS', value: metric.value })
          );
          onFID((metric) =>
            analytics.track('core_web_vital', { name: 'FID', value: metric.value })
          );
          onFCP((metric) =>
            analytics.track('core_web_vital', { name: 'FCP', value: metric.value })
          );
          onLCP((metric) =>
            analytics.track('core_web_vital', { name: 'LCP', value: metric.value })
          );
          onTTFB((metric) =>
            analytics.track('core_web_vital', { name: 'TTFB', value: metric.value })
          );
        })
        .catch(() => {
          // Web vitals not available
        });
    }
  },

  // Track resource loading times
  trackResourceTiming() {
    if ('performance' in window && 'getEntriesByType' in performance) {
      const resources = performance.getEntriesByType('resource');
      const slowResources = resources.filter((resource) => resource.duration > 1000);

      if (slowResources.length > 0) {
        analytics.track('slow_resources', { count: slowResources.length });
      }
    }
  },
};

// Start performance monitoring
if (isProduction) {
  performanceMonitor.trackCoreWebVitals();

  // Track resource timing after page load
  window.addEventListener('load', () => {
    setTimeout(() => performanceMonitor.trackResourceTiming(), 1000);
  });
}

export { analytics, errorTracker, performanceMonitor };
export default analytics;
