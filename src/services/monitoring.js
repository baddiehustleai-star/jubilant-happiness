/**
 * Simple Analytics/Monitoring Service
 *
 * Provides basic tracking functionality for Photo2Profit
 */

class Analytics {
  constructor() {
    this.isEnabled = true;
  }

  track(event, properties = {}) {
    if (!this.isEnabled) return;

    console.log('Analytics Event:', event, properties);

    // Future: Send to Google Analytics, Mixpanel, etc.
    // Example:
    // if (window.gtag) {
    //   window.gtag('event', event, properties);
    // }
  }

  identify(userId, traits = {}) {
    if (!this.isEnabled) return;

    console.log('Analytics Identity:', userId, traits);
  }

  page(name, properties = {}) {
    if (!this.isEnabled) return;

    console.log('Analytics Page View:', name, properties);
  }
}

export const analytics = new Analytics();
