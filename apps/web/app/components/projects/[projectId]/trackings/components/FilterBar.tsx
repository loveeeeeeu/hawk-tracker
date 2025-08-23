import { memo } from 'react';

interface FilterBarProps {
  statusFilter: 'all' | 'enabled' | 'disabled';
  onStatusFilterChange: (value: 'all' | 'enabled' | 'disabled') => void;
  typeFilter: 'all' | 'click' | 'pageview' | 'custom';
  onTypeFilterChange: (value: 'all' | 'click' | 'pageview' | 'custom') => void;
}

export const FilterBar = memo(function FilterBar({ 
  statusFilter, 
  onStatusFilterChange, 
  typeFilter, 
  onTypeFilterChange 
}: FilterBarProps) {
  return (
    <div className="flex gap-3">
      <select
        value={statusFilter}
        onChange={(e) => onStatusFilterChange(e.target.value as any)}
        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        <option value="all">全部状态</option>
        <option value="enabled">启用</option>
        <option value="disabled">停用</option>
      </select>
      
      <select
        value={typeFilter}
        onChange={(e) => onTypeFilterChange(e.target.value as any)}
        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        <option value="all">全部类型</option>
        <option value="click">点击事件</option>
        <option value="pageview">页面浏览</option>
        <option value="custom">自定义事件</option>
      </select>
    </div>
  );
});