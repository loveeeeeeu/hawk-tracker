import { useState } from 'react';

interface AddEventButtonProps {
  onAddEvent: (eventData: {
    name: string;
    description: string;
    type: 'click' | 'pageview' | 'custom';
    identifier: string;
    status: 'enabled' | 'disabled';
  }) => void;
}

export function AddEventButton({ onAddEvent }: AddEventButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'click' as 'click' | 'pageview' | 'custom',
    identifier: '',
    status: 'enabled' as 'enabled' | 'disabled'
  });

  const [errors, setErrors] = useState<{
    name?: string;
    identifier?: string;
  }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 表单验证
    const newErrors: { name?: string; identifier?: string } = {};
    
    if (!formData.name.trim()) {
      newErrors.name = '事件名称不能为空';
    }
    
    if (!formData.identifier.trim()) {
      newErrors.identifier = '事件标识符不能为空';
    } else if (!/^[a-z_][a-z0-9_]*$/.test(formData.identifier)) {
      newErrors.identifier = '标识符只能包含小写字母、数字和下划线，且不能以数字开头';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    onAddEvent(formData);
    handleClose();
  };

  const handleClose = () => {
    setFormData({
      name: '',
      description: '',
      type: 'click',
      identifier: '',
      status: 'enabled'
    });
    setErrors({});
    setIsModalOpen(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // 清除对应字段的错误
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        添加事件
      </button>

      {/* 添加事件模态框 */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                添加事件
              </h3>
            </div>
            
            <form onSubmit={handleSubmit} className="px-6 py-4">
              <div className="space-y-4">
                {/* 事件名称 */}
                <div>
                  <label htmlFor="add-name" className="block text-sm font-medium text-gray-700 mb-1">
                    事件名称 *
                  </label>
                  <input
                    type="text"
                    id="add-name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.name ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="例如：用户登录"
                    required
                  />
                  {errors.name && (
                    <p className="text-xs text-red-600 mt-1">{errors.name}</p>
                  )}
                </div>

                {/* 事件描述 */}
                <div>
                  <label htmlFor="add-description" className="block text-sm font-medium text-gray-700 mb-1">
                    事件描述
                  </label>
                  <textarea
                    id="add-description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="描述这个事件的用途和触发条件"
                  />
                </div>

                {/* 事件类型 */}
                <div>
                  <label htmlFor="add-type" className="block text-sm font-medium text-gray-700 mb-1">
                    事件类型 *
                  </label>
                  <select
                    id="add-type"
                    value={formData.type}
                    onChange={(e) => handleInputChange('type', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="click">点击事件</option>
                    <option value="pageview">页面浏览</option>
                    <option value="custom">自定义事件</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    选择事件的触发类型
                  </p>
                </div>

                {/* 事件标识符 */}
                <div>
                  <label htmlFor="add-identifier" className="block text-sm font-medium text-gray-700 mb-1">
                    事件标识符 *
                  </label>
                  <input
                    type="text"
                    id="add-identifier"
                    value={formData.identifier}
                    onChange={(e) => handleInputChange('identifier', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono ${
                      errors.identifier ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="例如: user_login"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    用于代码中识别事件的唯一标识符，只能包含小写字母、数字和下划线
                  </p>
                  {errors.identifier && (
                    <p className="text-xs text-red-600 mt-1">{errors.identifier}</p>
                  )}
                </div>

                {/* 事件状态 */}
                <div>
                  <label htmlFor="add-status" className="block text-sm font-medium text-gray-700 mb-1">
                    事件状态
                  </label>
                  <select
                    id="add-status"
                    value={formData.status}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="enabled">启用</option>
                    <option value="disabled">停用</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    停用的事件将不会收集数据
                  </p>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  添加
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}