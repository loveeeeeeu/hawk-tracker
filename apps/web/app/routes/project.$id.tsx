import { Link, useParams } from '@react-router/client';
import { useState, useEffect } from 'react';

interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  status: 'active' | 'inactive';
  errorCount: number;
  userCount: number;
  lastErrorTime?: string;
}

export default function ProjectDetail() {
  const { id } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 模拟获取项目详情
    const mockProject: Project = {
      id: id || '1',
      name: 'Hawk Tracker Web',
      description: '前端错误监控系统，提供实时的错误监控和性能分析功能',
      createdAt: '2024-01-15',
      status: 'active',
      errorCount: 156,
      userCount: 1234,
      lastErrorTime: '2024-01-30 14:30:25'
    };

    setTimeout(() => {
      setProject(mockProject);
      setLoading(false);
    }, 1000);
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">加载中...</div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-red-500">项目不存在</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link to="/project" className="text-blue-500 hover:text-blue-600 mb-4 inline-block">
          ← 返回项目列表
        </Link>
        <h1 className="text-3xl font-bold">{project.name}</h1>
        <p className="text-gray-600 mt-2">{project.description}</p>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white border rounded-lg p-4">
          <div className="text-2xl font-bold text-blue-600">{project.errorCount}</div>
          <div className="text-gray-600">总错误数</div>
        </div>
        <div className="bg-white border rounded-lg p-4">
          <div className="text-2xl font-bold text-green-600">{project.userCount}</div>
          <div className="text-gray-600">活跃用户</div>
        </div>
        <div className="bg-white border rounded-lg p-4">
          <div className="text-2xl font-bold text-orange-600">
            {project.lastErrorTime ? '有' : '无'}
          </div>
          <div className="text-gray-600">最新错误</div>
        </div>
        <div className="bg-white border rounded-lg p-4">
          <div className="text-2xl font-bold text-purple-600">
            {project.status === 'active' ? '活跃' : '非活跃'}
          </div>
          <div className="text-gray-600">项目状态</div>
        </div>
      </div>

      {/* 导航菜单 */}
      <div className="bg-white border rounded-lg p-4 mb-8">
        <h2 className="text-xl font-semibold mb-4">项目功能</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link 
            to={`/project/${project.id}/overview`}
            className="text-center p-4 border rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="text-2xl mb-2">📊</div>
            <div className="font-medium">概览</div>
          </Link>
          <Link 
            to={`/project/${project.id}/errors`}
            className="text-center p-4 border rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="text-2xl mb-2">🚨</div>
            <div className="font-medium">错误监控</div>
          </Link>
          <Link 
            to={`/project/${project.id}/performance`}
            className="text-center p-4 border rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="text-2xl mb-2">⚡</div>
            <div className="font-medium">性能分析</div>
          </Link>
          <Link 
            to={`/project/${project.id}/users`}
            className="text-center p-4 border rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="text-2xl mb-2">👥</div>
            <div className="font-medium">用户分析</div>
          </Link>
        </div>
      </div>

      {/* 项目信息 */}
      <div className="bg-white border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">项目信息</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">项目ID</label>
            <p className="mt-1 text-sm text-gray-900">{project.id}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">创建时间</label>
            <p className="mt-1 text-sm text-gray-900">{project.createdAt}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">项目状态</label>
            <p className="mt-1 text-sm text-gray-900">
              <span className={`px-2 py-1 rounded text-xs ${
                project.status === 'active' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {project.status === 'active' ? '活跃' : '非活跃'}
              </span>
            </p>
          </div>
          {project.lastErrorTime && (
            <div>
              <label className="block text-sm font-medium text-gray-700">最新错误时间</label>
              <p className="mt-1 text-sm text-gray-900">{project.lastErrorTime}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}