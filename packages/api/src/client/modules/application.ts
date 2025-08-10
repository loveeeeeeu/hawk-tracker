import { apiInstance } from '../instance';
import { createPaginatedApi } from '../helpers';
import {
  Application,
  CreateApplicationPayload,
  UpdateApplicationPayload,
  AppKeys,
  ReportSetting,
} from '../../types';

export const application = {
  /**
   * Fetches a paginated list of applications for the current workspace.
   */
  getApplications: createPaginatedApi<Application>('/applications'),
  /**
   * Creates a new application in the current workspace.
   */
  createApplication: (
    payload: CreateApplicationPayload,
  ): Promise<Application> => {
    return apiInstance.post('/applications', payload);
  },
  /**
   * Updates an existing application.
   */
  updateApplication: (
    appId: string,
    payload: UpdateApplicationPayload,
  ): Promise<Application> => {
    return apiInstance.patch(`/applications/${appId}`, payload);
  },
  /**
   * Deletes an application.
   */
  deleteApplication: (appId: string): Promise<void> => {
    return apiInstance.delete(`/applications/${appId}`);
  },
  /**
   * Gets the access keys for a specific application.
   */
  getAppKeys: (appId: string): Promise<AppKeys> => {
    return apiInstance.get(`/applications/${appId}/keys`);
  },
  /**
   * Resets the access keys for a specific application.
   * The new secret key will only be available in the response of this call.
   */
  resetAppKeys: (appId: string): Promise<AppKeys> => {
    return apiInstance.post(`/applications/${appId}/keys/reset`);
  },
  /**
   * Gets the data collection settings for a specific application.
   */
  getApplicationSettings: (appId: string): Promise<ReportSetting[]> => {
    return apiInstance.get(`/applications/${appId}/settings`);
  },
  /**
   * Updates the data collection settings for a specific application.
   */
  updateApplicationSettings: (
    appId: string,
    settings: ReportSetting[],
  ): Promise<ReportSetting[]> => {
    return apiInstance.put(`/applications/${appId}/settings`, { settings });
  },
};
