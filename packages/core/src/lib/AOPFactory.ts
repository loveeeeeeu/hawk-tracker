import type { AnyFun } from '../types/common'
import { _global } from '../utils/global'
import {
  subscribeListener,
  unsubscribeListener,
  replaceMethod,
  throttle,
  getTimestamp,
  hasOwnProperty,
  hasGlobalProperty,
  createEventStorage,
  createOriginalMethodsStorage  
} from '../utils/common'
import { LISTEN_TYPES } from '../common/event'
import { eventCenter } from './eventCenter'
import debug from '../utils/debug'

// 存储原始方法，用于恢复
const originalMethods = createOriginalMethodsStorage<
  | 'consoleError'
  | 'xhrOpen' 
  | 'xhrSend'
  | 'fetch'
  | 'historyPushState'
  | 'historyReplaceState'
>()

// 存储事件监听器引用，用于移除
const eventHandlers = createEventStorage<
  | 'error'
  | 'unhandledrejection'
  | 'click'
  | 'load'
  | 'beforeunload'
  | 'hashchange'
  | 'popstate'
  | 'offline'
  | 'online'
>()

/**
 * 事件监听器工厂函数
 * @param type 事件类型
 * @param eventName 原生事件名
 * @param target 监听目标，默认为window
 * @param options 事件选项
 */
function createEventListener(
  type: LISTEN_TYPES,
  eventName: string,
  target: Window | Document = _global,
  options = false
): void {
  if (!target || !('addEventListener' in target)) return

  const handler = function (event: Event) {
    eventCenter.emit(type, event)
  }

  eventHandlers[eventName as keyof typeof eventHandlers] = handler
  
  debug.logDebug('createEventListener xxxxx',{target,eventName,handler,options})
  subscribeListener(target, eventName, handler, options)
}

/**
 * 创建节流事件监听器
 * @param type 事件类型
 * @param eventName 原生事件名
 * @param delay 节流延迟
 * @param target 监听目标
 * @param options 事件选项
 */
function createThrottledEventListener(
  type: LISTEN_TYPES,
  eventName: string,
  delay: number,
  target: Window | Document = _global,
  options = false
): void {
  if (!target || !('addEventListener' in target)) return

  const throttledHandler = throttle((event: Event) => {
    eventCenter.emit(type, event)
  }, delay, true)

  const handler = function (event: Event) {
    throttledHandler(event)
  }

  eventHandlers[eventName as keyof typeof eventHandlers] = handler
  subscribeListener(target, eventName, handler, options)
}

/**
 * 方法重写工厂函数
 * @param target 目标对象
 * @param methodName 方法名
 * @param type 事件类型
 * @param wrapper 包装函数
 * @param storageKey 存储原始方法的key
 */
function createMethodReplace<T extends Record<string, any>>(
  target: T,
  methodName: keyof T,
  type: LISTEN_TYPES,
  wrapper: (original: AnyFun, type: LISTEN_TYPES) => AnyFun,
  storageKey: keyof typeof originalMethods
): void {
  if (!target || !hasOwnProperty(target, methodName)) return

  // 保存原始方法
  originalMethods[storageKey] = target[methodName]

  replaceMethod(target, methodName, (original: AnyFun) => {
    return wrapper(original, type)
  })
}

/**
 * 监听器注册表
 */
const listenerRegistry: Record<LISTEN_TYPES, () => void> = {
  [LISTEN_TYPES.ERROR]: () => {
    createEventListener(LISTEN_TYPES.ERROR, 'error', _global, true)
  },

  [LISTEN_TYPES.UNHANDLEDREJECTION]: () => {
    createEventListener(LISTEN_TYPES.UNHANDLEDREJECTION, 'unhandledrejection')
  },

  [LISTEN_TYPES.CLICK]: () => {
    if (!hasGlobalProperty('document')) return
    createThrottledEventListener(
      LISTEN_TYPES.CLICK, 
      'click', 
      100, 
      _global.document, 
      true
    )
  },

  [LISTEN_TYPES.LOAD]: () => {
    createEventListener(LISTEN_TYPES.LOAD, 'load', _global, true)
  },

  [LISTEN_TYPES.BEFOREUNLOAD]: () => {
    createEventListener(LISTEN_TYPES.BEFOREUNLOAD, 'beforeunload')
  },

  [LISTEN_TYPES.HASHCHANGE]: () => {
    createEventListener(LISTEN_TYPES.HASHCHANGE, 'hashchange')
  },

  [LISTEN_TYPES.POPSTATE]: () => {
    createEventListener(LISTEN_TYPES.POPSTATE, 'popstate')
  },

  [LISTEN_TYPES.OFFLINE]: () => {
    createEventListener(LISTEN_TYPES.OFFLINE, 'offline')
  },

  [LISTEN_TYPES.ONLINE]: () => {
    createEventListener(LISTEN_TYPES.ONLINE, 'online')
  },

  [LISTEN_TYPES.READYSTATECHANGE]: () => {
    if (!hasGlobalProperty('document')) return
    createEventListener(LISTEN_TYPES.READYSTATECHANGE, 'readystatechange', _global.document)
  },

  [LISTEN_TYPES.CONSOLEERROR]: () => {
    if (!hasGlobalProperty('console')) return
    createMethodReplace(
      console,
      'error',
      LISTEN_TYPES.CONSOLEERROR,
      (original, type) => {
        return function (this: any, ...args: any[]): void {
          // 过滤掉SDK内部的错误日志
          if (!(args[0] && 
                typeof args[0] === 'string' && 
                args[0].startsWith('@hawk-tracker'))) {
            eventCenter.emit(type, args)
          }
          original.apply(this, args)
        }
      },
      'consoleError'
    )
  },

  [LISTEN_TYPES.XHROPEN]: () => {
    if (!hasGlobalProperty('XMLHttpRequest')) return
    createMethodReplace(
      XMLHttpRequest.prototype,
      'open',
      LISTEN_TYPES.XHROPEN,
      (original, type) => {
        return function (this: XMLHttpRequest, ...args: any[]): void {
          eventCenter.emit(type, this, ...args)
          original.apply(this, args)
        }
      },
      'xhrOpen'
    )
  },

  [LISTEN_TYPES.XHRSEND]: () => {
    if (!hasGlobalProperty('XMLHttpRequest')) return
    createMethodReplace(
      XMLHttpRequest.prototype,
      'send',
      LISTEN_TYPES.XHRSEND,
      (original, type) => {
        return function (this: XMLHttpRequest, ...args: any[]): void {
          eventCenter.emit(type, this, ...args)
          original.apply(this, args)
        }
      },
      'xhrSend'
    )
  },

  [LISTEN_TYPES.FETCH]: () => {
    if (!hasGlobalProperty('fetch')) return
    createMethodReplace(
      _global,
      'fetch',
      LISTEN_TYPES.FETCH,
      (original, type) => {
        return function (this: any, ...args: any[]): Promise<Response> {
          const fetchStart = getTimestamp()
          const traceContext = { startTime: fetchStart }
          
          return original.apply(this, args).then((response: Response) => {
            eventCenter.emit(type, {
              args,
              response,
              startTime: fetchStart,
              endTime: getTimestamp(),
              traceContext
            })
            return response
          }).catch((error: Error) => {
            eventCenter.emit(type, {
              args,
              error,
              startTime: fetchStart,
              endTime: getTimestamp(),
              traceContext
            })
            throw error
          })
        }
      },
      'fetch'
    )
  },

  [LISTEN_TYPES.HISTORYPUSHSTATE]: () => {
    if (!hasGlobalProperty('history') || !_global.history.pushState) return
    createMethodReplace(
      _global.history,
      'pushState',
      LISTEN_TYPES.HISTORYPUSHSTATE,
      (original, type) => {
        return function (this: History, ...args: any[]): void {
          eventCenter.emit(type, ...args)
          original.apply(this, args)
        }
      },
      'historyPushState'
    )
  },

  [LISTEN_TYPES.HISTORYREPLACESTATE]: () => {
    if (!hasGlobalProperty('history') || !_global.history.replaceState) return
    createMethodReplace(
      _global.history,
      'replaceState',
      LISTEN_TYPES.HISTORYREPLACESTATE,
      (original, type) => {
        return function (this: History, ...args: any[]): void {
          eventCenter.emit(type, ...args)
          original.apply(this, args)
        }
      },
      'historyReplaceState'
    )
  }
}

/**
 * 根据类型注册监听器或重写方法
 * @param type 事件类型
 */
function registerListener(type: LISTEN_TYPES): void {
  const register = listenerRegistry[type]
  if (register) {
    try {
      register()
    } catch (error) {
      console.warn(`[@hawk-tracker] Failed to register listener for ${type}:`, error)
    }
  }
}

/**
 * 初始化所有监听器和方法重写
 * @param types 需要监听的事件类型数组，如果不传则监听所有类型
 */
// TODO：根据注册插件不同，返回不同的监听列表
export function initReplace(types?: LISTEN_TYPES[]): void {
  const targetTypes = types || Object.values(LISTEN_TYPES)
  debug.logDebug('initReplace xxxxx',{targetTypes})
  targetTypes.forEach(type => {
      debug.logDebug('initReplace --->',{type})
      registerListener(type)
  })
}

/**
 * 恢复单个原始方法
 */
function restoreOriginalMethod<T extends Record<string, any>>(
  target: T,
  methodName: keyof T,
  storageKey: keyof typeof originalMethods
): void {
  const originalMethod = originalMethods[storageKey]
  if (originalMethod && target[methodName] !== originalMethod) {
    ;(target as any)[methodName] = originalMethod
    originalMethods[storageKey] = null
  }
}

/**
 * 移除单个事件监听器
 */
function removeEventListener(
  eventName: string,
  target: Window | Document = _global,
  options = false
): void {
  const handler = eventHandlers[eventName as keyof typeof eventHandlers]
  if (handler) {
    unsubscribeListener(target, eventName, handler, options)
    eventHandlers[eventName as keyof typeof eventHandlers] = null
  }
}

/**
 * 销毁所有重写和监听
 */
export function destroyReplace(): void {
  // 恢复原始方法
  restoreOriginalMethod(console, 'error', 'consoleError')
  
  if (hasGlobalProperty('XMLHttpRequest')) {
    restoreOriginalMethod(XMLHttpRequest.prototype, 'open', 'xhrOpen')
    restoreOriginalMethod(XMLHttpRequest.prototype, 'send', 'xhrSend')
  }
  
  if (hasGlobalProperty('fetch')) {
    restoreOriginalMethod(_global, 'fetch', 'fetch')
  }
  
  if (hasGlobalProperty('history')) {
    restoreOriginalMethod(_global.history, 'pushState', 'historyPushState')
    restoreOriginalMethod(_global.history, 'replaceState', 'historyReplaceState')
  }

  // 移除事件监听器
  removeEventListener('error', _global, true)
  removeEventListener('unhandledrejection')
  removeEventListener('click', _global.document, true)
  removeEventListener('load', _global, true)
  removeEventListener('beforeunload')
  removeEventListener('hashchange')
  removeEventListener('popstate')
  removeEventListener('offline')
  removeEventListener('online')
  removeEventListener('readystatechange', _global.document)
}

/**
 * 检查是否支持某个监听类型
 * @param type 事件类型
 */
export function isListenerSupported(type: LISTEN_TYPES): boolean {
  switch (type) {
    case LISTEN_TYPES.ERROR:
    case LISTEN_TYPES.UNHANDLEDREJECTION:
    case LISTEN_TYPES.LOAD:
    case LISTEN_TYPES.BEFOREUNLOAD:
    case LISTEN_TYPES.HASHCHANGE:
    case LISTEN_TYPES.POPSTATE:
    case LISTEN_TYPES.OFFLINE:
    case LISTEN_TYPES.ONLINE:
      return hasGlobalProperty('addEventListener')
    
    case LISTEN_TYPES.READYSTATECHANGE:
      return hasGlobalProperty('document') && hasGlobalProperty('addEventListener')
    
    case LISTEN_TYPES.CLICK:
      return hasGlobalProperty('document') && hasGlobalProperty('addEventListener')
    
    case LISTEN_TYPES.CONSOLEERROR:
      return hasGlobalProperty('console')
    
    case LISTEN_TYPES.XHROPEN:
    case LISTEN_TYPES.XHRSEND:
      return hasGlobalProperty('XMLHttpRequest')
    
    case LISTEN_TYPES.FETCH:
      return hasGlobalProperty('fetch')
    
    case LISTEN_TYPES.HISTORYPUSHSTATE:
    case LISTEN_TYPES.HISTORYREPLACESTATE:
      return hasGlobalProperty('history')
    
    default:
      return false
  }
}

/**
 * 获取支持的监听类型列表
 */
export function getSupportedListenerTypes(): LISTEN_TYPES[] {
  return Object.values(LISTEN_TYPES).filter(type => isListenerSupported(type))
}