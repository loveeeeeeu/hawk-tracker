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
    dedupeWindowMs?: number; // 新增：短窗去重时间窗口
    rrwebMaxBytes?: number; // 新增：录屏最大字节限制（近似）
    maxConsecutiveFailures?: number; // 断路器阈值
    circuitOpenMs?: number; // 断路器打开时长
  };
  // 新增：短窗去重存储
  private recentFingerprints: Map<string, number> = new Map();
  // 新增：自我上报屏蔽（避免SDK-自身-报错-循环）
  private isSelfReporting = false;
  // 新增：断路器状态
  private consecutiveFailures = 0;
  private circuitOpenUntil = 0;

  constructor(options: Partial<ErrorPlugin['options']> = {}) {
    super(SEND_TYPES.ERROR);
    this.options = {
      behaviorStackName: 'user_behavior',
      behaviorSnapshotCount: 50,
      attachRrweb: true,
      rrwebMaxSize: 200, // 限制录屏事件数量，避免体积过大
      rrwebMaxBytes: 64 * 1024, // 64KB 近似上限
      appId: undefined,
      version: undefined,
      dedupeWindowMs: 3000,
      maxConsecutiveFailures: 3,
      circuitOpenMs: 5000,
      ...options,
    };
  }

  install(core: any, _options?: any) {
    const { eventCenter, dataSender } = core;

    const trySend = async (
      subType: SEND_SUB_TYPES | string,
      payload: NormalizedErrorData,
      immediate: boolean,
    ) => {
      if (!this.shouldSend(subType, payload)) return;
      if (this.isSelfReporting) return; // 自身上报中，直接丢弃，避免循环
      if (Date.now() < this.circuitOpenUntil) return; // 断路器打开中，丢弃
      try {
        this.isSelfReporting = true;
        dataSender.sendData(SEND_TYPES.ERROR, subType, payload, immediate);
        this.consecutiveFailures = 0; // 视为投递请求已入队成功
      } catch (_) {
        this.consecutiveFailures++;
        if (this.consecutiveFailures >= (this.options.maxConsecutiveFailures || 3)) {
          this.circuitOpenUntil = Date.now() + (this.options.circuitOpenMs || 5000);
          this.consecutiveFailures = 0;
        }
      } finally {
        this.isSelfReporting = false;
      }
    };

    // window.onerror 捕获：代码错误 + 资源加载错误
    eventCenter.subscribeEvent({
      type: LISTEN_TYPES.ERROR,
      callback: (event: any) => {
        const payload = this.handleWindowError(event, core);
        if (!payload) return;
        const subType = payload.resource
          ? SEND_SUB_TYPES.RESOURCE
          : SEND_SUB_TYPES.ERROR;
        trySend(subType, payload, true);
      },
    });

    // Promise 未处理拒绝
    eventCenter.subscribeEvent({
      type: LISTEN_TYPES.UNHANDLEDREJECTION,
      callback: (event: PromiseRejectionEvent) => {
        const payload = this.handleUnhandledRejection(event, core);
        const subType = SEND_SUB_TYPES.UNHANDLEDREJECTION;
        trySend(subType, payload, true);
      },
    });

    // console.error 捕获
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
          const subType = SEND_SUB_TYPES.CONSOLEERROR;
          trySend(subType, payload, false);
        } catch {}
      },
    });

    // fetch 错误/异常
    eventCenter.subscribeEvent({
      type: LISTEN_TYPES.FETCH,
      callback: (info: any) => {
        const payload = this.handleFetch(info, core);
        if (!payload) return;
        const subType = SEND_SUB_TYPES.FETCH;
        trySend(subType, payload, true);
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
            const subType = SEND_SUB_TYPES.XHR;
            trySend(subType, payload, true);
          };

          xhr.addEventListener('loadend', () => finalize('loadend'));
          xhr.addEventListener('error', () => finalize('error'));
          xhr.addEventListener('timeout', () => finalize('timeout'));
        } catch {}
      },
    });
  }

  // 生成错误指纹（尽量稳定，避免动态因素）
  private computeFingerprint(subType: SEND_SUB_TYPES | string, payload: NormalizedErrorData): string {
    try {
      const pageUrl = (payload.pageUrl || '').split('?')[0] || '';

      // 资源错误：tag + url（去query/hash）
      if (subType === SEND_SUB_TYPES.RESOURCE || payload.resource) {
        const tag = payload.resource?.tag || '';
        const rawResUrl = String(payload.resource?.url || '');
        const withoutQuery = (rawResUrl.split('?')[0] || '');
        const url = (withoutQuery.split('#')[0] || '');
        return `res|${tag}|${url}`;
      }

      // HTTP 错误：method + url（去query/hash模板化） + status
      if (payload.http) {
        const http = payload.http as { url?: string; method?: string; status?: number };
        const method = (http?.method || 'GET').toUpperCase();
        const rawUrl = String(http?.url || '');
        const withoutQuery = (rawUrl.split('?')[0] || '');
        const withoutHash = (withoutQuery.split('#')[0] || '');
        const url = withoutHash
          // 简单模板化：/123/ -> /:id/
          .replace(/\/(\d{3,})\//g, '/:id/')
          .replace(/=[0-9a-fA-F-]{8,}/g, '=*');
        const status = http?.status || 0;
        return `http|${method}|${url}|${status}`;
      }

      // 运行时/Promise/Console：name + message + stackTop
      const name = payload.name || '';
      const message = (payload.message || '').slice(0, 200);
      const stackTop = this.getStackTop(payload.stack);
      return `rt|${name}|${message}|${stackTop}|${pageUrl}`;
    } catch {
      return JSON.stringify({ subType, payload });
    }
  }

  private getStackTop(stack?: string) {
    if (!stack) return '';
    try {
      const lines = stack.split('\n').map((s) => s.trim());
      // 取第一条包含 at/（) 的栈帧，去掉行列号
      const firstLine = lines.find((l) => /at\s+/.test(l) || /\(/.test(l)) || lines[0] || '';
      return firstLine
        .replace(/:\d+:\d+\)?$/, '')
        .replace(/\(.*?\)/, '(*)')
        .replace(/https?:\/\/[^\s)]+/g, 'url');
    } catch {
      return '';
    }
  }

  private shouldSend(subType: SEND_SUB_TYPES | string, payload: NormalizedErrorData): boolean {
    try {
      const key = this.computeFingerprint(subType, payload);
      const now = Date.now();
      const win = this.options.dedupeWindowMs ?? 3000;
      const last = this.recentFingerprints.get(key) || 0;
      if (now - last < win) {
        return false;
      }
      this.recentFingerprints.set(key, now);
      // 清理过期项（轻量）
      if (this.recentFingerprints.size > 2000) {
        const threshold = now - win * 2;
        for (const [k, v] of this.recentFingerprints) {
          if (v < threshold) this.recentFingerprints.delete(k);
        }
      }
      return true;
    } catch {
      return true;
    }
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

    // 改进：主动关联录屏和错误
    let rrwebSnapshot: any | undefined;
    let errorContext: any = undefined;

    if (this.options.attachRrweb) {
      try {
        const api = (window as any)?.$hawkRrweb;
        if (api && typeof api.getReplay === 'function') {
          const bytesLimit = this.options.rrwebMaxBytes || 64 * 1024;
          // 获取最近的录屏事件，带字节上限
          rrwebSnapshot = api.getReplay({
            maxSize: this.options.rrwebMaxSize,
            maxBytes: bytesLimit,
          });

          // 新增：获取错误发生时的上下文信息
          if (api.getErrorContext) {
            errorContext = api.getErrorContext({
              errorType: base.name,
              errorMessage: base.message,
              timestamp: Date.now(),
            });
          }

          // 新增：标记错误发生的时间点
          if (api.markErrorPoint) {
            api.markErrorPoint({
              type: 'error',
              error: base,
              timestamp: Date.now(),
            });
          }
        }
      } catch {}
    }

    return {
      pageUrl,
      userAgent,
      behaviorSnapshot,
      rrwebSnapshot,
      errorContext, // 新增：错误上下文
      release: {
        appId: this.options.appId,
        version: this.options.version,
      },
      ...base,
    } as NormalizedErrorData;
  }
}

export * from './framework';
