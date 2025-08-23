import { useParams } from '@react-router/client';
import { useState, useEffect } from 'react';

interface TrackingEvent {
  id: string;
  name: string;
  description: string;
  eventType: 'click' | 'pageview' | 'custom' | 'error';
  selector?: string;
  url?: string;
  customData?: Record<string, any>;
  createdAt: string;
  status: 'active' | 'inactive';
}

export default function ProjectTrackings() {
  const { id } = useParams();
  const [events, setEvents] = useState<TrackingEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    // 模拟获取追踪事件列表
    const mockEvents: TrackingEvent[] = [
      {
        id: '1',
        name: '用户登录',
        description: '追踪用户登录行为',
        eventType: 'click',
        selector: '#login-btn',
        createdAt: '2024-01-15',
        status: 'active'
      },
      {
        id: '2',
        name: '页面访问',
        description: '追踪首页访问',
        eventType: 'pageview',
        url: '/home',
        createdAt: '2024-01-16',
        status: 'active'
      },
      {
        id: '3',
        name: '购买行为',
        description: '追踪用户购买行为',
        eventType: 'custom',
        customData: { productId: '123', price: 99.99 },
        createdAt: '2024-01-17',
        status: 'active'
      },
      {
        id: '4',
        name: 'API 错误',
        description: '追踪 API 调用错误',
        eventType: 'error',
        createdAt: '2024-01-18',
        status: 'inactive'
      }
    ];

    setTimeout(() => {
      setEvents(mockEvents);
      setLoading(false);
    }, 1000);
  }, [id]);

  const getEventTypeLabel = (type: string) => {
    const labels = {
      click: '点击事件',
      pageview: '页面访问',
      custom: '自定义事件',
      error: '错误事件'
    };
    return labels[type as keyof typeof labels] || type;
  };

  const getEventTypeColor = (type: string) => {
    const colors = {
      click: 'bg-blue-100 text-blue-800',
      pageview: 'bg-green-100 text-green-800',
      custom: 'bg-purple-100 text-purple-800',
      error: 'bg-red-100 text-red-800'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">加载中...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">事件追踪</h1>
          <p className="text-gray-600 mt-2">管理和配置用户行为追踪事件</p>
        </div>
        <button 
          onClick={() => setShowCreateForm(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          新建追踪事件
        </button>
      </div>

      {/* 统计信息 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white border rounded-lg p-4">
          <div className="text-2xl font-bold text-blue-600">{events.length}</div>
          <div className="text-gray-600">总事件数</div>
        </div>
        <div className="bg-white border rounded-lg p-4">
          <div className="text-2xl font-bold text-green-600">
            {events.filter(e => e.status === 'active').length}
          </div>
          <div className="text-gray-600">活跃事件</div>
        </div>
        <div className="bg-white border rounded-lg p-4">
          <div className="text-2xl font-bold text-purple-600">
            {events.filter(e => e.eventType === 'custom').length}
          </div>
          <div className="text-gray-600">自定义事件</div>
        </div>
        <div className="bg-white border rounded-lg p-4">
          <div className="text-2xl font-bold text-orange-600">
            {events.filter(e => e.eventType === 'error').length}
          </div>
          <div className="text-gray-600">错误事件</div>
        </div>
      </div>

      {/* 事件列表 */}
      <div className="bg-white border rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h2 className="text-lg font-semibold">追踪事件列表</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  事件名称
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  类型
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  描述
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  状态
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  创建时间
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {events.map((event) => (
                <tr key={event.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{event.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getEventTypeColor(event.eventType)}`}>
                      {getEventTypeLabel(event.eventType)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{event.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      event.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {event.status === 'active' ? '活跃' : '非活跃'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {event.createdAt}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 mr-3">编辑</button>
                    <button className="text-red-600 hover:text-red-900">删除</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 创建事件表单 */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">新建追踪事件</h3>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    事件名称
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="输入事件名称"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    事件类型
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="click">点击事件</option>
                    <option value="pageview">页面访问</option>
                    <option value="custom">自定义事件</option>
                    <option value="error">错误事件</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    描述
                  </label>
                  <textarea
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="输入事件描述"
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    取消
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  >
                    创建
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}