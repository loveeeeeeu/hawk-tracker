interface Project {
  id: string;
  name: string;
  description: string;
}

interface PageHeaderProps {
  project: Project | null;
}

export function PageHeader({ project }: PageHeaderProps) {
  return (
    <div className="mb-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">埋点事件管理</h1>
      {project && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="text-sm text-blue-800">
            <span className="font-medium">项目:</span> {project.name}
          </div>
          <div className="text-sm text-blue-600 mt-1">
            {project.description}
          </div>
        </div>
      )}
    </div>
  );
}