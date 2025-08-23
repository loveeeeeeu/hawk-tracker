// 模拟API库，用于开发阶段的数据模拟

export interface TrackingEvent {
  id: string;
  name: string;
  description: string;
  type: 'click' | 'pageview' | 'custom';
  identifier: string;
  status: 'enabled' | 'disabled';
  createdAt: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
}

// 新增：项目概览数据接口
export interface ProjectOverview {
  errorsToday: number;
  affectedUsers: number;
  averageResponseTime: number;
  onlineUsers: number;
}

// 新增：错误日志数据接口
export interface ErrorLog {
  id: string;
  eventId: string;
  eventType: string;
  currentPageUrl: string;
  timestamp: string;
  errorMessage?: string;
  stackTrace?: string;
}

// 新增：错误详情数据接口
export interface ErrorDetail {
  id: string;
  eventId: string;
  eventType: string;
  currentPageUrl: string;
  timestamp: string;
  errorMessage: string;
  stackTrace: string;
  userAgent: string;
  browser: string;
  os: string;
  device: string;
  screenResolution: string;
  viewport: string;
  // SourceMap 还原后的源码信息
  sourceCode: {
    file: string;
    line: number;
    column: number;
    code: string;
    context: Array<{
      line: number;
      code: string;
      isErrorLine: boolean;
    }>;
  };
  // 录屏数据
  recordingId: string;
}

// 模拟数据库 - 项目信息
const mockProjects: Record<string, Project> = {
  'project-1': {
    id: 'project-1',
    name: '用户中心',
    description: '用户相关功能'
  },
  'project-2': {
    id: 'project-2',
    name: '电商平台',
    description: '在线购物系统'
  },
  'project-3': {
    id: 'project-3',
    name: '内部管理',
    description: '员工管理系统'
  }
};

// 模拟数据库 - 埋点事件数据
let mockProjectEvents: Record<string, TrackingEvent[]> = {
  'project-1': [
    {
      id: 'event-1',
      name: '用户登录',
      description: '用户成功登录系统',
      type: 'click',
      identifier: 'user_login',
      status: 'enabled',
      createdAt: '2023-01-01'
    },
    {
      id: 'event-2',
      name: '用户注册',
      description: '新用户注册账号',
      type: 'click',
      identifier: 'user_register',
      status: 'enabled',
      createdAt: '2023-01-15'
    },
    {
      id: 'event-3',
      name: '密码重置',
      description: '用户重置密码',
      type: 'custom',
      identifier: 'password_reset',
      status: 'disabled',
      createdAt: '2023-02-01'
    }
  ],
  'project-2': [
    {
      id: 'event-4',
      name: '加入购物车',
      description: '用户点击加入购物车按钮',
      type: 'click',
      identifier: 'cart_add',
      status: 'enabled',
      createdAt: '2023-01-01'
    },
    {
      id: 'event-5',
      name: '商品详情浏览',
      description: '用户浏览商品详情页',
      type: 'pageview',
      identifier: 'item_view',
      status: 'enabled',
      createdAt: '2023-01-15'
    },
    {
      id: 'event-6',
      name: '支付成功',
      description: '用户完成支付',
      type: 'custom',
      identifier: 'payment_succ',
      status: 'enabled',
      createdAt: '2023-02-01'
    },
    {
      id: 'event-7',
      name: '订单取消',
      description: '用户取消订单',
      type: 'click',
      identifier: 'order_cancel',
      status: 'disabled',
      createdAt: '2023-02-15'
    }
  ],
  'project-3': [
    {
      id: 'event-8',
      name: '员工打卡',
      description: '员工上下班打卡',
      type: 'click',
      identifier: 'employee_clock',
      status: 'enabled',
      createdAt: '2023-01-01'
    },
    {
      id: 'event-9',
      name: '请假申请',
      description: '员工提交请假申请',
      type: 'click',
      identifier: 'leave_request',
      status: 'enabled',
      createdAt: '2023-01-10'
    },
    {
      id: 'event-10',
      name: '工资查询',
      description: '员工查询工资信息',
      type: 'pageview',
      identifier: 'salary_query',
      status: 'enabled',
      createdAt: '2023-01-20'
    }
  ]
};

// 新增：模拟数据库 - 项目概览数据
const mockProjectOverviews: Record<string, ProjectOverview> = {
  'project-1': {
    errorsToday: 5,
    affectedUsers: 23,
    averageResponseTime: 180,
    onlineUsers: 456
  },
  'project-2': {
    errorsToday: 12,
    affectedUsers: 156,
    averageResponseTime: 245,
    onlineUsers: 1234
  },
  'project-3': {
    errorsToday: 3,
    affectedUsers: 8,
    averageResponseTime: 120,
    onlineUsers: 89
  }
};

// 新增：模拟数据库 - 错误日志数据
let mockErrorLogs: Record<string, ErrorLog[]> = {
  'project-1': [
    {
      id: 'error-1',
      eventId: 'evt-001',
      eventType: '普通错误事件',
      currentPageUrl: 'https://example.com/user/login',
      timestamp: '2024-01-15 10:30:25',
      errorMessage: 'TypeError: Cannot read property \'length\' of undefined',
      stackTrace: 'at validateForm (login.js:15)\nat handleSubmit (login.js:8)'
    },
    {
      id: 'error-2',
      eventId: 'evt-002',
      eventType: '普通错误事件',
      currentPageUrl: 'https://example.com/user/register',
      timestamp: '2024-01-15 09:15:42',
      errorMessage: 'ReferenceError: userData is not defined',
      stackTrace: 'at processRegistration (register.js:22)\nat submitForm (register.js:12)'
    }
  ],
  'project-2': [
    {
      id: 'error-3',
      eventId: 'evt-003',
      eventType: '普通错误事件',
      currentPageUrl: 'https://example.com/product/list',
      timestamp: '2024-01-15 11:45:18',
      errorMessage: 'TypeError: Cannot read property \'price\' of null',
      stackTrace: 'at renderProduct (product.js:45)\nat loadProducts (product.js:18)'
    },
    {
      id: 'error-4',
      eventId: 'evt-004',
      eventType: '普通错误事件',
      currentPageUrl: 'https://example.com/cart/checkout',
      timestamp: '2024-01-15 08:20:33',
      errorMessage: 'NetworkError: Failed to fetch',
      stackTrace: 'at checkout (checkout.js:67)\nat processPayment (checkout.js:34)'
    }
  ],
  'project-3': [
    {
      id: 'error-5',
      eventId: 'evt-005',
      eventType: '普通错误事件',
      currentPageUrl: 'https://example.com/employee/dashboard',
      timestamp: '2024-01-15 14:10:55',
      errorMessage: 'TypeError: Cannot read property \'name\' of undefined',
      stackTrace: 'at displayEmployeeInfo (dashboard.js:28)\nat loadDashboard (dashboard.js:15)'
    }
  ]
};

// 新增：模拟数据库 - 错误详情数据
const mockErrorDetails: Record<string, ErrorDetail> = {
  'error-1': {
    id: 'error-1',
    eventId: 'evt-001',
    eventType: '普通错误事件',
    currentPageUrl: 'https://example.com/user/login',
    timestamp: '2024-01-15 10:30:25',
    errorMessage: 'TypeError: Cannot read property \'length\' of undefined',
    stackTrace: 'at validateForm (login.js:15)\nat handleSubmit (login.js:8)\nat HTMLButtonElement.onclick (login.js:25)',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    browser: 'Chrome 120.0.0.0',
    os: 'Windows 10',
    device: 'Desktop',
    screenResolution: '1920x1080',
    viewport: '1920x937',
    sourceCode: {
      file: 'login.js',
      line: 15,
      column: 12,
      code: 'function validateForm(formData) {',
      context: [
        { line: 13, code: '  // 验证表单数据', isErrorLine: false },
        { line: 14, code: '  if (!formData) {', isErrorLine: false },
        { line: 15, code: '    return false;', isErrorLine: true },
        { line: 16, code: '  }', isErrorLine: false },
        { line: 17, code: '  ', isErrorLine: false },
        { line: 18, code: '  // 检查必填字段', isErrorLine: false },
        { line: 19, code: '  if (formData.username.length === 0) {', isErrorLine: false },
        { line: 20, code: '    showError("用户名不能为空");', isErrorLine: false },
        { line: 21, code: '    return false;', isErrorLine: false },
        { line: 22, code: '  }', isErrorLine: false },
        { line: 23, code: '  ', isErrorLine: false },
        { line: 24, code: '  return true;', isErrorLine: false },
        { line: 25, code: '}', isErrorLine: false }
      ]
    },
    recordingId: 'recording-001'
  }
};

// 新增：模拟录屏数据
const mockRecordings: Record<string, any> = {
  'recording-001': {
    id: 'recording-001',
    events: [
      { type: 'dom', timestamp: 0, data: { /* DOM 事件数据 */ } },
      { type: 'mouse', timestamp: 1000, data: { x: 100, y: 200 } },
      { type: 'click', timestamp: 2000, data: { x: 100, y: 200 } },
      // ... 更多录屏事件
    ]
  }
};

// 模拟API延迟
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// 模拟API类
export class MockAPI {
  // 获取项目信息
  static async getProject(projectId: string): Promise<Project> {
    await delay(300); // 模拟网络延迟
    
    const project = mockProjects[projectId];
    if (!project) {
      throw new Error(`项目不存在: ${projectId}`);
    }
    
    return project;
  }

  // 获取项目概览数据
  static async getProjectOverview(projectId: string): Promise<ProjectOverview> {
    await delay(400); // 模拟网络延迟
    
    const overview = mockProjectOverviews[projectId];
    if (!overview) {
      // 返回默认数据
      return {
        errorsToday: 0,
        affectedUsers: 0,
        averageResponseTime: 0,
        onlineUsers: 0
      };
    }
    
    return overview;
  }

  // 获取错误日志列表
  static async getErrorLogs(projectId: string): Promise<ErrorLog[]> {
    await delay(500); // 模拟网络延迟
    
    const logs = mockErrorLogs[projectId];
    if (!logs) {
      return [];
    }
    
    return logs;
  }

  // 添加错误日志
  static async addErrorLog(projectId: string, errorLog: Omit<ErrorLog, 'id'>): Promise<ErrorLog> {
    await delay(300); // 模拟网络延迟
    
    if (!mockErrorLogs[projectId]) {
      mockErrorLogs[projectId] = [];
    }
    
    const newErrorLog: ErrorLog = {
      id: `error-${Date.now()}`,
      ...errorLog
    };
    
    mockErrorLogs[projectId].unshift(newErrorLog); // 添加到开头
    
    return newErrorLog;
  }

  // 获取项目埋点事件列表
  static async getEvents(projectId: string): Promise<TrackingEvent[]> {
    await delay(500); // 模拟网络延迟
    
    const events = mockProjectEvents[projectId];
    if (!events) {
      return []; // 返回空数组而不是抛出错误
    }
    
    return events;
  }

  // 创建新事件
  static async createEvent(projectId: string, eventData: Omit<TrackingEvent, 'id' | 'createdAt'>): Promise<TrackingEvent> {
    await delay(400); // 模拟网络延迟
    
    // 检查项目是否存在
    if (!mockProjectEvents[projectId]) {
      mockProjectEvents[projectId] = [];
    }
    
    // 检查标识符是否已存在
    const existingEvent = mockProjectEvents[projectId].find(e => e.identifier === eventData.identifier);
    if (existingEvent) {
      throw new Error('事件标识符已存在');
    }
    
    // 创建新事件
    const newEvent: TrackingEvent = {
      id: `event-${Date.now()}`,
      ...eventData,
      createdAt: new Date().toISOString().split('T')[0] || ''
    };
    
    // 添加到数据库
    mockProjectEvents[projectId].push(newEvent);
    
    return newEvent;
  }

  // 更新事件
  static async updateEvent(projectId: string, eventId: string, eventData: Omit<TrackingEvent, 'id' | 'createdAt'>): Promise<TrackingEvent> {
    await delay(400); // 模拟网络延迟
    
    const events = mockProjectEvents[projectId];
    if (!events) {
      throw new Error(`项目不存在: ${projectId}`);
    }
    
    const eventIndex = events.findIndex(e => e.id === eventId);
    if (eventIndex === -1) {
      throw new Error(`事件不存在: ${eventId}`);
    }
    
    // 检查标识符是否与其他事件冲突
    const existingEvent = events.find(e => e.id !== eventId && e.identifier === eventData.identifier);
    if (existingEvent) {
      throw new Error('事件标识符已存在');
    }
    
    // 更新事件
    const updatedEvent: TrackingEvent = {
      ...events[eventIndex],
      ...eventData
    };
    
    events[eventIndex] = updatedEvent;
    
    return updatedEvent;
  }

  // 删除事件
  static async deleteEvent(projectId: string, eventId: string): Promise<void> {
    await delay(300); // 模拟网络延迟
    
    const events = mockProjectEvents[projectId];
    if (!events) {
      throw new Error(`项目不存在: ${projectId}`);
    }
    
    const eventIndex = events.findIndex(e => e.id === eventId);
    if (eventIndex === -1) {
      throw new Error(`事件不存在: ${eventId}`);
    }
    
    // 删除事件
    events.splice(eventIndex, 1);
  }

  // 获取所有项目列表（用于项目管理页面）
  static async getAllProjects(): Promise<Project[]> {
    await delay(500);
    return Object.values(mockProjects);
  }

  // 创建新项目
  static async createProject(projectData: Omit<Project, 'id'>): Promise<Project> {
    await delay(400);
    
    // 检查项目名称是否已存在
    const existingProject = Object.values(mockProjects).find(p => p.name === projectData.name);
    if (existingProject) {
      throw new Error('项目名称已存在');
    }
    
    const newProject: Project = {
      id: `project-${Date.now()}`,
      ...projectData
    };
    
    mockProjects[newProject.id] = newProject;
    mockProjectEvents[newProject.id] = []; // 初始化空的事件列表
    mockErrorLogs[newProject.id] = []; // 初始化空的错误日志
    mockProjectOverviews[newProject.id] = { // 初始化概览数据
      errorsToday: 0,
      affectedUsers: 0,
      averageResponseTime: 0,
      onlineUsers: 0
    };
    
    return newProject;
  }

  // 更新项目
  static async updateProject(projectId: string, projectData: Partial<Omit<Project, 'id'>>): Promise<Project> {
    await delay(400);
    
    const project = mockProjects[projectId];
    if (!project) {
      throw new Error(`项目不存在: ${projectId}`);
    }
    
    // 检查项目名称是否与其他项目冲突
    if (projectData.name) {
      const existingProject = Object.values(mockProjects).find(p => p.id !== projectId && p.name === projectData.name);
      if (existingProject) {
        throw new Error('项目名称已存在');
      }
    }
    
    const updatedProject: Project = {
      ...project,
      ...projectData
    };
    
    mockProjects[projectId] = updatedProject;
    
    return updatedProject;
  }

  // 删除项目
  static async deleteProject(projectId: string): Promise<void> {
    await delay(300);
    
    if (!mockProjects[projectId]) {
      throw new Error(`项目不存在: ${projectId}`);
    }
    
    delete mockProjects[projectId];
    delete mockProjectEvents[projectId];
    delete mockErrorLogs[projectId];
    delete mockProjectOverviews[projectId];
  }

  // 新增：获取错误详情
  static async getErrorDetail(errorId: string): Promise<ErrorDetail | null> {
    await delay(500);
    return mockErrorDetails[errorId] || null;
  }

  // 新增：获取录屏数据
  static async getRecording(recordingId: string): Promise<any> {
    await delay(300);
    return mockRecordings[recordingId] || null;
  }
}
