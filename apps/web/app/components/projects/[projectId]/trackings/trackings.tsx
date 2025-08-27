import { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Breadcrumb } from './components/Breadcrumb';
import { PageHeader } from './components/PageHeader';
import { TrackingHeader } from './components/TrackingHeader';
import { EventTable } from './components/EventTable';
import { Pagination } from './components/Pagination';
import { EditEventModal } from './components/EditEventModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { MockAPI, TrackingEvent, Project } from '../../../../api/mockAPI';

export default function TrackingsPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const [events, setEvents] = useState<TrackingEvent[]>([]);
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'enabled' | 'disabled'>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | 'click' | 'pageview' | 'custom'>('all');
  
  // 模态框状态
  const [editModal, setEditModal] = useState<{
    isOpen: boolean;
    event: TrackingEvent | null;
  }>({
    isOpen: false,
    event: null
  });
  
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    eventName: string;
    eventId: string;
  }>({
    isOpen: false,
    eventName: '',
    eventId: ''
  });

  // 获取项目信息
  useEffect(() => {
    const fetchProject = async () => {
      if (!projectId) return;
      
      try {
        const projectData = await MockAPI.getProject(projectId);
        setProject(projectData);
      } catch (error) {
        console.error('获取项目信息失败:', error);
        // 设置默认项目信息
        setProject({
          id: projectId,
          name: '未知项目',
          description: '项目信息不存在'
        });
      }
    };

    fetchProject();
  }, [projectId]);

  // 获取埋点事件数据
  useEffect(() => {
    const fetchEvents = async () => {
      if (!projectId) return;
      
      try {
        const eventsData = await MockAPI.getEvents(projectId);
        setEvents(eventsData);
      } catch (error) {
        console.error('获取埋点事件失败:', error);
        setEvents([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, [projectId]);

  // 使用 useMemo 优化过滤逻辑
  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      const matchesSearch = event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           event.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || event.status === statusFilter;
      const matchesType = typeFilter === 'all' || event.type === typeFilter;
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [events, searchTerm, statusFilter, typeFilter]);

  // 编辑事件处理
  const handleEdit = useCallback((eventId: string) => {
    const event = events.find(e => e.id === eventId);
    if (event) {
      setEditModal({
        isOpen: true,
        event
      });
    }
  }, [events]);

  // 保存编辑的事件
  const handleSaveEvent = useCallback(async (eventData: Omit<TrackingEvent, 'id' | 'createdAt'>) => {
    if (!projectId || !editModal.event) return;
    
    try {
      const updatedEvent = await MockAPI.updateEvent(projectId, editModal.event.id, eventData);
      
      // 更新本地状态
      setEvents(prev => prev.map(event => 
        event.id === editModal.event!.id 
          ? updatedEvent
          : event
      ));
      
      alert('事件更新成功！');
    } catch (error) {
      console.error('更新事件失败:', error);
      alert(`更新事件失败: ${error instanceof Error ? error.message : '未知错误'}`);
    }
  }, [editModal.event, projectId]);

  // 删除事件处理
  const handleDelete = useCallback((eventId: string) => {
    const event = events.find(e => e.id === eventId);
    if (event) {
      setDeleteModal({
        isOpen: true,
        eventName: event.name,
        eventId
      });
    }
  }, [events]);

  // 确认删除事件
  const handleConfirmDelete = useCallback(async () => {
    if (!projectId) return;
    
    try {
      await MockAPI.deleteEvent(projectId, deleteModal.eventId);
      
      // 更新本地状态
      setEvents(prev => prev.filter(event => event.id !== deleteModal.eventId));
      alert('事件删除成功！');
    } catch (error) {
      console.error('删除事件失败:', error);
      alert(`删除事件失败: ${error instanceof Error ? error.message : '未知错误'}`);
    }
  }, [deleteModal.eventId, projectId]);

  // 添加新事件
  const handleAddEvent = useCallback(async (eventData: {
    name: string;
    description: string;
    type: 'click' | 'pageview' | 'custom';
    identifier: string;
    status: 'enabled' | 'disabled';
  }) => {
    if (!projectId) return;
    
    try {
      const newEvent = await MockAPI.createEvent(projectId, eventData);
      
      // 更新本地状态
      setEvents(prev => [...prev, newEvent]);
      alert('事件添加成功！');
    } catch (error) {
      console.error('创建事件失败:', error);
      alert(`创建事件失败: ${error instanceof Error ? error.message : '未知错误'}`);
    }
  }, [projectId]);

  // 使用 useCallback 优化筛选器变化处理函数
  const handleStatusFilterChange = useCallback((value: 'all' | 'enabled' | 'disabled') => {
    setStatusFilter(value);
  }, []);

  const handleTypeFilterChange = useCallback((value: 'all' | 'click' | 'pageview' | 'custom') => {
    setTypeFilter(value);
  }, []);

  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg text-gray-600">加载中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <Breadcrumb projectName={project?.name} />
        <PageHeader project={project} />
        
        <TrackingHeader
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          statusFilter={statusFilter}
          onStatusFilterChange={handleStatusFilterChange}
          typeFilter={typeFilter}
          onTypeFilterChange={handleTypeFilterChange}
          onAddEvent={handleAddEvent}
        />

        <EventTable
          events={filteredEvents}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        <Pagination
          totalCount={filteredEvents.length}
          currentPage={1}
          totalPages={1}
          onPreviousPage={() => {}}
          onNextPage={() => {}}
        />

        {/* 编辑事件模态框 */}
        <EditEventModal
          event={editModal.event}
          isOpen={editModal.isOpen}
          onClose={() => setEditModal({ isOpen: false, event: null })}
          onSave={handleSaveEvent}
        />

        {/* 删除确认模态框 */}
        <DeleteConfirmModal
          eventName={deleteModal.eventName}
          isOpen={deleteModal.isOpen}
          onClose={() => setDeleteModal({ isOpen: false, eventName: '', eventId: '' })}
          onConfirm={handleConfirmDelete}
        />
      </div>
    </div>
  );
}