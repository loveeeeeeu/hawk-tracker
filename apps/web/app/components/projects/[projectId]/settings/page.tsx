import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Button } from '@workspace/ui/components/button';

interface ProjectMember {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'admin' | 'member' | 'viewer';
  avatar?: string
}

interface ProjectSettings {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export default function ProjectSettingsPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  
  const [project, setProject] = useState<ProjectSettings | null>(null);
  const [members, setMembers] = useState<ProjectMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });

  // 模拟获取项目数据
  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        // 这里应该调用实际的API
        const mockProject: ProjectSettings = {
          id: projectId || '',
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
          }
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

    if (projectId) {
      fetchProjectData();
    }
  }, [projectId]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // 这里应该调用实际的API保存数据
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (project) {
        setProject(prev => prev ? {
          ...prev,
          name: formData.name,
          description: formData.description,
          updatedAt: new Date().toISOString()
        } : null);
      }
      
      // 显示成功消息
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
        name: email.split('@')[0] || '新成员',
        email: email.trim(),
        role: 'member'
      };
      setMembers(prev => [...prev, newMember]);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">加载中...</div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-red-600">项目不存在</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* 面包屑导航 */}
        <nav className="flex mb-6" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li className="inline-flex items-center">
              <button
                onClick={() => navigate('/')}
                className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600"
              >
                应用首页
              </button>
            </li>
            <li>
              <div className="flex items-center">
                <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                </svg>
                <button
                  onClick={() => navigate('/projects')}
                  className="ml-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ml-2"
                >
                  项目管理
                </button>
              </div>
            </li>
            <li>
              <div className="flex items-center">
                <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                </svg>
                <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2">项目设置</span>
              </div>
            </li>
          </ol>
        </nav>

        {/* 页面标题 */}
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
              <Button
                onClick={() => navigate('/projects')}
                variant="outline"
              >
                返回项目管理
              </Button>
            </div>
          </div>
        </div>

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
                <Button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="px-6"
                >
                  {isSaving ? '保存中...' : '保存更改'}
                </Button>
              </div>
            </div>
          </div>

          {/* 成员管理 */}
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                成员管理
              </h2>
              <Button 
                variant="outline"
                onClick={handleInviteMember}
              >
                邀请成员
              </Button>
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
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRemoveMember(member.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        移除
                      </Button>
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
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-red-900 dark:text-red-100">
                    删除项目
                  </h3>
                  <p className="text-red-700 dark:text-red-200">
                    此操作将永久删除项目及其所有数据，无法恢复。
                  </p>
                </div>
                <Button
                  variant="destructive"
                  onClick={() => {
                    if (confirm('确定要删除此项目吗？此操作无法撤销！')) {
                      // 这里应该调用删除API
                      alert('项目删除功能待实现');
                    }
                  }}
                >
                  删除项目
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}