import { LoaderFunction } from "react-router";
import { useParams } from "react-router";
import { getProject } from "@/api/project";

export const meta = () => [{ title: "自定义埋点详情" }];

export const loader: LoaderFunction = async ({ params }) => {
  const projectId = params.id;
  const eventId = params.eventId;
  
  if (!projectId || !eventId) {
    throw new Error('项目ID或事件ID不能为空');
  }
  
  const project = await getProject(projectId);
  return Response.json({ project, eventId });
};

export default function CustomTrackingDetailPage() {
  const { id: projectId, eventId } = useParams<{ id: string; eventId: string }>();
  
  if (!projectId || !eventId) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">错误</h1>
          <p className="text-muted-foreground">项目ID或事件ID不能为空</p>
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
    { label: '自定义埋点', href: `/project/${projectId}/custom` },
    { label: '事件详情' }
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
            className="flex items-center px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
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
            className="flex items-center px-3 py-2 text-sm font-medium text-primary bg-primary/10 rounded-md"
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
              <a href={`/project/${projectId}/custom`} className="hover:text-foreground transition-colors duration-200">自定义埋点</a>
              <span>/</span>
              <span className="text-foreground font-medium">事件详情</span>
            </nav>
            <h1 className="text-2xl font-bold">自定义埋点详情</h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 左侧：事件信息和数据 */}
            <div className="space-y-6">
              {/* 事件基本信息 */}
              <div className="bg-card p-6 rounded-lg border border-border">
                <h3 className="text-lg font-semibold mb-4">事件基本信息</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">事件ID:</label>
                    <p className="text-sm text-foreground">{eventId}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">事件名称:</label>
                    <p className="text-sm text-foreground">用户注册事件</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">事件标识符:</label>
                    <p className="text-sm text-foreground">user_register</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">触发次数:</label>
                    <p className="text-sm text-foreground">1,234</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">影响用户:</label>
                    <p className="text-sm text-foreground">567</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">最后触发时间:</label>
                    <p className="text-sm text-foreground">2024-01-15 14:30:25</p>
                  </div>
                </div>
              </div>

              {/* 事件数据 */}
              <div className="bg-card p-6 rounded-lg border border-border">
                <h3 className="text-lg font-semibold mb-4">事件数据</h3>
                <div className="bg-muted p-4 rounded-md">
                  <pre className="text-sm text-foreground overflow-x-auto">
{`{
  "eventId": "user_register",
  "timestamp": "2024-01-15 14:30:23",
  "userId": "user_123",
  "properties": {
    "registerMethod": "email",
    "source": "landing_page",
    "referrer": "google.com",
    "utm_source": "google",
    "utm_medium": "cpc"
  },
  "pageInfo": {
    "url": "https://example.com/register",
    "title": "用户注册",
    "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
  },
  "deviceInfo": {
    "screenWidth": 1920,
    "screenHeight": 1080,
    "language": "zh-CN",
    "timezone": "Asia/Shanghai"
  }
}`}
                  </pre>
                </div>
              </div>
            </div>

            {/* 右侧：用户操作录屏 */}
            <div className="bg-card p-6 rounded-lg border border-border">
              <h3 className="text-lg font-semibold mb-4">用户操作录屏</h3>
              <div className="bg-muted rounded-lg p-4 h-96 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="text-sm text-muted-foreground">录屏播放器</p>
                  <p className="text-xs text-muted-foreground mt-2">rrweb 录屏回放功能</p>
                  <button className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
                    播放录屏
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}