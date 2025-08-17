import { LoaderFunction } from "react-router";
import { useParams } from "react-router";
import { getProject } from "@/api/project";

export const meta = () => [{ title: "错误详情" }];

export const loader: LoaderFunction = async ({ params }) => {
  const projectId = params.id;
  const errorId = params.errorId;
  
  if (!projectId || !errorId) {
    throw new Error('项目ID或错误ID不能为空');
  }
  
  const project = await getProject(projectId);
  return Response.json({ project, errorId });
};

export default function ErrorDetailPage() {
  // 使用 useParams 获取路由参数
  const { id: projectId, errorId } = useParams<{ id: string; errorId: string }>();
  
  const breadcrumbs = [
    { label: '应用首页', href: '/' },
    { label: '项目管理', href: '/project' },
    { label: '错误日志', href: `/project/${projectId}/errors` },
    { label: '错误详情' }
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
            className="flex items-center px-3 py-2 text-sm font-medium text-primary bg-primary/10 rounded-md"
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
            href={`/project/${projectId}/trackings`}
            className="flex items-center px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
          >
            自定义埋点
          </a>
          <a 
            href={`/project/${projectId}/settings`}
            className="flex items-center px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
          >
            项目设置
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
              <a href={`/project/${projectId}/errors`} className="hover:text-foreground transition-colors duration-200">错误日志</a>
              <span>/</span>
              <span className="text-foreground font-medium">错误详情</span>
            </nav>
            <h1 className="text-2xl font-bold">错误详情</h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 左侧：错误信息和源码堆栈 */}
            <div className="space-y-6">
              {/* 错误基本信息 */}
              <div className="bg-card p-6 rounded-lg border border-border">
                <h3 className="text-lg font-semibold mb-4">错误基本信息</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">事件ID:</label>
                    <p className="text-sm text-foreground">{errorId}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">错误类型:</label>
                    <p className="text-sm text-foreground">TypeError</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">错误消息:</label>
                    <p className="text-sm text-foreground">Cannot read property 'length' of undefined</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">发生时间:</label>
                    <p className="text-sm text-foreground">2024-01-15 14:30:23</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">页面URL:</label>
                    <p className="text-sm text-foreground">https://example.com/product/list</p>
                  </div>
                </div>
              </div>

              {/* 源码堆栈 */}
              <div className="bg-card p-6 rounded-lg border border-border">
                <h3 className="text-lg font-semibold mb-4">源码堆栈</h3>
                <div className="bg-muted p-4 rounded-md">
                  <pre className="text-sm text-foreground overflow-x-auto">
{`TypeError: Cannot read property 'length' of undefined
    at renderProductList (productList.js:45:12)
    at ProductList.render (ProductList.jsx:23:8)
    at ReactDOM.render (react-dom.js:123:45)
    at mountComponent (app.js:67:12)`}
                  </pre>
                </div>
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">productList.js:45</h4>
                  <div className="bg-muted p-3 rounded-md">
                    <pre className="text-sm text-foreground">
{`// 第43行
function renderProductList(products) {
  // 第45行 - 错误发生在这里
  const productCount = products.length; // TypeError: Cannot read property 'length' of undefined
  return \`共找到 \${productCount} 个商品\`;
}`}
                    </pre>
                  </div>
                </div>
              </div>
            </div>

            {/* 右侧：录屏播放器 */}
            <div className="bg-card p-6 rounded-lg border border-border">
              <h3 className="text-lg font-semibold mb-4">用户操作录屏</h3>
              <div className="bg-muted rounded-lg p-4 h-96 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
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