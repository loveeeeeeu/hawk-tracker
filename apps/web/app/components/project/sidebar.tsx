interface ProjectSidebarProps {
  projectId: string;
  activePage: 'overview' | 'errors' | 'performance' | 'users' | 'custom';
}

export function ProjectSidebar({ projectId, activePage }: ProjectSidebarProps) {
  const navItems = [
    { key: 'overview', label: '概览', href: `/project/${projectId}/overview` },
    { key: 'errors', label: '错误日志', href: `/project/${projectId}/errors` },
    { key: 'performance', label: '性能日志', href: `/project/${projectId}/performance` },
    { key: 'users', label: '用户日志', href: `/project/${projectId}/users` },
    { key: 'custom', label: '自定义埋点', href: `/project/${projectId}/custom` },
  ];

  return (
    <div className="w-64 bg-card border-r border-border">
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-semibold">项目导航</h2>
      </div>
      <nav className="p-4 space-y-2">
        {navItems.map((item) => (
          <a
            key={item.key}
            href={item.href}
            className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              activePage === item.key
                ? 'text-primary bg-primary/10'
                : 'text-muted-foreground hover:text-foreground hover:bg-accent'
            }`}
          >
            {item.label}
          </a>
        ))}
      </nav>
    </div>
  );
}