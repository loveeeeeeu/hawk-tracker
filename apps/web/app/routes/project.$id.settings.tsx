import { useParams } from '@react-router/client';
import { useState, useEffect } from 'react';

interface ProjectSettings {
  id: string;
  name: string;
  description: string;
  dsn: string;
  environment: 'development' | 'staging' | 'production';
  errorThreshold: number;
  performanceThreshold: number;
  notifications: {
    email: boolean;
    slack: boolean;
    webhook: string;
  };
}

export default function ProjectSettings() {
  const { id } = useParams();
  const [settings, setSettings] = useState<ProjectSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // 模拟获取项目设置
    const mockSettings: ProjectSettings = {
      id: id || '1',
      name: 'Hawk Tracker Web',
      description: '前端错误监控系统',
      dsn: 'https://your-dsn.com/api/data',
      environment: 'production',
      errorThreshold: 10,
      performanceThreshold: 3000,
      notifications: {
        email: true,
        slack: false,
        webhook: 'https://your-webhook.com/notify'
      }
    };

    setTimeout(() => {
      setSettings(mockSettings);
      setLoading(false);
    }, 1000);
  }, [id]);

  const handleSave = async () => {
    if (!settings) return;
    
    setSaving(true);
    // 模拟保存设置
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSaving(false);
    alert('设置已保存');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">加载中...</div>
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-red-500">项目不存在</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">项目设置</h1>
        <p className="text-gray-600 mt-2">配置项目的基本信息和监控参数</p>
      </div>

      <div className="max-w-4xl">
        {/* 基本信息 */}
        <div className="bg-white border rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">基本信息</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                项目名称
              </label>
              <input
                type="text"
                value={settings.name}
                onChange={(e) => setSettings({...settings, name: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                环境
              </label>
              <select
                value={settings.environment}
                onChange={(e) => setSettings({...settings, environment: e.target.value as any})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="development">开发环境</option>
                <option value="staging">测试环境</option>
                <option value="production">生产环境</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                项目描述
              </label>
              <textarea
                value={settings.description}
                onChange={(e) => setSettings({...settings, description: e.target.value})}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* DSN 配置 */}
        <div className="bg-white border rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">DSN 配置</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Data Source Name (DSN)
            </label>
            <input
              type="text"
              value={settings.dsn}
              onChange={(e) => setSettings({...settings, dsn: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://your-dsn.com/api/data"
            />
            <p className="text-sm text-gray-500 mt-1">
              这是用于接收错误数据的端点地址
            </p>
          </div>
        </div>

        {/* 阈值设置 */}
        <div className="bg-white border rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">监控阈值</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                错误阈值 (每分钟)
              </label>
              <input
                type="number"
                value={settings.errorThreshold}
                onChange={(e) => setSettings({...settings, errorThreshold: parseInt(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                性能阈值 (毫秒)
              </label>
              <input
                type="number"
                value={settings.performanceThreshold}
                onChange={(e) => setSettings({...settings, performanceThreshold: parseInt(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* 通知设置 */}
        <div className="bg-white border rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">通知设置</h2>
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="email-notify"
                checked={settings.notifications.email}
                onChange={(e) => setSettings({
                  ...settings, 
                  notifications: {...settings.notifications, email: e.target.checked}
                })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="email-notify" className="ml-2 block text-sm text-gray-900">
                邮件通知
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="slack-notify"
                checked={settings.notifications.slack}
                onChange={(e) => setSettings({
                  ...settings, 
                  notifications: {...settings.notifications, slack: e.target.checked}
                })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="slack-notify" className="ml-2 block text-sm text-gray-900">
                Slack 通知
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Webhook URL
              </label>
              <input
                type="text"
                value={settings.notifications.webhook}
                onChange={(e) => setSettings({
                  ...settings, 
                  notifications: {...settings.notifications, webhook: e.target.value}
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://your-webhook.com/notify"
              />
            </div>
          </div>
        </div>

        {/* 保存按钮 */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white px-6 py-2 rounded-md transition-colors"
          >
            {saving ? '保存中...' : '保存设置'}
          </button>
        </div>
      </div>
    </div>
  );
}