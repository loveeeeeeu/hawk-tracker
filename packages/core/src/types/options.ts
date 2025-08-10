import { AnyObj, AnyFun, VoidFun } from "./common";

// 功能配置接口
interface Pv {
  core?: boolean // 是否发送页面跳转相关数据
}

interface Performance {
  core?: boolean // 是否采集静态资源、接口的相关数据
  firstResource?: boolean // 是否采集首次进入页面的数据
  server?: boolean // 是否采集接口请求
}

interface Error {
  core?: boolean // 是否采集异常数据
  server?: boolean // 是否采集报错接口数据
}

interface Event {
  core?: boolean // 是否采集点击事件
}

/**
 * SDK初始化入参配置
 */
export interface InternalConfig {
  dsn: string // 上报地址
  appName: string // 应用名称
  appCode?: string // 应用code
  appVersion?: string // 应用版本
  userUuid?: string // 用户id(外部填充进来的id)
  sampleRate?: number // 采样率
  debug?: boolean // 是否开启调试模式(控制台会输出sdk动作)
  // debug?: boolean // 是否开启调试模式(控制台会输出sdk动作)
  // pv?: Pv | boolean
  // performance?: Performance | boolean
  // error?: Error | boolean
  // event?: Event | boolean
  // ext?: AnyObj // 自定义全局附加参数(放在baseInfo中)
  // tracesSampleRate?: number // 抽样发送
  // cacheMaxLength?: number // 上报数据最大缓存数
  // cacheWatingTime?: number // 上报数据最大等待时间
  // ignoreErrors?: Array<string | RegExp> // 错误类型事件过滤
  // ignoreRequest?: Array<string | RegExp> // 请求类型事件过滤
  // scopeError?: boolean // 当某个时间段报错时，会将此类错误转为特殊错误类型
  // localization?: boolean // 是否本地化：sdk不再主动发送事件，事件都存储在本地
  // sendTypeByXmlBody?: boolean // 是否强制指定发送形式为xml，body请求方式
  // recordScreen?: boolean // 是否启动录屏
  // beforePushEventList?: (data: any) => any // 添加到行为列表前的 hook
  // beforeSendData?: (data: any) => any // 数据上报前的 hook
  // afterSendData?: (data: any) => void // 数据上报后的 hook
  // timeout?: number // 日志上报超时时间（毫秒）
  // maxQueueLength?: number // 上报接口异常，日志队列最大缓存数
  // checkRecoverInterval?: number // 多长时间检测一次上报接口是否恢复（分钟）
  
  // 兼容旧版本
  // apikey?: string
  // disable?: boolean
}
