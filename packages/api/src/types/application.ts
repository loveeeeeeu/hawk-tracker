import { ReportType } from './reporting';

export type ApplicationPlatform = 'web' | 'ios' | 'android' | 'mini_program';

/**
 * Defines the data collection settings for a specific event type within an application.
 */
export interface ReportSetting {
  type: ReportType | string; // Can be a standard ReportType or a custom event name for TRACK
  enabled: boolean; // Whether this event type is actively being collected
  sampleRate: number; // A value between 0 and 1 (e.g., 0.5 for 50% sampling)
}

export interface Application {
  id: string;
  name: string;
  description?: string;
  platform: ApplicationPlatform;
  workspaceId: string;
  createdAt: number;
  settings: ReportSetting[]; // The collection settings for this application
}

export interface CreateApplicationPayload {
  name: string;
  description?: string;
  platform: ApplicationPlatform;
}

export interface UpdateApplicationPayload {
  name?: string;
  description?: string;
}

export interface AppKeys {
  accessKey: string;
  secretKey: string; // Note: The secretKey should only be shown once upon creation/reset.
}
