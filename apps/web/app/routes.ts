import { type RouteConfig, route } from '@react-router/dev/routes';

export default [
  route('/', 'routes/home.tsx'),
  route('/project', 'routes/project.tsx'),
  route('/project/:id', 'routes/project.$id.tsx'),
  route('/project/:id/overview', 'routes/project.$id.overview.tsx'),
  route('/project/:id/errors', 'routes/project.$id.errors.tsx'),
  route(
    '/project/:id/errors/:errorId',
    'routes/project.$id.errors.$errorId.tsx',
  ),
  route('/project/:id/settings', 'routes/project.$id.settings.tsx'),
  route('/project/:id/trackings', 'routes/project.$id.trackings.tsx'),
  route('/test-error', 'routes/test-error.tsx'),
] satisfies RouteConfig;
