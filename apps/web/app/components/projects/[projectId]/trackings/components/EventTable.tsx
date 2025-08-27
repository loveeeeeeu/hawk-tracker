import { memo } from 'react';

interface TrackingEvent {
  id: string;
  name: string;
  description: string;
  type: 'click' | 'pageview' | 'custom';
  identifier: string;
  status: 'enabled' | 'disabled';
  createdAt: string;
}

interface EventTableProps {
  events: TrackingEvent[];
  onEdit: (eventId: string) => void;
  onDelete: (eventId: string) => void;
}

export const EventTable = memo(function EventTable({ events, onEdit, onDelete }: EventTableProps) {
  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'click': return '点击事件';
      case 'pageview': return '页面浏览';
      case 'custom': return '自定义事件';
      default: return type;
    }
  };

  const getStatusLabel = (status: string) => {
    return status === 'enabled' ? '启用' : '停用';
  };

  const getStatusClass = (status: string) => {
    return status === 'enabled' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-gray-100 text-gray-800';
  };

  const getTypeClass = () => {
    return 'bg-blue-100 text-blue-800';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                事件名称
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                类型
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                标识符
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                状态
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                操作
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {events.map((event) => (
              <tr key={event.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">{event.name}</div>
                  <div className="text-sm text-gray-500">{event.description}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeClass()}`}>
                    {getTypeLabel(event.type)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">
                  {event.identifier}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusClass(event.status)}`}>
                    {getStatusLabel(event.status)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-3">
                    <button
                      onClick={() => onEdit(event.id)}
                      className="text-blue-600 hover:text-blue-900 transition-colors"
                    >
                      编辑
                    </button>
                    <button
                      onClick={() => onDelete(event.id)}
                      className="text-red-600 hover:text-red-900 transition-colors"
                    >
                      删除
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
});