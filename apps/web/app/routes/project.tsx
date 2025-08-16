//import type { Route } from "./+types/project";
import { ProjectTable } from "../components/project/table";
import { LoaderFunction, ActionFunction} from "react-router";
import { getProjects, createProject, updateProject, deleteProject } from "@/api/project";
import { Project } from "@/types/project";

export function meta() {
  return [{ title: "项目管理" }];
}

// 类型声明（必须！）
export type LoaderData = {
  projects: Project[];
};

// 1. 导出 loader 函数
export const loader: LoaderFunction = async () => {
  const projects = await getProjects();//await 会解包（unwrap） Promise，提取其解析值（即 Project[]）
  return Response.json({ projects }); // 明确返回类型
};//为什么将数据包装为 { projects } 对象结构:便于组件消费,且React Router 的 loader 函数中，要求使用 Response.json() 包装数据

//当 action 函数（CRUD)执行完成后，React Router 会自动重新调用 loader 函数来获取最新数据！
export const action: ActionFunction = async ({ request }) => {
  try {
    const formData = await request.formData();
    const action = formData.get("action") as string;

    switch (action) {
      case "create":
        const project = await createProject({
          name: formData.get("name") as string,
          description: formData.get("description") as string,
        });
        console.log('创建项目成功:', project);
        return Response.json({ project });

      case "update":
        const id = formData.get("id") as string;
        const updatedProject = await updateProject(id, {
          name: formData.get("name") as string,
          description: formData.get("description") as string,
          active: formData.get("active") === "true",
        });
        console.log('更新项目成功:', updatedProject);
        return Response.json({ project: updatedProject });

      case "delete":
        const deleteId = formData.get("id") as string;
        await deleteProject(deleteId);
        console.log('删除项目成功:', deleteId);
        return Response.json({ success: true });//告诉前端是否操作成功 if (fetcher.data?.success)

      default:
        return Response.json({ error: '未知操作' }, { status: 400 });
    }
  } catch (error) {
    console.error('操作失败:', error);
    return Response.json({ error: '操作失败' }, { status: 500 });
  }
};

export default function ProjectPage() {
  return (
    <div className="p-6 space-y-4">
      {/* 面包屑导航 */}
      <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
        <a 
          href="/"
          className="hover:text-foreground transition-colors duration-200 flex items-center space-x-1"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span>应用首页</span>
        </a>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        <span className="text-foreground font-medium">项目管理</span>
      </nav>
      
      <h1 className="text-2xl font-bold">项目管理</h1>
      <ProjectTable />
    </div>
  );
}