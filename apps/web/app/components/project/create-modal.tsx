import { useState } from "react";
import { useFetcher } from "react-router";

interface ProjectCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProjectCreateModal({ isOpen, onClose }: ProjectCreateModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    environment: "production" as const
  });
  
  const fetcher = useFetcher();

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetcher.submit(
      { 
        action: 'create',
        ...formData 
      },
      { method: 'post' }
    );
    onClose();
    setFormData({ name: "", description: "", environment: "production" });
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-background border rounded-lg shadow-lg w-96 p-6">
        <h2 className="text-lg font-semibold mb-4">新建项目</h2>
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
            <label className="block text-sm font-medium mb-1">环境</label>
            <select
              value={formData.environment}
              onChange={(e) => setFormData({ ...formData, environment: e.target.value as any })}
              className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="development">开发环境</option>
              <option value="staging">测试环境</option>
              <option value="production">生产环境</option>
            </select>
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
              创建
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}