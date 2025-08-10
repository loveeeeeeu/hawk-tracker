import { LogLevel } from './reporting';

/**
 * Placeholder for a single performance metric record.
 */
export interface PerformanceStat {
  id: string;
  type: string; // e.g., 'LCP', 'FCP', 'API_REQUEST'
  value: number; // e.g., duration in ms
  path: string; // url path where it occurred
  timestamp: number;
}

/**
 * Placeholder for a single error group record.
 */
export interface ErrorTrend {
  id: string;
  name: string; // Error name, e.g., 'TypeError'
  message: string; // Error message
  count: number;
  lastSeen: number;
  firstSeen: number;
}

/**
 * Placeholder for a single log record.
 */
export interface LogStat {
  id: string;
  level: LogLevel;
  message: string;
  timestamp: number;
}

/**
 * Defines the structure for a workspace-level overview.
 */
export interface WorkspaceOverview {
  totalApplications: number;
  totalErrors24h: number;
  totalLogs24h: number;
  apps: string[];
}

/**
 * Defines the structure for an application-level overview.
 */
export interface ApplicationOverview {
  appId: string;
  appName: string;
  totalErrors24h: number;
  avgPageLoad24h: number; // in ms
  p95PageLoad24h: number; // in ms
  totalLogs24h: number;
  sessions24h: number;
}
