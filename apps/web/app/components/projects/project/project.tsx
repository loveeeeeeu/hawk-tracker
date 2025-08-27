import { useState, useEffect, useMemo, useCallback } from 'react';
import { Pagination } from './components/Pagination';
import { Breadcrumb } from './components/Breadcrumb';
import { PageHeader } from './components/PageHeader';
import { ProjectHeader } from './components/ProjectHeader';
import { ProjectTable } from './components/ProjectTable';
import { MockAPI, Project } from '../../../api/mockAPI';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'disabled'>('all');

  // 获取项目数据
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const projectsData = await MockAPI.getAllProjects();
        setProjects(projectsData);
      } catch (error) {
        console.error('获取项目列表失败:', error);
        setProjects([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // 过滤项目
  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           project.description.toLowerCase().includes(searchTerm.toLowerCase());
      // 注意：这里我们假设所有项目都是活跃的，因为没有status字段
      const matchesStatus = statusFilter === 'all' || statusFilter === 'active';
      return matchesSearch && matchesStatus;
    });
  }, [projects, searchTerm, statusFilter]);

  const handleView = useCallback((projectId: string) => {
    // 查看功能待实现
    alert(`查看项目: ${projectId}`);
  }, []);

  const handleTracking = useCallback((projectId: string) => {
    // 埋点功能待实现
    alert(`埋点项目: ${projectId}`);
  }, []);

  // 新建项目处理
  const handleCreateProject = useCallback(async (projectData: {
    name: string;
    description: string;
    status: 'active' | 'disabled';
  }) => {
    try {
      const newProject = await MockAPI.createProject({
        name: projectData.name,
        description: projectData.description
      });
      
      setProjects(prev => [...prev, newProject]);
      alert('项目创建成功！');
    } catch (error) {
      console.error('创建项目失败:', error);
      alert(`创建项目失败: ${error instanceof Error ? error.message : '未知错误'}`);
    }
  }, []);

  // 使用 useCallback 优化筛选器变化处理函数
  const handleStatusFilterChange = useCallback((value: 'all' | 'active' | 'disabled') => {
    setStatusFilter(value);
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
        <Breadcrumb />
        <PageHeader />
        
        <ProjectHeader
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          statusFilter={statusFilter}
          onStatusFilterChange={handleStatusFilterChange}
          onCreateProject={handleCreateProject}
        />

        <ProjectTable
          projects={filteredProjects}
          onView={handleView}
          onTracking={handleTracking}
        />

        <Pagination
          totalCount={filteredProjects.length}
          currentPage={1}
          totalPages={1}
          onPreviousPage={() => {}}
          onNextPage={() => {}}
        />
      </div>
    </div>
  );
}
