import { useState, useEffect, useCallback } from "react";
import type { Project } from "../../types/project";

type Props = {
  originalData: Project[];
  onSearch: (filtered: Project[]) => void;
};

export function ProjectSearch({ originalData, onSearch }: Props) {
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");

  const runFilter = useCallback(() => {
    const keyword = searchText.trim();
    const filtered = originalData.filter((project) => {
      const matchesSearch =
        project.name.includes(keyword) ||
        project.description.includes(keyword);
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && project.active) ||
        (statusFilter === "inactive" && !project.active);
      return matchesSearch && matchesStatus;
    });
    onSearch(filtered);
  }, [originalData, onSearch, searchText, statusFilter]);

  useEffect(() => {
    runFilter();
  }, [runFilter]);

  return (
    <div className="flex space-x-4">
      <input
        type="text"
        placeholder="搜索项目名称或描述"
        className="flex h-10 w-64 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            runFilter();
          }
        }}
      />
      <select
        className="flex h-10 w-32 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value as any)}
      >
        <option value="all">全部状态</option>
        <option value="active">活跃</option>
        <option value="inactive">停用</option>
      </select>
    </div>
  );
}