// 项目相关的 API 函数

export interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  status: 'active' | 'inactive';
  errorCount: number;
  userCount: number;
  lastErrorTime?: string;
  dsn: string;
  environment: 'development' | 'staging' | 'production';
}

export interface ProjectListResponse {
  projects: Project[];
  total: number;
}

export interface ProjectDetailResponse {
  project: Project;
}

// 模拟项目数据
const mockProjects: Project[] = [
  {
    id: '1',
    name: 'Hawk Tracker Web',
    description: '前端错误监控系统，提供实时的错误监控和性能分析功能',
    createdAt: '2024-01-15',
    status: 'active',
    errorCount: 156,
    userCount: 1234,
    lastErrorTime: '2024-01-30 14:30:25',
    dsn: 'https://your-dsn.com/api/data',
    environment: 'production'
  },
  {
    id: '2',
    name: 'Hawk Tracker Mobile',
    description: '移动端错误监控系统',
    createdAt: '2024-01-20',
    status: 'active',
    errorCount: 89,
    userCount: 856,
    lastErrorTime: '2024-01-29 16:45:12',
    dsn: 'https://your-dsn.com/api/data',
    environment: 'production'
  },
  {
    id: '3',
    name: 'Hawk Tracker API',
    description: '后端API服务监控',
    createdAt: '2024-01-25',
    status: 'inactive',
    errorCount: 23,
    userCount: 0,
    dsn: 'https://your-dsn.com/api/data',
    environment: 'development'
  }
];

/**
 * 获取项目列表
 */
export async function getProjects(): Promise<ProjectListResponse> {
  // 模拟 API 延迟
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return {
    projects: mockProjects,
    total: mockProjects.length
  };
}

/**
 * 根据 ID 获取项目详情
 */
export async function getProject(projectId: string): Promise<Project> {
  // 模拟 API 延迟
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const project = mockProjects.find(p => p.id === projectId);
  
  if (!project) {
    throw new Error(`项目不存在: ${projectId}`);
  }
  
  return project;
}

/**
 * 创建新项目
 */
export async function createProject(projectData: Omit<Project, 'id' | 'createdAt'>): Promise<Project> {
  // 模拟 API 延迟
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const newProject: Project = {
    ...projectData,
    id: Date.now().toString(),
    createdAt: new Date().toISOString()
  };
  
  mockProjects.push(newProject);
  
  return newProject;
}

/**
 * 更新项目信息
 */
export async function updateProject(projectId: string, updates: Partial<Omit<Project, 'id'>>): Promise<Project> {
  // 模拟 API 延迟
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const projectIndex = mockProjects.findIndex(p => p.id === projectId);
  
  if (projectIndex === -1) {
    throw new Error(`项目不存在: ${projectId}`);
  }
  
  mockProjects[projectIndex] = {
    ...mockProjects[projectIndex],
    ...updates
  } as Project;
  
  return mockProjects[projectIndex]!;
}

/**
 * 删除项目
 */
export async function deleteProject(projectId: string): Promise<void> {
  // 模拟 API 延迟
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const projectIndex = mockProjects.findIndex(p => p.id === projectId);
  
  if (projectIndex === -1) {
    throw new Error(`项目不存在: ${projectId}`);
  }
  
  mockProjects.splice(projectIndex, 1);
}

/**
 * 获取项目统计信息
 */
export async function getProjectStats(projectId: string) {
  // 模拟 API 延迟
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const project = mockProjects.find(p => p.id === projectId);
  
  if (!project) {
    throw new Error(`项目不存在: ${projectId}`);
  }
  
  return {
    errorCount: project.errorCount,
    userCount: project.userCount,
    lastErrorTime: project.lastErrorTime,
    averageResponseTime: 245,
    successRate: 99.8
  };
}

/**
 * 获取项目错误列表
 */
export async function getProjectErrors(projectId: string, page = 1, limit = 20) {
  // 模拟 API 延迟
  await new Promise(resolve => setTimeout(resolve, 400));
  
  const project = mockProjects.find(p => p.id === projectId);
  
  if (!project) {
    throw new Error(`项目不存在: ${projectId}`);
  }
  
  // 模拟错误数据
  const mockErrors = Array.from({ length: 50 }, (_, index) => ({
    id: `evt-${String(index + 1).padStart(3, '0')}`,
    type: index % 3 === 0 ? '普通错误事件' : index % 3 === 1 ? '资源加载错误' : 'API 错误',
    url: `https://example.com/page/${index + 1}`,
    message: `错误信息 ${index + 1}`,
    fullMessage: `TypeError: 错误信息 ${index + 1} at script.js:${(index + 1) * 10}:${(index + 1) * 2}`,
    line: (index + 1) * 10,
    column: (index + 1) * 2,
    sendTime: new Date(Date.now() - index * 3600000).toISOString().replace('T', ' ').substring(0, 19),
    occurTime: new Date(Date.now() - index * 3600000 - 2000).toISOString().replace('T', ' ').substring(0, 19),
    isBatchError: index % 5 === 0,
    batchErrorCount: index % 5 === 0 ? Math.floor(Math.random() * 10) + 1 : 0,
    resourceUrl: index % 3 === 1 ? `https://example.com/resource/${index + 1}.js` : undefined
  }));
  
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedErrors = mockErrors.slice(startIndex, endIndex);
  
  return {
    errors: paginatedErrors,
    total: mockErrors.length,
    page,
    limit,
    totalPages: Math.ceil(mockErrors.length / limit)
  };
}

/**
 * 获取项目性能数据
 */
export async function getProjectPerformance(projectId: string) {
  // 模拟 API 延迟
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const project = mockProjects.find(p => p.id === projectId);
  
  if (!project) {
    throw new Error(`项目不存在: ${projectId}`);
  }
  
  // 模拟性能数据
  return {
    averageResponseTime: 245,
    p95ResponseTime: 450,
    p99ResponseTime: 800,
    successRate: 99.8,
    errorRate: 0.2,
    throughput: 1250,
    activeUsers: project.userCount
  };
}

/**
 * 获取项目用户数据
 */
export async function getProjectUsers(projectId: string) {
  // 模拟 API 延迟
  await new Promise(resolve => setTimeout(resolve, 400));
  
  const project = mockProjects.find(p => p.id === projectId);
  
  if (!project) {
    throw new Error(`项目不存在: ${projectId}`);
  }
  
  // 模拟用户数据
  const mockUsers = Array.from({ length: 20 }, (_, index) => ({
    id: `user-${String(index + 1).padStart(3, '0')}`,
    sessionId: `session-${String(index + 1).padStart(3, '0')}`,
    userAgent: `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36`,
    ip: `192.168.1.${index + 1}`,
    location: '北京市',
    firstVisitTime: new Date(Date.now() - index * 86400000).toISOString().replace('T', ' ').substring(0, 19),
    lastVisitTime: new Date(Date.now() - index * 3600000).toISOString().replace('T', ' ').substring(0, 19),
    visitCount: Math.floor(Math.random() * 10) + 1,
    errorCount: Math.floor(Math.random() * 5),
    currentPage: `https://example.com/page/${index + 1}`
  }));
  
  return {
    users: mockUsers,
    total: mockUsers.length,
    activeUsers: project.userCount
  };
}