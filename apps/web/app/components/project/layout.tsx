import { ProjectSidebar } from './sidebar';

interface ProjectLayoutProps {
  projectId: string;
  activePage: 'overview' | 'errors' | 'performance' | 'users' | 'custom';
  breadcrumbs: Array<{ label: string; href?: string }>;
  children: React.ReactNode;
}

export function ProjectLayout({ projectId, activePage, breadcrumbs, children }: ProjectLayoutProps) {
  return (
    <div className="flex h-screen bg-background">
      <ProjectSidebar projectId={projectId} activePage={activePage} />
      
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          {/* 面包屑导航 */}
          <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-4">
            {breadcrumbs.map((crumb, index) => (
              <div key={index} className="flex items-center">
                {crumb.href ? (
                  <a href={crumb.href} className="hover:text-foreground transition-colors duration-200">
                    {crumb.label}
                  </a>
                ) : (
                  <span className="text-foreground font-medium">{crumb.label}</span>
                )}
                {index < breadcrumbs.length - 1 && <span className="mx-2">/</span>}
              </div>
            ))}
          </nav>
          
          {children}
        </div>
      </div>
    </div>
  );
}