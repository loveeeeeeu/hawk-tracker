import { AnyObj, AnyFun, VoidFun } from './common';
import { LISTEN_TYPES } from '../common/event';

// 功能配置接口
interface Pv {
  core?: boolean; // 是否发送页面跳转相关数据
}

interface Performance {
  core?: boolean; // 是否采集静态资源、接口的相关数据
  firstResource?: boolean; // 是否采集首次进入页面的数据
  server?: boolean; // 是否采集接口请求
}

interface Error {
  core?: boolean; // 是否采集异常数据
  server?: boolean; // 是否采集报错接口数据
}

interface Event {
  core?: boolean; // 是否采集点击事件
}

interface Behavior {
  core?: boolean; // 是否启用行为栈管理
  maxSize?: number; // 默认行为栈最大事件数量
  maxAge?: number; // 默认行为栈最大事件年龄（毫秒）
  debug?: boolean; // 是否开启行为栈调试模式

  // 点击事件控制配置
  click?: {
    enabled?: boolean; // 是否启用点击事件监控
    throttle?: number; // 点击事件节流时间（毫秒），默认100ms
    ignoreSelectors?: string[]; // 忽略的选择器列表
    capturePosition?: boolean; // 是否捕获点击位置
    captureElementInfo?: boolean; // 是否捕获元素详细信息
    maxElementTextLength?: number; // 元素文本最大长度，默认100
    customAttributes?: string[]; // 自定义属性列表
    beforeSend?: (event: ClickEvent) => ClickEvent | null; // 发送前钩子
    afterSend?: (success: boolean, data: any) => void; // 发送后钩子
  };

  // 监听器控制配置
  listeners?: {
    enabled?: LISTEN_TYPES[]; // 启用的监听器类型列表
    disabled?: LISTEN_TYPES[]; // 禁用的监听器类型列表
  };
}

/**
 * SDK初始化入参配置
 */
export interface InternalConfig {
  dsn: string; // 上报地址
  appName: string; // 应用名称
  appCode?: string; // 应用code
  appVersion?: string; // 应用版本
  userUuid?: string; // 用户id(外部填充进来的id)
  sampleRate?: number; // 采样率
  debug?: boolean; // 是否开启调试模式(控制台会输出sdk动作)
  behavior?: Behavior; // 行为栈配置

  // DataSender相关配置（已实现）
  batchSize?: number; // 批量上报大小
  sendInterval?: number; // 上报间隔（毫秒）
  maxRetry?: number; // 最大重试次数
  backoffBaseMs?: number; // 退避基础时间（毫秒）
  backoffMaxMs?: number; // 退避最大时间（毫秒）
  maxConcurrentRequests?: number; // 最大并发请求数
  offlineStorageKey?: string; // 离线存储键名

  // 其他功能配置（预留/已有）
  pv?: Pv | boolean;
  performance?: Performance | boolean;
  error?: Error | boolean;
  event?: Event | boolean;
  ext?: AnyObj; // 自定义全局附加参数(放在baseInfo中)
  tracesSampleRate?: number; // 抽样发送

  // 注意：同时保留两个字段以兼容历史
  cacheMaxLength?: number; // 上报数据最大缓存数
  cacheWaitingTime?: number; // 上报数据最大等待时间（推荐字段）

  ignoreErrors?: Array<string | RegExp>; // 错误类型事件过滤
  ignoreRequest?: Array<string | RegExp>; // 请求类型事件过滤
  scopeError?: boolean; // 当某个时间段报错时，会将此类错误转为特殊错误类型
  localization?: boolean; // 是否本地化：sdk不再主动发送事件，事件都存储在本地
  sendTypeByXmlBody?: boolean; // 是否强制指定发送形式为xml，body请求方式
  recordScreen?: boolean; // 是否启动录屏

  beforePushEventList?: (data: any) => any; // 添加到行为列表前的 hook
  beforeSendData?: (data: any) => any; // 数据上报前的 hook
  afterSendData?: (data: any) => void; // 数据上报后的 hook

  timeout?: number; // 日志上报超时时间（毫秒）
  maxQueueLength?: number; // 上报接口异常，日志队列最大缓存数
  checkRecoverInterval?: number; // 多长时间检测一次上报接口是否恢复（分钟）

  // 兼容旧版本
  apikey?: string;
  disable?: boolean;
}

// 点击事件数据结构
export interface ClickEvent {
  eventId: string; // 事件唯一标识
  title?: string; // 事件标题
  eventType: 'click'; // 事件类型
  params: Record<string, any>; // 自定义参数
  triggerPageUrl: string; // 触发页面URL
  triggerTime: number; // 触发时间戳
  elementPath: string; // 元素路径
  x: number; // 点击X坐标
  y: number; // 点击Y坐标
  elementId?: string; // 元素ID
}

// 点击事件配置
export interface ClickTrackerConfig {
  eventId: string; // 事件ID
  title?: string; // 事件标题
  params?: Record<string, any>; // 自定义参数
}
