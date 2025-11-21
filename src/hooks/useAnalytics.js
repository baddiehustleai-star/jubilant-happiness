/**
 * React hooks for analytics and monitoring integration
 */
import { useEffect, useCallback } from 'react';
import { analytics, errorTracker } from '../lib/monitoring.js';

/**
 * Hook for tracking analytics events
 */
export function useAnalytics() {
  const track = useCallback((eventName, properties = {}) => {
    analytics.track(eventName, properties);
  }, []);

  const trackPageView = useCallback((path) => {
    analytics.trackPageView(path);
  }, []);

  const trackInteraction = useCallback((element, action) => {
    analytics.trackInteraction(element, action);
  }, []);

  const trackFileUpload = useCallback((fileType, fileSize) => {
    analytics.trackFileUpload(fileType, fileSize);
  }, []);

  return {
    track,
    trackPageView,
    trackInteraction,
    trackFileUpload,
  };
}

/**
 * Hook for error tracking
 */
export function useErrorTracking() {
  const captureError = useCallback((error, context = {}) => {
    errorTracker.captureException(error, context);
  }, []);

  const captureUserFeedback = useCallback((message, userInfo = {}) => {
    errorTracker.captureUserFeedback(message, userInfo);
  }, []);

  return {
    captureError,
    captureUserFeedback,
  };
}

/**
 * Hook for automatic page view tracking
 */
export function usePageTracking(pageName) {
  const { trackPageView } = useAnalytics();

  useEffect(() => {
    trackPageView(pageName || window.location.pathname);
  }, [trackPageView, pageName]);
}

/**
 * Hook for tracking component performance
 */
export function usePerformanceTracking(componentName) {
  const { track } = useAnalytics();

  useEffect(() => {
    const startTime = performance.now();

    return () => {
      const endTime = performance.now();
      const renderTime = endTime - startTime;

      if (renderTime > 100) {
        // Only track slow renders
        track('component_performance', {
          component: componentName,
          render_time: renderTime,
        });
      }
    };
  }, [track, componentName]);
}

/**
 * Hook for tracking user interactions with automatic event binding
 */
export function useInteractionTracking(ref, elementName) {
  const { trackInteraction } = useAnalytics();

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleClick = (_event) => {
      trackInteraction(elementName, 'click');
    };

    const handleFocus = (_event) => {
      trackInteraction(elementName, 'focus');
    };

    element.addEventListener('click', handleClick);
    element.addEventListener('focus', handleFocus);

    return () => {
      element.removeEventListener('click', handleClick);
      element.removeEventListener('focus', handleFocus);
    };
  }, [ref, elementName, trackInteraction]);
}
