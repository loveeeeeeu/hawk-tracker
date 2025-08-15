import { useEffect, useState, useCallback } from "react";
import { useLoaderData, useFetcher } from "react-router";
import { ProjectSearch } from "./search";
import { ProjectCreateModal } from "./create-modal";
import { ProjectEditModal } from "./edit-modal";
import type { Project } from "../../types/project";

export function ProjectTable() {
  const { projects } = useLoaderData() as { projects: Project[] };
  const [filteredProjects, setFilteredProjects] = useState(projects);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [deletingProject, setDeletingProject] = useState<Project | null>(null);
  
  const fetcher = useFetcher();

  const [page, setPage] = useState(1);
  const pageSize = 10;
  const totalPages = Math.max(1, Math.ceil(filteredProjects.length / pageSize));

  useEffect(() => {
    setPage(1);
  }, [filteredProjects]);

  const currentPageData = filteredProjects.slice((page - 1) * pageSize, page * pageSize);

  const handleSearch = useCallback((filtered: Project[]) => {
    setFilteredProjects(filtered);
  }, []);

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setIsEditModalOpen(true);
  };

  const handleDelete = (project: Project) => {
    setDeletingProject(project);
  };

  const confirmDelete = () => {
    if (!deletingProject) return;
    
    fetcher.submit(
      { action: 'delete', id: deletingProject.id },
      { method: 'post' }
    );
    setDeletingProject(null);
  };

  const cancelDelete = () => {
    setDeletingProject(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <ProjectSearch
          onSearch={handleSearch}
          originalData={projects}
        />
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md transition-colors"
        >
          新建项目
        </button>
      </div>

      <div className="border rounded-lg">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">项目名称</th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">描述</th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">状态</th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">创建时间</th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">操作</th>
            </tr>
          </thead>
          <tbody>
            {currentPageData.map((project) => (
              <tr key={project.id} className="border-b transition-colors hover:bg-muted/50">
                <td className="p-4 align-middle font-medium">{project.name}</td>
                <td className="p-4 align-middle text-muted-foreground">{project.description}</td>
                <td className="p-4 align-middle">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      project.active 
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" 
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {project.active ? "活跃" : "停用"}
                  </span>
                </td>
                <td className="p-4 align-middle text-muted-foreground">{project.createdAt}</td>
                <td className="p-4 align-middle">
                  <div className="flex space-x-2">
                    <a className="text-primary hover:underline" href={`/project/${project.id}`}>查看</a>
                    <button 
                      className="text-blue-600 hover:underline"
                      onClick={() => handleEdit(project)}
                    >
                      编辑
                    </button>
                    <button 
                      className="text-red-600 hover:underline"
                      onClick={() => handleDelete(project)}
                    >
                      删除
                    </button>
                    <a className="text-muted-foreground hover:underline" href={`/project/${project.id}/settings`}>设置</a>
                    <a className="text-green-600 hover:underline" href={`/project/${project.id}/trackings`}>埋点</a>
                  </div>
                </td>
              </tr>
            ))}
            {currentPageData.length === 0 && (
              <tr>
                <td className="p-4 text-center text-muted-foreground" colSpan={5}>
                  暂无数据
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          共 {filteredProjects.length} 条，页码 {page}/{totalPages}
        </div>
        <div className="flex space-x-2">
          <button
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            上一页
          </button>
          <button
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            下一页
          </button>
        </div>
      </div>

      <ProjectCreateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      {editingProject && (
        <ProjectEditModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingProject(null);
          }}
          project={editingProject}
        />
      )}

      {/* 删除确认对话框 */}
      {deletingProject && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-background border rounded-lg shadow-lg w-96 p-6">
            <h2 className="text-lg font-semibold mb-4">确认删除</h2>
            <p className="text-muted-foreground mb-6">
              确定要删除项目 "{deletingProject.name}" 吗？此操作不可撤销。
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