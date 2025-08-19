# Vue3 监控系统部署指南

本文档说明如何部署集成了监控系统的Vue3应用。

## 📋 部署准备

### 1. 环境要求

- Node.js 18+
- pnpm 8+ (推荐) 或 npm/yarn
- 现代浏览器支持

### 2. 构建前检查

```bash
# 检查依赖是否正确安装
pnpm install

# 检查TypeScript类型
pnpm run type-check

# 运行linting检查
pnpm run lint
```

## 🔧 源码引用部署

### 1. Monorepo环境构建

```bash
# 在项目根目录下
cd hawk-tracker

# 构建核心包
pnpm run build --filter @hawk-tracker/core

# 构建错误插件
pnpm run build --filter @hawk-tracker/plugin-error

# 构建Vue3应用
pnpm run build --filter vue3-monitor-demo
```

### 2. 验证构建

```bash
# 检查核心包构建产物
ls packages/core/dist/
# 应该包含: index.js, index.mjs, index.d.ts

# 检查插件构建产物
ls packages/plugin-error/dist/
# 应该包含: index.js, index.mjs, index.d.ts

# 检查应用构建产物
ls apps/vue3-monitor-demo/dist/
# 应该包含: index.html, assets/, 等静态文件
```

### 3. 部署配置

**生产环境变量 (.env.production):**

```bash
VITE_MONITOR_DSN=https://api.your-domain.com/track
VITE_APP_NAME=vue3-monitor-demo
VITE_APP_VERSION=1.0.0
VITE_DEBUG_MODE=false
VITE_SAMPLE_RATE=0.1
```

## 📦 非源码引用部署

### 1. 独立项目构建

```bash
# 在Vue3应用目录下
cd your-vue3-app

# 安装依赖
npm install

# 构建生产版本
npm run build
```

### 2. 包版本管理

**package.json 锁定版本:**

```json
{
  "dependencies": {
    "@hawk-tracker/core": "1.0.0",
    "@hawk-tracker/plugin-error": "1.0.0"
  }
}
```

### 3. CDN部署优化

**vite.config.ts 配置外部依赖:**

```typescript
export default defineConfig({
  build: {
    rollupOptions: {
      external: ['@hawk-tracker/core', '@hawk-tracker/plugin-error'],
      output: {
        globals: {
          '@hawk-tracker/core': 'HawkTrackerCore',
          '@hawk-tracker/plugin-error': 'HawkTrackerErrorPlugin',
        },
      },
    },
  },
});
```

## 🐳 Docker部署

### 1. 多阶段构建 Dockerfile

```dockerfile
# 构建阶段
FROM node:18-alpine as builder

WORKDIR /app

# 复制package文件
COPY package*.json ./
COPY pnpm-lock.yaml ./

# 安装pnpm
RUN npm install -g pnpm

# 安装依赖
RUN pnpm install --frozen-lockfile

# 复制源码
COPY . .

# 构建应用
RUN pnpm run build

# 生产阶段
FROM nginx:alpine

# 复制构建产物
COPY --from=builder /app/dist /usr/share/nginx/html

# 复制nginx配置
COPY nginx.conf /etc/nginx/nginx.conf

# 暴露端口
EXPOSE 80

# 启动nginx
CMD ["nginx", "-g", "daemon off;"]
```

### 2. Nginx配置

**nginx.conf:**

```nginx
events {
    worker_connections 1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    # 日志格式
    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';

    access_log /var/log/nginx/access.log main;
    error_log /var/log/nginx/error.log;

    # 基础配置
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;

    # Gzip压缩
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_comp_level 6;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/javascript
        application/xml+rss
        application/json;

    server {
        listen 80;
        server_name localhost;
        root /usr/share/nginx/html;
        index index.html;

        # 处理Vue Router的history模式
        location / {
            try_files $uri $uri/ /index.html;
        }

        # 静态资源缓存
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }

        # 安全头
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header X-XSS-Protection "1; mode=block" always;
        add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    }
}
```

### 3. Docker Compose部署

**docker-compose.yml:**

```yaml
version: '3.8'

services:
  vue3-monitor-app:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - '80:80'
    environment:
      - NODE_ENV=production
    restart: unless-stopped
    networks:
      - monitor-network

  # 可选：监控数据收集服务
  monitor-api:
    image: your-monitor-api:latest
    ports:
      - '3000:3000'
    environment:
      - DATABASE_URL=postgresql://user:pass@db:5432/monitor
    networks:
      - monitor-network
    depends_on:
      - db

  db:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=monitor
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=pass
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - monitor-network

networks:
  monitor-network:
    driver: bridge

volumes:
  postgres_data:
```

## ☁️ 云平台部署

### 1. Vercel部署

**vercel.json:**

```json
{
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ],
  "env": {
    "VITE_MONITOR_DSN": "@monitor-dsn",
    "VITE_APP_NAME": "vue3-monitor-demo",
    "VITE_APP_VERSION": "1.0.0"
  }
}
```

### 2. Netlify部署

**netlify.toml:**

```toml
[build]
  publish = "dist"
  command = "npm run build"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  VITE_MONITOR_DSN = "https://api.your-domain.com/track"
  VITE_APP_NAME = "vue3-monitor-demo"
  VITE_APP_VERSION = "1.0.0"
```

### 3. AWS S3 + CloudFront部署

**部署脚本 (deploy.sh):**

```bash
#!/bin/bash

# 构建应用
npm run build

# 同步到S3
aws s3 sync dist/ s3://your-bucket-name --delete

# 清除CloudFront缓存
aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"

echo "部署完成！"
```

## 📊 监控配置

### 1. 生产环境监控配置

```typescript
// src/monitor-config.ts
export const productionConfig = {
  dsn: process.env.VITE_MONITOR_DSN,
  appName: process.env.VITE_APP_NAME,
  appVersion: process.env.VITE_APP_VERSION,
  debug: false,
  sampleRate: 0.1, // 10% 采样率
  timeout: 3000,
  maxQueueLength: 50,
  beforeSendData: (data) => {
    // 生产环境数据脱敏
    return sanitizeData(data);
  },
};
```

### 2. 错误过滤配置

```typescript
export const errorFilterConfig = {
  filterErrors: (error: Error) => {
    // 过滤掉无用的错误
    const ignoredMessages = [
      'Script error',
      'ResizeObserver loop limit exceeded',
      'Non-Error promise rejection captured',
      'Loading chunk',
    ];

    return !ignoredMessages.some((msg) => error.message.includes(msg));
  },
};
```

## 🔍 部署验证

### 1. 功能测试

```bash
# 访问应用
curl -I https://your-domain.com

# 检查监控端点
curl -X POST https://your-domain.com/api/track \
  -H "Content-Type: application/json" \
  -d '{"test": "data"}'
```

### 2. 性能测试

```bash
# 使用Lighthouse
npx lighthouse https://your-domain.com --output=html

# 使用WebPageTest
# 访问 https://www.webpagetest.org/
```

### 3. 监控验证

1. 访问应用首页
2. 触发一些错误（错误演示页面）
3. 检查监控后台是否收到数据
4. 验证错误过滤是否正常工作

## 🚨 故障排除

### 常见问题

1. **构建失败**

   ```bash
   # 清理缓存
   rm -rf node_modules
   rm -rf dist
   npm install
   ```

2. **监控数据未上报**
   - 检查网络连接
   - 验证DSN配置
   - 查看浏览器控制台错误

3. **静态资源404**
   - 检查nginx配置
   - 验证publicPath设置

4. **Docker构建失败**
   ```bash
   # 清理Docker缓存
   docker system prune -a
   ```

## 📞 技术支持

如遇到部署问题，请：

1. 检查构建日志
2. 验证环境变量配置
3. 测试监控端点连通性
4. 查看应用运行日志
5. 联系技术支持团队
