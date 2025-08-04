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
