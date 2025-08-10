export const logDebug = (...message: any[]) => {
  console.debug(...message);
};

export const logInfo = (message: any) => {
  console.log(...message);
};

export const logError = (message: string) => {
  console.error(message);
};

export const logWarn = (message: string) => {
  console.warn(message);
};

export default {
  logDebug,
  logInfo,
  logError,
  logWarn,
};

// 初始化日志系统
export const log = (level: 'debug' | 'info' | 'error' | 'warn', message: string, ...args: any[]) => {
  console[level](`[SDK] [${level.toUpperCase()}] ${message}`, ...args);
};