import { useState } from 'react';

export default function TestErrorPage() {
  const [errorCount, setErrorCount] = useState(0);

  // 测试不同类型的错误
  const testErrors = {
    typeError: () => {
      console.log('🦅 测试: 触发 TypeError');
      const obj = {};
      // @ts-ignore
      obj.split('/');
    },
    referenceError: () => {
      console.log('🦅 测试: 触发 ReferenceError');
      // @ts-ignore
      nonExistentVariable.someMethod();
    },
    manualError: () => {
      console.log('🦅 测试: 手动抛出错误');
      throw new Error('手动测试错误 - 来自测试页面');
    },
    asyncError: async () => {
      console.log('🦅 测试: 触发异步错误');
      try {
        const response = await fetch('/non-existent-api');
        const data = await response.json();
        console.log(data);
      } catch (error) {
        console.error('🦅 异步错误:', error);
        throw error;
      }
    }
  };

  const handleTestError = (errorType: keyof typeof testErrors) => {
    setErrorCount(prev => prev + 1);
    console.log(` 开始测试 ${errorType} 错误...`);
    
    try {
      testErrors[errorType]();
    } catch (error) {
      console.error(` ${errorType} 错误已触发:`, error);
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">🦅 Hawk Tracker 错误测试页面</h1>
        
        <div className="bg-card rounded-lg border border-border p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">测试说明</h2>
          <p className="text-muted-foreground mb-4">
            点击下面的按钮来测试不同类型的JavaScript错误。这些错误会被Hawk Tracker的ErrorPlugin捕获并上报。
          </p>
          <p className="text-sm text-muted-foreground">
            已触发错误次数: <span className="font-mono text-foreground">{errorCount}</span>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <button
            onClick={() => handleTestError('typeError')}
            className="p-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            测试 TypeError
          </button>

          <button
            onClick={() => handleTestError('referenceError')}
            className="p-4 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
          >
            测试 ReferenceError
          </button>

          <button
            onClick={() => handleTestError('manualError')}
            className="p-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            测试手动错误
          </button>

          <button
            onClick={() => handleTestError('asyncError')}
            className="p-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            测试异步错误
          </button>
        </div>

        <div className="mt-8 bg-card rounded-lg border border-border p-6">
          <h3 className="text-lg font-semibold mb-4">调试信息</h3>
          <p className="text-sm text-muted-foreground mb-2">
            打开浏览器控制台查看详细的错误信息和Hawk Tracker的调试输出。
          </p>
          <div className="bg-muted p-4 rounded-md">
            <p className="text-sm font-mono">
              1. 点击任意测试按钮<br/>
              2. 查看控制台错误信息<br/>
              3. 查看Hawk Tracker的调试输出（🦅 前缀）<br/>
              4. 检查网络请求（如果有DSN配置）
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}