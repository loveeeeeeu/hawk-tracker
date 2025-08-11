import { apiInstance } from '../instance';
import { createPaginatedApi } from '../helpers';
import {
  PerformanceStat,
  ErrorTrend,
  LogStat,
  PaginationPayload,
  WorkspaceOverview,
  ApplicationOverview,
} from '../../types';

// Define payload types that include specific filters along with pagination
export interface PerformanceStatsPayload extends PaginationPayload {
  timeRange: '24h' | '7d' | '30d';
}

export interface ErrorTrendsPayload extends PaginationPayload {
  timeRange: '24h' | '7d' | '30d';
}

export interface LogStatsPayload extends PaginationPayload {
  timeRange: '24h' | '7d' | '30d';
  level?: string; // e.g., 'ERROR', 'WARN'
}

export const analytics = {
  /**
   * Fetches high-level overview metrics for the current workspace.
   */
  getWorkspaceOverview: (): Promise<WorkspaceOverview> => {
    return apiInstance.get('/analytics/overview/workspace');
  },
  /**
   * Fetches high-level overview metrics for a specific application.
   */
  getApplicationOverview: (appId: string): Promise<ApplicationOverview> => {
    return apiInstance.get(`/analytics/overview/apps/${appId}`);
  },
  /**
   * A factory for application-specific analytics API calls.
   * @param appId - The ID of the application.
   */
  apps: (appId: string) => ({
    /**
     * Fetches a paginated list of performance statistics.
     */
    performance: createPaginatedApi<PerformanceStat, PerformanceStatsPayload>(
      `/analytics/apps/${appId}/performance`,
    ),
    /**
     * Fetches a paginated list of error trends.
     */
    errors: createPaginatedApi<ErrorTrend, ErrorTrendsPayload>(
      `/analytics/apps/${appId}/errors`,
    ),
    /**
     * Fetches a paginated list of logs.
     */
    logs: createPaginatedApi<LogStat, LogStatsPayload>(
      `/analytics/apps/${appId}/logs`,
    ),
  }),
};
