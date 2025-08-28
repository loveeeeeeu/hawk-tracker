import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MockAPI, Project, ErrorLog } from '../../../../../api/mockAPI';
import { trackError } from '../../../../../monitor'; // 导入真实的监控SDK

export default function ErrorLogsPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [errorLogs, setErrorLogs] = useState<ErrorLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorCount, setErrorCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      if (!projectId) return;
      
      try {
        const [projectData, logsData] = await Promise.all([
          MockAPI.getProject(projectId),
          MockAPI.getErrorLogs(projectId)
        ]);
        
        setProject(projectData);
        setErrorLogs(logsData);
      } catch (error) {
        console.error('获取错误日志失败:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [projectId]);

  // 测试错误功能 - 修改为使用真实的Hawk Tracker SDK
  const testError = async (errorType: string) => {
    if (!projectId) return;
    
    try {
      // 使用真实的Hawk Tracker SDK上报错误
      let testError: Error;
      
      switch (errorType) {
        case 'TypeError':
          testError = new TypeError('这是一个TypeError测试错误');
          break;
        case 'ReferenceError':
          testError = new ReferenceError('这是一个ReferenceError测试错误');
          break;
        case '手动错误':
          testError = new Error('这是一个手动触发的测试错误');
          break;
        case '异步错误':
          // 模拟异步错误
          setTimeout(() => {
            const asyncError = new Error('这是一个异步测试错误');
            trackError(asyncError, { 
              errorType: 'async',
              projectId,
              testMode: true 
            });
          }, 100);
          setErrorCount(prev => prev + 1);
          alert(`${errorType}错误测试已触发！`);
          return;
        default:
          testError = new Error(`测试${errorType}错误`);
      }
      
      // 使用真实的监控SDK上报错误
      trackError(testError, { 
        errorType,
        projectId,
        testMode: true,
        currentPageUrl: window.location.href
      });
      
      // 同时添加到本地状态用于显示
      const errorLog = {
        id: `evt-${Date.now()}`,
        eventId: `evt-${Date.now()}`,
        eventType: `${errorType}测试错误`,
        currentPageUrl: window.location.href,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        errorMessage: testError.message,
        stackTrace: testError.stack || `at test${errorType} (test.js:1)\nat handleTest (test.js:5)`
      };
      
      setErrorLogs(prev => [errorLog, ...prev]);
      setErrorCount(prev => prev + 1);
      
      alert(`${errorType}错误测试成功！已通过Hawk Tracker SDK上报`);
    } catch (error) {
      console.error('测试错误失败:', error);
      alert('测试错误失败，请重试！');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg text-gray-600">加载中...</div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* 面包屑导航 */}
      <nav className="flex mb-6" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-3">
          <li className="inline-flex items-center">
            <Link to="/" className="text-gray-700 hover:text-blue-600 transition-colors">
              应用首页
            </Link>
          </li>
          <li>
            <div className="flex items-center">
              <span className="mx-2 text-gray-400">/</span>
              <Link to="/projects" className="text-gray-700 hover:text-blue-600 transition-colors">
                项目管理
              </Link>
            </div>
          </li>
          <li>
            <div className="flex items-center">
              <span className="mx-2 text-gray-400">/</span>
              <span className="text-gray-900 font-medium">错误日志</span>
            </div>
          </li>
        </ol>
      </nav>

      {/* 页面标题 */}
      <h1 className="text-3xl font-bold text-gray-900 mb-8">错误日志</h1>

      {/* Hawk Tracker 错误测试 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Hawk Tracker 错误测试</h2>
        <p className="text-sm text-gray-600 mb-4">
          点击下面的按钮来测试Hawk Tracker的错误捕获功能。这些错误会被ErrorPlugin捕获并上报。
        </p>
        <p className="text-sm text-gray-600 mb-6">
          已触发错误次数: <span className="font-medium text-red-600">{errorCount}</span>
        </p>
        
        <div className="flex flex-wrap gap-4">
          <button
            onClick={() => testError('TypeError')}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
          >
            测试 TypeError
          </button>
          <button
            onClick={() => testError('ReferenceError')}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors"
          >
            测试 ReferenceError
          </button>
          <button
            onClick={() => testError('手动错误')}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
          >
            测试手动错误
          </button>
          <button
            onClick={() => testError('异步错误')}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            测试异步错误
          </button>
        </div>
      </div>

      {/* 错误事件列表 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">错误事件列表</h2>
        <p className="text-sm text-gray-600 mb-6">
          错误事件的捕获会有延迟,特别是在开启了批量错误的情况下,一般会有2s延迟
        </p>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  序号
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  事件ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  事件类型
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  当前页面URL
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  时间
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {errorLogs.map((log, index) => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">
                    {log.eventId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                      {log.eventType}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                    {log.currentPageUrl}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {log.timestamp}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Link
                      to={`/projects/${projectId}/errors-log/${log.id}`}
                      className="text-blue-600 hover:text-blue-900 transition-colors"
                    >
                      详情
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {errorLogs.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">暂无错误日志</p>
          </div>
        )}
      </div>
    </div>
  );
}
