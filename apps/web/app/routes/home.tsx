export function meta() {
  return [{ title: "应用首页" }];
}

export default function HomePage() {
  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">应用首页</h1>
      <p className="text-muted-foreground">
        展示所有项目的概览数据
      </p>
      <div className="flex space-x-4">
        <a 
          href="/project"
          className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
        >
          进入项目管理
        </a>
      </div>
    </div>
  );
}