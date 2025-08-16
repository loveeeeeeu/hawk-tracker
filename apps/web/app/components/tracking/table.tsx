import { useState, useCallback, useEffect } from "react";
import { useLoaderData, useFetcher } from "react-router";
import { TrackingEventSearch } from "./search";
import { TrackingEventCreateModal } from "./create-modal";
import { TrackingEventEditModal } from "./edit-modal";
import type { LoaderData } from "../../routes/project.$id.trackings";

export function TrackingEventTable() {
  const { project, events } = useLoaderData<LoaderData>();
  const fetcher = useFetcher();
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any>(null);
  const [deletingEvent, setDeletingEvent] = useState<any>(null);
  const [filteredEvents, setFilteredEvents] = useState(events);

  // 监听 fetcher 状态变化，处理删除、更新、切换状态等操作的成功响应
  useEffect(() => {
    if (fetcher.state === 'idle' && fetcher.data) {
      console.log('操作成功:', fetcher.data);
      // 刷新页面以获取最新数据
      window.location.reload();
    }
  }, [fetcher.state, fetcher.data]);

  const handleSearch = useCallback((searchTerm: string, statusFilter: string, typeFilter: string) => {
    let filtered = events;
    
    if (searchTerm) {
      filtered = filtered.filter(event => 
        event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(event => 
        statusFilter === 'active' ? event.active : !event.active
      );
    }
    
    if (typeFilter !== 'all') {
      filtered = filtered.filter(event => event.type === typeFilter);
    }
    
    setFilteredEvents(filtered);
  }, [events]);

  const handleEdit = (event: any) => {
    setEditingEvent(event);
    setIsEditModalOpen(true);
  };

  const handleDelete = (event: any) => {
    setDeletingEvent(event);
  };

  const confirmDelete = () => {
    if (deletingEvent) {
      const formData = new FormData();
      formData.append('action', 'delete');
      formData.append('id', deletingEvent.id);
      fetcher.submit(formData, { method: 'post' });
      setDeletingEvent(null);
    }
  };

  const cancelDelete = () => {
    setDeletingEvent(null);
  };

  const handleToggleStatus = (event: any) => {
    const formData = new FormData();
    formData.append('action', 'toggle');
    formData.append('id', event.id);
    fetcher.submit(formData, { method: 'post' });
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'click': return '点击事件';
      case 'pageview': return '页面浏览';
      case 'custom': return '自定义事件';
      default: return type;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold">项目：{project.name}</h2>
          <p className="text-sm text-muted-foreground">{project.description}</p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
        >
          添加事件
        </button>
      </div>

      <TrackingEventSearch onSearch={handleSearch} />

      <div className="border rounded-lg">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="text-left p-4 font-medium">事件名称</th>
              <th className="text-left p-4 font-medium">类型</th>
              <th className="text-left p-4 font-medium">标识符</th>
              <th className="text-left p-4 font-medium">状态</th>
              <th className="text-left p-4 font-medium">操作</th>
            </tr>
          </thead>
          <tbody>
            {filteredEvents.map((event) => (
              <tr key={event.id} className="border-b">
                <td className="p-4">
                  <div>
                    <div className="font-medium">{event.name}</div>
                    {event.description && (
                      <div className="text-sm text-muted-foreground">{event.description}</div>
                    )}
                  </div>
                </td>
                <td className="p-4">
                  <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-blue-100 text-blue-800">
                    {getTypeLabel(event.type)}
                  </span>
                </td>
                <td className="p-4 font-mono text-sm">{event.identifier}</td>
                <td className="p-4">
                  <button
                    onClick={() => handleToggleStatus(event)}
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      event.active 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {event.active ? '启用' : '停用'}
                  </button>
                </td>
                <td className="p-4 align-middle">
                  <div className="flex space-x-2">
                    <button 
                      className="text-blue-600 hover:underline"
                      onClick={() => handleEdit(event)}
                    >
                      编辑
                    </button>
                    <button 
                      className="text-red-600 hover:underline"
                      onClick={() => handleDelete(event)}
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

      <TrackingEventCreateModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)}
        projectId={project.id}
      />

      <TrackingEventEditModal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)}
        event={editingEvent}
      />

      {deletingEvent && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-background border rounded-lg shadow-lg w-96 p-6">
            <h2 className="text-lg font-semibold mb-4">确认删除</h2>
            <p className="text-muted-foreground mb-6">
              确定要删除事件 "{deletingEvent.name}" 吗？此操作不可撤销。
            </p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={cancelDelete}
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
              >
                取消
              </button>
              <button
                onClick={confirmDelete}
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-destructive text-destructive-foreground hover:bg-destructive/90 h-10 px-4 py-2"
              >
                删除
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}