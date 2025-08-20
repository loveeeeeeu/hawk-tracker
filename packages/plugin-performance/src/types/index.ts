export interface PerformanceData {
  loadTime: number;
  domContentLoaded: number;
  firstPaint: number;
  firstContentfulPaint?: number;
  dnsTime?: number;
  tcpTime?: number;
  requestTime?: number;
}

export interface PerformanceOptions {
  enableWebVitals?: boolean;
  enableResourceTiming?: boolean;
  enableNavigationTiming?: boolean;
}

export interface ResourceTimingData {
  name: string;
  duration: number;
  transferSize: number;
  initiatorType: string;
}

