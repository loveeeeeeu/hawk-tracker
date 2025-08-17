// Vue3 监控系统组合式API
import { inject, onMounted, onUnmounted, ref, readonly } from 'vue';

// 监控实例的注入键
export const MONITOR_INJECTION_KEY = Symbol('monitor');

// 监控实例类型
interface MonitorInstance {
  track: (type: string, data: any, immediate?: boolean) => void;
}

/**
 * 使用监控系统的组合式API
 */
export function useMonitor() {
  // 从全局注入监控实例
  const monitor = inject<MonitorInstance>(MONITOR_INJECTION_KEY);
  
  if (!monitor) {
    console.warn('Monitor instance not found. Make sure to provide it in your app.');
    return {
      track: () => {},
      trackError: () => {},
      trackPerformance: () => {},
      trackUserAction: () => {},
    };
  }

  /**
   * 通用事件追踪
   */
  const track = (type: string, data: any, immediate = true) => {
    try {
      monitor.track(type, data, immediate);
    } catch (error) {
      console.error('Failed to track event:', error);
    }
  };

  /**
   * 错误追踪
   */
  const trackError = (error: Error | string, context?: any) => {
    const errorData = {
      message: typeof error === 'string' ? error : error.message,
      stack: typeof error === 'object' ? error.stack : undefined,
      context,
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent,
    };

    track('error', errorData);
  };

  /**
   * 性能追踪
   */
  const trackPerformance = (name: string, duration: number, metadata?: any) => {
    const performanceData = {
      name,
      duration,
      metadata,
      timestamp: Date.now(),
      url: window.location.href,
    };

    track('performance', performanceData);
  };

  /**
   * 用户行为追踪
   */
  const trackUserAction = (action: string, target?: string, metadata?: any) => {
    const actionData = {
      action,
      target,
      metadata,
      timestamp: Date.now(),
      url: window.location.href,
    };

    track('user-action', actionData);
  };

  return {
    track,
    trackError,
    trackPerformance,
    trackUserAction,
  };
}

/**
 * 组件性能监控Hook
 */
export function useComponentPerformance(componentName: string) {
  const { trackPerformance } = useMonitor();
  const mountStartTime = ref(0);

  onMounted(() => {
    mountStartTime.value = performance.now();
    
    // 下一帧记录挂载完成时间
    requestAnimationFrame(() => {
      const mountDuration = performance.now() - mountStartTime.value;
      trackPerformance(`component-mount:${componentName}`, mountDuration, {
        componentName,
        type: 'mount',
      });
    });
  });

  onUnmounted(() => {
    trackPerformance(`component-unmount:${componentName}`, 0, {
      componentName,
      type: 'unmount',
    });
  });

  return {
    measureAction: (actionName: string, fn: () => void | Promise<void>) => {
      const startTime = performance.now();
      
      const result = fn();
      
      if (result instanceof Promise) {
        return result.finally(() => {
          const duration = performance.now() - startTime;
          trackPerformance(`action:${actionName}`, duration, {
            componentName,
            actionName,
            type: 'async-action',
          });
        });
      } else {
        const duration = performance.now() - startTime;
        trackPerformance(`action:${actionName}`, duration, {
          componentName,
          actionName,
          type: 'sync-action',
        });
        return result;
      }
    },
  };
}

/**
 * 错误边界Hook
 */
export function useErrorBoundary(componentName: string) {
  const { trackError } = useMonitor();
  const hasError = ref(false);
  const errorInfo = ref<any>(null);

  const handleError = (error: Error, errorInfo: any) => {
    hasError.value = true;
    errorInfo.value = errorInfo;
    
    trackError(error, {
      componentName,
      errorInfo,
      type: 'component-error-boundary',
    });
  };

  const resetError = () => {
    hasError.value = false;
    errorInfo.value = null;
  };

  return {
    hasError: readonly(hasError),
    errorInfo: readonly(errorInfo),
    handleError,
    resetError,
  };
}

/**
 * 用户行为监控Hook
 */
export function useUserBehavior() {
  const { trackUserAction } = useMonitor();

  const trackClick = (target: string, metadata?: any) => {
    trackUserAction('click', target, metadata);
  };

  const trackPageView = (pageName: string, metadata?: any) => {
    trackUserAction('page-view', pageName, {
      ...metadata,
      referrer: document.referrer,
      timestamp: Date.now(),
    });
  };

  const trackFormSubmit = (formName: string, success: boolean, metadata?: any) => {
    trackUserAction('form-submit', formName, {
      ...metadata,
      success,
    });
  };

  const trackSearch = (query: string, results?: number, metadata?: any) => {
    trackUserAction('search', query, {
      ...metadata,
      resultsCount: results,
    });
  };

  return {
    trackClick,
    trackPageView,
    trackFormSubmit,
    trackSearch,
  };
}

/**
 * 网络请求监控Hook
 */
export function useNetworkMonitor() {
  const { track } = useMonitor();

  const trackAPICall = async <T>(
    url: string,
    options: RequestInit,
    fetchFn: (url: string, options: RequestInit) => Promise<T>
  ): Promise<T> => {
    const startTime = performance.now();
    const requestId = Math.random().toString(36).substr(2, 9);

    // 记录请求开始
    track('api-request-start', {
      requestId,
      url,
      method: options.method || 'GET',
      timestamp: Date.now(),
    });

    try {
      const result = await fetchFn(url, options);
      const duration = performance.now() - startTime;

      // 记录请求成功
      track('api-request-success', {
        requestId,
        url,
        method: options.method || 'GET',
        duration,
        timestamp: Date.now(),
      });

      return result;
    } catch (error) {
      const duration = performance.now() - startTime;

      // 记录请求失败
      track('api-request-error', {
        requestId,
        url,
        method: options.method || 'GET',
        duration,
        error: error instanceof Error ? error.message : String(error),
        timestamp: Date.now(),
      });

      throw error;
    }
  };

  return {
    trackAPICall,
  };
} 