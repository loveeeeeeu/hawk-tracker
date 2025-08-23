import { useState, useEffect } from "react";
import { useFetcher } from "react-router";
import type { Project } from "../../types/project";

interface ProjectEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
}

export function ProjectEditModal({ isOpen, onClose, project }: ProjectEditModalProps) {
  const [formData, setFormData] = useState({
    name: project.name,
    description: project.description,
    active: project.active
  });
  
  const fetcher = useFetcher();

  useEffect(() => {
    setFormData({
      name: project.name,
      description: project.description,
      active: project.active
    });
  }, [project]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetcher.submit(
      { 
        action: 'update',
        id: project.id,
        ...formData 
      },
      { method: 'post' }
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-background border rounded-lg shadow-lg w-96 p-6">
        <h2 className="text-lg font-semibold mb-4">编辑项目</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">项目名称</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">描述</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              rows={3}
            />
          </div>
          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.active}
                onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                className="rounded"
              />
              <span className="text-sm font-medium">项目活跃</span>
            </label>
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-border rounded-md hover:bg-accent"
            >
              取消
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              保存
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}