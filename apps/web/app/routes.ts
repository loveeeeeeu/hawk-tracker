import { type RouteConfig, route } from '@react-router/dev/routes';

export default [
  route('/', 'routes/home.tsx'),
  route('/project', 'routes/project.tsx'),
  route('/project/:id', 'routes/project.$id.tsx'),
  route('/project/:id/overview', 'routes/project.$id.overview.tsx'), // 添加概览页面路由
  route('/project/:id/errors', 'routes/project.$id.errors.tsx'), // 添加错误日志页面路由
  route('/project/:id/settings', 'routes/project.$id.settings.tsx'),
  route('/project/:id/trackings', 'routes/project.$id.trackings.tsx'),
  route('/test-error', 'routes/test-error.tsx'), // 可选：独立的测试页面
] satisfies RouteConfig;