export interface TrackingEvent {
  id: string;
  name: string;
  identifier: string;
  type: 'click' | 'pageview' | 'custom';
  description?: string;
  active: boolean;
  projectId: string;
  createdAt: string;
}

export interface CreateTrackingEventPayload {
  name: string;
  identifier: string;
  type: 'click' | 'pageview' | 'custom';
  description?: string;
}

export interface UpdateTrackingEventPayload {
  name?: string;
  identifier?: string;
  type?: 'click' | 'pageview' | 'custom';
  description?: string;
  active?: boolean;
}
