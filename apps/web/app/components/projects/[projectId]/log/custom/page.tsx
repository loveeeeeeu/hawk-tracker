import { useParams } from 'react-router-dom';

export default function CustomPage() {
  const { projectId } = useParams();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">自定义分析</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">自定义分析功能开发中...</p>
      </div>
    </div>
  );
}
