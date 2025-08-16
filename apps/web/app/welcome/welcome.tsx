import { useState, useEffect } from 'react';
import logoDark from "./logo-dark.svg";
import logoLight from "./logo-light.svg";

interface ProjectMember {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'admin' | 'member' | 'viewer';
  avatar?: string;
}

interface ProjectSettings {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

interface UserProfile {
  id: string;
  nickname: string;
  email: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export function Welcome() {
  const [activeTab, setActiveTab] = useState<'welcome' | 'settings'>('welcome');
  const [project, setProject] = useState<ProjectSettings | null>(null);
  const [members, setMembers] = useState<ProjectMember[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });

  // 模拟获取项目数据
  useEffect(() => {
    if (activeTab === 'settings') {
      loadProjectData();
    }
  }, [activeTab]);

  const loadProjectData = async () => {
    setIsLoading(true);
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const mockProject: ProjectSettings = {
        id: 'project-123',
        name: 'Hawk Tracker 项目',
        description: '这是一个用于错误监控和性能追踪的项目，帮助开发者快速定位和解决问题。',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      };
      
      const mockMembers: ProjectMember[] = [
        {
          id: '1',
          name: '张三',
          email: 'zhangsan@hawk-tracker.com',
          role: 'owner'
        },
        {
          id: '2',
          name: '李四',
          email: 'lisi@hawk-tracker.com',
          role: 'admin'
        },
        {
          id: '3',
          name: '王五',
          email: 'wangwu@hawk-tracker.com',
          role: 'member'
        },
        
      ];
      
      setProject(mockProject);
      setMembers(mockMembers);
      setFormData({
        name: mockProject.name,
        description: mockProject.description
      });
    } catch (error) {
      console.error('获取项目数据失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    if (isSaving) return;
    
    setIsSaving(true);
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (project) {
        setProject(prev => prev ? {
          ...prev,
          name: formData.name,
          description: formData.description,
          updatedAt: new Date().toISOString()
        } : null);
      }
      
      alert('项目设置已保存');
    } catch (error) {
      console.error('保存失败:', error);
      alert('保存失败，请重试');
    } finally {
      setIsSaving(false);
    }
  };

  const handleMemberRoleChange = (memberId: string, newRole: ProjectMember['role']) => {
    setMembers(prev => prev.map(member => 
      member.id === memberId ? { ...member, role: newRole } : member
    ));
  };

  const handleRemoveMember = (memberId: string) => {
    if (confirm('确定要移除该成员吗？')) {
      setMembers(prev => prev.filter(member => member.id !== memberId));
    }
  };

  const handleInviteMember = () => {
    const email = prompt('请输入要邀请的成员邮箱:');
    if (email && email.trim()) {
      const newMember: ProjectMember = {
        id: Date.now().toString(),
        name: email.split('@')[0] || '新成员', // 提供默认值防止 undefined
        email: email.trim(),
        role: 'member'
      };
      setMembers(prev => [...prev, newMember]);
    }
  };

  const handleDeleteProject = () => {
    if (confirm('确定要删除此项目吗？此操作无法撤销！')) {
      alert('项目删除功能待实现');
    }
  };

  if (activeTab === 'settings') {
    return (
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          {/* 页面标题和导航 */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  项目设置
                </h1>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  管理项目配置和成员权限
                </p>
              </div>
              <div className="flex items-center gap-4">
                {/* 个人设置按钮 */}
                <a
                  href="/profile"
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="stroke-current"
                  >
                    <path
                      d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  个人设置
                </a>
                <button
                  onClick={() => setActiveTab('welcome')}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  返回欢迎页
                </button>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center min-h-64">
              <div className="text-lg text-gray-600 dark:text-gray-400">加载中...</div>
            </div>
          ) : project ? (
            <div className="space-y-8">
              {/* 基本信息设置 */}
              <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  基本信息
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      项目名称
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      placeholder="输入项目名称"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      项目描述
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      placeholder="输入项目描述"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between pt-4">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      最后更新: {new Date(project.updatedAt).toLocaleString('zh-CN')}
                    </div>
                    <button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                    >
                      {isSaving ? '保存中...' : '保存更改'}
                    </button>
                  </div>
                </div>
              </div>

              {/* 成员管理 */}
              <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    成员管理
                  </h2>
                  <button
                    onClick={handleInviteMember}
                    className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    邀请成员
                  </button>
                </div>
                
                <div className="space-y-4">
                  {members.map((member) => (
                    <div key={member.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {member.name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {member.name}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {member.email}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <select
                          value={member.role}
                          onChange={(e) => handleMemberRoleChange(member.id, e.target.value as ProjectMember['role'])}
                          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                          disabled={member.role === 'owner'}
                        >
                          <option value="owner">所有者</option>
                          <option value="admin">管理员</option>
                          <option value="member">成员</option>
                          <option value="viewer">访客</option>
                        </select>
                        
                        {member.role !== 'owner' && (
                          <button
                            onClick={() => handleRemoveMember(member.id)}
                            className="px-3 py-1 text-sm text-red-600 hover:text-red-700 border border-red-600 hover:border-red-700 rounded-md transition-colors"
                          >
                            移除
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 危险操作区域 */}
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-red-900 dark:text-red-100 mb-4">
                  危险操作
                </h2>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-red-900 dark:text-red-100">
                      删除项目
                    </h3>
                    <p className="text-red-700 dark:text-red-200">
                      此操作将永久删除项目及其所有数据，无法恢复。
                    </p>
                  </div>
                  <button
                    onClick={handleDeleteProject}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                  >
                    删除项目
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center min-h-64">
              <div className="text-lg text-red-600 dark:text-red-400">项目不存在</div>
            </div>
          )}
        </div>
      </main>
    );
  }

  // 欢迎页面
  return (
    <main className="flex items-center justify-center pt-16 pb-4">
      {/* 添加右上角的按钮组 */}
      <div className="absolute top-4 right-4 flex items-center gap-3">
        {/* 项目设置按钮 */}
        <button
          onClick={() => setActiveTab('settings')}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            className="stroke-current"
          >
            <path
              d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z"
              strokeWidth="1.5"
            />
            <path
              d="M19.4 15C19.1277 15.6171 19.2583 16.3378 19.73 16.82L19.79 16.88C20.1656 17.2547 20.3767 17.7648 20.3767 18.295C20.3767 18.8252 20.1656 19.3353 19.79 19.71C19.4144 20.0847 18.9043 20.2958 18.374 20.2958C17.8437 20.2958 17.3336 20.0847 16.958 19.71L16.898 19.65C16.4163 19.1783 15.6956 19.0477 15.0785 19.32C14.7524 19.4457 14.3969 19.4147 14.092 19.232C13.7871 19.0493 13.5597 18.7293 13.47 18.36C13.3748 17.9662 13.4378 17.5478 13.65 17.2L13.71 17.14C14.1823 16.6573 14.3127 15.9366 14.04 15.32C13.9143 14.994 13.9453 14.6385 14.128 14.3336C14.3107 14.0287 14.6307 13.8013 15 13.71C15.3938 13.6148 15.8122 13.6778 16.16 13.89L16.22 13.95C16.7027 14.4223 17.4234 14.5527 18.04 14.28H18.1C18.4261 14.1543 18.7816 14.1853 19.0865 14.368C19.3914 14.5507 19.6188 14.8707 19.7085 15.24L19.4 15Z"
              strokeWidth="1.5"
            />
          </svg>
          项目设置
        </button>
        
        {/* 个人设置按钮 */}
        <a
          href="/profile"
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            className="stroke-current"
          >
            <path
              d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          个人设置
        </a>
      </div>

      <div className="flex-1 flex flex-col items-center gap-16 min-h-0">
        <header className="flex flex-col items-center gap-9">
          <div className="w-[500px] max-w-[100vw] p-4">
            <img
              src={logoLight}
              alt="React Router"
              className="block w-full dark:hidden"
            />
            <img
              src={logoDark}
              alt="React Router"
              className="hidden w-full dark:block"
            />
          </div>
        </header>
        <div className="max-w-[300px] w-full space-y-6 px-4">
          <nav className="rounded-3xl border border-gray-200 p-6 dark:border-gray-700 space-y-4">
            <p className="leading-6 text-gray-700 dark:text-gray-200 text-center">
              下一步是什么？
            </p>
            <ul>
              {resources.map(({ href, text, icon }) => (
                <li key={href}>
                  <a
                    className="group flex items-center gap-3 self-stretch p-3 leading-normal text-blue-700 hover:underline dark:text-blue-500"
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {icon}
                    {text}
                  </a>
                </li>
              ))}
              <li>
                
              </li>
              <li>
                
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </main>
  );
}

const resources = [
  {
    href: "https://reactrouter.com/docs",
    text: "React Router 文档",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        className="stroke-gray-600 group-hover:stroke-current dark:stroke-gray-300"
      >
        <path
          d="M9.99981 10.0751V9.99992M17.4688 17.4688C15.889 19.0485 11.2645 16.9853 7.13958 12.8604C3.01467 8.73546 0.951405 4.11091 2.53116 2.53116C4.11091 0.951405 8.73546 3.01467 12.8604 7.13958C16.9853 11.2645 19.0485 15.889 17.4688 17.4688ZM2.53132 17.4688C0.951566 15.8891 3.01483 11.2645 7.13974 7.13963C11.2647 3.01471 15.8892 0.951453 17.469 2.53121C19.0487 4.11096 16.9854 8.73551 12.8605 12.8604C8.73562 16.9853 4.11107 19.0486 2.53132 17.4688Z"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    href: "https://rmx.as/discord",
    text: "加入 Discord",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="20"
        viewBox="0 0 24 20"
        fill="none"
        className="stroke-gray-600 group-hover:stroke-current dark:stroke-gray-300"
      >
        <path
          d="M15.0686 1.25995L14.5477 1.17423L14.2913 1.63578C14.1754 1.84439 14.0545 2.08275 13.9422 2.31963C12.6461 2.16488 11.3406 2.16505 10.0445 2.32014C9.92822 2.08178 9.80478 1.84975 9.67412 1.62413L9.41449 1.17584L8.90333 1.25995C7.33547 1.51794 5.80717 1.99419 4.37748 2.66939L4.19 2.75793L4.07461 2.93019C1.23864 7.16437 0.46302 11.3053 0.838165 15.3924L0.868838 15.7266L1.13844 15.9264C2.81818 17.1714 4.68053 18.1233 6.68582 18.719L7.18892 18.8684L7.50166 18.4469C7.96179 17.8268 8.36504 17.1824 8.709 16.4944L8.71099 16.4904C10.8645 17.0471 13.128 17.0485 15.2821 16.4947C15.6261 17.1826 16.0293 17.8269 16.4892 18.4469L16.805 18.8725L17.3116 18.717C19.3056 18.105 21.1876 17.1751 22.8559 15.9238L23.1224 15.724L23.1528 15.3923C23.5873 10.6524 22.3579 6.53306 19.8947 2.90714L19.7759 2.73227L19.5833 2.64518C18.1437 1.99439 16.6386 1.51826 15.0686 1.25995ZM16.6074 10.7755L16.6074 10.7756C16.5934 11.6409 16.0212 12.1444 15.4783 12.1444C14.9297 12.1444 14.3493 11.6173 14.3493 10.7877C14.3493 9.94885 14.9378 9.41192 15.4783 9.41192C16.0471 9.41192 16.6209 9.93851 16.6074 10.7755ZM8.49373 12.1444C7.94513 12.1444 7.36471 11.6173 7.36471 10.7877C7.36471 9.94885 7.95323 9.41192 8.49373 9.41192C9.06038 9.41192 9.63892 9.93712 9.6417 10.7815C9.62517 11.6239 9.05462 12.1444 8.49373 12.1444Z"
          strokeWidth="1.5"
        />
      </svg>
    ),
  },
];
