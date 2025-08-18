import { useState, useEffect } from 'react';

interface UserProfile {
  id: string;
  nickname: string;
  email: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string
}

export function Profile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isPasswordChanging, setIsPasswordChanging] = useState(false);
  
  const [formData, setFormData] = useState({
    nickname: '',
    avatar: ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // 模拟获取用户资料数据
  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    setIsLoading(true);
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const mockProfile: UserProfile = {
        id: 'ByteDance-123',
        nickname: '小白',
        email: 'xiaobai@example.com',
        avatar: 'https://example.com/avatar.png',
        createdAt: '2025-08-16T00:00:00Z',
        updatedAt: '2025-08-16T00:00:00Z'
      };
      
      setProfile(mockProfile);
      setFormData({
        nickname: mockProfile.nickname,
        avatar: mockProfile.avatar || ''
      });
    } catch (error) {
      console.error('获取用户资料失败:', error);
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

  const handlePasswordChange = (field: string, value: string) => {
    setPasswordData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveProfile = async () => {
    if (isSaving) return;
    
    setIsSaving(true);
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (profile) {
        setProfile(prev => prev ? {
          ...prev,
          nickname: formData.nickname,
          avatar: formData.avatar,
          updatedAt: new Date().toISOString()
        } : null);
      }
      
      alert('个人资料已保存');
    } catch (error) {
      console.error('保存失败:', error);
      alert('保存失败，请重试');
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (isPasswordChanging) return;
    
    // 验证密码
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('新密码和确认密码不匹配');
      return;
    }
    
    if (passwordData.newPassword.length < 6) {
      alert('新密码长度至少6位');
      return;
    }
    
    setIsPasswordChanging(true);
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 清空密码表单
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      alert('密码修改成功');
    } catch (error) {
      console.error('密码修改失败:', error);
      alert('密码修改失败，请重试');
    } finally {
      setIsPasswordChanging(false);
    }
  };

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // 这里可以添加文件类型和大小验证
      if (file.size > 5 * 1024 * 1024) { // 5MB限制
        alert('头像文件大小不能超过5MB');
        return;
      }
      
      // 模拟文件上传，实际项目中应该上传到服务器
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setFormData(prev => ({
          ...prev,
          avatar: result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-lg text-gray-600 dark:text-gray-400">加载中...</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-lg text-red-600 dark:text-red-400">用户资料不存在</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            个人设置
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            管理您的个人资料和账户设置
          </p>
        </div>

        <div className="space-y-8">
          {/* 基本信息设置 */}
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              基本信息
            </h2>
            
            <div className="space-y-6">
              {/* 头像设置 */}
              <div className="flex items-center space-x-6">
                <div className="flex-shrink-0">
                  <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
                    {formData.avatar ? (
                      <img
                        src={formData.avatar}
                        alt="头像"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-2xl font-medium text-gray-500 dark:text-gray-400">
                          {formData.nickname ? formData.nickname.charAt(0) : 'U'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    更换头像
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="block w-full text-sm text-gray-500 dark:text-gray-400
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-md file:border-0
                      file:text-sm file:font-medium
                      file:bg-blue-50 file:text-blue-700
                      dark:file:bg-blue-900/20 dark:file:text-blue-400
                      hover:file:bg-blue-100 dark:hover:file:bg-blue-900/30
                      transition-colors"
                  />
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    支持 JPG、PNG 格式，文件大小不超过 5MB
                  </p>
                </div>
              </div>
              
              {/* 昵称设置 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  昵称
                </label>
                <input
                  type="text"
                  value={formData.nickname}
                  onChange={(e) => handleInputChange('nickname', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="输入昵称"
                />
              </div>
              
              {/* 邮箱显示（只读） */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  邮箱
                </label>
                <input
                  type="email"
                  value={profile.email}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-gray-100 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  邮箱地址不可修改
                </p>
              </div>
              
              {/* 保存按钮 */}
              <div className="flex items-center justify-between pt-4">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  最后更新: {new Date(profile.updatedAt).toLocaleString('zh-CN')}
                </div>
                <button
                  onClick={handleSaveProfile}
                  disabled={isSaving}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  {isSaving ? '保存中...' : '保存更改'}
                </button>
              </div>
            </div>
          </div>

          {/* 密码修改 */}
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              修改密码
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  当前密码
                </label>
                <input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="输入当前密码"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  新密码
                </label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="输入新密码"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  确认新密码
                </label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="再次输入新密码"
                />
              </div>
              
              <div className="pt-4">
                <button
                  onClick={handleChangePassword}
                  disabled={isPasswordChanging}
                  className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  {isPasswordChanging ? '修改中...' : '修改密码'}
                </button>
              </div>
            </div>
          </div>

          {/* 账户信息 */}
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              账户信息
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">用户ID</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">{profile.id}</span>
              </div>
              
              <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">注册时间</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {new Date(profile.createdAt).toLocaleString('zh-CN')}
                </span>
              </div>
              
              <div className="flex items-center justify-between py-3">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">最后更新</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {new Date(profile.updatedAt).toLocaleString('zh-CN')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

// 添加默认导出
export default Profile;