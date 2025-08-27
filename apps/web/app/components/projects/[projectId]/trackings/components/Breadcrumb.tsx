import { Link } from 'react-router-dom';

interface BreadcrumbProps {
  projectName?: string;
}

export function Breadcrumb({ projectName }: BreadcrumbProps) {
  return (
    <nav className="flex mb-6" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-3">
        <li className="inline-flex items-center">
          <Link to="/" className="text-gray-700 hover:text-blue-600 transition-colors">
            应用首页
          </Link>
        </li>
        <li>
          <div className="flex items-center">
            <span className="mx-2 text-gray-400">/</span>
            <Link to="/projects" className="text-gray-700 hover:text-blue-600 transition-colors">
              项目管理
            </Link>
          </div>
        </li>
        <li>
          <div className="flex items-center">
            <span className="mx-2 text-gray-400">/</span>
            <span className="text-gray-900 font-medium">埋点事件管理</span>
          </div>
        </li>
      </ol>
    </nav>
  );
}