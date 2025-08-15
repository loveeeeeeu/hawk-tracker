import type { Route } from "./+types/project.$id";
import { LoaderFunction } from "react-router";
import { getProjects } from "@/api/project";
import { Project } from "@/types/project";
import { useLoaderData } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [{ title: "项目详情" }];
}

export type LoaderData = {
  project: Project;
};

export const loader: LoaderFunction = async ({ params }) => {
  const projects = await getProjects();
  const project = projects.find(p => p.id === params.id);
  
  if (!project) {
    throw new Response("项目不存在", { status: 404 });
  }
  
  return Response.json({ project });
};

export default function ProjectDetailPage() {
  const { project } = useLoaderData() as LoaderData;
  
  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">项目详情</h1>
        <a 
          href="/project" 
          className="text-blue-600 hover:underline"
        >
          返回列表
        </a>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="space-y-4">
          <div>
            <label className="font-semibold">项目名称:</label>
            <p className="mt-1">{project.name}</p>
          </div>
          <div>
            <label className="font-semibold">项目描述:</label>
            <p className="mt-1 text-gray-600">{project.description}</p>
          </div>
          <div>
            <label className="font-semibold">状态:</label>
            <p className="mt-1">
              <span className={`px-2 py-1 rounded-full text-xs ${
                project.active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
              }`}>
                {project.active ? "活跃" : "停用"}
              </span>
            </p>
          </div>
          <div>
            <label className="font-semibold">创建时间:</label>
            <p className="mt-1">{project.createdAt}</p>
          </div>
        </div>
      </div>
    </div>
  );
}