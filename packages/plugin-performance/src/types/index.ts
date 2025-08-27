export interface PerformanceData {
  type: 'navigation' | 'dom_ready' | 'web_vitals' | 'resource';
  timestamp: number;
  loadTime?: number;
  domContentLoaded?: number;
  firstPaint?: number;
  firstContentfulPaint?: number;
  dnsTime?: number;
  tcpTime?: number;
  requestTime?: number;
  domParseTime?: number;
  domReadyTime?: number;
  redirectTime?: number;
  unloadTime?: number;
  secureConnectionTime?: number;
  // Web Vitals 相关
  metric?: 'LCP' | 'FID' | 'CLS';
  value?: number;
  element?: string;
  // 资源相关
  name?: string;
  duration?: number;
  transferSize?: number;
  initiatorType?: string;
  startTime?: number;
  responseEnd?: number;
  domainLookupStart?: number;
  domainLookupEnd?: number;
  connectStart?: number;
  connectEnd?: number;
  requestStart?: number;
  responseStart?: number;
}

export interface PerformanceOptions {
  enableWebVitals?: boolean;
  enableResourceTiming?: boolean;
  enableNavigationTiming?: boolean;
  resourceTypes?: string[];
  performanceThresholds?: {
    loadTime?: number;
    domContentLoaded?: number;
    firstPaint?: number;
    lcp?: number;
    fid?: number;
    cls?: number;
  };
}

export interface ResourceTimingData {
  name: string;
  duration: number;
  transferSize: number;
  initiatorType: string;
  startTime: number;
  responseEnd: number;
  domainLookupStart: number;
  domainLookupEnd: number;
  connectStart: number;
  connectEnd: number;
  requestStart: number;
  responseStart: number;
}

export interface WebVitalsData {
  lcp?: number;
  fid?: number;
  cls?: number;
  fcp?: number;
  ttfb?: number;
}
