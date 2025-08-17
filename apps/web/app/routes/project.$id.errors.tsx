import { type LoaderFunction } from 'react-router';
import { useParams } from 'react-router';
import { useState } from 'react';
import { getProject } from '../api/project';

export const meta = () => [{ title: "错误日志" }];

export const loader: LoaderFunction = async ({ params }) => {
  const projectId = params.id;
  if (!projectId) throw new Error('项目ID不能为空');
  
  const project = await getProject(projectId);
  return Response.json({ project });
};

export default function ProjectErrorsPage() {
  const { id: projectId } = useParams<{ id: string }>();
  const [errorCount, setErrorCount] = useState(0);
  
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
    { label: '错误日志' }
  ];

  const errorColumns = [
    '序号', '事件ID', '事件类型', '当前页面URL', '事件发送时间', '事件发生时间',
    '错误信息', '完整错误信息', '错误行', '错误列', '是否为批量错误',
    '批量错误最后发生时间', '批量错误-错误个数', '资源请求链接', '操作'
  ];

  const mockErrors = [
    {
      id: 'evt-001',
      type: '普通错误事件',
      url: 'https://example.com/product/list',
      message: 'Cannot read property \'length\' of undefined',
      fullMessage: 'TypeError: Cannot read property \'length\' of undefined at productList.js:45:12',
      line: 45,
      column: 12,
      sendTime: '2024-01-15 14:30:25',
      occurTime: '2024-01-15 14:30:23'
    }
  ];

  // Hawk Tracker 错误测试功能
  const testErrors = {
    typeError: () => {
      console.log('🦅 测试: 触发 TypeError');
      const obj = {};
      // @ts-ignore
      obj.split('/');
    },
    referenceError: () => {
      console.log('🦅 测试: 触发 ReferenceError');
      // @ts-ignore
      nonExistentVariable.someMethod();
    },
    manualError: () => {
      console.log('🦅 测试: 手动抛出错误');
      throw new Error('手动测试错误 - 来自错误日志页面');
    },
    asyncError: async () => {
      console.log('🦅 测试: 触发异步错误');
      try {
        const response = await fetch('/non-existent-api');
        const data = await response.json();
        console.log(data);
      } catch (error) {
        console.error('🦅 异步错误:', error);
        throw error;
      }
    }
  };

  const handleTestError = (errorType: keyof typeof testErrors) => {
    setErrorCount(prev => prev + 1);
    console.log(` 开始测试 ${errorType} 错误...`);
    
    // 直接调用，让 SDK 自动捕获错误
    testErrors[errorType]();
  };

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
              <span className="text-foreground font-medium">错误日志</span>
            </nav>
            <h1 className="text-2xl font-bold">错误日志</h1>
          </div>
          
          {/* Hawk Tracker 测试区域 */}
          <div className="bg-card rounded-lg border border-border p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">🦅 Hawk Tracker 错误测试</h2>
            <p className="text-sm text-muted-foreground mb-4">
              点击下面的按钮来测试Hawk Tracker的错误捕获功能。这些错误会被ErrorPlugin捕获并上报。
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              已触发错误次数: <span className="font-mono text-foreground">{errorCount}</span>
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <button
                onClick={() => handleTestError('typeError')}
                className="p-3 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm"
              >
                测试 TypeError
              </button>
              <button
                onClick={() => handleTestError('referenceError')}
                className="p-3 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors text-sm"
              >
                测试 ReferenceError
              </button>
              <button
                onClick={() => handleTestError('manualError')}
                className="p-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm"
              >
                测试手动错误
              </button>
              <button
                onClick={() => handleTestError('asyncError')}
                className="p-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
              >
                测试异步错误
              </button>
            </div>
          </div>
          
          {/* 原有的错误日志表格 */}
          <div className="bg-card rounded-lg border border-border">
            <div className="p-6 border-b border-border">
              <h2 className="text-lg font-semibold">错误事件列表</h2>
              <p className="text-sm text-muted-foreground mt-2">
                错误事件的捕获会有延迟，特别是在开启了批量错误的情况下，一般会有2s延迟
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    {errorColumns.map((column) => (
                      <th key={column} className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        {column}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {mockErrors.map((error, index) => (
                    <tr key={error.id} className="hover:bg-muted/50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">{index + 1}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">{error.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          {error.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-foreground">{error.url}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{error.sendTime}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{error.occurTime}</td>
                      <td className="px-6 py-4 text-sm text-foreground">{error.message}</td>
                      <td className="px-6 py-4 text-sm text-foreground">{error.fullMessage}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">{error.line}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">{error.column}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">否</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">-</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">-</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">-</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <a href={`/project/${projectId}/errors/${error.id}`} className="text-primary hover:text-primary/80 transition-colors">
                          详情
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}