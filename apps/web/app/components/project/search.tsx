import { useState, useCallback } from "react";
import type { Project } from "../../types/project";

interface ProjectSearchProps {
  onSearch: (filtered: Project[]) => void;
  originalData: Project[];
}

export function ProjectSearch({ onSearch, originalData }: ProjectSearchProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = useCallback((value: string) => {
    setSearchTerm(value);
    const filtered = originalData.filter(project =>
      project.name.toLowerCase().includes(value.toLowerCase()) ||
      project.description.toLowerCase().includes(value.toLowerCase())
    );
    onSearch(filtered);
  }, [originalData, onSearch]);

  return (
    <div className="flex items-center space-x-2">
      <input
        type="text"
        placeholder="搜索项目..."
        value={searchTerm}
        onChange={(e) => handleSearch(e.target.value)}
        className="px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
      />
    </div>
  );
}