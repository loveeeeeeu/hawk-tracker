export function getFirstPaint() {
  const paintEntries = performance.getEntriesByType('paint');
  const firstPaint = paintEntries.find((entry) => entry.name === 'first-paint');
  return firstPaint ? firstPaint.startTime : 0;
}

export function getFirstContentfulPaint() {
  const paintEntries = performance.getEntriesByType('paint');
  const firstContentfulPaint = paintEntries.find(
    (entry) => entry.name === 'first-contentful-paint',
  );
  return firstContentfulPaint ? firstContentfulPaint.startTime : 0;
}

export function getNavigationTiming() {
  const navigation = performance.getEntriesByType(
    'navigation',
  )[0] as PerformanceNavigationTiming;
  if (!navigation) return null;

  return {
    loadTime: navigation.loadEventEnd - navigation.fetchStart,
    domContentLoaded:
      navigation.domContentLoadedEventEnd - navigation.fetchStart,
    dnsTime: navigation.domainLookupEnd - navigation.domainLookupStart,
    tcpTime: navigation.connectEnd - navigation.connectStart,
    requestTime: navigation.responseEnd - navigation.requestStart,
  };
}

export function getResourceTiming() {
  const resources = performance.getEntriesByType(
    'resource',
  ) as PerformanceResourceTiming[];
  return resources.map((resource) => ({
    name: resource.name,
    duration: resource.duration,
    transferSize: resource.transferSize || 0,
    initiatorType: resource.initiatorType,
  }));
}
