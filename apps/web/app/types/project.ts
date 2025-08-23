export interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  active: boolean;
  dsn?: string;
  environment?: 'development' | 'staging' | 'production';
}