import { type RouteConfig, index, route } from '@react-router/dev/routes';

export default [
  index('routes/home.tsx'),
  route('profile', 'profile/index.tsx'),
  route('projects/:projectId/settings', 'projects/[projectId]/settings/page.tsx')
] satisfies RouteConfig;
