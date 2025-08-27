import { useState, useEffect } from 'react';
import { MockAPI } from '../../../../../../../api/mockAPI';

interface RecordingPlayerProps {
  recordingId: string;
}
//创建录屏播放器组件
export function RecordingPlayer({ recordingId }: RecordingPlayerProps) {
  const [recording, setRecording] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRecording = async () => {
      try {
        setIsLoading(true);
        const data = await MockAPI.getRecording(recordingId);
        setRecording(data);
      } catch (error) {
        console.error('获取录屏数据失败:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecording();
  }, [recordingId]);

  const handlePlay = () => {
    setIsPlaying(true);
    // 这里应该实现实际的录屏播放逻辑
    console.log('开始播放录屏:', recordingId);
  };

  const handlePause = () => {
    setIsPlaying(false);
    // 这里应该实现暂停逻辑
    console.log('暂停录屏播放');
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-white">加载录屏数据中...</div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* 播放器头部 */}
      <div className="bg-gray-800 px-4 py-3 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <h3 className="text-white font-medium">用户操作录屏</h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={isPlaying ? handlePause : handlePlay}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition-colors"
            >
              {isPlaying ? '暂停' : '播放'}
            </button>
          </div>
        </div>
      </div>

      {/* 播放器主体 */}
      <div className="flex-1 bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
            </svg>
            <p className="text-lg">rrweb 录屏播放器</p>
            <p className="text-sm mt-2">点击播放按钮开始回放用户操作</p>
          </div>
          
          {recording && (
            <div className="text-gray-500 text-sm">
              <p>录屏ID: {recording.id}</p>
              <p>事件数量: {recording.events?.length || 0}</p>
            </div>
          )}
        </div>
      </div>

      {/* 播放器底部控制栏 */}
      <div className="bg-gray-800 px-4 py-3 border-t border-gray-700">
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentTime / 100) * 100}%` }}
              ></div>
            </div>
          </div>
          <div className="text-white text-sm">
            {Math.floor(currentTime)}s / 100s
          </div>
        </div>
      </div>
    </div>
  );
}