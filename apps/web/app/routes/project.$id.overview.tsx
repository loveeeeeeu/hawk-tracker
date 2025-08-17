import { LoaderFunction } from "react-router";
import { useParams } from "react-router";
import { getProject } from "@/api/project";

export const meta = () => [{ title: "项目概览" }];

export const loader: LoaderFunction = async ({ params }) => {
  const projectId = params.id;
  if (!projectId) {
    throw new Error('项目ID不能为空');
  }
  
  const project = await getProject(projectId);
  return Response.json({ project });
};

export default function ProjectOverviewPage() {
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
    { label: '项目概览' }
  ];

  return (
    <div className="flex h-screen bg-background">
      {/* 左侧侧边栏 */}
      <div className="w-64 bg-card border-r border-border">
        <div className="p-4 border-b border-border">
          <h2 className="text-lg font-semibold">项目导航</h2>
        </div>
        <nav className="p-4 space-y-2">
          <a 
            href={`/project/${projectId}/overview`}
            className="flex items-center px-3 py-2 text-sm font-medium text-primary bg-primary/10 rounded-md"
          >
            概览
          </a>
          <a 
            href={`/project/${projectId}/errors`}
            className="flex items-center px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
          >
            错误日志
          </a>
          <a 
            href={`/project/${projectId}/performance`}
            className="flex items-center px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
          >
            性能日志
          </a>
          <a 
            href={`/project/${projectId}/users`}
            className="flex items-center px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
          >
            用户日志
          </a>
          <a 
            href={`/project/${projectId}/custom`}
            className="flex items-center px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
          >
            自定义埋点
          </a>
          <a 
            href={`/project/${projectId}/trackings`}
            className="flex items-center px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
          >
            埋点事件管理
          </a>
        </nav>
      </div>

      {/* 右侧内容区域 */}
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          <div className="mb-6">
            <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-4">
              <a href="/" className="hover:text-foreground transition-colors duration-200">
                应用首页
              </a>
              <span>/</span>
              <a href="/project" className="hover:text-foreground transition-colors duration-200">项目管理</a>
              <span>/</span>
              <span className="text-foreground font-medium">项目概览</span>
            </nav>
            <h1 className="text-2xl font-bold">项目概览</h1>
          </div>

          {/* 概览内容 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-card p-6 rounded-lg border border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">今日错误</p>
                  <p className="text-2xl font-bold">12</p>
                </div>
              </div>
            </div>

            <div className="bg-card p-6 rounded-lg border border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">影响用户</p>
                  <p className="text-2xl font-bold">156</p>
                </div>
              </div>
            </div>

            <div className="bg-card p-6 rounded-lg border border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">平均响应时间</p>
                  <p className="text-2xl font-bold">245ms</p>
                </div>
              </div>
            </div>

            <div className="bg-card p-6 rounded-lg border border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">在线用户</p>
                  <p className="text-2xl font-bold">1,234</p>
                </div>
              </div>
            </div>
          </div>

          {/* 快速操作 */}
          <div className="bg-card p-6 rounded-lg border border-border">
            <h3 className="text-lg font-semibold mb-4">快速操作</h3>
            <div className="flex space-x-4">
              <a 
                href={`/project/${projectId}/errors`}
                className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                查看错误日志
              </a>
              <a 
                href={`/project/${projectId}/performance`}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                查看性能日志
              </a>
              <a 
                href={`/project/${projectId}/custom`}
                className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                查看自定义埋点
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}