import { SearchBar } from './SearchBar';
import { FilterBar } from './FilterBar';
import { AddEventButton } from './AddEventButton';

interface TrackingHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: 'all' | 'enabled' | 'disabled';
  onStatusFilterChange: (value: 'all' | 'enabled' | 'disabled') => void;
  typeFilter: 'all' | 'click' | 'pageview' | 'custom';
  onTypeFilterChange: (value: 'all' | 'click' | 'pageview' | 'custom') => void;
  onAddEvent: () => void;
}
// 项目头部操作区域
export function TrackingHeader({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  typeFilter,
  onTypeFilterChange,
  onAddEvent
}: TrackingHeaderProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <SearchBar searchTerm={searchTerm} onSearchChange={onSearchChange} />
        <FilterBar 
          statusFilter={statusFilter} 
          onStatusFilterChange={onStatusFilterChange}
          typeFilter={typeFilter}
          onTypeFilterChange={onTypeFilterChange}
        />
        <AddEventButton onAddEvent={onAddEvent} />
      </div>
    </div>
  );
}