export enum ReportType {
  TRACK = 0,
  ERROR = 1,
  PERFORMANCE = 2,
  LOG = 3,
}

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

export enum PerfType {
  PAGE_LOAD = 0,
  API_REQUEST = 1,
  RESOURCE_LOAD = 2,
  RENDER = 3,
}

export enum APIStatus {
  SUCCESS = 0,
  FAIL = 1,
  RETRY = 2,
}

export enum ResourceType {
  IMAGE = 0,
  SCRIPT = 1,
  CSS = 2,
  FONT = 3,
  OTHER = 4,
}

export interface DeviceInfo {
  deviceId: string;
  model?: string;
  os?: string;
  osVersion?: string;
  networkType?: string;
  browser?: string;
  browserVersion?: string;
}

export interface PageInfo {
  url: string;
  path: string;
  title?: string;
}

export interface AppInfo {
  appId: string;
  accessKey: string;
  appVersion: string;
  appName: string;
  platform: string;
  env: 'prod' | 'test' | 'dev';
}

export interface CommonInfo {
  app: AppInfo;
  device?: DeviceInfo;
  page?: PageInfo;
}

export interface LogData {
  level: LogLevel;
  message: string;
  extJson?: string;
}

export interface ErrorData {
  name: string;
  message: string;
  stack?: string;
  metaJson?: string;
}

export interface PerformanceData {
  perfType: PerfType;
  duration: number;
  apiStatus?: APIStatus;
  size?: number;
  extraJson?: string;
}

export interface TrackData {
  eventName: string;
  propertiesJson?: string;
}

export type EventDetails =
  | { type: ReportType.TRACK; details: TrackData }
  | { type: ReportType.ERROR; details: ErrorData }
  | { type: ReportType.PERFORMANCE; details: PerformanceData }
  | { type: ReportType.LOG; details: LogData };

export interface ReportEvent {
  reportId: string;
  type: ReportType;
  timestamp: number; // Thrift i64
  common: CommonInfo;
  details: EventDetails['details']; // This will be correctly typed based on the 'type' property
}

export interface ReportData {
  batchId?: string;
  dataSize: number;
  timestamp: number; // Thrift i64
  isRetry: boolean;
  data: ReportEvent[]; // Corrected from ReportData to ReportEvent
}

export interface EventDefinitionData {
  eventName: string;
  description?: string;
  status: boolean;
  propertiesSchemaJson?: string;
}

export interface EventDefinition {
  app: AppInfo; // Corrected from AppInfo to app
  events: EventDefinitionData[];
}

export interface SubmitResponseBody {
  batchId: string;
  dataSize: number;
  needRetry: boolean;
  submitEvent?: string[];
}

export interface RegisterResponseBody {
  eventSize: number;
  isFlush: boolean;
}
