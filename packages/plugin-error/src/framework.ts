// 框架错误接入辅助方法

export function createVueErrorHandler(core: any) {
  return function (err: any, vm?: any, info?: string) {
    try {
      const message = err?.message || String(err);
      const stack = err?.stack;
      const componentName = vm?.$options?.name || vm?.$options?._componentTag;
      const propsData = vm?.$options?.propsData;
      core?.dataSender?.sendData(
        'error',
        'vue',
        {
          message,
          name: err?.name || 'VueError',
          stack,
          context: { componentName, propsData, info },
        },
        true,
      );
    } catch {}
  };
}

export function withReactErrorBoundary(core: any) {
  return function <P>(Component: any): any {
    return class ErrorBoundary extends (window as any).React.Component<
      any,
      any
    > {
      constructor(props: any) {
        super(props);
        this.state = { hasError: false };
      }
      static getDerivedStateFromError() {
        return { hasError: true };
      }
      componentDidCatch(error: any, info: any) {
        try {
          core?.dataSender?.sendData(
            'error',
            'react',
            {
              message: error?.message || String(error),
              name: error?.name || 'ReactError',
              stack: error?.stack,
              context: info,
            },
            true,
          );
        } catch {}
      }
      render() {
        if (this.state.hasError) return null;
        return (window as any).React.createElement(Component, this.props);
      }
    };
  };
}
