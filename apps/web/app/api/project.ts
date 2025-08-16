// 临时使用模拟数据，直到后端 API 准备好
import type { Project } from '../types/project';

// 模拟项目数据
const mockProjects: Project[] = [
  {
    id: '1',
    name: '用户中心',
    description: '用户相关功能',
    active: true,
    createdAt: '2023-01-01',
  },
  {
    id: '2',
    name: '电商平台',
    description: '在线购物系统',
    active: true,
    createdAt: '2023-02-15',
  },
  {
    id: '3',
    name: '内部管理',
    description: '员工管理系统',
    active: false,
    createdAt: '2022-11-20',
  },
];

// 格式化日期为 YYYY-MM-DD
function formatDate(date: Date): string {
  const isoString = date.toISOString();
  const datePart = isoString.split('T')[0];
  return datePart || isoString;
}

export async function getProjects(): Promise<Project[]> {
  // 模拟 API 延迟
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...mockProjects]);
    }, 300);
  });
}

export async function createProject(
  data: Omit<Project, 'id' | 'createdAt' | 'active'>,
): Promise<Project> {
  return new Promise<Project>((resolve) => {
    setTimeout(() => {
      const created: Project = {
        ...data,
        id: Math.random().toString(36).substring(2),
        active: true,
        createdAt: formatDate(new Date()),
      };
      mockProjects.push(created);
      resolve(created);
    }, 300);
  });
}

// 新增：更新项目
export async function updateProject(
  id: string,
  data: Partial<Omit<Project, 'id' | 'createdAt'>>,
): Promise<Project> {
  return new Promise<Project>((resolve, reject) => {
    setTimeout(() => {
      const index = mockProjects.findIndex((p) => p.id === id);
      if (index === -1) {
        reject(new Error('项目不存在'));
        return;
      }

      // 明确获取当前项目
      const currentProject = mockProjects[index]!; // 使用 ! 断言，因为我们已经检查了 index !== -1
      const updatedProject: Project = {
        id: currentProject.id, // 保持不变
        createdAt: currentProject.createdAt, // 保持不变
        name: data.name !== undefined ? data.name : currentProject.name, // 明确检查 undefined
        description:
          data.description !== undefined
            ? data.description
            : currentProject.description, // 明确检查 undefined
        active: data.active !== undefined ? data.active : currentProject.active, // 处理 boolean 类型
      };

      mockProjects[index] = updatedProject;
      resolve(updatedProject);
    }, 300);
  });
}

// 新增：删除项目
export async function deleteProject(id: string): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    setTimeout(() => {
      const index = mockProjects.findIndex((p) => p.id === id);
      if (index === -1) {
        reject(new Error('项目不存在'));
        return;
      }

      mockProjects.splice(index, 1);
      resolve();
    }, 300);
  });
}

// 新增：获取项目详情
export async function getProject(id: string): Promise<Project> {
  return new Promise<Project>((resolve, reject) => {
    setTimeout(() => {
      const project = mockProjects.find((p) => p.id === id);
      if (!project) {
        reject(new Error('项目不存在'));
        return;
      }
      resolve(project);
    }, 300);
  });
}

// 当后端 API 准备好后，可以取消注释下面的代码来使用真实 API
/*
import { api } from '@workspace/api';
import type { Application, CreateApplicationPayload } from '@workspace/api';

// 转换 Application 到 Project 格式
function convertApplicationToProject(app: Application) {
  return {
    id: app.id,
    name: app.name,
    description: app.description || '',
    active: true,
    createdAt: formatDate(new Date(app.createdAt)),
  };
}

export async function getProjects() {
  try {
    const response = await api.application.getApplications({ 
      page: 1, 
      pageSize: 50 
    });
    return response.list.map(convertApplicationToProject);
  } catch (error) {
    console.error('获取项目列表失败:', error);
    return [];
  }
}

export async function createProject(data: { name: string; description: string }) {
  try {
    const payload: CreateApplicationPayload = {
      name: data.name,
      description: data.description,
      platform: 'web',
    };
    
    const app = await api.application.createApplication(payload);
    return convertApplicationToProject(app);
  } catch (error) {
    console.error('创建项目失败:', error);
    throw error;
  }
}
*/
