import { LISTEN_TYPES } from '../common/event';

/**
 * 行为事件基础接口
 */
export interface BehaviorEvent {
  /** 事件类型 */
  type: LISTEN_TYPES | string;
  /** 事件发生时间戳 */
  timestamp: number;
  /** 事件唯一标识 */
  id: string;
  /** 页面URL */
  pageUrl: string;
  /** 事件上下文信息 */
  context: BehaviorEventContext;
  /** 自定义数据 */
  customData?: Record<string, any>;
}

/**
 * 行为事件上下文信息
 */
export interface BehaviorEventContext {
  /** 自定义数据 */
  customData?: Record<string, any>;
  /** 元素信息 */
  element?: {
    /** 元素标签名 */
    tagName: string;
    /** 元素ID */
    id?: string;
    /** 元素类名 */
    className?: string;
    /** 元素文本内容 */
    textContent?: string;
    /** 元素位置信息 */
    position?: {
      x: number;
      y: number;
    };
    /** 元素尺寸 */
    size?: {
      width: number;
      height: number;
    };
  };
  /** 网络请求信息 */
  network?: {
    /** 请求URL */
    url: string;
    /** 请求方法 */
    method?: string;
    /** 请求状态码 */
    status?: number;
    /** 请求状态文本 */
    statusText?: string;
    /** 请求耗时 */
    duration?: number;
    /** 请求大小 */
    size?: number;
  };
  /** 路由信息 */
  route?: {
    /** 路由类型 */
    type: 'pushState' | 'replaceState' | 'popstate' | 'hashchange';
    /** 路由地址 */
    from: string;
    /** 路由地址 */
    to: string;
  };
  /** 页面信息 */
  page?: {
    /** 页面标题 */
    title: string;
    /** 页面加载时间 */
    loadTime?: number;
    /** 页面性能指标 */
    performance?: Record<string, number>;
  };
  /** 用户代理信息 */
  userAgent?: string;
  /** 屏幕信息 */
  screen?: {
    width: number;
    height: number;
    availWidth: number;
    availHeight: number;
  };
  /** 视口信息 */
  viewport?: {
    width: number;
    height: number;
  };
}

/**
 * 行为栈配置选项
 */
export interface BehaviorStackConfig {
  /** 最大事件数量 */
  maxSize?: number;
  /** 最大事件年龄（毫秒） */
  maxAge?: number;
  /** 是否开启调试模式 */
  debug?: boolean;
  /** 栈名称 */
  name?: string;
  /** 自定义事件过滤器 */
  filter?: (event: BehaviorEvent) => boolean;
}

/**
 * 行为栈快照选项
 */
export interface SnapshotOptions {
  /** 最大事件数量 */
  maxCount?: number;
  /** 开始时间戳 */
  startTime?: number;
  /** 结束时间戳 */
  endTime?: number;
  /** 包含的事件类型 */
  includeTypes?: (LISTEN_TYPES | string)[];
  /** 排除的事件类型 */
  excludeTypes?: (LISTEN_TYPES | string)[];
}

/**
 * 行为栈统计信息
 */
export interface BehaviorStackStats {
  /** 总事件数量 */
  totalEvents: number;
  /** 当前栈中事件数量 */
  currentEvents: number;
  /** 最早事件时间 */
  earliestEventTime: number;
  /** 最新事件时间 */
  latestEventTime: number;
  /** 事件类型分布 */
  typeDistribution: Record<string, number>;
  /** 栈名称 */
  name: string;
}
