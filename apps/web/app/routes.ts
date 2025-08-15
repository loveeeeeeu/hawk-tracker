import { type RouteConfig, route } from '@react-router/dev/routes';

export default [
  route('/', 'routes/home.tsx'),
  route('/project', 'routes/project.tsx'),
  route('/project/:id', 'routes/project.$id.tsx'),
  route('/project/:id/settings', 'routes/project.$id.settings.tsx'),
  route('/project/:id/trackings', 'routes/project.$id.trackings.tsx'),
] satisfies RouteConfig;
