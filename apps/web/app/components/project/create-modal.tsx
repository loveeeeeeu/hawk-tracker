import { useEffect } from "react";
import { useFetcher } from "react-router";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export function ProjectCreateModal({ isOpen, onClose }: Props) {
  const fetcher = useFetcher();

  useEffect(() => {
    if (fetcher.state === 'idle' && fetcher.data) {
      console.log('创建成功:', fetcher.data);
      onClose();
      window.location.reload();
    }
  }, [fetcher.state, fetcher.data, onClose]);

  useEffect(() => {
    if (fetcher.state === 'submitting') {
      console.log('正在提交...');
    }
  }, [fetcher.state]);

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-background border rounded-lg shadow-lg w-96 p-6">
        <h2 className="text-lg font-semibold mb-4">新建项目</h2>

        {fetcher.data?.error && (
          <div className="text-destructive mb-4">{fetcher.data.error}</div>
        )}
        
        <fetcher.Form method="post" action="/project">
          <input type="hidden" name="action" value="create" />
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mb-2 block">项目名称</label>
              <input
                type="text"
                name="name"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mb-2 block">项目描述</label>
              <textarea
                name="description"
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
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
                {fetcher.state === 'submitting' ? '创建中...' : '确定'}
              </button>
            </div>
          </div>
        </fetcher.Form>
      </div>
    </div>
  );
}