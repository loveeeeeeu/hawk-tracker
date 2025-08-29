# Hawk Tracker Web 应用结构说明文档

## 📋 概述

Hawk Tracker Web 是一个基于 React + TypeScript + Tailwind CSS 构建的现代化项目监控管理系统。该系统提供了完整的用户认证、项目管理、数据监控和可视化分析功能。

## 🏗️ 技术架构

- **前端框架**: React 19 + TypeScript
- **路由系统**: React Router v7
- **样式框架**: Tailwind CSS v3
- **状态管理**: React Context API
- **构建工具**: Vite
- **包管理**: pnpm + workspace

## 🌐 应用结构图

```
🌐 Hawk Tracker Web 应用
├── 🔐 认证系统
│   ├── /login - 登录页面
│   ├── /register - 注册页面
│   └── AuthContext - 用户认证上下文
│
├── 🏠 首页 (/)
│   ├── 导航栏（Hawk Tracker 标题 + 用户信息 + 退出登录）
│   └── DashboardPage - 仪表板页面
│
├── 👤 用户管理 (/profile)
│   └── 用户资料页面
│
├── 📁 项目管理 (/projects)
│   ├── 项目列表展示
│   ├── 搜索和筛选功能
│   ├── 创建新项目
│   └── 项目操作（查看、埋点等）
│
└── 📊 项目监控 (/projects/:projectId)
    ├── 📈 概览 (/overview) - 监控数据总览
    │   ├── 错误数量统计
    │   ├── 性能数据统计
    │   ├── 用户行为统计
    │   ├── 总数据量统计
    │   ├── 最近数据表格
    │   └── 快速操作按钮
    │
    ├── ❌ 错误日志 (/errors-log)
    │   ├── 错误列表展示
    │   ├── 错误详情查看 (/errors-log/:errorId)
    │   └── Hawk Tracker 错误测试功能
    │
    ├── ⚡ 性能日志 (/performance)
    │   ├── 页面性能数据
    │   ├── 资源加载性能
    │   └── 接口响应时间
    │
    ├── 👥 用户日志 (/users)
    │   ├── 用户行为数据
    │   └── 页面访问统计
    │
    ├── 🎯 自定义埋点 (/custom)
    │   ├── 自定义事件数据
    │   └── 手动上报的事件
    │
    ├── ⚙️ 项目设置 (/settings)
    │   └── 项目配置管理
    │
    └── 🎯 埋点管理 (/trackings)
        ├── 埋点事件列表
        ├── 添加/编辑埋点
        └── 埋点数据管理
```

## 🎯 路由功能详解

### **1. 认证路由**

#### `/login` - 用户登录

- **功能**: 用户身份验证
- **特性**:
  - 用户名/密码登录
  - 表单验证
  - 错误提示
  - 登录状态管理
- **组件**: `routes/login.tsx`

#### `/register` - 用户注册

- **功能**: 新用户账户创建
- **特性**:
  - 用户信息注册
  - 密码确认
  - 表单验证
- **组件**: `routes/register.tsx`

### **2. 主要功能路由**

#### `/` - 应用首页

- **功能**: 应用主入口
- **特性**:
  - 用户认证状态检查
  - 导航栏显示
  - 仪表板展示
- **组件**: `routes/home.tsx`
- **子组件**: `components/dashboardPage/DashboardPage.tsx`

#### `/profile` - 用户资料

- **功能**: 用户个人信息管理
- **特性**:
  - 查看用户信息
  - 编辑用户资料
- **组件**: `components/profile/index.tsx`

#### `/projects` - 项目管理

- **功能**: 项目列表和操作
- **特性**:
  - 项目列表展示
  - 搜索和筛选
  - 创建新项目
  - 项目状态管理
- **组件**: `components/projects/project/project.tsx`

### **3. 项目监控路由** (`/projects/:projectId`)

#### `/overview` - 监控概览

- **功能**: 项目监控数据总览
- **特性**:
  - 关键指标展示（错误、性能、行为、总量）
  - 最近数据表格
  - 实时数据更新（30秒刷新）
  - 快速导航到其他监控页面
- **组件**: `components/projects/[projectId]/log/overview/page.tsx`
- **数据源**: 连接到 Hawk Tracker Server (`http://localhost:3001/api`)

#### `/errors-log` - 错误日志

- **功能**: 错误监控和分析
- **特性**:
  - 错误列表展示
  - 错误详情查看
  - Hawk Tracker 错误测试功能
  - 错误分类和筛选
- **组件**: `components/projects/[projectId]/log/errors-log/page.tsx`

#### `/performance` - 性能日志

- **功能**: 性能数据监控
- **特性**:
  - 页面加载性能
  - 资源加载时间
  - 接口响应时间
  - 性能指标图表
- **组件**: `components/projects/[projectId]/log/performance/page.tsx`

#### `/users` - 用户日志

- **功能**: 用户行为监控
- **特性**:
  - 用户操作记录
  - 页面访问统计
  - 用户行为分析
- **组件**: `components/projects/[projectId]/log/users/page.tsx`

#### `/custom` - 自定义埋点

- **功能**: 自定义事件监控
- **特性**:
  - 自定义事件数据
  - 手动上报的事件
  - 事件统计分析
- **组件**: `components/projects/[projectId]/log/custom/page.tsx`

#### `/settings` - 项目设置

- **功能**: 项目配置管理
- **特性**:
  - 项目基本信息
  - 监控配置
  - 权限设置
- **组件**: `components/projects/[projectId]/settings/page.tsx`

#### `/trackings` - 埋点管理

- **功能**: 埋点事件管理
- **特性**:
  - 埋点事件列表
  - 添加/编辑埋点
  - 埋点数据管理
  - 埋点配置
- **组件**: `components/projects/[projectId]/trackings/index.tsx`

## 🔧 核心组件结构

### **布局组件**

- `components/projects/[projectId]/log/layout.tsx` - 项目监控页面布局
  - 左侧导航栏
  - 右侧内容区域
  - 路由嵌套结构

### **通用组件**

- `components/ProtectedRoute.tsx` - 路由保护组件
- `components/Breadcrumb.tsx` - 面包屑导航
- `components/PageHeader.tsx` - 页面头部
- `components/Pagination.tsx` - 分页组件
- `components/SearchBar.tsx` - 搜索栏
- `components/FilterBar.tsx` - 筛选栏

### **业务组件**

- `components/dashboardPage/DashboardPage.tsx` - 仪表板
- `components/projects/project/ProjectTable.tsx` - 项目表格
- `components/projects/project/ProjectHeader.tsx` - 项目头部

## 📊 数据流架构

```
用户操作 → React 组件 → Hawk Tracker SDK → Server API → 数据存储
    ↓
数据展示 ← 组件状态 ← API 调用 ← 数据查询 ← 数据存储
```

### **数据来源**

1. **Hawk Tracker Server**: `http://localhost:3001/api`
   - `/api/stats` - 统计数据
   - `/api/data` - 详细数据
   - `/api` - SDK 数据接收端点

2. **MockAPI**: 开发阶段的模拟数据
   - 项目信息
   - 用户数据
   - 基础配置

## 🔐 认证和权限

### **认证流程**

1. 用户访问受保护路由
2. `ProtectedRoute` 组件检查认证状态
3. 未认证用户重定向到登录页面
4. 认证成功后访问目标页面

### **权限控制**

- 基于用户角色的访问控制
- 项目级别的权限管理
- 功能模块的权限验证

## 🎨 UI/UX 设计

### **设计原则**

- 现代化界面设计
- 响应式布局
- 直观的用户体验
- 一致的设计语言

### **样式系统**

- Tailwind CSS 工具类
- 自定义组件样式
- 主题色彩系统
- 响应式断点

## 🚀 部署和配置

### **环境配置**

- 开发环境: `pnpm dev`
- 构建环境: `pnpm build`
- 生产环境: `pnpm start`

### **依赖管理**

- 核心依赖: React, React Router, TypeScript
- 样式依赖: Tailwind CSS, PostCSS
- 开发依赖: Vite, ESLint, TypeScript 编译器

## 📝 开发指南

### **添加新路由**

1. 在 `app/routes.ts` 中定义路由
2. 创建对应的页面组件
3. 更新导航菜单
4. 添加路由保护（如需要）

### **添加新功能**

1. 创建功能组件
2. 更新相关页面
3. 添加类型定义
4. 更新文档

### **样式修改**

1. 使用 Tailwind CSS 类名
2. 在 `app/app.css` 中添加自定义样式
3. 遵循设计系统规范

## 🔍 故障排除

### **常见问题**

1. **路由不匹配**: 检查 `routes.ts` 配置
2. **组件渲染错误**: 检查 TypeScript 类型定义
3. **样式不生效**: 检查 Tailwind CSS 配置
4. **数据加载失败**: 检查 API 端点和网络连接

### **调试工具**

- 浏览器开发者工具
- React Developer Tools
- TypeScript 类型检查
- ESLint 代码检查

## 📚 相关文档

- [React 官方文档](https://react.dev/)
- [React Router 文档](https://reactrouter.com/)
- [Tailwind CSS 文档](https://tailwindcss.com/)
- [TypeScript 文档](https://www.typescriptlang.org/)
- [Vite 文档](https://vitejs.dev/)

---

**文档版本**: 1.0.0  
**最后更新**: 2024年12月  
**维护者**: Hawk Tracker 开发团队
