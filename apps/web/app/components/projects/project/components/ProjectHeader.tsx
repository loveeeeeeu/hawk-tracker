import { SearchBar } from './SearchBar';
import { FilterBar } from './FilterBar';
import { CreateProjectButton } from './CreateProjectButton';

interface ProjectHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: 'all' | 'active' | 'disabled';
  onStatusFilterChange: (value: 'all' | 'active' | 'disabled') => void;
  onCreateProject: (projectData: {
    name: string;
    description: string;
    status: 'active' | 'disabled';
  }) => void;
}

// 项目头部操作区域，包含搜索、筛选和新建项目功能
export function ProjectHeader({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  onCreateProject
}: ProjectHeaderProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <SearchBar searchTerm={searchTerm} onSearchChange={onSearchChange} />
        <FilterBar statusFilter={statusFilter} onStatusFilterChange={onStatusFilterChange} />
        <CreateProjectButton onCreateProject={onCreateProject} />
      </div>
    </div>
  );
}
