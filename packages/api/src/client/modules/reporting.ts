import { apiInstance } from '../instance';
import {
  ReportData,
  EventDefinition,
  SubmitResponseBody,
  RegisterResponseBody,
} from '../../types';

export const reporting = {
  /**
   * Submits a batch of reporting data to the server.
   * @param data - An array of ReportData objects.
   * @returns A promise that resolves with the submission response body.
   */
  submit: (data: ReportData[]): Promise<SubmitResponseBody> => {
    return apiInstance.post('/report/submit', data);
  },
  /**
   * Registers event definitions with the server.
   * @param definitions - An array of EventDefinition objects.
   * @returns A promise that resolves with the registration response body.
   */
  registerEvents: (
    definitions: EventDefinition[],
  ): Promise<RegisterResponseBody> => {
    return apiInstance.post('/report/register', definitions);
  },
};
