interface FilterBarProps {
  statusFilter: 'all' | 'active' | 'disabled';
  onStatusFilterChange: (value: 'all' | 'active' | 'disabled') => void;
}
//筛选框
export function FilterBar({ statusFilter, onStatusFilterChange }: FilterBarProps) {
  return (
    <div className="sm:w-48">
      <select
        value={statusFilter}
        onChange={(e) => onStatusFilterChange(e.target.value as 'all' | 'active' | 'disabled')}
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        <option value="all">全部状态</option>
        <option value="active">活跃</option>
        <option value="disabled">停用</option>
      </select>
    </div>
  );
}


