import { ErrorDetail } from '../../../../../../../api/mockAPI';

interface ErrorInfoProps {
  errorDetail: ErrorDetail;
}
//创建错误信息组件
export function ErrorInfo({ errorDetail }: ErrorInfoProps) {
  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">错误信息</h2>
      
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
        <div className="text-red-800 font-medium mb-2">错误类型</div>
        <div className="text-red-700">{errorDetail.errorMessage}</div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">基本信息</h3>
          <dl className="space-y-2 text-sm">
            <div>
              <dt className="text-gray-500">事件ID</dt>
              <dd className="text-gray-900">{errorDetail.eventId}</dd>
            </div>
            <div>
              <dt className="text-gray-500">事件类型</dt>
              <dd className="text-gray-900">{errorDetail.eventType}</dd>
            </div>
            <div>
              <dt className="text-gray-500">页面URL</dt>
              <dd className="text-gray-900 break-all">{errorDetail.currentPageUrl}</dd>
            </div>
          </dl>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">环境信息</h3>
          <dl className="space-y-2 text-sm">
            <div>
              <dt className="text-gray-500">浏览器</dt>
              <dd className="text-gray-900">{errorDetail.browser}</dd>
            </div>
            <div>
              <dt className="text-gray-500">操作系统</dt>
              <dd className="text-gray-900">{errorDetail.os}</dd>
            </div>
            <div>
              <dt className="text-gray-500">设备类型</dt>
              <dd className="text-gray-900">{errorDetail.device}</dd>
            </div>
            <div>
              <dt className="text-gray-500">屏幕分辨率</dt>
              <dd className="text-gray-900">{errorDetail.screenResolution}</dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-sm font-medium text-gray-700 mb-2">堆栈跟踪</h3>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <pre className="text-sm text-gray-800 whitespace-pre-wrap font-mono">
            {errorDetail.stackTrace}
          </pre>
        </div>
      </div>
    </div>
  );
}
