import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MockAPI, ErrorDetail } from '../../../../../../api/mockAPI';
import { ErrorInfo } from './components/ErrorInfo';
import { SourceCodeViewer } from './components/SourceCodeViewer';
import { RecordingPlayer } from './components/RecordingPlayer';

export default function ErrorDetailPage() {
  const { projectId, errorId } = useParams<{ projectId: string; errorId: string }>();
  const [errorDetail, setErrorDetail] = useState<ErrorDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchErrorDetail = async () => {
      if (!errorId) return;
      
      try {
        setIsLoading(true);
        const detail = await MockAPI.getErrorDetail(errorId);
        setErrorDetail(detail);
      } catch (error) {
        console.error('获取错误详情失败:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchErrorDetail();
  }, [errorId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg text-gray-600">加载中...</div>
      </div>
    );
  }

  if (!errorDetail) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">错误详情不存在</h1>
          <Link
            to={`/projects/${projectId}/errors-log`}
            className="text-blue-600 hover:text-blue-800"
          >
            返回错误日志
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 页面头部 */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                to={`/projects/${projectId}/errors-log`}
                className="text-gray-400 hover:text-gray-600"
              >
                ← 返回错误日志
              </Link>
              <h1 className="text-xl font-semibold text-gray-900">错误详情</h1>
            </div>
            <div className="text-sm text-gray-500">
              {errorDetail.timestamp}
            </div>
          </div>
        </div>
      </div>

      {/* 主要内容区域 */}
      <div className="flex h-screen">
        {/* 左侧：错误信息和源码 */}
        <div className="w-1/2 bg-white border-r border-gray-200 overflow-y-auto">
          <div className="p-6">
            {/* 错误基本信息 */}
            <ErrorInfo errorDetail={errorDetail} />
            
            {/* 源码堆栈 */}
            <SourceCodeViewer sourceCode={errorDetail.sourceCode} />
          </div>
        </div>

        {/* 右侧：录屏播放器 */}
        <div className="w-1/2 bg-gray-900">
          <RecordingPlayer recordingId={errorDetail.recordingId} />
        </div>
      </div>
    </div>
  );
}
