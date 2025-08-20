import {
  BasePlugin,
  SEND_TYPES,
  LISTEN_TYPES,
  SEND_SUB_TYPES,
} from '@hawk-tracker/core';

// 统一的错误数据结构
interface NormalizedErrorData {
  message?: string;
  name?: string;
  stack?: string;
  filename?: string;
  lineno?: number;
  colno?: number;
  pageUrl?: string;
  userAgent?: string;
  release?: {
    appId?: string;
    version?: string;
  };
  // 资源错误
  resource?: {
    tag?: string;
    url?: string;
    outerHTML?: string;
  };
  // HTTP 错误
  http?: {
    url?: string;
    method?: string;
    status?: number;
    statusText?: string;
    durationMs?: number;
    requestHeaders?: Record<string, any>;
    responseHeaders?: Record<string, any>;
    bodyExcerpt?: string;
    error?: string;
  };
  // 行为快照与录屏快照
  behaviorSnapshot?: any[];
  rrwebSnapshot?: any;
}

export class ErrorPlugin extends BasePlugin {
  private options: {
    behaviorStackName?: string;
    behaviorSnapshotCount?: number;
    attachRrweb?: boolean;
    rrwebMaxSize?: number;
    appId?: string;
    version?: string;
  };

  constructor(options: Partial<ErrorPlugin['options']> = {}) {
    super(SEND_TYPES.ERROR);
    this.options = {
      behaviorStackName: 'user_behavior',
      behaviorSnapshotCount: 50,
      attachRrweb: true,
      rrwebMaxSize: 200, // 限制录屏事件数量，避免体积过大
      appId: undefined,
      version: undefined,
      ...options,
    };
  }

  install(core: any, _options?: any) {
    const { eventCenter, dataSender } = core;

    // window.onerror 捕获：代码错误 + 资源加载错误
    eventCenter.subscribeEvent({
      type: LISTEN_TYPES.ERROR,
      callback: (event: any) => {
        const payload = this.handleWindowError(event, core);
        if (!payload) return;
        const subType = payload.resource
          ? SEND_SUB_TYPES.LOAD
          : SEND_SUB_TYPES.ERROR;
        dataSender.sendData(SEND_TYPES.ERROR, subType, payload, true);
      },
    });

    // Promise 未处理拒绝
    eventCenter.subscribeEvent({
      type: LISTEN_TYPES.UNHANDLEDREJECTION,
      callback: (event: PromiseRejectionEvent) => {
        const payload = this.handleUnhandledRejection(event, core);
        dataSender.sendData(
          SEND_TYPES.ERROR,
          SEND_SUB_TYPES.UNHANDLEDREJECTION,
          payload,
          true,
        );
      },
    });

    // console.error 捕获（可辅助定位开发期错误）
    eventCenter.subscribeEvent({
      type: LISTEN_TYPES.CONSOLEERROR,
      callback: (args: any[]) => {
        try {
          const message = args
            ?.map((a) => (typeof a === 'string' ? a : JSON.stringify(a)))
            .join(' ');
          const payload = this.enrichWithContext(core, {
            message: message || 'console.error',
            name: 'ConsoleError',
          });
          dataSender.sendData(
            SEND_TYPES.ERROR,
            SEND_SUB_TYPES.CONSOLEERROR,
            payload,
            false,
          );
        } catch {}
      },
    });

    // fetch 错误/异常
    eventCenter.subscribeEvent({
      type: LISTEN_TYPES.FETCH,
      callback: (info: any) => {
        const payload = this.handleFetch(info, core);
        if (!payload) return;
        dataSender.sendData(
          SEND_TYPES.ERROR,
          SEND_SUB_TYPES.FETCH,
          payload,
          true,
        );
      },
    });

    // XHR：在 open/send 时挂监听，统一在 loadend/timeout/error 处理
    eventCenter.subscribeEvent({
      type: LISTEN_TYPES.XHROPEN,
      callback: (xhr: XMLHttpRequest, method: string, url: string) => {
        try {
          (xhr as any).__hawk_meta__ = {
            method: (method || 'GET').toUpperCase(),
            url,
          };
        } catch {}
      },
    });

    eventCenter.subscribeEvent({
      type: LISTEN_TYPES.XHRSEND,
      callback: (xhr: XMLHttpRequest) => {
        try {
          const start = Date.now();
          (xhr as any).__hawk_meta__ = {
            ...(xhr as any).__hawk_meta__,
            start,
          };

          const finalize = (etype?: string) => {
            const meta = (xhr as any).__hawk_meta__ || {};
            const durationMs = Date.now() - (meta.start || start);
            const status = xhr.status;
            const statusText = xhr.statusText;
            const isError =
              etype === 'error' || etype === 'timeout' || status >= 400;
            if (!isError) return;

            const payload = this.enrichWithContext(core, {
              http: {
                url: meta.url,
                method: meta.method,
                status,
                statusText,
                durationMs,
                responseHeaders: this.safeParseHeaders(
                  (xhr.getAllResponseHeaders && xhr.getAllResponseHeaders()) ||
                    '',
                ),
                error: etype,
              },
              message: `[XHR ${meta.method}] ${meta.url} -> ${status} ${statusText}`,
              name: 'XMLHttpRequestError',
            });
            core.dataSender.sendData(
              SEND_TYPES.ERROR,
              SEND_SUB_TYPES.XHR,
              payload,
              true,
            );
          };

          xhr.addEventListener('loadend', () => finalize('loadend'));
          xhr.addEventListener('error', () => finalize('error'));
          xhr.addEventListener('timeout', () => finalize('timeout'));
        } catch {}
      },
    });
  }

  private handleWindowError(event: any, core: any): NormalizedErrorData | null {
    // 资源加载错误：event.target 存在且不是 window
    const isResourceError = event && event.target && event.target !== window;
    if (isResourceError) {
      const target = event.target as any;
      const tag = (target.tagName || '').toLowerCase();
      const url = target.src || target.href || '';
      const outerHTML = (target.outerHTML || '').slice(0, 200);
      return this.enrichWithContext(core, {
        message: `Resource load error: <${tag}> ${url}`,
        name: 'ResourceError',
        resource: { tag, url, outerHTML },
      });
    }

    // 代码运行时错误（ErrorEvent）
    const errorEvent = event as ErrorEvent;
    const base: NormalizedErrorData = {
      message: errorEvent?.message,
      name: (errorEvent?.error && errorEvent.error.name) || 'Error',
      stack: errorEvent?.error && errorEvent.error.stack,
      filename: (errorEvent as any)?.filename,
      lineno: (errorEvent as any)?.lineno,
      colno: (errorEvent as any)?.colno,
    };
    return this.enrichWithContext(core, base);
  }

  private handleUnhandledRejection(
    event: PromiseRejectionEvent,
    core: any,
  ): NormalizedErrorData {
    let message = 'Unhandled Promise Rejection';
    let name = 'UnhandledRejection';
    let stack: string | undefined;

    const reason: any = (event && (event as any).reason) || undefined;
    if (reason) {
      if (typeof reason === 'string') {
        message = reason;
      } else if (reason instanceof Error) {
        message = reason.message;
        name = reason.name || name;
        stack = reason.stack;
      } else if (typeof reason === 'object') {
        try {
          message = JSON.stringify(reason);
        } catch {}
      }
    }

    return this.enrichWithContext(core, { message, name, stack });
  }

  private handleFetch(info: any, core: any): NormalizedErrorData | null {
    const { args = [], response, error, startTime, endTime } = info || {};
    const url = (args && args[0]) || '';
    const method = (args && args[1] && args[1].method) || 'GET';

    if (error) {
      return this.enrichWithContext(core, {
        http: {
          url,
          method,
          status: 0,
          statusText: 'NETWORK_ERROR',
          durationMs: endTime && startTime ? endTime - startTime : undefined,
          error: error?.message || String(error),
        },
        message: `[fetch ${method}] ${url} -> NETWORK_ERROR`,
        name: 'FetchError',
      });
    }

    if (response && response.status >= 400) {
      return this.enrichWithContext(core, {
        http: {
          url,
          method,
          status: response.status,
          statusText: response.statusText,
          durationMs: endTime && startTime ? endTime - startTime : undefined,
        },
        message: `[fetch ${method}] ${url} -> ${response.status} ${response.statusText}`,
        name: 'FetchHttpError',
      });
    }

    return null;
  }

  private safeParseHeaders(raw: string): Record<string, any> {
    const headers: Record<string, any> = {};
    if (!raw) return headers;
    try {
      raw
        .trim()
        .split(/\r?\n/)
        .forEach((line) => {
          const idx = line.indexOf(':');
          if (idx > -1) {
            const key = line.slice(0, idx).trim().toLowerCase();
            const value = line.slice(idx + 1).trim();
            headers[key] = value;
          }
        });
    } catch {}
    return headers;
  }

  private enrichWithContext(
    core: any,
    base: Partial<NormalizedErrorData>,
  ): NormalizedErrorData {
    const pageUrl =
      (typeof window !== 'undefined' &&
        window.location &&
        window.location.href) ||
      '';
    const userAgent =
      (typeof navigator !== 'undefined' && navigator.userAgent) || '';

    // 行为快照
    let behaviorSnapshot: any[] | undefined;
    try {
      const stack = core.getBehaviorStack?.(this.options.behaviorStackName);
      behaviorSnapshot =
        stack?.getSnapshot?.({
          maxCount: this.options.behaviorSnapshotCount,
        }) || undefined;
    } catch {}

    // rrweb 快照（如果存在 rrweb 插件导出的全局能力）
    let rrwebSnapshot: any | undefined;
    if (this.options.attachRrweb) {
      try {
        const api = (window as any)?.$hawkRrweb;
        if (api && typeof api.getReplay === 'function') {
          rrwebSnapshot = api.getReplay({ maxSize: this.options.rrwebMaxSize });
        }
      } catch {}
    }

    return {
      pageUrl,
      userAgent,
      behaviorSnapshot,
      rrwebSnapshot,
      release: {
        appId: this.options.appId,
        version: this.options.version,
      },
      ...base,
    } as NormalizedErrorData;
  }
}

export * from './framework';
