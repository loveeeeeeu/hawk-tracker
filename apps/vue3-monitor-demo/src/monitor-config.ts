// 监控系统配置文件
export interface MonitorConfig {
  dsn: string
  appName: string
  appVersion: string
  debug: boolean
  sampleRate: number
  timeout?: number
  maxQueueLength?: number
  beforeSendData?: (data: any) => any
  afterSendData?: (result: any) => void
}

export interface ErrorPluginConfig {
  captureUnhandledRejections?: boolean
  captureConsoleErrors?: boolean
  maxStackTraceLength?: number
  filterErrors?: (error: Error) => boolean
}

// 开发环境配置
export const developmentConfig: MonitorConfig = {
  dsn: 'https://dev-api.your-domain.com/track',
  appName: 'vue3-monitor-demo',
  appVersion: '1.0.0-dev',
  debug: true,
  sampleRate: 1.0, // 开发环境全量采集
  timeout: 5000,
  maxQueueLength: 100,
  beforeSendData: (data) => {
    console.log('[Monitor] 发送数据:', data)
    return data
  },
  afterSendData: (result) => {
    console.log('[Monitor] 发送结果:', result)
  }
}

// 生产环境配置
export const productionConfig: MonitorConfig = {
  dsn: 'https://api.your-domain.com/track',
  appName: 'vue3-monitor-demo',
  appVersion: '1.0.0',
  debug: false,
  sampleRate: 0.1, // 生产环境 10% 采样率
  timeout: 3000,
  maxQueueLength: 50,
  beforeSendData: (data) => {
    // 生产环境可以进行数据脱敏处理
    const sanitizedData = { ...data }
    
    // 移除敏感信息
    if (sanitizedData.userAgent) {
      sanitizedData.userAgent = sanitizedData.userAgent.replace(/\d+\.\d+\.\d+\.\d+/g, '[IP]')
    }
    
    return sanitizedData
  }
}

// 错误插件配置
export const errorPluginConfig: ErrorPluginConfig = {
  captureUnhandledRejections: true,
  captureConsoleErrors: true,
  maxStackTraceLength: 50,
  filterErrors: (error: Error) => {
    // 过滤掉一些无用的错误
    const ignoredMessages = [
      'Script error',
      'ResizeObserver loop limit exceeded',
      'Non-Error promise rejection captured'
    ]
    
    return !ignoredMessages.some(msg => error.message.includes(msg))
  }
}

// 根据环境获取配置
export const getMonitorConfig = (): MonitorConfig => {
  const isDevelopment = import.meta.env.DEV
  
  // 优先使用环境变量
  const envConfig: Partial<MonitorConfig> = {
    dsn: import.meta.env.VITE_MONITOR_DSN,
    appName: import.meta.env.VITE_APP_NAME,
    appVersion: import.meta.env.VITE_APP_VERSION,
  }
  
  const baseConfig = isDevelopment ? developmentConfig : productionConfig
  
  return {
    ...baseConfig,
    ...Object.fromEntries(
      Object.entries(envConfig).filter(([_, value]) => value !== undefined)
    )
  }
}

// 使用示例配置的工厂函数
export const createMonitorInstance = () => {
  const config = getMonitorConfig()
  
  return {
    config,
    errorPluginConfig,
    // 可以在这里添加其他插件配置
  }
} 