import { useEffect, useState } from "react";
import { useFetcher } from "react-router";
import type { TrackingEvent } from "../../types/tracking";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  event: TrackingEvent | null;
};

export function TrackingEventEditModal({ isOpen, onClose, event }: Props) {
  const fetcher = useFetcher();
  const [formData, setFormData] = useState({
    name: event?.name || '',
    identifier: event?.identifier || '',
    type: event?.type || 'click' as 'click' | 'pageview' | 'custom',
    description: event?.description || '',
    active: event?.active ?? true,
  });

  useEffect(() => {
    if (event) {
      setFormData({
        name: event.name,
        identifier: event.identifier,
        type: event.type,
        description: event.description || '',
        active: event.active,
      });
    }
  }, [event]);

  useEffect(() => {
    if (fetcher.state === 'idle' && fetcher.data) {
      console.log('更新成功:', fetcher.data);
      onClose();
      window.location.reload();
    }
  }, [fetcher.state, fetcher.data, onClose]);

  useEffect(() => {
    if (fetcher.state === 'submitting') {
      console.log('正在提交...');
    }
  }, [fetcher.state]);

  if (!isOpen || !event) return null;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-background border rounded-lg shadow-lg w-96 p-6">
        <h2 className="text-lg font-semibold mb-4">编辑埋点事件</h2>

        {fetcher.data?.error && (
          <div className="text-destructive mb-4">{fetcher.data.error}</div>
        )}
        
        <fetcher.Form method="post" action="">
          <input type="hidden" name="action" value="update" />
          <input type="hidden" name="id" value={event.id} />
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mb-2 block">事件名称</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mb-2 block">事件标识符</label>
              <input
                type="text"
                name="identifier"
                value={formData.identifier}
                onChange={(e) => setFormData(prev => ({ ...prev, identifier: e.target.value }))}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mb-2 block">事件类型</label>
              <select
                name="type"
                value={formData.type}
                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as 'click' | 'pageview' | 'custom' }))}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="click">点击事件</option>
                <option value="pageview">页面浏览</option>
                <option value="custom">自定义事件</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mb-2 block">事件描述</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
            <div>
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mb-2 block">状态</label>
              <select
                name="active"
                value={formData.active.toString()}
                onChange={(e) => setFormData(prev => ({ ...prev, active: e.target.value === 'true' }))}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="true">启用</option>
                <option value="false">停用</option>
              </select>
            </div>
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
              >
                取消
              </button>
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                disabled={fetcher.state === 'submitting'}
              >
                {fetcher.state === 'submitting' ? '更新中...' : '确定'}
              </button>
            </div>
          </div>
        </fetcher.Form>
      </div>
    </div>
  );
}