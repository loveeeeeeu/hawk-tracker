import { LoaderFunction } from "react-router";
import { ProjectTable } from "../components/project/table";

export const meta = () => [{ title: "项目管理" }];

export const loader: LoaderFunction = async () => {
  // 模拟项目数据
  const projects = [
    {
      id: '1',
      name: 'Hawk Tracker Web',
      description: '前端错误监控系统',
      createdAt: '2024-01-15',
      active: true
    },
    {
      id: '2',
      name: 'Hawk Tracker Mobile',
      description: '移动端错误监控系统',
      createdAt: '2024-01-20',
      active: true
    },
    {
      id: '3',
      name: 'Hawk Tracker API',
      description: '后端API服务',
      createdAt: '2024-01-25',
      active: false
    }
  ];
  
  return Response.json({ projects });
};

export default function ProjectListPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">项目管理</h1>
        <p className="text-muted-foreground">管理您的监控项目</p>
      </div>
      <ProjectTable />
    </div>
  );
}