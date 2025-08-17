import { useParams } from 'react-router';
import { ProjectLayout } from '../components/project/layout';

export default function UsersPage() {
  // 使用 useParams 获取路由参数
  const { id: projectId } = useParams<{ id: string }>();
  
  // 如果 projectId 不存在，显示错误
  if (!projectId) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">错误</h1>
          <p className="text-muted-foreground">项目ID不能为空</p>
          <a href="/project" className="text-primary hover:underline">
            返回项目列表
          </a>
        </div>
      </div>
    );
  }
  
  const breadcrumbs = [
    { label: '应用首页', href: '/' },
    { label: '项目管理', href: '/project' },
    { label: '用户日志' }
  ];

  return (
    <ProjectLayout projectId={projectId} activePage="users" breadcrumbs={breadcrumbs}>
      <h1 className="text-2xl font-bold">用户日志</h1>
      <p className="text-muted-foreground">用户行为分析功能开发中...</p>
    </ProjectLayout>
  );
}