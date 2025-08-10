export enum LISTEN_TYPES {
  ERROR = 'error',
  UNHANDLEDREJECTION = 'unhandledrejection',
  CONSOLEERROR = 'consoleError',
  CLICK = 'click',
  LOAD = 'load',
  BEFOREUNLOAD = 'beforeunload',
  XHROPEN = 'xhrOpen',
  XHRSEND = 'xhrSend',
  FETCH = 'fetch',
  HASHCHANGE = 'hashchange',
  HISTORYPUSHSTATE = 'history-pushState',
  HISTORYREPLACESTATE = 'history-replaceState',
  POPSTATE = 'popstate',
  READYSTATECHANGE = 'readystatechange',
  ONLINE = 'online',
  OFFLINE = 'offline',
}

export enum SEND_TYPES {
  ERROR = 'error',
  PERFORMANCE = 'performance',
  BEHAVIOR = 'behavior',
  CUSTOM = 'custom',
}

// export enum EVENT_TARGET {
//   PAGE = 'page',
//   RESOURCE = 'resource',

// }
