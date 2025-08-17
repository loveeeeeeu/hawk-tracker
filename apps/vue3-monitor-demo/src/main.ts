import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { createPinia } from 'pinia'
import App from './App.vue'

// 方式1：源码引用 - 直接从workspace包引入
import { init as initHawkTracker } from '@hawk-tracker/core'
import { ErrorPlugin } from '@hawk-tracker/plugin-error'

// 方式2：非源码引用示例（如果包已发布到npm）
// import { init as initHawkTracker } from '@hawk-tracker/core'
// import { ErrorPlugin } from '@hawk-tracker/plugin-error'

// 导入配置
import { createMonitorInstance } from './monitor-config'

// 路由配置
const routes = [
  // promise 构造函数 需要引入 es2015 库
  { path: '/', component: () =>  import('./views/Home.vue') },
  { path: '/error-demo', component: () => import('./views/ErrorDemo.vue') },
  { path: '/performance-demo', component: () => import('./views/PerformanceDemo.vue') }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 初始化监控系统
const { config, errorPluginConfig } = createMonitorInstance()
const hawkTracker = initHawkTracker(config)

// 安装错误监控插件
hawkTracker.use(ErrorPlugin, errorPluginConfig)

// 创建Vue应用
const app = createApp(App)

app.use(createPinia())
app.use(router)

// 全局错误处理器（可选，用于捕获Vue组件错误）
app.config.errorHandler = (err: Error | unknown, instance, info) => {
  console.error('Vue Error:', err, info)
  // 手动上报错误到监控系统
  hawkTracker.track('error', {
    message: (err as Error).message,
    stack: (err as Error).stack,
    info,
    type: 'vue-error'
  })
}

app.mount('#app') 