import { useCallback } from 'react';
import { getMonitor, reportError, reportCustomEvent } from '../monitor';

export function useMonitor() {
  const monitor = getMonitor();

  const trackError = useCallback((error: Error, extra?: any) => {
    reportError(error, extra);
  }, []);

  const trackEvent = useCallback((eventName: string, data: any) => {
    reportCustomEvent(eventName, data);
  }, []);

  const trackPageView = useCallback(
    (pageName: string, extra?: any) => {
      if (monitor) {
        monitor.track('behavior', {
          type: 'pageView',
          pageName,
          url: window.location.href,
          timestamp: Date.now(),
          ...extra,
        });
      }
    },
    [monitor],
  );

  const trackClick = useCallback(
    (element: string, extra?: any) => {
      if (monitor) {
        monitor.track('behavior', {
          type: 'click',
          element,
          url: window.location.href,
          timestamp: Date.now(),
          ...extra,
        });
      }
    },
    [monitor],
  );

  const trackPerformance = useCallback(
    (metrics: any) => {
      if (monitor) {
        monitor.track('performance', {
          ...metrics,
          timestamp: Date.now(),
        });
      }
    },
    [monitor],
  );

  return {
    monitor,
    trackError,
    trackEvent,
    trackPageView,
    trackClick,
    trackPerformance,
  };
}
