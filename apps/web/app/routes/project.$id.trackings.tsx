import { LoaderFunction, ActionFunction } from "react-router";
import { getTrackingEvents, createTrackingEvent, updateTrackingEvent, deleteTrackingEvent, toggleTrackingEventStatus } from "@/api/tracking";
import { getProject } from "@/api/project";
import { TrackingEventTable } from "../components/tracking/table";
import type { Project } from "@/types/project";
import type { TrackingEvent } from "@/types/tracking";

export function meta() {
  return [{ title: "埋点事件管理" }];
}

export type LoaderData = {
  project: Project;
  events: TrackingEvent[];
};

export const loader: LoaderFunction = async ({ params }) => {
  const projectId = params.id;
  if (!projectId) {
    throw new Error('项目ID不能为空');
  }

  const [project, events] = await Promise.all([
    getProject(projectId),
    getTrackingEvents(projectId)
  ]);

  return Response.json({ project, events });
};

export const action: ActionFunction = async ({ request }) => {
  try {
    const formData = await request.formData();
    const action = formData.get("action") as string;

    switch (action) {
      case "create":
        const projectId = formData.get("projectId") as string;
        const newEvent = await createTrackingEvent(projectId, {
          name: formData.get("name") as string,
          identifier: formData.get("identifier") as string,
          type: formData.get("type") as 'click' | 'pageview' | 'custom',
          description: formData.get("description") as string || undefined,
        });
        console.log('创建事件成功:', newEvent);
        return Response.json({ event: newEvent });

      case "update":
        const id = formData.get("id") as string;
        const updatedEvent = await updateTrackingEvent(id, {
          name: formData.get("name") as string,
          identifier: formData.get("identifier") as string,
          type: formData.get("type") as 'click' | 'pageview' | 'custom',
          description: formData.get("description") as string || undefined,
          active: formData.get("active") === "true",
        });
        console.log('更新事件成功:', updatedEvent);
        return Response.json({ event: updatedEvent });

      case "delete":
        const deleteId = formData.get("id") as string;
        await deleteTrackingEvent(deleteId);
        console.log('删除事件成功:', deleteId);
        return Response.json({ success: true });

      case "toggle":
        const toggleId = formData.get("id") as string;
        const toggledEvent = await toggleTrackingEventStatus(toggleId);
        console.log('切换状态成功:', toggledEvent);
        return Response.json({ event: toggledEvent });

      default:
        return Response.json({ error: '未知操作' }, { status: 400 });
    }
  } catch (error) {
    console.error('操作失败:', error);
    return Response.json({ error: '操作失败' }, { status: 500 });
  }
};

export default function TrackingPage() {
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
        <a 
          href="/project"
          className="hover:text-foreground transition-colors duration-200"
        >
          项目管理
        </a>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        <span className="text-foreground font-medium">埋点事件管理</span>
      </nav>
      
      <h1 className="text-2xl font-bold">埋点事件管理</h1>
      <TrackingEventTable />
    </div>
  );
}