import { useParams } from 'react-router';
import { ProjectLayout } from '../components/project/layout';

export default function CustomTrackingPage() {
  const { id: projectId } = useParams<{ id: string }>();
  
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
    { label: '自定义埋点' }
  ];

  const customEvents = [
    {
      id: 'evt-custom-001',
      name: '用户注册事件',
      identifier: 'user_register',
      triggerCount: 1234,
      affectedUsers: 567,
      lastTriggered: '2024-01-15 14:30:25'
    },
    {
      id: 'evt-custom-002',
      name: '商品购买事件',
      identifier: 'product_purchase',
      triggerCount: 890,
      affectedUsers: 234,
      lastTriggered: '2024-01-15 13:45:12'
    }
  ];

  return (
    <ProjectLayout projectId={projectId} activePage="custom" breadcrumbs={breadcrumbs}>
      <h1 className="text-2xl font-bold mb-6">自定义埋点</h1>
      
      <div className="bg-card rounded-lg border border-border">
        <div className="p-6 border-b border-border">
          <h2 className="text-lg font-semibold">自定义埋点事件</h2>
          <p className="text-sm text-muted-foreground mt-2">
            展示项目中所有自定义埋点事件的触发数据和统计信息
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  事件名称
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  事件标识符
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  触发次数
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  影响用户
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  最后触发时间
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {customEvents.map((event) => (
                <tr key={event.id} className="hover:bg-muted/50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">{event.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">{event.identifier}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">{event.triggerCount}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">{event.affectedUsers}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{event.lastTriggered}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <a href={`/project/${projectId}/custom/${event.id}`} className="text-primary hover:text-primary/80 transition-colors">
                      详情
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </ProjectLayout>
  );
}